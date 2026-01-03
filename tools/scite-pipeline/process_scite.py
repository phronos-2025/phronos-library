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
    
Batch Processing:
    python process_scite.py --topic digital-identity-formation --batch-size 10    # Process 10 at a time
    python process_scite.py --topic digital-identity-formation --limit 5          # Only process first 5
    python process_scite.py --topic digital-identity-formation --skip-processed   # Skip already processed files
    python process_scite.py --topic digital-identity-formation --confirm          # Require confirmation before starting
"""

import argparse
import json
import os
import re
import sys
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple

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
        """Count references by various formats."""
        if not self.references.strip():
            return 0
        
        # Try numbered list format first (e.g., "1. Author...")
        numbered_pattern = r'^\s*\d+[\.\)]\s+'
        numbered_count = len(re.findall(numbered_pattern, self.references, re.MULTILINE))
        if numbered_count > 0:
            return numbered_count
        
        # Try DOI-based counting (most reliable for APA format)
        doi_count = len(re.findall(r'https?://doi\.org/', self.references))
        if doi_count > 0:
            return doi_count
        
        # Fallback: count lines that look like citations (Author, Year pattern)
        citation_pattern = r'^[A-Z][a-zA-Z\-\']+,?\s.*\(\d{4}\)'
        citation_count = len(re.findall(citation_pattern, self.references, re.MULTILINE))
        if citation_count > 0:
            return citation_count
        
        # Last resort: count non-empty lines in references section
        lines = [l.strip() for l in self.references.split('\n') if l.strip() and not l.strip().startswith('|')]
        return len(lines)
    
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
    narrative_conclusion_quote: str = ""  # New: preserves source conclusion for audit
    
    def to_markdown(self) -> str:
        """Render as markdown."""
        lines = [
            f"## {self.question_id}: {self.question_title}",
            "",
            f"**Coverage:** {self.coverage}",
            "",
        ]
        
        if self.narrative_conclusion_quote:
            lines.append(f"**Source conclusion:** \"{self.narrative_conclusion_quote}\"")
            lines.append("")
        
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
class CostEntry:
    """Track API usage and costs for a single question."""
    
    question_id: str
    question_title: str
    model: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    cost_usd: float
    timestamp: str
    
    def to_dict(self) -> dict:
        return asdict(self)


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

SUMMARIZATION_PROMPT = """You are extracting and summarizing information from a scite.ai literature search result.

## CRITICAL GROUNDING RULES — VIOLATION CAUSES TASK FAILURE

1. **ONLY USE INFORMATION FROM THE PROVIDED TEXT BELOW.** Do not add ANY information from your training data or general knowledge.
2. **CITATIONS MUST BE COPIED FROM THE REFERENCES SECTION.** Every citation you include must appear verbatim in the "References Found" section below. Do not invent, synthesize, or recall citations from memory.
3. **FINDINGS MUST BE STATED IN THE NARRATIVE.** Every key finding must be directly supported by text in the "Scite.ai Narrative Response" section. Do not infer or extrapolate.
4. **PRESERVE THE NARRATIVE'S CONCLUSION.** If the narrative says evidence "supports" or "strongly supports" something, your summary must reflect that. If it says evidence is "limited" or "lacking," reflect that instead. Do not invert conclusions.

---

## Source Material

**Research Question:** {question_title}
**Query Submitted:** {query_submitted}

**Scite.ai Narrative Response:**
{narrative}

**References Found:**
{references}

**Reference Count:** {reference_count}

---

## Extraction Task

### Step 1: Identify the narrative's overall conclusion
Read the narrative's conclusion/summary section. What does it say about the evidence? Quote the key concluding sentence(s) that characterize the strength of evidence.

### Step 2: Assess coverage
Based on reference count AND how directly the references address the research question:
- Rich: 8+ references that directly address the question with empirical findings
- Moderate: 4-7 references with reasonable relevance
- Sparse: 1-3 references OR references are tangential to the question
- None: 0 references OR completely off-topic

### Step 3: Extract key findings
Pull 3-5 specific empirical claims from the narrative. Each must:
- Be stated in the narrative (not inferred)
- Include specific details when present (effect sizes, sample sizes, contexts)
- Be one sentence

### Step 4: Extract citations
Select up to 5 citations from the References section. Copy them in this format:
"Author (Year). Title fragment. Journal."
ONLY include citations that appear in the References section above.

### Step 5: Identify gaps
Note what evidence is missing relative to the research question—but only if the narrative itself identifies limitations or gaps.

---

## Output Format

