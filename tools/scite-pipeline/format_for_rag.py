#!/usr/bin/env python3
"""
Convert raw scite.ai HTML output to clean markdown optimized for RAG retrieval.

Usage:
    python format_for_rag.py --topic digital-identity-formation           # Format all raw files
    python format_for_rag.py --topic digital-identity-formation --question Q01  # Format single question
    python format_for_rag.py --topic digital-identity-formation --verbose       # Show detailed output
"""

import argparse
import re
from pathlib import Path

from bs4 import BeautifulSoup
import yaml


# =============================================================================
# Citation Cleanup
# =============================================================================

def clean_citation_artifacts(text: str) -> str:
    """
    Clean up malformed inline citations from scite.ai HTML extraction.
    
    Common issues:
    - "(Author, Year; " → missing close paren, trailing semicolon
    - "Author, Year)" → missing open paren
    - "(Author1, Year1; Author2, Year2; " → trailing semicolon in multi-citation
    """
    
    # Pattern 1: Fix citations missing closing paren with trailing semicolon/space
    # e.g., "(Winghart & Zaidy, 2024; " → "(Winghart & Zaidy, 2024)"
    # Matches: opening paren, author text, year, semicolon, optional space, end or next word
    text = re.sub(
        r'\(([A-Za-z][^()]*?,\s*\d{4});\s*(?=\.|,|\s+[A-Z]|\s+[a-z]|$)',
        r'(\1)',
        text
    )
    
    # Pattern 2: Fix citations missing opening paren
    # e.g., "Budinoff et al., 2024)" → "(Budinoff et al., 2024)"
    # Match: word boundary, author name(s), comma, year, close paren
    text = re.sub(
        r'(?<![(\w])([A-Z][a-z]+(?:\s+(?:et\s+al\.|&\s+[A-Z][a-z]+))?(?:\s+et\s+al\.)?),?\s*(\d{4})\)',
        r'(\1, \2)',
        text
    )
    
    # Pattern 3: Clean up any remaining isolated semicolons before punctuation
    text = re.sub(r';\s*\.', '.', text)
    text = re.sub(r';\s*,', ',', text)
    
    # Pattern 4: Remove orphaned opening parens with just semicolon/space
    # e.g., "(; " left over from partial citations
    text = re.sub(r'\(\s*;\s*', '', text)
    
    # Pattern 5: Clean double spaces
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()


# =============================================================================
# HTML to Markdown Conversion
# =============================================================================

def extract_citation_from_link(link) -> str:
    """Extract author (year) format from a scite.ai citation link."""
    label = link.get('aria-label', '')
    # Extract author and year from patterns like "Fang et al. (2023)" or "(Esmaeilzadeh, 2021)"
    match = re.search(r'([A-Za-z\-]+(?:\s+et\s+al\.)?).+?(\d{4})', label)
    if match:
        return f"{match.group(1)} ({match.group(2)})"
    return None


def html_to_clean_markdown(html_content: str) -> str:
    """Convert HTML narrative to clean markdown, preserving structure and citations."""
    
    if not html_content.strip():
        return ""
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    lines = []
    
    for element in soup.find_all(['h1', 'h2', 'h3', 'p']):
        if element.name == 'h1':
            lines.append(f"\n# {element.get_text(strip=True)}\n")
        elif element.name == 'h2':
            lines.append(f"\n## {element.get_text(strip=True)}\n")
        elif element.name == 'h3':
            lines.append(f"\n### {element.get_text(strip=True)}\n")
        elif element.name == 'p':
            # First, extract citations from links before removing them
            para_citations = []
            for link in element.find_all('a', class_=re.compile(r'PaperLink')):
                citation = extract_citation_from_link(link)
                if citation:
                    para_citations.append(citation)
            
            # Remove all citation link spans from the paragraph to avoid malformed inline text
            # Make a copy of the element to avoid modifying the original tree
            p_copy = BeautifulSoup(str(element), 'html.parser').find('p')
            for span in p_copy.find_all('span'):
                # Check if span contains a PaperLink
                if span.find('a', class_=re.compile(r'PaperLink')):
                    span.decompose()
            
            # Now extract clean text without citation links
            text = p_copy.get_text(strip=True)
            
            # Clean up any remaining citation artifacts
            text = re.sub(r'\s*\([^)]*opens in a new tab[^)]*\)', '', text)
            text = clean_citation_artifacts(text)
            
            if text:
                lines.append(text)
                if para_citations:
                    # Deduplicate while preserving order
                    seen = set()
                    unique_citations = []
                    for c in para_citations:
                        if c not in seen:
                            seen.add(c)
                            unique_citations.append(c)
                    lines.append(f"  - Citations: {', '.join(unique_citations)}")
                lines.append("")
    
    return '\n'.join(lines)


