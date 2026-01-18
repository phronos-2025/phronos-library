# Phronos Library Pipeline

**Version:** 2.0  
**Date:** 2026-01-18  
**Change:** Updated for goal-directed schema (v3)

A system for turning Zotero annotations into **instrument-justifying** .mdx articles.

---

## Core Idea

```
Zotero HTML → Parser → Evidence JSON → Claude Code + Seeds → .mdx
```

**Four things you maintain:**
1. **Seeds** — Hypothesis + what it enables (plain text)
2. **Evidence** — Parsed annotations with roles
3. **Articles** — Growing .mdx files with motivation → synthesis → design implications
4. **Hypothesis tracking** — Which claims are validated, partial, or gaps

---

## Directory Structure

```
phronos-library/
├── seeds/
│   ├── LIB-001.md          # Hypothesis + enables + must-establish
│   ├── LIB-002.md
│   └── ...
│
├── evidence/
│   ├── LIB-001/
│   │   ├── _sources.json   # All sources with roles
│   │   └── _pending.json   # New sources awaiting integration
│   └── ...
│
├── zotero-exports/
│   └── (drop HTML reports here)
│
├── articles/
│   └── lib-001-linguistic-markers.mdx
│
├── tracking/
│   └── hypothesis-status.json  # Which claims are supported/partial/gap
│
└── parser.py
```

---

## 1. Seed Files

One markdown file per article. **Must include what the article enables.**

```markdown
# LIB-001: Linguistic Markers of Identity

## Question
What features of language reliably encode identity at scale in chat data?

## Enables

**Instruments:** INS-001.1, INS-001.2  
**Hypotheses:** H1.2, H1.7, H1.8  
**Methods:** MTH-002

## Must Establish

- Semantic networks vary meaningfully across individuals
- Embedding distances reflect cognitive semantic distance
- Semantic spread (DAT methodology) correlates with creativity
- Individual differences are stable enough to measure

## Scope
- Pronoun patterns and psychological states
- Semantic network structure and creativity
- Linguistic accommodation

## Out of Scope
- Platform effects → LIB-003
- Validity of inference → LIB-002

## Key Sources
- Olson et al. 2021 — DAT validation → establishes spread-creativity link
- Beaty & Kenett 2023 — Associative creativity → establishes theoretical framework
- De Deyne 2019 — Small World of Words → establishes individual differences

## Current Gaps
- Task-based vs. naturalistic convergence — affects H2.6
- Test-retest reliability for brief tasks — affects H2.3

## Confidence
Moderate — Olson 2021 and Beaty & Kenett 2023 provide strong foundation for spread-creativity link. Embedding validity (H1.7) has moderate support. Task-naturalistic convergence (H2.6) is a gap.
```

---

## 2. Evidence Store

### Source Entry with Roles

```json
{
  "key": "OlsonEtAl2021",
  "title": "Naming unrelated words predicts creativity",
  "authors": "Olson, Nahas, et al.",
  "year": "2021",
  "publication": "PNAS",
  "doi": "10.1073/pnas.2022340118",
  "status": "anchor",
  "role": {
    "establishes": ["H1.8: DAT methodology validity", "Spread-creativity correlation"],
    "supports_instruments": ["INS-001.1", "INS-001.2"],
    "limitations": ["10-word task vs. INS-001's 5 clues", "GloVe embeddings"]
  },
  "annotations": [
    {
      "text": "The DAT [...] can be administered online in under five minutes and scored automatically, providing a reliable and valid measure of divergent thinking.",
      "page": 6,
      "claim": "DAT is valid and practical"
    },
    {
      "text": "Mean semantic distance correlated r = 0.40 with our composite creativity measure.",
      "page": 4,
      "claim": "Spread correlates with creativity"
    }
  ]
}
```

### Status Values
- `anchor` — Must cite; establishes foundational claim
- `cite` — Will cite; provides supporting evidence
- `challenge` — Presents competing view or limitation
- `gap` — Reveals what's missing
- `skip` — Reviewed, not using

### Role Fields
- `establishes` — Which hypotheses/claims this validates
- `supports_instruments` — Which instruments depend on this
- `limitations` — Caveats that affect instrument design

---

## 3. Claude Code Workflow

### Starting a New Article

```
Create the Motivation section for LIB-001.

Seed file: [paste seeds/LIB-001.md]

Tasks:
1. List what instruments/methods depend on this article (from "Enables")
2. For each item in "Must Establish," explain why it matters (what breaks if false)
3. Identify what the literature gap is—what's established vs. what Phronos still needs
4. Create the "Design Decisions at Stake" table

Output format: Markdown following the schema's Motivation section structure.
```

### Synthesizing a Section

```
Generate the "[Section Name]" synthesis section for LIB-001.

Seed: [paste seeds/LIB-001.md]
Evidence for this section: [paste relevant entries from evidence JSON]

Required structure:
1. **Claim:** One sentence stating what the evidence establishes
2. **Evidence:** Integrated narrative citing sources as (Author Year, p. N)
3. **Limitations:** Bullet list of caveats
4. **Design implication:** 1-2 sentences on how this shapes INS-001 or MTH-002 decisions
5. **Confidence:** Level + rationale

Rules:
- Start with the claim, not the citations
- The design implication must reference a specific instrument or method
- If evidence is thin, lower confidence and note in limitations
- 200-400 words total
```

