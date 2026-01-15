#!/usr/bin/env python3
"""
Phronos Library: Zotero HTML Report Parser (Enhanced)

Parses Zotero "Generate Report from Items" HTML exports into JSON.
Extracts bibliographic data and PDF annotations from "Note from Annotations".

Usage:
    python parser.py report.html                    # Print JSON to stdout
    python parser.py report.html -o evidence.json  # Save to file
    python parser.py report.html --pretty          # Pretty print
"""

from bs4 import BeautifulSoup
import json
import re
import sys
import argparse
from pathlib import Path
from urllib.parse import unquote
from typing import Optional


def parse_report(html_path: str) -> list:
    """Parse a Zotero HTML report into a list of source dictionaries."""

    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Find the report list
    report_list = soup.find('ul', class_='report')
    if not report_list:
        raise ValueError("No report list found. Is this a Zotero 'Generate Report from Items' export?")

    sources = []
    for item in report_list.find_all('li', class_='item', recursive=False):
        try:
            source = parse_item(item)
            if source and source.get('title'):
                sources.append(source)
        except Exception as e:
            print(f"Warning: Failed to parse item: {e}", file=sys.stderr)
            continue

    return sources


def parse_item(item) -> dict:
    """Parse a single item element into a source dictionary."""

    # Extract metadata from table rows
    meta = {}
    authors = []

    table = item.find('table')
    if table:
        for row in table.find_all('tr'):
            th = row.find('th')
            td = row.find('td')
            if not (th and td):
                continue

            key = th.get_text(strip=True)
            val = td.get_text(strip=True)
            th_classes = th.get('class', [])

            # Collect authors separately
            if 'author' in th_classes or key == 'Author':
                authors.append(val)
            else:
                meta[key] = val

    # Get title from h2 element
    h2 = item.find('h2')
    title = h2.get_text(strip=True) if h2 else meta.get('Title', '')

    # Extract annotations from notes
    annotations = extract_annotations(item)

    # Generate citation key (AuthorYear format)
    year = ''
    date_str = meta.get('Date', '')
    year_match = re.search(r'(\d{4})', date_str)
    if year_match:
        year = year_match.group(1)

    citation_key = generate_citation_key(authors, year)

    # Format author string
    author_str = format_authors(authors)

    return {
        "key": citation_key,
        "title": title,
        "authors": author_str,
        "year": year,
        "publication": meta.get('Publication', meta.get('Journal Abbr', '')),
        "doi": meta.get('DOI', ''),
        "url": meta.get('URL', ''),
        "abstract": meta.get('Abstract', ''),
        "status": "cite",  # Default status; change manually
        "annotations": annotations
    }


def extract_annotations(item) -> list[dict]:
    """Extract PDF annotations from the item's notes.

    Zotero's "Note from Annotations" format places highlighted text in
    <span class="underline"> elements with data-annotation attributes
    containing page numbers.
    """

    annotations = []
    seen_texts = set()  # Avoid duplicates

    # Find notes sections (both direct notes and attachment notes)
    notes_sections = []

    # Direct notes on item
    direct_notes = item.find('ul', class_='notes')
    if direct_notes:
        notes_sections.append(direct_notes)

    # Notes in attachments
    attachments = item.find('ul', class_='attachments')
    if attachments:
        for attachment in attachments.find_all('li', recursive=False):
            attachment_notes = attachment.find('ul', class_='notes')
            if attachment_notes:
                notes_sections.append(attachment_notes)

    # Process all notes sections
    for notes_ul in notes_sections:
        for note_li in notes_ul.find_all('li', recursive=False):
            # Find all paragraphs with annotations
            for p in note_li.find_all('p'):
                annotation = extract_annotation_from_paragraph(p, seen_texts)
                if annotation:
                    annotations.append(annotation)

    return annotations