Respond with ONLY this JSON structure (no other text):

```json
{{
  "narrative_conclusion_quote": "Direct quote from the narrative's conclusion about evidence strength",
  "coverage": "[Rich|Moderate|Sparse|None]",
  "key_findings": [
    "Finding 1 extracted from narrative",
    "Finding 2 extracted from narrative",
    "Finding 3 extracted from narrative"
  ],
  "methodological_notes": "Limitations mentioned IN THE NARRATIVE. Empty string if none stated.",
  "top_citations": [
    "Author (Year). Title. Journal. — MUST appear in References section",
    "Author (Year). Title. Journal."
  ],
  "gap_flag": true,
  "gap_notes": "Gaps identified IN THE NARRATIVE or obvious from sparse coverage. Empty string if none."
}}
```

## Final Verification Checklist (complete mentally before responding)
- [ ] Every citation I included appears in the References section
- [ ] My coverage assessment matches the narrative's conclusion
- [ ] My key findings are stated (not inferred) in the narrative
- [ ] I did not add any information from outside the provided text"""


def process_with_llm(raw: RawSciteFile, client: anthropic.Anthropic, config: dict) -> Tuple[ProcessedEntry, CostEntry]:
    """Use Claude to summarize raw scite output into structured format.
    
    Returns:
        tuple: (ProcessedEntry, CostEntry)
    """
    
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
    
    # Extract usage data
    usage = response.usage
    model = config["api"]["model"]
    pricing = config["api"].get("pricing", {}).get(model, {})
    
    # Calculate cost
    input_cost = (usage.input_tokens / 1_000_000) * pricing.get("input", 0)
    output_cost = (usage.output_tokens / 1_000_000) * pricing.get("output", 0)
    total_cost = input_cost + output_cost
    
    cost_entry = CostEntry(
        question_id=raw.question_id,
        question_title=raw.question_title,
        model=model,
        input_tokens=usage.input_tokens,
        output_tokens=usage.output_tokens,
        total_tokens=usage.input_tokens + usage.output_tokens,
        cost_usd=total_cost,
        timestamp=datetime.now().isoformat(),
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
    
    # Validate citations against source references
    extracted_citations = data.get("top_citations", [])
    validated_citations = []
    references_text = raw.references.lower() if raw.references else ""
    
    for citation in extracted_citations:
        # Extract author name and year from citation for validation
        # Look for pattern like "Author (Year)" or "Author et al. (Year)"
        match = re.search(r'^([A-Za-z\-]+).*?\((\d{4})\)', citation)
        if match:
            author_fragment = match.group(1).lower()
            year = match.group(2)
            # Check if author and year appear in references
            if author_fragment in references_text and year in references_text:
                validated_citations.append(citation)
            else:
                # Citation may be hallucinated - flag but include with warning
                validated_citations.append(f"[UNVERIFIED] {citation}")
        else:
            validated_citations.append(citation)
    
    entry = ProcessedEntry(
        question_id=raw.question_id,
        cluster=raw.cluster,
        question_title=raw.question_title,
        query_submitted=raw.query_submitted,
        coverage=data.get("coverage", "None"),
        key_findings=data.get("key_findings", []),
        methodological_notes=data.get("methodological_notes", ""),
        top_citations=validated_citations,
        gap_flag=data.get("gap_flag", False),
        gap_notes=data.get("gap_notes", ""),
        source_file=raw.source_file,
        processed_date=datetime.now().isoformat(),
        narrative_conclusion_quote=data.get("narrative_conclusion_quote", ""),
    )
    
    return entry, cost_entry


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
        narrative_conclusion_quote="[DRY RUN]",
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


def save_cost_log(cost_entries: list[CostEntry], output_dir: Path, topic: str) -> Path:
    """Save cost tracking data to JSON file."""
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save individual cost log
    cost_log_path = output_dir / "cost_log.json"
    
    # Load existing log if it exists
    existing_log = []
    if cost_log_path.exists():
        existing_log = json.loads(cost_log_path.read_text())
    
    # Append new entries
    new_entries = [entry.to_dict() for entry in cost_entries]
    all_entries = existing_log + new_entries
    
    # Save updated log
    cost_log_path.write_text(
        json.dumps(all_entries, indent=2),
        encoding="utf-8"
    )
    
    return cost_log_path


def generate_cost_summary(cost_entries: list[CostEntry], output_dir: Path) -> Path:
    """Generate human-readable cost summary report."""
    
    output_dir.mkdir(parents=True, exist_ok=True)
    summary_path = output_dir / "COST_SUMMARY.md"
    
    if not cost_entries:
        summary_path.write_text("# Cost Summary\n\nNo API calls made.\n")
        return summary_path
    
    total_cost = sum(entry.cost_usd for entry in cost_entries)
    total_input_tokens = sum(entry.input_tokens for entry in cost_entries)
    total_output_tokens = sum(entry.output_tokens for entry in cost_entries)
    total_tokens = sum(entry.total_tokens for entry in cost_entries)
    
    # Group by model
    by_model = {}
    for entry in cost_entries:
        if entry.model not in by_model:
            by_model[entry.model] = []
        by_model[entry.model].append(entry)
    
    lines = [
        "# API Cost Summary",
        "",
        f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        "## Totals",
        "",
        f"- **Total Cost:** ${total_cost:.4f}",
        f"- **Total Tokens:** {total_tokens:,}",
        f"  - Input: {total_input_tokens:,}",
        f"  - Output: {total_output_tokens:,}",
        f"- **Questions Processed:** {len(cost_entries)}",
        f"- **Average Cost per Question:** ${total_cost / len(cost_entries):.4f}",
        "",
        "## By Model",
        "",
    ]
    
    for model, entries in by_model.items():
        model_cost = sum(e.cost_usd for e in entries)
        model_tokens = sum(e.total_tokens for e in entries)
        lines.extend([
            f"### {model}",
            "",
            f"- Questions: {len(entries)}",
            f"- Cost: ${model_cost:.4f}",
            f"- Tokens: {model_tokens:,}",
            "",
        ])
    
    lines.extend([
        "## Per Question",
        "",
        "| Question | Title | Input Tokens | Output Tokens | Cost (USD) |",
        "|----------|-------|--------------|---------------|------------|",
    ])
    
    for entry in sorted(cost_entries, key=lambda x: x.question_id):
        lines.append(
            f"| {entry.question_id} | {entry.question_title[:50]} | "
            f"{entry.input_tokens:,} | {entry.output_tokens:,} | ${entry.cost_usd:.4f} |"
        )
    
    summary_path.write_text("\n".join(lines), encoding="utf-8")
    return summary_path


def estimate_costs(raw_files: list[RawSciteFile], config: dict) -> dict:
    """Estimate costs based on average prompt size."""
    
    # Rough estimate: average prompt is ~2000 tokens, response ~500 tokens
    avg_input = 2000
    avg_output = 500
    
    model = config["api"]["model"]
    pricing = config["api"].get("pricing", {}).get(model, {})
    
    input_cost_per = (avg_input / 1_000_000) * pricing.get("input", 0)
    output_cost_per = (avg_output / 1_000_000) * pricing.get("output", 0)
    cost_per_question = input_cost_per + output_cost_per
    
    return {
        "estimated_cost": cost_per_question * len(raw_files),
        "cost_per_question": cost_per_question,
        "num_questions": len(raw_files),
    }


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
    parser.add_argument("--cluster", type=int, help="Process entire cluster (1-17)")
    parser.add_argument("--dry-run", action="store_true", help="Parse files without LLM processing")
    parser.add_argument("--report-only", action="store_true", help="Regenerate report from existing processed files")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    # Batch processing options
    parser.add_argument("--batch-size", type=int, default=0, help="Process N questions per batch (0 = all at once)")
    parser.add_argument("--batch-delay", type=float, default=2.0, help="Delay in seconds between batches (default: 2)")
    parser.add_argument("--limit", type=int, default=0, help="Only process first N questions (0 = no limit)")
    parser.add_argument("--skip-processed", action="store_true", help="Skip files that already have processed JSON")
    parser.add_argument("--confirm", action="store_true", help="Require confirmation before starting")
    
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
    skipped_empty = 0
    for filepath in raw_files:
        try:
            raw = parse_raw_file(filepath)
            if args.cluster is not None and raw.cluster != args.cluster:
                continue
            # Skip files with no actual content (template files)
            if not raw.narrative.strip() or raw.narrative.strip().startswith("[Paste"):
                skipped_empty += 1
                if args.verbose:
                    print(f"  Skipped (empty template): {raw.question_id}")
                continue
            parsed.append(raw)
            if args.verbose:
                print(f"  Parsed: {raw.question_id} ({raw.reference_count} refs)")
        except Exception as e:
            print(f"  Error parsing {filepath}: {e}")
    
    if skipped_empty:
        print(f"  Skipped {skipped_empty} empty template file(s)")
    
    if not parsed:
        print("No files matched criteria after parsing.")
        sys.exit(1)
    
    # Skip already processed files if requested
    if args.skip_processed:
        original_count = len(parsed)
        parsed = [
            raw for raw in parsed 
            if not (paths["processed_dir"] / f"{raw.question_id}_processed.json").exists()
        ]
        skipped_count = original_count - len(parsed)
        if skipped_count:
            print(f"  Skipped {skipped_count} already processed file(s)")
        if not parsed:
            print("All files already processed. Nothing to do.")
            sys.exit(0)
    
    # Apply limit if specified
    if args.limit > 0 and len(parsed) > args.limit:
        print(f"  Limiting to first {args.limit} file(s)")
        parsed = parsed[:args.limit]
    
    print(f"\n📋 Will process {len(parsed)} question(s)")
    
    # Estimate costs before processing (if not dry-run)
    if not args.dry_run:
        estimate = estimate_costs(parsed, config)
        print(f"💰 Estimated cost: ${estimate['estimated_cost']:.4f} ({estimate['num_questions']} questions @ ${estimate['cost_per_question']:.4f} each)")
        print("   (Based on average prompt size - actual costs may vary)")
        
        if args.batch_size > 0:
            num_batches = (len(parsed) + args.batch_size - 1) // args.batch_size
            print(f"📦 Batch mode: {args.batch_size} per batch, {num_batches} batch(es), {args.batch_delay}s delay between batches")
    
    # Confirmation prompt
    if args.confirm and not args.dry_run:
        print()
        response = input("Proceed? [y/N] ").strip().lower()
        if response != 'y':
            print("Aborted.")
            sys.exit(0)
    
    # Check for API key
    if not args.dry_run and not os.environ.get("ANTHROPIC_API_KEY"):
        print("\n❌ Error: ANTHROPIC_API_KEY environment variable not set.")
        print("Set it with: export ANTHROPIC_API_KEY='your-key-here'")
        sys.exit(1)
    
    # Process with LLM (or dry-run)
    client = None
    if not args.dry_run:
        client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var
    
    processed_entries: list[ProcessedEntry] = []
    cost_entries: list[CostEntry] = []
    
    # Process in batches
    batch_size = args.batch_size if args.batch_size > 0 else len(parsed)
    total_batches = (len(parsed) + batch_size - 1) // batch_size
    
    for batch_num in range(total_batches):
        batch_start = batch_num * batch_size
        batch_end = min(batch_start + batch_size, len(parsed))
        batch = parsed[batch_start:batch_end]
        
        if total_batches > 1:
            print(f"\n📦 Batch {batch_num + 1}/{total_batches} ({len(batch)} questions)")
        
        for i, raw in enumerate(batch):
            progress = f"[{batch_start + i + 1}/{len(parsed)}]"
            print(f"{progress} Processing {raw.question_id}: {raw.question_title[:50]}...")
            
            try:
                if args.dry_run:
                    entry = process_without_llm(raw, config)
                    processed_entries.append(entry)
                else:
                    entry, cost_entry = process_with_llm(raw, client, config)
                    processed_entries.append(entry)
                    cost_entries.append(cost_entry)
                    
                    if args.verbose:
                        print(f"  → Coverage: {entry.coverage}, Gap: {entry.gap_flag}")
                        print(f"  → Tokens: {cost_entry.total_tokens:,} (${cost_entry.cost_usd:.4f})")
                
                # Save individual file
                if config["output"]["individual_files"]:
                    save_processed_entry(entry, paths["processed_dir"])
            
            except Exception as e:
                print(f"  ❌ Error processing {raw.question_id}: {e}")
                if args.verbose:
                    import traceback
                    traceback.print_exc()
        
        # Batch delay (except for last batch)
        if batch_num < total_batches - 1 and not args.dry_run and args.batch_delay > 0:
            print(f"  ⏳ Waiting {args.batch_delay}s before next batch...")
            time.sleep(args.batch_delay)
    
    # Save cost tracking
    if cost_entries:
        cost_log_path = save_cost_log(cost_entries, paths["output_dir"], args.topic)
        cost_summary_path = generate_cost_summary(cost_entries, paths["output_dir"])
        
        total_cost = sum(entry.cost_usd for entry in cost_entries)
        total_tokens = sum(entry.total_tokens for entry in cost_entries)
        print(f"\n💰 Cost Summary:")
        print(f"  Total: ${total_cost:.4f} ({total_tokens:,} tokens)")
        print(f"  Average per question: ${total_cost / len(cost_entries):.4f}")
        print(f"  Cost log: {cost_log_path}")
        print(f"  Cost summary: {cost_summary_path}")
    
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

