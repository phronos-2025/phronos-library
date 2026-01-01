#!/usr/bin/env python3
"""
Scite.ai Output Processing Pipeline

Transforms raw scite.ai literature search results into structured
summaries organized by research cluster.

Usage:
    python process_scite.py --topic digital-identity-formation                    # Process all raw files
    python process_scite.py --topic digital-identity-formation --question Q05     # Process single question
    python process_scite.py --topic digital-identity-formation --cluster 2        # Process entire cluster
    python process_scite.py --topic digital-identity-formation --dry-run          # Parse without API calls
    python process_scite.py --topic digital-identity-formation --report-only      # Regenerate report from processed files
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional

import anthropic
import yaml


# =============================================================================
# Data Structures
# =============================================================================

@dataclass
class RawSciteFile:
    """Parsed raw scite.ai output file."""
    
    question_id: str
    cluster: int
    question_title: str
    query_submitted: str
    retrieval_date: str
    retrieval_time: Optional[str] = None
    scite_assistant_url: Optional[str] = None
    notes: Optional[str] = None
    narrative: str = ""
    references: str = ""
    citation_metrics: Optional[str] = None
    source_file: str = ""
    
    @property
    def reference_count(self) -> int:
        """Count references by numbered list items."""
        if not self.references.strip():
            return 0
        # Count lines starting with number followed by period or parenthesis
        pattern = r'^\s*\d+[\.\)]\s+'
        return len(re.findall(pattern, self.references, re.MULTILINE))
    
    @property
    def is_sparse(self) -> bool:
        """Check if results indicate sparse coverage."""
        if self.notes and ("SPARSE" in self.notes.upper() or "NO_RESULTS" in self.notes.upper()):
            return True
        return self.reference_count < 4


@dataclass
class ProcessedEntry:
    """Structured summary of a literature search."""
    
    question_id: str
    cluster: int
    question_title: str
    query_submitted: str
    coverage: str  # Rich, Moderate, Sparse, None
    key_findings: list[str] = field(default_factory=list)
    methodological_notes: str = ""
    top_citations: list[str] = field(default_factory=list)
    gap_flag: bool = False
    gap_notes: str = ""
    source_file: str = ""
    processed_date: str = ""
    
    def to_markdown(self) -> str:
        """Render as markdown."""
        lines = [
            f"## {self.question_id}: {self.question_title}",
            "",
            f"**Coverage:** {self.coverage}",
            "",
        ]
        
        if self.key_findings:
            lines.append("**Key findings:**")
            for finding in self.key_findings:
                lines.append(f"- {finding}")
            lines.append("")
        
        if self.methodological_notes:
            lines.append(f"**Methodological notes:** {self.methodological_notes}")
            lines.append("")
        
        if self.top_citations:
            lines.append("**Top citations:**")
            for i, citation in enumerate(self.top_citations, 1):
                lines.append(f"{i}. {citation}")
            lines.append("")
        
        if self.gap_flag:
            lines.append(f"**Gap flag:** Yes — {self.gap_notes}")
        else:
            lines.append("**Gap flag:** No")
        
        lines.extend([
            "",
            f"*Source: `{self.source_file}`*",
            ""
        ])
        
        return "\n".join(lines)


@dataclass
class ClusterSummary:
    """Summary for an entire cluster."""
    
    cluster_id: int
    cluster_name: str
    entries: list[ProcessedEntry] = field(default_factory=list)
    
    @property
    def needs_deep_research(self) -> bool:
        """Check if cluster has significant gaps."""
        sparse_count = sum(1 for e in self.entries if e.coverage in ("Sparse", "None"))
        return sparse_count > len(self.entries) // 2
    
    def to_markdown(self) -> str:
        """Render cluster as markdown section."""
        lines = [
            f"# Cluster {self.cluster_id}: {self.cluster_name}",
            "",
        ]
        
        if self.needs_deep_research:
            lines.append("> ⚠️ **This cluster requires deep web research** — majority of questions have sparse coverage.")
            lines.append("")
        
        for entry in sorted(self.entries, key=lambda e: e.question_id):
            lines.append(entry.to_markdown())
            lines.append("---")
            lines.append("")
        
        return "\n".join(lines)


# =============================================================================
# File Parsing
# =============================================================================

def parse_raw_file(filepath: Path) -> RawSciteFile:
    """Parse a raw scite.ai markdown file with YAML frontmatter."""
    
    content = filepath.read_text(encoding="utf-8")
    
    # Split frontmatter from body
    if not content.startswith("---"):
        raise ValueError(f"File {filepath} missing YAML frontmatter")
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        raise ValueError(f"File {filepath} has malformed frontmatter")
    
    frontmatter = yaml.safe_load(parts[1])
    body = parts[2].strip()
    
    # Parse body sections
    narrative = ""
    references = ""
    citation_metrics = ""
    
    # Look for section headers
    sections = re.split(r'^## ', body, flags=re.MULTILINE)
    
    for section in sections:
        section_lower = section.lower()
        if section_lower.startswith("scite") or section_lower.startswith("narrative"):
            # Extract content after the header line
            lines = section.split("\n", 1)
            narrative = lines[1].strip() if len(lines) > 1 else ""
        elif section_lower.startswith("reference"):
            lines = section.split("\n", 1)
            references = lines[1].strip() if len(lines) > 1 else ""
        elif section_lower.startswith("citation"):
            lines = section.split("\n", 1)
            citation_metrics = lines[1].strip() if len(lines) > 1 else ""
    
    return RawSciteFile(
        question_id=frontmatter.get("question_id", ""),
        cluster=frontmatter.get("cluster", 0),
        question_title=frontmatter.get("question_title", ""),
        query_submitted=frontmatter.get("query_submitted", ""),
        retrieval_date=str(frontmatter.get("retrieval_date", "")),
        retrieval_time=frontmatter.get("retrieval_time"),
        scite_assistant_url=frontmatter.get("scite_assistant_url"),
        notes=frontmatter.get("notes"),
        narrative=narrative,
        references=references,
        citation_metrics=citation_metrics or None,
        source_file=str(filepath),
    )


def load_outline_clusters(outline_path: Path) -> dict:
    """Load cluster definitions from topic OUTLINE.md frontmatter."""
    
    if not outline_path.exists():
        return {}
    
    content = outline_path.read_text(encoding="utf-8")
    
    # Extract frontmatter
    if not content.startswith("---"):
        return {}
    
    parts = content.split("---", 2)
    if len(parts) < 2:
        return {}
    
    frontmatter = yaml.safe_load(parts[1])
    clusters = frontmatter.get("clusters", {})
    
    # Convert to format expected by generate_consolidated_report
    # {cluster_id: {"name": "...", "questions": [...]}}
    result = {}
    for cluster_id, cluster_data in clusters.items():
        if isinstance(cluster_data, dict):
            result[int(cluster_id)] = cluster_data
        else:
            # Handle legacy format if needed
            result[int(cluster_id)] = {"name": str(cluster_data), "questions": []}
    
    return result


def discover_raw_files(raw_dir: Path, question_id: Optional[str] = None, cluster: Optional[int] = None) -> list[Path]:
    """Find raw files matching criteria."""
    
    if not raw_dir.exists():
        return []
    
    files = list(raw_dir.glob("Q*.md"))
    
    if question_id:
        files = [f for f in files if f.name.startswith(question_id)]
    
    if cluster is not None:
        # Need to parse to check cluster - defer filtering
        pass
    
    # Sort by question number, then version
    def sort_key(p: Path):
        match = re.match(r'Q(\d+)', p.stem)
        num = int(match.group(1)) if match else 999
        # Higher version numbers sort later (we want latest)
        version = 0
        if '_v' in p.stem:
            v_match = re.search(r'_v(\d+)', p.stem)
            version = int(v_match.group(1)) if v_match else 0
        return (num, version)
    
    files.sort(key=sort_key)
    
    # Keep only latest version per question
    seen = {}
    for f in files:
        q_match = re.match(r'(Q\d+)', f.stem)
        if q_match:
            q_id = q_match.group(1)
            seen[q_id] = f  # Later versions overwrite
    
    return list(seen.values())


# =============================================================================
# LLM Processing
# =============================================================================

SUMMARIZATION_PROMPT = """You are analyzing a literature search result from scite.ai to create a structured summary for a research synthesis.

