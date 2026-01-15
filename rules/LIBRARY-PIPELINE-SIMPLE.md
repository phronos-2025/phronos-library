# Phronos Library Pipeline (Simplified)

A minimal system for turning Zotero annotations into hypothesis-driven .mdx articles.

---

## Core Idea

```
Zotero HTML → Parser → Evidence JSON → Claude Code + Seeds → .mdx
```

**Three things you maintain:**
1. **Seeds** — One-paragraph hypothesis per article (plain text)
2. **Evidence** — Parsed annotations with minimal tagging
3. **Articles** — Growing .mdx files

---

## Directory Structure

```
phronos-library/
├── seeds/
│   ├── LIB-001.md          # Simple hypothesis + scope
│   ├── LIB-002.md
│   └── ...
│
├── evidence/
│   ├── LIB-001/
│   │   ├── _sources.json   # All sources for this article
│   │   └── _pending.json   # New sources awaiting integration
│   └── ...
│
├── zotero-exports/
│   └── (drop HTML reports here)
│
├── articles/
│   └── lib-001-linguistic-markers.mdx
│
└── parser.py               # Single-file parser
```

---

## 1. Seed Files (Hypotheses)

One markdown file per article. Keep it short.

```markdown
# LIB-001: Linguistic Markers of Identity

## Question
What features of language reliably encode identity at scale in chat data?

## Scope
- Pronoun patterns and psychological states
- Semantic network structure and creativity
- Linguistic accommodation

## Out of Scope
- Platform effects → LIB-003
- Validity of inference → LIB-002

## Key Sources
- De Deyne 2019 (Small World of Words)
- Pennebaker 2015 (LIWC)
- Beaty & Kenett 2023 (Associative creativity)

## Current Confidence
Moderate — strong theoretical basis, measurement validation incomplete.
```

That's it. Update this file as your understanding evolves. No version numbers needed until you're publishing—just use git.

---

## 2. Evidence Store

### Minimal Source Entry

```json
{
  "key": "BeatyKenett2023",
  "title": "Associative thinking at the core of creativity",
  "authors": "Beaty & Kenett",
  "year": "2023",
  "doi": "10.1016/j.tics.2023.04.004",
  "status": "anchor",
  "annotations": [
    {
      "text": "According to the associative theory of creativity, what distinguishes more creative people is their capacity for association...",
      "page": 4,
      "note": "Defines the associative theory"
    },
    {
      "text": "The associative theory has received mixed empirical support, largely due to challenges in representing semantic memory structure...",
      "page": 4,
      "note": "Key limitation"
    }
  ]
}
```

### Status Values
- `anchor` — Must cite (3-5 per article)
- `cite` — Will cite
- `support` — Backup evidence
- `skip` — Reviewed, not using

---

## 3. Parser (Simplified)

```python
#!/usr/bin/env python3
"""
Parse Zotero HTML reports into evidence JSON.
Usage: python parser.py report.html > evidence.json
"""

from bs4 import BeautifulSoup
import json
import re
import sys

def parse_report(html_path):
    with open(html_path, 'r') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    sources = []
    for item in soup.select('ul.report > li.item'):
        source = parse_item(item)
        if source:
            sources.append(source)
    
    return sources

def parse_item(item):
    # Get metadata from table
    meta = {}
    authors = []
    
    for row in item.select('table tr'):
        th = row.find('th')
        td = row.find('td')
        if th and td:
            key = th.get_text(strip=True)
            val = td.get_text(strip=True)
            
            if 'author' in (th.get('class') or []):
                authors.append(val)
            else:
                meta[key] = val
    
    # Get title
    h2 = item.find('h2')
    title = h2.get_text(strip=True) if h2 else meta.get('Title', '')
    
    # Get annotations
    annotations = []
    for note in item.select('.notes .note'):
        text = note.get_text()
        # Find quoted passages with page numbers
        for match in re.finditer(r'["""]([^"""]{20,})["""].*?(?:p\.\s*(\d+))?', text):
            annotations.append({
                "text": match.group(1).strip(),
                "page": int(match.group(2)) if match.group(2) else None,
                "note": ""
            })
    
    # Generate citation key
    year = re.search(r'(\d{4})', meta.get('Date', ''))
    year = year.group(1) if year else ''
    
    if len(authors) == 0:
        key = f"Unknown{year}"
    elif len(authors) == 1:
        key = f"{authors[0].split(',')[0]}{year}"
    else:
        key = f"{authors[0].split(',')[0]}{authors[1].split(',')[0]}{year}"
    
    return {
        "key": key,
        "title": title,
        "authors": ", ".join(a.split(',')[0] for a in authors[:3]) + (" et al." if len(authors) > 3 else ""),
        "year": year,
        "doi": meta.get('DOI', ''),
        "status": "cite",
        "annotations": annotations
    }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python parser.py report.html", file=sys.stderr)
        sys.exit(1)
    
    sources = parse_report(sys.argv[1])
    print(json.dumps(sources, indent=2))
```