def parse_references(references_text: str) -> list[dict]:
    """Parse references section into structured list."""
    refs = []
    
    if not references_text.strip():
        return refs
    
    # First, join multi-line references
    # A new reference starts with an author pattern: "Name, I." or "Name ("
    # Continuation lines start with lowercase or don't match author pattern
    raw_lines = references_text.strip().split('\n')
    joined_refs = []
    current_ref = ""
    
    for line in raw_lines:
        line = line.strip()
        if not line or line.startswith('|') or line.startswith('---'):
            continue
        
        # Remove leading number if present
        line = re.sub(r'^\d+[\.\)]\s*', '', line)
        
        # Check if this looks like the start of a new reference
        # Starts with: AuthorName, or AuthorName ( or Čekaitė, etc. (Unicode letters)
        # Use broad Unicode letter classes to catch all international names
        is_new_ref = bool(re.match(r'^[\u0041-\u005A\u00C0-\u024F\u1E00-\u1EFF]', line, re.UNICODE))
        
        if is_new_ref:
            # Save previous reference if exists
            if current_ref:
                joined_refs.append(current_ref)
            current_ref = line
        else:
            # Continuation of previous reference
            current_ref += " " + line
    
    # Don't forget the last reference
    if current_ref:
        joined_refs.append(current_ref)
    
    # Now parse each complete reference
    for ref_text in joined_refs:
        # Try to extract author, year, title, source
        # Pattern: Authors (Year). Title. Source. URL
        match = re.match(
            r'^([^(]+)\((\d{4})\)\.\s*(.+?)(?:\.\s*https?://.*)?$',
            ref_text
        )
        if match:
            authors = match.group(1).strip().rstrip(',')
            year = match.group(2)
            remainder = match.group(3).strip()
            
            # Try to split remainder into title and source
            # Look for pattern: Title. Journal, Volume(Issue), Pages
            # or: Title. Journal Name, pages
            # or just: Title (no source)
            
            # Split on last period followed by journal-like pattern
            parts = remainder.rsplit('. ', 1)
            if len(parts) == 2 and not parts[1].startswith('http'):
                title = parts[0].strip()
                source = parts[1].strip().rstrip('.')
                # Skip if source looks like a URL remnant or is empty
                if source and not source.startswith('http'):
                    refs.append({
                        'authors': authors,
                        'year': year,
                        'title': title,
                        'source': source
                    })
                else:
                    # No valid source, just use title
                    refs.append({
                        'authors': authors,
                        'year': year,
                        'title': remainder.rstrip('.'),
                        'source': ''
                    })
            else:
                # Can't split, treat whole remainder as title
                refs.append({
                    'authors': authors,
                    'year': year,
                    'title': remainder.rstrip('.'),
                    'source': ''
                })
        elif ref_text:
            # Fallback: store as raw
            refs.append({'raw': ref_text})
    
    return refs


# =============================================================================
# File Processing
# =============================================================================