## Source Material

**Research Question:** {question_title}
**Query Submitted:** {query_submitted}

**Scite.ai Narrative Response:**
{narrative}

**References Found:**
{references}

**Reference Count:** {reference_count}

## Task

Create a structured summary following this exact format. Be concise—each finding should be one sentence.

### Coverage Assessment
Based on the reference count and narrative depth:
- Rich (8+ relevant references with substantive findings)
- Moderate (4-7 references with reasonable coverage)
- Sparse (1-3 references or tangential coverage)
- None (0 references or completely off-topic)

### Output Format (respond with ONLY this JSON structure):

```json
{{
  "coverage": "[Rich|Moderate|Sparse|None]",
  "key_findings": [
    "Finding 1 - one sentence summarizing a key empirical result",
    "Finding 2 - another key result or pattern",
    "Finding 3 - contradictory finding if any, or methodological limitation"
  ],
  "methodological_notes": "Brief note on study quality, sample types, or generalizability concerns. Leave empty string if none.",
  "top_citations": [
    "Author (Year). Brief title. Journal.",
    "Author (Year). Brief title. Journal."
  ],
  "gap_flag": true,
  "gap_notes": "What's missing that would be needed for our methodology. Empty string if no gaps."
}}
```

Constraints:
- Maximum 5 key findings
- Maximum 5 citations (prioritize most cited, most methodologically relevant, and most recent)
- gap_flag should be true if coverage is Sparse/None OR if specific needed evidence is missing
- All strings must be properly escaped for JSON"""


def process_with_llm(raw: RawSciteFile, client: anthropic.Anthropic, config: dict) -> ProcessedEntry:
    """Use Claude to summarize raw scite output into structured format."""
    
    prompt = SUMMARIZATION_PROMPT.format(
        question_title=raw.question_title,
        query_submitted=raw.query_submitted,
        narrative=raw.narrative or "(No narrative provided)",
        references=raw.references or "(No references found)",
        reference_count=raw.reference_count,
    )
    
    response = client.messages.create(
        model=config["api"]["model"],
        max_tokens=config["api"]["max_tokens"],
        temperature=config["api"]["temperature"],
        messages=[{"role": "user", "content": prompt}],
    )
    
    # Extract JSON from response
    response_text = response.content[0].text
    
    # Find JSON block
    json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
    if json_match:
        json_str = json_match.group(1)
    else:
        # Try to find raw JSON
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
        else:
            raise ValueError(f"Could not extract JSON from LLM response for {raw.question_id}")
    
    data = json.loads(json_str)
    
    return ProcessedEntry(
        question_id=raw.question_id,
        cluster=raw.cluster,
        question_title=raw.question_title,
        query_submitted=raw.query_submitted,
        coverage=data.get("coverage", "None"),
        key_findings=data.get("key_findings", []),
        methodological_notes=data.get("methodological_notes", ""),
        top_citations=data.get("top_citations", []),
        gap_flag=data.get("gap_flag", False),
        gap_notes=data.get("gap_notes", ""),
        source_file=raw.source_file,
        processed_date=datetime.now().isoformat(),
    )


def process_without_llm(raw: RawSciteFile, config: dict) -> ProcessedEntry:
    """Create a placeholder entry for dry-run mode."""
    
    thresholds = config["processing"]["coverage_thresholds"]
    ref_count = raw.reference_count
    
    if ref_count >= thresholds["rich"]:
        coverage = "Rich"
    elif ref_count >= thresholds["moderate"]:
        coverage = "Moderate"
    elif ref_count >= thresholds["sparse"]:
        coverage = "Sparse"
    else:
        coverage = "None"
    
    return ProcessedEntry(
        question_id=raw.question_id,
        cluster=raw.cluster,
        question_title=raw.question_title,
        query_submitted=raw.query_submitted,
        coverage=coverage,
        key_findings=["[DRY RUN - LLM summarization skipped]"],
        methodological_notes="",
        top_citations=[],
        gap_flag=coverage in ("Sparse", "None"),
        gap_notes="Requires LLM processing" if coverage in ("Sparse", "None") else "",
        source_file=raw.source_file,
        processed_date=datetime.now().isoformat(),
    )


# =============================================================================
# Output Generation
# =============================================================================

def save_processed_entry(entry: ProcessedEntry, output_dir: Path) -> Path:
    """Save individual processed entry as markdown and JSON."""
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save markdown
    md_path = output_dir / f"{entry.question_id}_processed.md"
    md_path.write_text(entry.to_markdown(), encoding="utf-8")
    
    # Save JSON for programmatic access
    json_path = output_dir / f"{entry.question_id}_processed.json"
    json_path.write_text(json.dumps(asdict(entry), indent=2), encoding="utf-8")
    
    return md_path


def generate_consolidated_report(entries: list[ProcessedEntry], clusters_config: dict, output_dir: Path) -> Path:
    """Generate consolidated report organized by cluster."""
    
    # Group entries by cluster
    by_cluster: dict[int, list[ProcessedEntry]] = {}
    for entry in entries:
        by_cluster.setdefault(entry.cluster, []).append(entry)
    
    # Build report
    lines = [
        "# Literature Review: Structured Summaries",
        "",
        f"*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*",
        "",
        "---",
        "",
        "## Executive Summary",
        "",
    ]
    
    # Coverage summary table
    lines.extend([
        "| Cluster | Questions | Rich | Moderate | Sparse | None | Needs Research |",
        "|---------|-----------|------|----------|--------|------|----------------|",
    ])
    
    for cluster_id in sorted(by_cluster.keys()):
        cluster_entries = by_cluster[cluster_id]
        cluster_info = clusters_config.get(cluster_id, {})
        cluster_name = cluster_info.get("name", f"Cluster {cluster_id}")
        
        rich = sum(1 for e in cluster_entries if e.coverage == "Rich")
        moderate = sum(1 for e in cluster_entries if e.coverage == "Moderate")
        sparse = sum(1 for e in cluster_entries if e.coverage == "Sparse")
        none = sum(1 for e in cluster_entries if e.coverage == "None")
        needs_research = "Yes" if (sparse + none) > len(cluster_entries) // 2 else "No"
        
        lines.append(f"| {cluster_id}. {cluster_name[:40]} | {len(cluster_entries)} | {rich} | {moderate} | {sparse} | {none} | {needs_research} |")
    
    lines.extend(["", "---", ""])
    
    # Questions flagged for deep research
    flagged = [e for e in entries if e.gap_flag]
    if flagged:
        lines.extend([
            "## Questions Requiring Deep Web Research",
            "",
        ])
        for entry in sorted(flagged, key=lambda e: e.question_id):
            lines.append(f"- **{entry.question_id}**: {entry.question_title}")
            if entry.gap_notes:
                lines.append(f"  - {entry.gap_notes}")
        lines.extend(["", "---", ""])
    
    # Detailed sections by cluster
    for cluster_id in sorted(by_cluster.keys()):
        cluster_entries = by_cluster[cluster_id]
        cluster_info = clusters_config.get(cluster_id, {})
        cluster_name = cluster_info.get("name", f"Cluster {cluster_id}")
        
        summary = ClusterSummary(
            cluster_id=cluster_id,
            cluster_name=cluster_name,
            entries=cluster_entries,
        )
        lines.append(summary.to_markdown())
    
    report_path = output_dir / "LITERATURE_REVIEW_SUMMARY.md"
    report_path.write_text("\n".join(lines), encoding="utf-8")
    
    return report_path


# =============================================================================
# Main Pipeline
# =============================================================================

def load_config(config_path: Path) -> dict:
    """Load configuration from YAML file."""
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")
    return yaml.safe_load(config_path.read_text())


def get_topic_paths(topic: str, repo_root: Path) -> dict[str, Path]:
    """Resolve paths for a given topic."""
    
    topic_root = repo_root / "library" / "topics" / topic
    scite_dir = topic_root / "sources" / "scite"
    
    return {
        "topic_root": topic_root,
        "scite_dir": scite_dir,
        "raw_dir": scite_dir / "raw",
        "processed_dir": scite_dir / "processed",
        "output_dir": scite_dir / "output",
        "outline_path": scite_dir / "OUTLINE.md",
    }


def main():
    parser = argparse.ArgumentParser(description="Process scite.ai literature search results")
    parser.add_argument("--config", type=Path, help="Path to config file (default: tools/scite-pipeline/config.yaml)")
    parser.add_argument("--topic", type=str, required=True, help="Topic slug (e.g., digital-identity-formation)")
    parser.add_argument("--question", type=str, help="Process single question (e.g., Q05)")
    parser.add_argument("--cluster", type=int, help="Process entire cluster (1-8)")
    parser.add_argument("--dry-run", action="store_true", help="Parse files without LLM processing")
    parser.add_argument("--report-only", action="store_true", help="Regenerate report from existing processed files")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    # Resolve repo root (assume script is in tools/scite-pipeline/)
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent.parent
    
    # Load config
    if args.config:
        config_path = args.config
    else:
        config_path = script_dir / "config.yaml"
    
    config = load_config(config_path)
    
    # Get topic-specific paths
    paths = get_topic_paths(args.topic, repo_root)
    
    if not paths["scite_dir"].exists():
        print(f"Topic directory not found: {paths['scite_dir']}")
        print(f"Expected structure: library/topics/{args.topic}/sources/scite/")
        sys.exit(1)
    
    # Load cluster definitions from topic OUTLINE.md
    clusters_config = load_outline_clusters(paths["outline_path"])
    
    if not clusters_config:
        print(f"Warning: Could not load cluster definitions from {paths['outline_path']}")
        print("Make sure OUTLINE.md has YAML frontmatter with 'clusters:' section")
    
    # Handle report-only mode
    if args.report_only:
        print("Regenerating report from processed files...")
        entries = []
        for json_path in paths["processed_dir"].glob("*_processed.json"):
            data = json.loads(json_path.read_text())
            entries.append(ProcessedEntry(**data))
        
        if not entries:
            print("No processed files found. Run processing first.")
            sys.exit(1)
        
        report_path = generate_consolidated_report(entries, clusters_config, paths["output_dir"])
        print(f"Report generated: {report_path}")
        sys.exit(0)
    
    # Discover raw files
    raw_files = discover_raw_files(paths["raw_dir"], args.question, args.cluster)
    
    if not raw_files:
        print(f"No raw files found in {paths['raw_dir']}")
        print("Create raw files following RAW_FORMAT.md specification.")
        sys.exit(1)
    
    print(f"Found {len(raw_files)} raw file(s) to process")
    
    # Parse raw files
    parsed: list[RawSciteFile] = []
    for filepath in raw_files:
        try:
            raw = parse_raw_file(filepath)
            if args.cluster is not None and raw.cluster != args.cluster:
                continue
            parsed.append(raw)
            if args.verbose:
                print(f"  Parsed: {raw.question_id} ({raw.reference_count} refs)")
        except Exception as e:
            print(f"  Error parsing {filepath}: {e}")
    
    if not parsed:
        print("No files matched criteria after parsing.")
        sys.exit(1)
    
    # Process with LLM (or dry-run)
    client = None
    if not args.dry_run:
        client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var
    
    processed_entries: list[ProcessedEntry] = []
    
    for raw in parsed:
        print(f"Processing {raw.question_id}: {raw.question_title[:50]}...")
        
        try:
            if args.dry_run:
                entry = process_without_llm(raw, config)
            else:
                entry = process_with_llm(raw, client, config)
            
            # Save individual file
            if config["output"]["individual_files"]:
                save_processed_entry(entry, paths["processed_dir"])
            
            processed_entries.append(entry)
            
            if args.verbose:
                print(f"  → Coverage: {entry.coverage}, Gap: {entry.gap_flag}")
        
        except Exception as e:
            print(f"  Error processing {raw.question_id}: {e}")
            if args.verbose:
                import traceback
                traceback.print_exc()
    
    # Generate consolidated report
    if config["output"]["consolidated_report"] and processed_entries:
        paths["output_dir"].mkdir(parents=True, exist_ok=True)
        report_path = generate_consolidated_report(processed_entries, clusters_config, paths["output_dir"])
        print(f"\nConsolidated report: {report_path}")
    
    # Summary
    print(f"\nProcessed {len(processed_entries)} questions:")
    for coverage in ["Rich", "Moderate", "Sparse", "None"]:
        count = sum(1 for e in processed_entries if e.coverage == coverage)
        if count:
            print(f"  {coverage}: {count}")
    
    flagged = sum(1 for e in processed_entries if e.gap_flag)
    if flagged:
        print(f"\n{flagged} question(s) flagged for deep web research")


if __name__ == "__main__":
    main()