def extract_annotation_from_paragraph(p, seen: set) -> Optional[dict]:
    """Extract a single annotation from a paragraph element.

    Expected structure:
    <p>
      <span class="underline" data-annotation="...">Highlighted text</span>
      <span class="citation">...</span>
    </p>
    """

    # Look for underline span with data-annotation
    underline = p.find('span', class_='underline')
    if not underline:
        return None

    # Get the highlighted text
    text = underline.get_text(strip=True)
    if not text or len(text) < 10:  # Skip very short annotations
        return None

    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)

    # Check for duplicates
    if text in seen:
        return None
    seen.add(text)

    # Extract page number from data-annotation
    page = None
    data_annotation = underline.get('data-annotation', '')
    if data_annotation:
        try:
            # URL-decode and parse JSON
            annotation_json = json.loads(unquote(data_annotation))
            page_label = annotation_json.get('pageLabel')
            if page_label:
                page = int(page_label)
            else:
                # Try citationItem.locator
                citation_item = annotation_json.get('citationItem', {})
                locator = citation_item.get('locator')
                if locator:
                    page = int(locator)
        except (json.JSONDecodeError, ValueError, TypeError):
            pass

    # If no page from data-annotation, try citation span
    if page is None:
        citation = p.find('span', class_='citation')
        if citation:
            citation_item = citation.find('span', class_='citation-item')
            if citation_item:
                # Extract page from text like "Author, Year, p. 42"
                match = re.search(r'p\.\s*(\d+)', citation_item.get_text())
                if match:
                    page = int(match.group(1))

    return {
        "text": text,
        "page": page,
        "note": ""  # User adds relevance notes manually
    }


def generate_citation_key(authors: list[str], year: str) -> str:
    """Generate citation key like 'BeatyKenett2023' or 'DeDeyne2019'."""

    if not authors:
        return f"Unknown{year}"

    # Extract family names
    def get_family(author_str: str) -> str:
        # Handle "Last, First" format
        if ',' in author_str:
            return author_str.split(',')[0].strip()
        # Handle "First Last" format
        parts = author_str.strip().split()
        return parts[-1] if parts else author_str

    family_names = [get_family(a) for a in authors]

    # Remove spaces/hyphens for key
    def clean_name(name: str) -> str:
        return re.sub(r'[\s\-]', '', name)

    if len(family_names) == 1:
        return f"{clean_name(family_names[0])}{year}"
    elif len(family_names) == 2:
        return f"{clean_name(family_names[0])}{clean_name(family_names[1])}{year}"
    else:
        return f"{clean_name(family_names[0])}EtAl{year}"


def format_authors(authors: list[str]) -> str:
    """Format author list for display."""

    if not authors:
        return "Unknown"

    # Extract family names
    def get_family(author_str: str) -> str:
        if ',' in author_str:
            return author_str.split(',')[0].strip()
        parts = author_str.strip().split()
        return parts[-1] if parts else author_str

    names = [get_family(a) for a in authors]

    if len(names) == 1:
        return names[0]
    elif len(names) == 2:
        return f"{names[0]} & {names[1]}"
    elif len(names) <= 4:
        return ", ".join(names[:-1]) + f" & {names[-1]}"
    else:
        return f"{names[0]} et al."


def main():
    parser = argparse.ArgumentParser(
        description='Parse Zotero HTML reports into JSON'
    )
    parser.add_argument('html_file', help='Input HTML file from Zotero')
    parser.add_argument('-o', '--output', help='Output JSON file (default: stdout)')
    parser.add_argument('--pretty', action='store_true', help='Pretty print JSON')

    args = parser.parse_args()

    # Check input file exists
    if not Path(args.html_file).exists():
        print(f"Error: File not found: {args.html_file}", file=sys.stderr)
        sys.exit(1)

    # Parse the report
    try:
        sources = parse_report(args.html_file)
    except Exception as e:
        print(f"Error parsing report: {e}", file=sys.stderr)
        sys.exit(1)

    # Format output
    indent = 2 if args.pretty else None
    json_output = json.dumps(sources, indent=indent, ensure_ascii=False)

    # Write output
    if args.output:
        Path(args.output).write_text(json_output, encoding='utf-8')

        # Summary
        total_annotations = sum(len(s.get('annotations', [])) for s in sources)
        print(f"Parsed {len(sources)} sources with {total_annotations} annotations → {args.output}",
              file=sys.stderr)
    else:
        print(json_output)


if __name__ == '__main__':
    main()
