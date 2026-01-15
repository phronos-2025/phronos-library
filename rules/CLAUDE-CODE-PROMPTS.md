# Claude Code Prompts for Library Pipeline

Copy-paste these prompts when working with Claude Code on your local machine.

---

## 1. Parse New Zotero Export

```
Parse this Zotero HTML report and output JSON.

File: [path to HTML file]

Use BeautifulSoup to:
1. Find all items in ul.report > li.item
2. Extract: title, authors, year, DOI, publication
3. Extract annotations from nested notes (quoted text + page numbers)
4. Generate citation keys like "BeatyKenett2023"

Output JSON array with this structure per source:
{
  "key": "AuthorYear",
  "title": "...",
  "authors": "Last & Last",
  "year": "2023",
  "doi": "...",
  "status": "cite",
  "annotations": [
    {"text": "...", "page": 42, "note": ""}
  ]
}
```

---

## 2. Assign Sources to Articles

```
Review these parsed sources and assign them to Library articles.

Sources:
[paste JSON from parser]

Article scopes:
- LIB-001 (Linguistic Markers): pronoun patterns, semantic networks, accommodation
- LIB-002 (Digital Validity): measurement validity, digital phenotyping
- LIB-003 (Reflexive Identity): AI sycophancy, IT identity, anthropomorphism
- LIB-005 (Genius): creativity, expertise, divergent thinking

For each source:
1. Which article does it belong to? (primary)
2. Does it cross-reference other articles?
3. Status: anchor (foundational, max 5), cite, support, or skip?
4. Add a one-line note explaining relevance

Output a table.
```

---

## 3. Generate Synthesis Section

```
Write a synthesis section for the Phronos Library.

Article: LIB-001 (Linguistic Markers)
Section: Semantic Networks

Seed (hypothesis):
"""
[paste from seeds/LIB-001.md]
"""

Evidence (sources to use):
"""
[paste relevant entries from evidence JSON]
"""

Rules:
- State the synthesis CLAIM first, then cite evidence
- Use: (Author Year, p. N) for citations
- 200-300 words
- Academic tone, first-person plural ("we find...")
- Match confidence to seed file
- If evidence is thin, acknowledge it

Output the section content only, ready to paste into .mdx.
```

---

## 4. Update Existing Section

```
Update this synthesis section with new evidence.

Current section:
"""
[paste existing section from .mdx]
"""

New sources to integrate:
"""
[paste new evidence entries]
"""

Seed (for scope check):
"""
[paste seed file]
"""

Tasks:
1. Where should new citations be added?
2. Does new evidence strengthen, qualify, or contradict existing claims?
3. Does confidence level need adjustment?

Output the revised section.
```

---

## 5. Generate Evidence Registry Entry

```
Create an evidence registry entry for this source.

Source JSON:
"""
[paste single source from parser output]
"""

Target article: LIB-001
Hypothesis it supports: Semantic network structure varies meaningfully across individuals

Format the entry for the .mdx Evidence Registry section:

### Author (Year)

**Status:** anchor | cite | support
**DOI:** [link]

**Key claims:**
- Claim 1 (p. X)
- Claim 2 (p. Y)

**Quotes:**
> "Direct quote..." (p. Z)

**Relevance:** Why this matters for Phronos
```

---

## 6. Check Scope Boundaries

```
Check if this source belongs in LIB-001 or should be redirected.

Source:
"""
[paste source]
"""

LIB-001 Scope:
- IN: pronoun patterns, semantic networks, accommodation, text-cognition link
- OUT: platform effects (→003), validity (→002), sycophancy (→003/006)

Questions:
1. Does this address an IN-scope topic?
2. If it addresses OUT-scope topics, which article should it go to?
3. If it spans multiple articles, what's the primary fit?
```

---

## 7. Identify Gaps

```
Review the evidence for LIB-001 and identify gaps.

Current sources:
"""
[paste evidence JSON]
"""

Seed (what we're trying to support):
"""
[paste seed file]
"""

Identify:
1. Which hypotheses have strong support (3+ sources)?
2. Which have weak support (1-2 sources)?
3. Which have no direct evidence?
4. What searches might fill the gaps?
```

---

## 8. Format for MDX

```
Format this content for the Phronos Library .mdx article.

Content:
"""
[paste synthesis section]
"""

Sources used:
"""
[paste source list]
"""

Add:
1. Section header with anchor: ## Section Name {#section-slug}
2. Citations in format: (Author Year)
3. A sources list at the end
4. Any gaps flagged inline with: {/* GAP: description */}
```

---

## Quick Tips

**For Claude Code sessions:**

1. Keep seed files open in context
2. Paste evidence JSON directly (don't ask Claude to read files)
3. Ask for one section at a time
4. Review output before pasting into .mdx
5. Track changes in git, not in the files themselves

**Common patterns:**

```bash
# Parse new export
python parser.py zotero-export.html --pretty > new-sources.json

# Quick review
cat new-sources.json | jq '.[].key'

# Count annotations
cat new-sources.json | jq '[.[].annotations | length] | add'
```