---

## 4. Claude Code Workflow

### Adding New Sources

```
I have a new Zotero export. Parse it and add sources to LIB-001.

1. Run parser.py on zotero-exports/new-batch.html
2. For each source, check if it fits LIB-001 scope (see seeds/LIB-001.md)
3. Add relevant sources to evidence/LIB-001/_sources.json
4. Flag any sources that might belong to other articles
```

### Synthesizing a Section

```
Generate the "Semantic Networks" section for LIB-001.

Seed: [paste seeds/LIB-001.md]

Evidence: [paste relevant entries from evidence/LIB-001/_sources.json]

Rules:
- State the synthesis claim first, then cite evidence
- Use format: (Author Year, p. N) for citations
- Match confidence to what's in the seed file
- 200-300 words
- If evidence is thin, say so
```

### Updating an Article

```
New sources added to LIB-001. Review and update the synthesis.

Current article: [paste relevant section from .mdx]
New evidence: [paste new entries]
Seed: [paste seed file]

Tasks:
1. Does new evidence change confidence level?
2. Should new citations be added to existing paragraphs?
3. Does anything contradict current synthesis?
```

---

## 5. MDX Template (Minimal)

```mdx
---
id: LIB-001
title: "Linguistic Markers of Identity"
question: "What features of language reliably encode identity at scale?"
status: drafting
sources: 12
updated: 2026-01-15
---

# Linguistic Markers of Identity

## The Question

What features of language reliably encode and communicate identity, and which are measurable at scale in conversational data?

## Synthesis

### Pronoun Patterns

[Synthesis content here...]

### Semantic Networks

[Synthesis content here...]

### Accommodation

[Synthesis content here...]

## Sources

### Anchor Papers

- **Beaty & Kenett 2023** — Associative thinking at the core of creativity. *Trends in Cognitive Sciences*. [DOI](...)
- **De Deyne et al. 2019** — Small World of Words. *Behavior Research Methods*. [DOI](...)

### Supporting

- Source 1
- Source 2

## Gaps

- Human-AI accommodation dynamics (no direct evidence yet)
- Cross-cultural validity of markers

## Changelog

- 2026-01-15: Initial draft
```

---

## Daily Workflow

1. **Read papers in Zotero** → highlight key passages
2. **Weekly: Export batch** → Generate Report from Items → save HTML
3. **Run parser** → `python parser.py export.html > new.json`
4. **Review output** → assign to articles, set status
5. **When ready: Ask Claude Code** to synthesize or update sections
6. **Edit .mdx** → refine the output, add to article

---

## What You Track in Git

```
git add seeds/ evidence/ articles/
git commit -m "Added 5 sources to LIB-001, updated semantic networks section"
```

The seed files are your hypothesis version control. Commit messages are your changelog.

---

## Scaling Later

When you have 5+ articles working:
- Add frontmatter validation
- Automate parser → evidence integration  
- Build Astro components for citations
- Add cross-reference tracking

But start with this. Get one article through the pipeline first.
