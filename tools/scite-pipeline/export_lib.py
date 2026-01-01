#!/usr/bin/env python3
"""
Export Library Entry from Processed Scite Summaries

Generates publish-ready MDX files for phronos-site Library content collection
from processed scite.ai summaries and topic metadata.

Usage:
    python export_lib.py --topic digital-identity-formation --lib-id LIB-001
"""

import argparse
import json
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Optional

import yaml


def load_processed_entries(processed_dir: Path) -> list[dict]:
    """Load all processed JSON entries."""
    
    entries = []
    for json_path in processed_dir.glob("*_processed.json"):
        data = json.loads(json_path.read_text())
        entries.append(data)
    
    return entries


def load_outline(outline_path: Path) -> dict:
    """Load topic OUTLINE.md and extract frontmatter + clusters."""
    
    if not outline_path.exists():
        return {}
    
    content = outline_path.read_text(encoding="utf-8")
    
    if not content.startswith("---"):
        return {}
    
    parts = content.split("---", 2)
    if len(parts) < 2:
        return {}
    
    frontmatter = yaml.safe_load(parts[1])
    return frontmatter


def load_topic_metadata(topic_path: Path) -> dict:
    """Load TOPIC.md metadata."""
    
    topic_file = topic_path / "TOPIC.md"
    if not topic_file.exists():
        return {}
    
    # Simple extraction - could be enhanced with frontmatter if needed
    content = topic_file.read_text(encoding="utf-8")
    title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else ""
    
    return {"title": title}


def dedupe_citations(entries: list[dict]) -> list[str]:
    """Extract and deduplicate citations from processed entries."""
    
    all_citations = []
    seen = set()
    
    for entry in entries:
        for citation in entry.get("top_citations", []):
            # Simple deduplication by exact match
            if citation not in seen:
                seen.add(citation)
                all_citations.append(citation)
    
    return all_citations


def generate_mdx_content(
    lib_id: str,
    topic: str,
    entries: list[dict],
    clusters: dict,
    topic_metadata: dict,
    consolidated_report: Optional[str] = None,
) -> str:
    """Generate MDX content with frontmatter and body sections."""
    
    # Extract title from topic metadata or default
    title = topic_metadata.get("title", f"Library Entry {lib_id}")
    
    # Generate frontmatter
    frontmatter_lines = [
        "---",
        f"id: {lib_id}",
        f"title: {title}",
        f"date: {datetime.now().strftime('%Y-%m-%d')}",
        "status: researching  # published | researching | planned | archived",
        f"abstract: \"Literature synthesis for {topic}. Generated from processed scite.ai summaries.\"",
        'version: "0.1"',
        f"topics:",
        f"  - {topic}",
        "---",
    ]
    
    # Generate body sections
    body_lines = [
        f"<!-- Copy to: phronos-site/src/content/library/{lib_id.lower().replace('-', '-')}.mdx -->",
        "",
        f"# {title}",
        "",
        "## Executive Summary",
        "",
    ]
    
    # Add executive summary placeholder or content from consolidated report
    if consolidated_report:
        # Extract executive summary section if present
        exec_match = re.search(r'## Executive Summary\s*\n\n(.*?)(?=\n##|\Z)', consolidated_report, re.DOTALL)
        if exec_match:
            body_lines.append(exec_match.group(1).strip())
            body_lines.append("")
        else:
            body_lines.append("*Executive summary will be synthesized from processed findings.*")
            body_lines.append("")
    else:
        body_lines.append("*Executive summary will be synthesized from processed findings.*")
        body_lines.append("")
    
    # Group entries by cluster
    by_cluster: dict[int, list[dict]] = defaultdict(list)
    for entry in entries:
        by_cluster[entry.get("cluster", 0)].append(entry)
    
    # Generate per-cluster sections
    for cluster_id in sorted(by_cluster.keys()):
        cluster_entries = by_cluster[cluster_id]
        cluster_info = clusters.get("clusters", {}).get(cluster_id, {})
        cluster_name = cluster_info.get("name", f"Cluster {cluster_id}")
        
        body_lines.extend([
            f"## {cluster_name}",
            "",
        ])
        
        # Add findings from each question in this cluster
        for entry in sorted(cluster_entries, key=lambda e: e.get("question_id", "")):
            question_title = entry.get("question_title", "")
            key_findings = entry.get("key_findings", [])
            methodological_notes = entry.get("methodological_notes", "")
            gap_flag = entry.get("gap_flag", False)
            gap_notes = entry.get("gap_notes", "")
            
            body_lines.append(f"### {entry.get('question_id', '')}: {question_title}")
            body_lines.append("")
            
            if key_findings:
                body_lines.append("**Key findings:**")
                for finding in key_findings:
                    body_lines.append(f"- {finding}")
                body_lines.append("")
            
            if methodological_notes:
                body_lines.append(f"**Methodological notes:** {methodological_notes}")
                body_lines.append("")
            
            if gap_flag:
                body_lines.append(f"**Research gap:** {gap_notes if gap_notes else 'Coverage is sparse or missing.'}")
                body_lines.append("")
        
        body_lines.append("---")
        body_lines.append("")
    
    # Bibliography section
    citations = dedupe_citations(entries)
    if citations:
        body_lines.extend([
            "## Bibliography",
            "",
        ])
        for i, citation in enumerate(citations, 1):
            body_lines.append(f"{i}. {citation}")
        body_lines.append("")
    
    # Human synthesis placeholders
    body_lines.extend([
        "---",
        "",
        "## Interpretation",
        "",
        "*Human synthesis section - interpret findings across clusters.*",
        "",
        "## Implications",
        "",
        "*Human synthesis section - implications for methodology and practice.*",
        "",
        "## Limitations",
        "",
        "*Human synthesis section - acknowledge limitations of the evidence base.*",
        "",
        "## Open Questions",
        "",
        "*Human synthesis section - identify remaining gaps and future research directions.*",
        "",
    ])
    
    # Combine frontmatter and body
    return "\n".join(frontmatter_lines) + "\n\n" + "\n".join(body_lines)