### Reviewing New Sources

```
Review these new sources for LIB-001.

New evidence: [paste parsed JSON]
Seed: [paste seeds/LIB-001.md]
Current article claims: [paste synthesis section headers]

For each source:
1. Does it support, challenge, or fill a gap in the seed's "Must Establish" claims?
2. Which synthesis section does it belong to?
3. What role should it have? (anchor/cite/challenge/gap/skip)
4. What are its limitations for INS-001?

Output: Updated JSON entries with role fields populated.
```

### Updating an Article

```
New sources added to LIB-001. Review and update the synthesis.

Current section: [paste relevant synthesis section]
New evidence: [paste new entries with roles]
Seed: [paste seed file]

Tasks:
1. Does new evidence change the section's confidence level?
2. Should new citations be integrated into existing paragraphs?
3. Does anything contradict current synthesis?
4. Does the design implication need updating?

Output: Revised synthesis section in full.
```

### Checking Instrument Coverage

```
Audit LIB-001's coverage of INS-001 requirements.

Seed: [paste seed]
Article: [paste full article]
INS-001 documentation: [paste relevant MTH-002 sections]

Questions:
1. For each "Must Establish" claim, is there a synthesis section that addresses it?
2. Are there claims marked as "supported" that have weak evidence?
3. Are there instrument design decisions that lack literature backing?
4. What searches should be run to fill gaps?

Output: Gap analysis table + recommended next steps.
```

### Generating Hypothesis Status

```
Update hypothesis-status.json based on LIB-001.

Article: [paste article]
Current status: [paste tracking/hypothesis-status.json]

For each hypothesis this article addresses (H1.2, H1.7, H1.8, etc.):
1. Is it supported, partial, or still a gap?
2. What evidence strength? (high/moderate/low)
3. What would move it to the next level?

Output: Updated JSON entries.
```

---

## 4. Hypothesis Tracking

```json
{
  "H1.2": {
    "claim": "Semantic networks vary across individuals and correlate with creativity",
    "status": "supported",
    "strength": "moderate",
    "primary_article": "LIB-001",
    "key_sources": ["BeatyKenett2023", "DeDeyne2019", "Kenett2014"],
    "gap": "Cross-cultural replication"
  },
  "H1.7": {
    "claim": "Embedding distances reflect cognitive semantic distance",
    "status": "partial",
    "strength": "moderate",
    "primary_article": "LIB-001",
    "key_sources": ["Hill2015", "ReimersGurevych2019"],
    "gap": "Individual-difference prediction (vs. population average)"
  },
  "H1.8": {
    "claim": "DAT methodology measures divergent thinking",
    "status": "supported",
    "strength": "moderate",
    "primary_article": "LIB-001",
    "key_sources": ["OlsonEtAl2021"],
    "gap": "Adaptation to shorter formats (INS-001 uses 5 vs. 10 words)"
  },
  "H2.6": {
    "claim": "Task-based and naturalistic measures show convergent validity",
    "status": "gap",
    "strength": null,
    "primary_article": "LIB-002",
    "key_sources": [],
    "gap": "No direct studies; requires empirical work"
  }
}
```

---

## 5. Quality Gates

### Before Starting Synthesis

- [ ] Seed file has "Enables" and "Must Establish" populated
- [ ] At least 3 anchor sources identified
- [ ] Evidence JSON has role fields for anchor sources

### Before Publishing Section

- [ ] Section has all five components (claim, evidence, limitations, design implication, confidence)
- [ ] Design implication references a specific instrument or method
- [ ] Confidence level is justified
- [ ] All citations are in evidence JSON

### Before Publishing Article

- [ ] Motivation section explains what depends on this article
- [ ] Each "Must Establish" claim has a synthesis section addressing it
- [ ] `validates` frontmatter is accurate
- [ ] Gaps section includes instrument impact
- [ ] hypothesis-status.json is updated

---

## 6. Daily Workflow

1. **Read papers in Zotero** → highlight key passages, noting which claims they support
2. **Weekly: Export batch** → Generate Report from Items → save HTML
3. **Run parser** → `python parser.py export.html > new.json`
4. **Assign roles** → For each source, populate `establishes`, `supports_instruments`, `limitations`
5. **Ask Claude Code** to synthesize or update sections (using prompts above)
6. **Edit .mdx** → refine output, ensure design implications are concrete
7. **Update tracking** → `hypothesis-status.json`

---

## 7. What You Track in Git

```bash
git add seeds/ evidence/ articles/ tracking/
git commit -m "LIB-001: Added embedding validity section (H1.7), strengthens INS-001 scoring justification"
```

Commit messages should note **which hypotheses are affected** and **instrument implications**.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-01-18 | Updated for goal-directed schema; added role fields to evidence; new Claude prompts |
| 1.0 | 2026-01-15 | Initial simplified pipeline |
