# Phronos Library Pipeline: Implementation Plan

**Date:** 2026-01-15
**Status:** Draft for approval
**Prepared for:** Vishal

---

## Executive Summary

This plan establishes a complete pipeline from Zotero annotations to a published research library at `phronos.org/library`. The system is designed for continuous, incremental growth as you add papers, refine hypotheses, and track evidence accumulation over time.

---

## Part 1: Current State Analysis

### What Exists

| Component | Status | Location |
|-----------|--------|----------|
| Hypotheses schema | Complete | `hypotheses/RESEARCH-HYPOTHESES.md` |
| Seed files (5 articles) | Complete | `seeds/LIB-00{1,2,3,5,8}.md` |
| Library schema | Complete | `rules/LIBRARY-SCHEMA.md` |
| Parser (v1) | Works, needs annotation extraction | `rules/parser.py` |
| Zotero reports | 2 available | `reports/` (LIB-002, LIB-008) |
| INS-001 mapping | Complete | `rules/INS-001-LIBRARY-MAPPING.md` |
| Web infrastructure | Not yet connected | Target: `phronos.org/library` |

### Gaps Identified

1. **Parser limitation**: Current parser extracts bibliographic data but not inline annotations (highlighted quotes with page numbers embedded in Zotero's "Note from Annotations" format)
2. **No Astro integration**: Need to connect to existing `phronos.org` site
3. **No versioning system**: Hypotheses need fine-grained change tracking
4. **Missing articles**: LIB-004, LIB-006, LIB-007, LIB-009 seed files not yet created
5. **SEO/GEO structure**: URL hierarchy not optimized

---

## Part 2: Pipeline Architecture

### 2.1 Data Flow

```
┌─────────────────┐
│   ZOTERO        │ You annotate PDFs, create "Note from Annotations"
└────────┬────────┘
         │ Export HTML report
         ▼
┌─────────────────┐
│  REPORTS/       │ Raw Zotero HTML files
└────────┬────────┘
         │ python3 parser.py report.html -o evidence.json
         ▼
┌─────────────────┐
│  EVIDENCE/      │ Structured JSON with quotes, page numbers, DOIs
└────────┬────────┘
         │ Claude Code synthesis
         ▼
┌─────────────────┐
│  SEEDS/         │ Working hypotheses (markdown)
│  HYPOTHESES/    │ Versioned hypothesis tracking
└────────┬────────┘
         │ Transform to MDX
         ▼
┌─────────────────┐
│  SRC/CONTENT/   │ Published .mdx articles for Astro
│  LIBRARY/       │
└────────┬────────┘
         │ Astro build
         ▼
┌─────────────────┐
│  phronos.org/   │ Live site
│  library/       │
└─────────────────┘
```

### 2.2 Directory Structure (Proposed)

```
phronos-library/
├── hypotheses/
│   ├── RESEARCH-HYPOTHESES.md      # Master hypothesis document
│   └── versions/                    # Git-tracked snapshots (NEW)
│       └── YYYY-MM-DD-hypotheses.md
├── reports/
│   └── *.html                       # Zotero exports (input)
├── evidence/                        # NEW: Parsed JSON output
│   ├── LIB-001-evidence.json
│   ├── LIB-002-evidence.json
│   └── ...
├── rules/
│   ├── parser.py                    # Enhanced parser
│   ├── LIBRARY-SCHEMA.md
│   └── ...
├── seeds/
│   └── LIB-*.md                     # Working hypotheses
├── src/
│   └── content/
│       └── library/                 # NEW: Astro content
│           ├── index.mdx            # Library landing page
│           ├── linguistic-markers.mdx
│           ├── digital-validity.mdx
│           └── ...
└── scripts/                         # NEW: Automation
    ├── parse-report.sh
    ├── sync-to-astro.sh
    └── version-hypotheses.sh
```

---

## Part 3: Parser Enhancement

### 3.1 Current Parser Output

The existing parser extracts:
- Citation key (AuthorYear format)
- Title, authors, year, publication
- DOI, URL, abstract
- Annotations array (currently empty due to format mismatch)

### 3.2 Required Enhancement

Zotero's "Note from Annotations" embeds highlighted text as `<span class="highlight">` elements followed by `<span class="citation">` elements with page locators. The parser needs to:

1. **Detect annotation notes**: Look for child notes under attachments
2. **Extract highlights**: Parse `<span class="highlight">` content
3. **Extract page numbers**: Decode `data-citation` attribute (URL-encoded JSON with `locator` field)
4. **Handle image annotations**: Skip or flag `<img data-annotation>` elements

### 3.3 Enhanced Output Format

```json
{
  "key": "BeatyKenett2023",
  "title": "Associative thinking at the core of creativity",
  "authors": "Beaty & Kenett",
  "year": "2023",
  "publication": "Trends in Cognitive Sciences",
  "doi": "10.1016/j.tics.2023.04.004",
  "status": "anchor",
  "annotations": [
    {
      "text": "According to the associative theory of creativity, what distinguishes more creative people is their capacity for association",
      "page": 4,
      "note": "",
      "hypothesis": "H1.2"
    }
  ],
  "assigned_to": ["LIB-001"]
}
```

---

## Part 4: Hypothesis Versioning System

### 4.1 Problem

Your hypotheses will evolve as evidence accumulates. You need to track:
- When confidence levels changed
- What evidence prompted changes
- Which hypotheses were added/removed/split

### 4.2 Solution: Structured Changelog + Git Tags

**Approach 1: Embedded Changelog (Recommended)**

Add to `RESEARCH-HYPOTHESES.md`:

```markdown
## Hypothesis History

### H1.7 (Embedding Validity)
| Date | Change | Evidence | Confidence |
|------|--------|----------|------------|
| 2026-01-15 | Created | INS-001-LIBRARY-MAPPING analysis | Moderate |
| 2026-01-20 | Updated | Added Reimers 2019 validation | Moderate→High |

### H1.8 (DAT Validity)
| Date | Change | Evidence | Confidence |
|------|--------|----------|------------|
| 2026-01-15 | Created | Olson 2021 (r=0.40) | Moderate |
```

**Approach 2: Git Tags for Major Versions**

```bash
# After each synthesis session
git tag -a "hypotheses-v1.1" -m "Added H1.7, H1.8 per INS-001 analysis"
git push origin --tags
```

**Approach 3: Version Snapshots (for rollback)**

Script to create dated snapshots:

```bash
#!/bin/bash
# scripts/version-hypotheses.sh
DATE=$(date +%Y-%m-%d)
cp hypotheses/RESEARCH-HYPOTHESES.md "hypotheses/versions/${DATE}-hypotheses.md"
git add hypotheses/versions/
git commit -m "Snapshot hypotheses as of ${DATE}"
```

### 4.3 Recommendation

Use **all three** approaches:
1. Embedded changelog for human-readable history per hypothesis
2. Git tags for major milestone versions
3. Dated snapshots for rollback capability

---

## Part 5: URL Structure for SEO/GEO

### 5.1 Primary URL Hierarchy

```
phronos.org/
├── library/                              # Main library index
│   ├── linguistic-markers/               # LIB-001
│   ├── digital-validity/                 # LIB-002
│   ├── reflexive-identity/               # LIB-003
│   ├── power-laws-extremes/              # LIB-004
│   ├── architecture-genius/              # LIB-005
│   ├── madness-mediation/                # LIB-006
│   ├── reference-classes/                # LIB-007
│   ├── instrument-design/                # LIB-008
│   └── mind-among-extremes/              # LIB-009
└── instruments/                          # Already at instruments.phronos.org
    └── semantic-union/                   # INS-001
```

### 5.2 SEO Optimization Principles

| Element | Strategy | Example |
|---------|----------|---------|
| **Slugs** | Keyword-rich, hyphenated, 2-4 words | `/library/digital-validity/` not `/library/lib-002/` |
| **Title tags** | Question format for featured snippets | "What Features of Language Encode Cognition?" |
| **Meta descriptions** | 150-160 chars summarizing the question | "Research synthesis on linguistic markers..." |
| **H1** | Single, clear heading matching page title | `# Linguistic Markers of Identity` |
| **Schema markup** | ScholarlyArticle or ResearchProject | JSON-LD in frontmatter |
| **Internal linking** | Cross-reference dependent articles | "For measurement validity, see LIB-002" |

### 5.3 GEO (Generative Engine Optimization)

For AI search engines (Perplexity, SearchGPT, etc.):

1. **Question-first structure**: Open each article with the research question
2. **Explicit confidence levels**: State "High confidence", "Moderate", "Low" prominently
3. **Citation density**: Include author-year citations inline
4. **Structured data**: Use frontmatter for machine parsing:

```yaml
---
id: LIB-001
slug: linguistic-markers
title: "Linguistic Markers of Identity"
question: "What features of language reliably encode cognition at scale?"
confidence: moderate
evidence_count: 12
last_updated: 2026-01-15
hypotheses:
  - id: H1.1
    claim: "Pronoun patterns encode psychological states"
    confidence: high
  - id: H1.2
    claim: "Semantic networks vary across individuals"
    confidence: moderate
---
```

5. **Explicit uncertainty**: AI engines favor sources that acknowledge limitations
6. **Primary source links**: Include DOIs for citation verification

### 5.4 Canonical URLs and Subdomain Strategy

```
phronos.org/library/         # Main library (this project)
instruments.phronos.org/     # Interactive instruments (already exists)
```

Avoid duplicating content between domains. Link semantically:
- Library articles reference instruments they support
- Instruments link back to theoretical grounding in Library

---

## Part 6: Implementation Tasks

### Phase 1: Parser Enhancement — COMPLETED

1. ✅ **Updated `parser.py`** to extract inline annotations from Zotero HTML
   - Parses `<span class="underline" data-annotation>` elements
   - Decodes `pageLabel` from JSON in data-annotation attribute
   - Handles edge cases

2. ✅ **Created `evidence/` directory structure**
   - Parsed reports into JSON
   - Naming convention: `LIB-XXX-evidence.json`

3. ✅ **Tested with existing reports**
   - LIB-002: 13 sources, 172 annotations
   - LIB-008: 3 sources, 47 annotations

### Phase 2: First Article Synthesis (LIB-002) — COMPLETED

1. ✅ Ran enhanced parser on LIB-002 report
2. ✅ Mapped sources to hypotheses (H2.1-H2.6)
3. ✅ Synthesized sections using Claude Code
4. ✅ Created `src/content/library/digital-validity.mdx`

### Phase 3: Astro Integration — COMPLETED

1. ✅ Set up library content collection in `src/content.config.ts`
2. ✅ Created library index page (`src/pages/index.astro`)
3. ✅ Implemented article layout (`src/layouts/ArticleLayout.astro`) with:
   - Question header
   - Confidence badge
   - Synthesis sections
   - Sources with DOI links

4. ✅ Configured SEO metadata:
   - Title tags
   - Meta descriptions
   - Schema.org JSON-LD (ScholarlyArticle)
   - Canonical URLs

### Phase 4: Hypothesis Versioning — COMPLETED

1. ✅ Created `hypotheses/versions/` directory
2. ✅ Added per-hypothesis changelog to RESEARCH-HYPOTHESES.md
3. ✅ Created version script: `scripts/version-hypotheses.sh`
4. ✅ Created initial snapshot: `hypotheses/versions/2026-01-15-1052-hypotheses.md`

### Phase 5: Complete Remaining Seeds — PENDING

Create seed files for missing articles:
- LIB-004: Power Laws and Extremes
- LIB-006: Madness and Mediation
- LIB-007: Reference Classes
- LIB-009: Mind Among Extremes

### Phase 6: Publish First Page — READY TO DEPLOY

1. **Deploy** `phronos.org/library/digital-validity/` (LIB-002)
2. **Verify SEO** with search console
3. **Test GEO** with AI search queries
4. **Document workflow** for repeatable use

---

## Part 7: Parsing the Current Reports

### 7.1 LIB-002 Report Analysis

The `Zotero Report - LIB-002 Semantic Networks 1-15-26.html` contains sources relevant to:

| Hypothesis | Relevant Sources (from parser output) |
|------------|---------------------------------------|
| H2.1 (Ecological validity) | Digital phenotyping literature |
| H2.2 (Anonymity effects) | Not directly covered |
| H2.3 (Test-retest) | Needs empirical work |
| H2.6 (Task vs naturalistic) | BeatyKenett2023, ReimersGurevych2019, KenettEtAl2018 |
| H1.2 (Semantic networks) | BeatyKenett2023, KenettEtAl2014, MersealEtAl2025 |
| H1.7 (Embedding validity) | ReimersGurevych2019 |
| H1.8 (DAT validity) | SaidMetwalyEtAl2024, GerwigEtAl2021 |

**Anchor papers identified:**
- BeatyKenett2023 — Core creativity/semantic theory
- KenettEtAl2018 — Network percolation and creativity
- ReimersGurevych2019 — Sentence-BERT (embedding validity)

### 7.2 LIB-008 Report Analysis

The `Zotero Report - LIB-008 Games 011526.html` contains sources for:

| Hypothesis | Relevant Sources |
|------------|------------------|
| H8.1 (Self-location) | PedersenEtAl2023 (game-based assessment) |
| H8.2 (Performance association) | PedersenEtAl2023 (validation) |
| INS-001 design | CazaletsDambre2025 (word association benchmark), XuEtAl2025 (game-based LLM probing) |

**Key finding:** These reports support the thesis that game-based cognitive assessment can achieve both engagement and validity—relevant for instrument design.

---

## Part 8: Next Steps for This Session

### Immediate Actions (If You Approve)

1. **Enhance parser.py** to extract inline annotations
2. **Parse both reports** into `evidence/` JSON files
3. **Create first .mdx article** (LIB-002 recommended as it's most complete)
4. **Set up hypothesis versioning** infrastructure

### Questions for You

1. **Astro integration**: Do you want to add Library to the existing `phronos.org` repo, or keep it separate and deploy independently?

2. **First article priority**: Should we start with LIB-002 (Digital Validity) since it has the most relevant report, or LIB-001 (Linguistic Markers) since it's foundational?

3. **Annotation depth**: When parsing, should we extract ALL annotations or only those you've marked as important in some way?

4. **Hypothesis versioning granularity**: Do you want to version every change, or only when confidence levels shift?

---

## Appendix A: Schema Reference

### MDX Frontmatter Template

```yaml
---
id: LIB-002
slug: digital-validity
title: "Digital Validity"
question: "Under what conditions can chat data serve as valid proxies for cognitive states?"
status: drafting
confidence: moderate
sources: 14
updated: 2026-01-15
tier: 2
depends_on: ["LIB-001"]
supports: ["INS-001", "LIB-008"]
hypotheses:
  - id: H2.1
    claim: "Chat data has ecological validity"
    confidence: moderate
  - id: H2.2
    claim: "Anonymity alters disclosure"
    confidence: moderate
  - id: H2.3
    claim: "Test-retest reliability acceptable"
    confidence: unknown
  - id: H2.4
    claim: "Cross-platform generalization"
    confidence: unknown
  - id: H2.5
    claim: "Selection effects characterizable"
    confidence: high
  - id: H2.6
    claim: "Task vs naturalistic convergent validity"
    confidence: low
---
```

### Evidence JSON Schema

```json
{
  "$schema": "evidence-v1",
  "article": "LIB-002",
  "generated": "2026-01-15",
  "sources": [
    {
      "key": "BeatyKenett2023",
      "title": "...",
      "authors": "...",
      "year": "2023",
      "publication": "...",
      "doi": "...",
      "status": "anchor|cite|review",
      "assigned_hypotheses": ["H1.2", "H2.6"],
      "annotations": [
        {
          "text": "...",
          "page": 4,
          "relevance": "H1.2",
          "note": "User-added context"
        }
      ]
    }
  ]
}
```

---

## Appendix B: Slug Mapping

| Article ID | Slug | Title |
|------------|------|-------|
| LIB-001 | `/library/linguistic-markers/` | Linguistic Markers of Identity |
| LIB-002 | `/library/digital-validity/` | Digital Validity |
| LIB-003 | `/library/reflexive-identity/` | Reflexive Identity |
| LIB-004 | `/library/power-laws-extremes/` | Power Laws and Extremes |
| LIB-005 | `/library/architecture-genius/` | Architecture of Genius |
| LIB-006 | `/library/madness-mediation/` | Madness and Mediation |
| LIB-007 | `/library/reference-classes/` | Reference Classes |
| LIB-008 | `/library/instrument-design/` | Instrument Design |
| LIB-009 | `/library/mind-among-extremes/` | Mind Among Extremes |

---

**Ready for your feedback before proceeding with implementation.**