def process_raw_file(input_path: Path, output_path: Path, verbose: bool = False):
    """Process a single raw scite file into clean markdown for RAG."""
    
    content = input_path.read_text(encoding='utf-8')
    
    # Parse frontmatter
    if not content.startswith('---'):
        raise ValueError(f"No frontmatter in {input_path}")
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        raise ValueError(f"Malformed frontmatter in {input_path}")
    
    frontmatter = yaml.safe_load(parts[1])
    body = parts[2]
    
    # Extract sections using regex
    narrative_match = re.search(
        r'## Scite\.ai Narrative Response\s*(.*?)(?=\n---|\n## References)',
        body, re.DOTALL
    )
    refs_match = re.search(
        r'## References\s*(.*?)(?=\n---|\Z)',
        body, re.DOTALL
    )
    
    narrative_html = narrative_match.group(1).strip() if narrative_match else ""
    references_text = refs_match.group(1).strip() if refs_match else ""
    
    # Skip empty template files
    if not narrative_html or narrative_html.startswith('[Paste'):
        if verbose:
            print(f"  Skipped (empty template): {input_path.name}")
        return False
    
    # Convert narrative HTML to clean markdown
    clean_narrative = html_to_clean_markdown(narrative_html)
    
    # Parse references
    refs = parse_references(references_text)
    
    # Build output frontmatter (simplified for RAG)
    output_frontmatter = {
        'question_id': frontmatter.get('question_id'),
        'cluster': frontmatter.get('cluster'),
        'title': frontmatter.get('question_title'),
        'query': frontmatter.get('query_submitted'),
        'source_date': str(frontmatter.get('retrieval_date', '')),
        'reference_count': len(refs),
    }
    
    # Build output content
    output_lines = [
        '---',
        yaml.dump(output_frontmatter, default_flow_style=False, allow_unicode=True).strip(),
        '---',
        '',
        clean_narrative,
        '',
        '## References',
        '',
    ]
    
    for i, ref in enumerate(refs, 1):
        if 'raw' in ref:
            output_lines.append(f"{i}. {ref['raw']}")
        else:
            # Format reference, handling empty source gracefully
            if ref['source']:
                output_lines.append(
                    f"{i}. {ref['authors']} ({ref['year']}). {ref['title']}. *{ref['source']}*."
                )
            else:
                # No source/journal - just title
                output_lines.append(
                    f"{i}. {ref['authors']} ({ref['year']}). {ref['title']}."
                )
    
    # Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text('\n'.join(output_lines), encoding='utf-8')
    
    if verbose:
        print(f"  Formatted: {input_path.name} ({len(refs)} refs)")
    
    return True


# =============================================================================
# Topic Path Resolution
# =============================================================================

def get_topic_paths(topic: str, repo_root: Path) -> dict[str, Path]:
    """Resolve paths for a given topic."""
    
    topic_root = repo_root / "library" / "topics" / topic
    scite_dir = topic_root / "sources" / "scite"
    
    return {
        "topic_root": topic_root,
        "scite_dir": scite_dir,
        "raw_dir": scite_dir / "raw",
        "formatted_dir": scite_dir / "formatted",
    }


def discover_raw_files(raw_dir: Path, question_id: str = None) -> list[Path]:
    """Find raw files matching criteria."""
    
    if not raw_dir.exists():
        return []
    
    files = list(raw_dir.glob("Q*.md"))
    
    if question_id:
        # Match exact question ID or prefix
        files = [f for f in files if f.name.startswith(question_id)]
    
    # Sort by question number
    def sort_key(p: Path):
        match = re.match(r'Q(\d+)', p.stem)
        return int(match.group(1)) if match else 999
    
    files.sort(key=sort_key)
    
    return files


# =============================================================================
# Main
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Convert raw scite.ai HTML to clean markdown for RAG retrieval"
    )
    parser.add_argument(
        "--topic", type=str, required=True,
        help="Topic slug (e.g., digital-identity-formation)"
    )
    parser.add_argument(
        "--question", type=str,
        help="Process single question (e.g., Q01)"
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true",
        help="Show detailed output"
    )
    
    args = parser.parse_args()
    
    # Resolve repo root (assume script is in tools/scite-pipeline/)
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent.parent
    
    # Get topic-specific paths
    paths = get_topic_paths(args.topic, repo_root)
    
    if not paths["scite_dir"].exists():
        print(f"Topic directory not found: {paths['scite_dir']}")
        print(f"Expected structure: library/topics/{args.topic}/sources/scite/")
        return 1
    
    # Discover raw files
    raw_files = discover_raw_files(paths["raw_dir"], args.question)
    
    if not raw_files:
        print(f"No raw files found in {paths['raw_dir']}")
        return 1
    
    print(f"Found {len(raw_files)} raw file(s) to format")
    
    # Process each file
    processed_count = 0
    skipped_count = 0
    error_count = 0
    
    for raw_file in raw_files:
        output_file = paths["formatted_dir"] / raw_file.name
        
        try:
            if process_raw_file(raw_file, output_file, args.verbose):
                processed_count += 1
            else:
                skipped_count += 1
        except Exception as e:
            print(f"  Error processing {raw_file.name}: {e}")
            error_count += 1
    
    # Summary
    print(f"\nFormatted {processed_count} file(s) to: {paths['formatted_dir']}")
    if skipped_count:
        print(f"Skipped {skipped_count} empty template file(s)")
    if error_count:
        print(f"Errors: {error_count}")
    
    return 0


if __name__ == '__main__':
    exit(main())