def get_topic_paths(topic: str, repo_root: Path) -> dict[str, Path]:
    """Resolve paths for a given topic."""
    
    topic_root = repo_root / "library" / "topics" / topic
    scite_dir = topic_root / "sources" / "scite"
    
    return {
        "topic_root": topic_root,
        "scite_dir": scite_dir,
        "processed_dir": scite_dir / "processed",
        "output_dir": scite_dir / "output",
        "outline_path": scite_dir / "OUTLINE.md",
    }


def main():
    import sys
    
    parser = argparse.ArgumentParser(description="Export Library entry from processed scite summaries")
    parser.add_argument("--topic", type=str, required=True, help="Topic slug (e.g., digital-identity-formation)")
    parser.add_argument("--lib-id", type=str, required=True, help="Library ID (e.g., LIB-001)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    # Resolve repo root
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent.parent
    
    # Get topic paths
    paths = get_topic_paths(args.topic, repo_root)
    
    if not paths["scite_dir"].exists():
        print(f"Topic directory not found: {paths['scite_dir']}")
        return 1
    
    # Load processed entries
    if not paths["processed_dir"].exists():
        print(f"Processed directory not found: {paths['processed_dir']}")
        print("Run process_scite.py first to generate processed summaries.")
        return 1
    
    entries = load_processed_entries(paths["processed_dir"])
    
    if not entries:
        print("No processed entries found.")
        print("Run process_scite.py first to generate processed summaries.")
        return 1
    
    if args.verbose:
        print(f"Loaded {len(entries)} processed entries")
    
    # Load outline and clusters
    outline_data = load_outline(paths["outline_path"])
    clusters = outline_data.get("clusters", {})
    
    # Load topic metadata
    topic_metadata = load_topic_metadata(paths["topic_root"])
    
    # Load consolidated report if available
    consolidated_report = None
    report_path = paths["output_dir"] / "LITERATURE_REVIEW_SUMMARY.md"
    if report_path.exists():
        consolidated_report = report_path.read_text(encoding="utf-8")
    
    # Generate MDX content
    mdx_content = generate_mdx_content(
        lib_id=args.lib_id,
        topic=args.topic,
        entries=entries,
        clusters=outline_data,
        topic_metadata=topic_metadata,
        consolidated_report=consolidated_report,
    )
    
    # Create lib directory structure
    lib_dir = paths["topic_root"] / "lib" / args.lib_id
    lib_dir.mkdir(parents=True, exist_ok=True)
    
    # Save working file
    working_file = lib_dir / f"{args.lib_id}.mdx"
    working_file.write_text(mdx_content, encoding="utf-8")
    print(f"Working file: {working_file}")
    
    # Create exports directory
    exports_dir = paths["topic_root"] / "exports"
    exports_dir.mkdir(parents=True, exist_ok=True)
    
    # Save copy-ready export (lowercase slug format)
    export_slug = args.lib_id.lower().replace("-", "-")
    export_file = exports_dir / f"{export_slug}.mdx"
    export_file.write_text(mdx_content, encoding="utf-8")
    print(f"Export file: {export_file}")
    print(f"\nCopy to phronos-site:")
    print(f"  cp {export_file} ../phronos-site/src/content/library/{export_slug}.mdx")
    
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())

