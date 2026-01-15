# Library Article Schema (Simplified)

**Version:** 2.0  
**Date:** 2026-01-15  
**Alignment:** LIBRARY-PIPELINE-SIMPLE.md

---

## Overview

Library articles are bounded literature syntheses that establish what research reveals about cognitive self-observation. Each article answers one question and grows incrementally as sources are added.

This schema is designed for a solo researcher workflow using Zotero → Parser → Claude Code → MDX.

---

## Article Structure

```
/library/[slug]/
├── Frontmatter (metadata)
├── The Question (framing)
├── Synthesis (claim-driven sections)
├── Sources (annotated bibliography)
├── Gaps (what's missing)
└── Changelog
```

---

## 1. Frontmatter

Minimal required fields:

```yaml
---
id: LIB-001
slug: linguistic-markers
title: "Linguistic Markers of Identity"
question: "What features of language reliably encode identity at scale?"
status: drafting          # drafting | published | archived
confidence: moderate      # low | moderate | high
sources: 12               # count of sources in article
updated: 2026-01-15
---
```

Optional fields (add as needed):

```yaml
tier: 1                   # 1-5, per library outline
depends_on: []            # other LIB articles this builds on
supports:                 # methods/instruments this informs
  - MTH-004
  - INS-001
```

---

## 2. The Question

Open with the framing question and a 2-3 sentence scope statement.

```markdown
# Linguistic Markers of Identity

**Question:** What features of language reliably encode and communicate identity, and which are measurable at scale in conversational data?

This article synthesizes research on linguistic identity markers—from pronoun use to semantic network structure—establishing conditions under which typed text can serve as a proxy for cognitive states. It focuses on *expression* (what language encodes), not platform effects (LIB-003) or measurement validity (LIB-002).
```

---

## 3. Synthesis

Organized by **conceptual claim**, not by paper. Each section:
- States a claim
- Integrates evidence
- Notes confidence/limitations

```markdown
## Synthesis

### Pronoun Patterns and Psychological States

First-person pronoun usage reliably correlates with psychological states across clinical and non-clinical populations. The LIWC tradition established that pronoun patterns—particularly shifts in I/we usage—track self-focus, depression markers, and relationship dynamics (Pennebaker 2015).

Ireland et al. (2010) demonstrated that language style matching, including coordinated pronoun use, predicts relationship outcomes. More recent work applies these insights to therapeutic contexts, finding that pronoun patterns predict therapeutic alliance (Ryu et al. 2023).

**Confidence:** High for human-human text; untested for human-AI conversation.

### Semantic Networks and Individual Variation

[Next section...]
```

**Voice guidelines:**
- First-person plural ("we find...", "the evidence suggests...")
- Academic but accessible
- State claims before citations
- Acknowledge uncertainty explicitly

---

## 4. Sources

Two tiers: anchor papers (must-cite foundations) and supporting sources.

```markdown
## Sources

### Anchor Papers

**Beaty & Kenett 2023** — Associative thinking at the core of creativity  
*Trends in Cognitive Sciences* · [DOI](https://doi.org/10.1016/j.tics.2023.04.004)

Synthesizes computational approaches to creativity measurement. Key claim: creative individuals have "flatter" semantic networks with more uniform connection strengths.

> "According to the associative theory of creativity, what distinguishes more creative people is their capacity for association." (p. 4)

---

**De Deyne et al. 2019** — Small World of Words  
*Behavior Research Methods* · [DOI](https://doi.org/10.3758/s13428-018-1115-7)

Foundation for semantic network measurement. Establishes that word association patterns show stable individual differences.

---

### Supporting Sources

- **Ireland et al. 2010** — Language style matching predicts relationships
- **Pennebaker 2015** — LIWC development and validation
- **Ryu et al. 2023** — Pronoun markers in psychotherapy
```

---

## 5. Gaps

Explicit documentation of what's missing. Prevents rabbit holes and flags future work.

```markdown
## Gaps

### Weak Evidence
- Human-AI accommodation dynamics (no direct studies found)
- Cross-cultural validity of pronoun markers

### Out of Scope
- Platform effects on identity expression → LIB-003
- Validity of inference from chat logs → LIB-002

### Searches to Run
- Forensic linguistics on idiolect stability
- LIWC validation in non-English languages
```

---

## 6. Changelog

Track major updates. Git handles fine-grained history.

```markdown
## Changelog

| Date | Change |
|------|--------|
| 2026-01-15 | Initial draft: pronoun and semantic network sections |
| 2026-01-20 | Added 5 sources, updated confidence to moderate |
```

---

## File Organization

```
/src/content/library/
├── lib-001-linguistic-markers.mdx
├── lib-002-digital-validity.mdx
├── lib-003-reflexive-identity.mdx
└── ...
```

One file per article. Split into separate files only if article exceeds ~3000 words.

---

## URL Structure

```
/library/                           # Index page
/library/linguistic-markers/        # LIB-001
/library/digital-validity/          # LIB-002
```

---

## Relationship to Pipeline

| Pipeline Component | Schema Element |
|-------------------|----------------|
| Seed file (`seeds/LIB-001.md`) | Question, scope, confidence |
| Evidence JSON | Sources section |
| Claude Code synthesis | Synthesis sections |
| Git history | Changelog |

The seed file is your working hypothesis. The .mdx article is the published output. They should stay aligned—when you update the seed, update the article.

---

## Quality Checklist

Before publishing:

- [ ] Question stated in opening
- [ ] Scope boundaries clear (what's in/out)
- [ ] Each synthesis section has a claim + evidence
- [ ] Confidence level stated and justified
- [ ] Anchor papers have quotes and annotations
- [ ] Gaps documented
- [ ] Sources count in frontmatter is accurate

---

## Example: Complete Article

```mdx
---
id: LIB-001
slug: linguistic-markers
title: "Linguistic Markers of Identity"
question: "What features of language reliably encode identity at scale?"
status: drafting
confidence: moderate
sources: 8
updated: 2026-01-15
---

# Linguistic Markers of Identity

**Question:** What features of language reliably encode and communicate identity, and which are measurable at scale in conversational data?

This article synthesizes research on linguistic identity markers—from pronoun use to semantic network structure. It focuses on expression (what language encodes), not platform effects (LIB-003) or measurement validity (LIB-002).

---

## Synthesis

### Pronoun Patterns and Psychological States

First-person pronoun usage reliably correlates with psychological states. The LIWC tradition established that pronoun patterns track self-focus and relationship dynamics (Pennebaker 2015). Language style matching predicts relationship outcomes (Ireland et al. 2010), and recent work finds pronoun patterns predict therapeutic alliance (Ryu et al. 2023).

**Confidence:** High for human text; untested for human-AI.

### Semantic Networks and Individual Variation

Semantic network structure—the pattern of associations between concepts—varies meaningfully across individuals. De Deyne et al. (2019) established stable individual differences in word associations. Creative individuals show "flatter" networks with more uniform connection strengths, facilitating novel associations (Beaty & Kenett 2023).

The challenge for Phronos: eliciting semantic structure from naturalistic chat rather than controlled tasks. Embedding approaches (MTH-004) offer one pathway, though validation is incomplete.

**Confidence:** Moderate—strong theory, measurement validation needed.

### Linguistic Accommodation

Language style matching encodes relational dynamics in human conversation (Ireland et al. 2010). Whether accommodation operates similarly with AI partners remains unstudied.

**Confidence:** Low—no direct evidence for human-AI context.

---

## Sources

### Anchor Papers

**Beaty & Kenett 2023** — Associative thinking at the core of creativity  
*Trends in Cognitive Sciences* · [DOI](https://doi.org/10.1016/j.tics.2023.04.004)

> "What distinguishes more creative people is their capacity for association, making new connections between seemingly unrelated concepts." (p. 4)

---

**De Deyne et al. 2019** — Small World of Words  
*Behavior Research Methods* · [DOI](https://doi.org/10.3758/s13428-018-1115-7)

Foundation for semantic network measurement across 12,000+ cue words.

---

### Supporting

- Ireland et al. 2010 — Language style matching
- Pennebaker 2015 — LIWC development
- Ryu et al. 2023 — Pronouns in therapy

---

## Gaps

**Weak evidence:**
- Human-AI accommodation (no studies)
- Cross-cultural validity

**Out of scope:**
- Platform effects → LIB-003
- Inference validity → LIB-002

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-15 | Initial draft |
```

---

## Confidence Levels

| Level | Meaning | Language to Use |
|-------|---------|-----------------|
| **High** | Multiple replicated studies, established measures | "robustly demonstrates", "well-established" |
| **Moderate** | Theoretical support + some empirical evidence | "suggests", "indicates", "preliminary support" |
| **Low** | Limited or no direct evidence | "remains unclear", "no direct studies", "speculative" |

State confidence per section and overall. Be honest about gaps.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-01-15 | Simplified schema aligned with pipeline |
| 1.0 | 2026-01-07 | Original detailed schema |
