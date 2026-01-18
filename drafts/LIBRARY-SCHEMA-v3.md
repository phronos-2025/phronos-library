# Library Article Schema

**Version:** 3.0  
**Date:** 2026-01-18  
**Change:** Added Motivation and Design Implications sections; restructured for instrument justification

---

## Overview

Library articles are **goal-directed literature syntheses** that establish what research reveals about cognitive self-observation. Each article answers one question *and* traces how that answer supports specific measurement decisions.

The key insight: library articles aren't standalone lit reviews. They're **foundational arguments** for instrument design and research claims. Every synthesis section should connect backward to literature and forward to Phronos methods.

---

## Article Structure

```
/library/[slug]/
├── Frontmatter (metadata + what this enables)
├── The Question (framing)
├── Motivation (why this matters for Phronos)
├── Synthesis (claim-driven sections with design implications)
├── Sources (annotated bibliography)
├── Gaps (what's missing + what that means for instruments)
└── Changelog
```

---

## 1. Frontmatter

```yaml
---
id: LIB-001
slug: linguistic-markers
title: "Linguistic Markers of Identity"
question: "What features of language reliably encode identity at scale?"
status: drafting          # drafting | published | archived
confidence: moderate      # low | moderate | high
sources: 12

# NEW: What this article enables
enables:
  instruments: [INS-001.1, INS-001.2]
  hypotheses: [H1.2, H1.7, H1.8]
  methods: [MTH-002]

# NEW: What must be true for downstream work
validates:
  - claim: "Semantic distance in embeddings reflects cognitive distance"
    status: supported       # supported | partial | gap
    strength: moderate
  - claim: "Divergent thinking is measurable via semantic spread"
    status: supported
    strength: moderate

depends_on: []            # other LIB articles this builds on
updated: 2026-01-18
---
```

The `enables` and `validates` fields make explicit: **what breaks if this article's claims don't hold?**

---

## 2. The Question

Open with the framing question, scope, and **stakes**.

```markdown
# Linguistic Markers of Identity

**Question:** What features of language reliably encode and communicate identity, and which are measurable at scale in conversational data?

**Scope:** This article synthesizes research on linguistic identity markers—from pronoun use to semantic network structure. It focuses on *expression* (what language encodes), not platform effects (LIB-003) or measurement validity (LIB-002).

**Out of scope:**
- Platform effects on identity expression → LIB-003
- Validity of inference from chat logs → LIB-002
- Cross-cultural measurement invariance → LIB-007
```

---

## 3. Motivation (NEW)

This section answers: **Why does Phronos need to establish this?**

```markdown
## Motivation

### What Depends on This Article

INS-001 (Semantic Association Instruments) measures divergent thinking via semantic spread. This requires establishing:

1. **Semantic networks vary meaningfully across individuals** — If everyone's semantic structure is identical, INS-001 measures noise
2. **Embeddings capture cognitive semantic distance** — If embedding distance diverges from human judgment, INS-001's scoring is invalid
3. **Semantic spread correlates with creativity** — If divergence doesn't predict creative ability, INS-001 measures the wrong construct

### The Literature Gap

The creativity-association literature (Beaty & Kenett 2023, Olson et al. 2021) validates semantic spread as a creativity measure in controlled settings. What remains unclear:

- Whether these findings generalize to brief, chat-like interactions
- Whether embedding-based scoring aligns with human semantic judgment at the individual level
- Whether task-based measures converge with naturalistic chat-derived measures

### Design Decisions at Stake

| If we establish... | Then we can justify... |
|-------------------|----------------------|
| Embedding distances reflect semantic cognition | Using cosine similarity for INS-001 scoring |
| DAT methodology is valid | Using mean pairwise distance as spread metric |
| Semantic spread correlates with creativity | Interpreting INS-001 as creativity measure |
| Individual differences are stable | Treating INS-001 results as trait-like |
```

This section makes the **stakes explicit** before diving into evidence.

---

## 4. Synthesis

Organized by **conceptual claim**, with each section tracing: claim → evidence → limitations → design implication.

```markdown
## Synthesis

### Semantic Networks Vary Across Individuals

**Claim:** The structure of associations between concepts in memory shows stable individual differences that correlate with cognitive style and creative ability.

**Evidence:** De Deyne et al. (2019) established through the Small World of Words project that word association patterns show reliable individual differences across 12,000+ cue words. Beaty & Kenett (2023) synthesize evidence that creative individuals have "flatter" semantic networks—more uniform connection strengths that facilitate novel associations:

> "What distinguishes more creative people is their capacity for association, making new connections between seemingly unrelated concepts." (p. 4)

Kenett et al. (2014) demonstrated that semantic network structure predicts performance on creative thinking tasks, independent of vocabulary size.

**Limitations:**
- Most evidence comes from English-speaking Western samples
- Stability over time (test-retest) less established than cross-sectional differences
- Network measurement requires many data points; unclear if brief tasks suffice

**Design implication:** INS-001's assumption that semantic spread varies meaningfully across individuals is well-supported. However, the brief task format (5-10 responses) may not capture full network structure—interpret as a *sample* of semantic reach rather than comprehensive mapping.

**Confidence:** Moderate — strong theoretical basis, methodological limitations in brief-task contexts.

---

### Embeddings Capture Semantic Distance

**Claim:** Semantic distances computed from word embeddings correlate with human judgments of semantic similarity and predict performance on semantic tasks.

**Evidence:** Hill et al. (2015) established SimLex-999 as a benchmark for evaluating whether embeddings capture human similarity judgments (as opposed to mere association). Modern embeddings achieve r ≈ 0.44-0.56 on SimLex. Reimers & Gurevych (2019) demonstrated that Sentence-BERT embeddings capture semantic similarity for longer text spans.

Auguste et al. (2017) found embedding distances predict semantic priming effects (RT facilitation), suggesting alignment with cognitive processing. However, Fatima et al. (2021) show embeddings are better at capturing *average* semantic relationships than *individual* variations in semantic structure.

**Limitations:**
- Embeddings capture population-level semantics; individual deviations from this baseline are what INS-001 aims to measure
- Different embedding models yield different distances (Olson et al. 2021 used GloVe; INS-001 uses text-embedding-3-small)
- Similarity ≠ distance; embeddings validated for similarity may not validate for creativity-relevant distance

**Design implication:** Using embedding distance as a *baseline* against which individual responses are compared is well-justified. The metric captures "how far from typical" rather than "how creative"—the creativity inference requires additional validation (see H1.8).

**Confidence:** Moderate — validated for similarity judgment, less validated for individual-difference measurement.

---

### Divergent Thinking via Semantic Spread

**Claim:** Divergent thinking—the capacity to generate varied responses to open-ended prompts—is measurable via mean pairwise semantic distance and correlates with broader creative ability.

**Evidence:** Olson et al. (2021) validated the Divergent Association Task (DAT) in a sample of 8,914 participants, finding:

- Mean pairwise distance correlated r = 0.40 with composite creativity (AUT + BFI openness + creative achievement)
- r = 0.40 with Alternate Uses Task (AUT) specifically
- r = 0.28 with Remote Associates Test (RAT)

These correlations held after controlling for vocabulary and verbal fluency. The DAT methodology (generate 10 unrelated words, compute mean pairwise GloVe distance) provides a validated approach to measuring divergent thinking.

**Limitations:**
- DAT uses 10 words; INS-001.1 uses 5 clues. Shorter formats have higher variance
- DAT participants are instructed to maximize unrelatedness; INS-001 has a competing relevance constraint
- Original validation used GloVe; different embedding models yield different distributions

**Design implication:** The core methodology is validated. INS-001's adaptation (fewer words, relevance constraint) requires its own calibration—hence the Haiku baseline studies in MTH-002.1. Report "DAT-equivalent" scores with appropriate caveats about task differences.

**Confidence:** Moderate — DAT methodology validated, INS-001 adaptation requires empirical calibration.
```

**Key pattern:** Each synthesis section ends with **design implication** and **confidence**. This forces the connection between literature and instrument.

---

## 5. Sources

Two tiers with explicit roles.

```markdown
## Sources

### Anchor Papers

Papers that *must* be engaged; they establish foundational claims.

**Olson et al. 2021** — Naming unrelated words predicts creativity  
*PNAS* · [DOI](https://doi.org/10.1073/pnas.2022340118)

Validates DAT methodology. Key finding: mean pairwise distance correlates r=0.40 with composite creativity. Establishes the approach INS-001 adapts.

> "The DAT [...] can be administered online in under five minutes and scored automatically, providing a reliable and valid measure of divergent thinking." (p. 6)

**Role:** Validates H1.8; justifies spread metric in MTH-002.1

---

**Beaty & Kenett 2023** — Associative thinking at the core of creativity  
*Trends in Cognitive Sciences* · [DOI](https://doi.org/10.1016/j.tics.2023.04.004)

Synthesizes computational approaches to semantic networks and creativity. Establishes theoretical framework for why semantic structure relates to creative ability.

**Role:** Theoretical foundation for H1.2; frames INS-001 constructs

---

### Supporting Sources

- **De Deyne et al. 2019** — Small World of Words; establishes individual differences in associations
- **Hill et al. 2015** — SimLex-999; benchmark for embedding validity
- **Reimers & Gurevych 2019** — Sentence-BERT; extends embedding validity to longer text
- **Kenett et al. 2014** — Semantic networks predict creative thinking

### Consulted But Not Cited

- **Author Year** — [Why not used: superseded, tangential, etc.]
```

The **role** annotation makes explicit how each source supports the article's purpose.

---

## 6. Gaps

Explicit documentation of what's missing **and what that means for instruments**.

```markdown
## Gaps

### Weak Evidence (Affects Confidence)

| Gap | Impact on Instruments | Mitigation |
|-----|----------------------|------------|
| Human-AI accommodation dynamics | Unknown if INS-001 triggers different associations than human interlocutor | Note in limitations; plan validation study |
| Cross-cultural validity | INS-001 may not generalize beyond English | Document scope limitation |
| Test-retest reliability for brief tasks | Unknown if INS-001 measures stable trait or state | H2.3 addresses this; needs empirical work |

### Structural Gaps (Requires New Work)

| Gap | What Would Resolve It | Priority |
|-----|----------------------|----------|
| Task-based vs. naturalistic convergence | Study comparing INS-001 scores to chat-derived semantic measures | High (H2.6) |
| Embedding model effects | Calibration across OpenAI, GloVe, etc. | Medium |

### Out of Scope

- Platform effects on identity expression → LIB-003
- Validity of inference from chat logs → LIB-002
- Cross-cultural measurement invariance → LIB-007

### Searches to Run

- Forensic linguistics on idiolect stability
- Embedding evaluation on individual-difference prediction
- Brief-task reliability in creativity measurement
```

---

## 7. Changelog

Track major updates with impact assessment.

```markdown
## Changelog

| Date | Change | Impact |
|------|--------|--------|
| 2026-01-18 | Added embedding validity section (H1.7) | Strengthens INS-001 scoring justification |
| 2026-01-18 | Added DAT validation section (H1.8) | Establishes spread metric foundation |
| 2026-01-15 | Initial draft: pronoun and semantic network sections | — |
```

---

## Confidence Levels

| Level | Meaning | Instrument Implication |
|-------|---------|----------------------|
| **High** | Multiple replicated studies, established measures | Can build on this confidently |
| **Moderate** | Theoretical support + some empirical evidence | Build with caveats; plan validation |
| **Low** | Limited or no direct evidence | Treat as hypothesis; don't claim validity |

State confidence per section and overall. Be honest about gaps—they're research opportunities, not failures.

---

## Relationship to Other Documents

| Document | Relationship |
|----------|--------------|
| **Seed file** (`seeds/LIB-XXX.md`) | Working hypothesis; drives article structure |
| **Evidence JSON** | Source material; annotations become synthesis |
| **RESEARCH-HYPOTHESES.md** | Hypotheses validated/challenged by synthesis |
| **MTH-XXX documents** | Downstream methods that depend on article claims |
| **INS-XXX instruments** | What the article ultimately justifies |

The library article is the **middle layer**: it transforms literature evidence into justified design decisions.

---

## Quality Checklist

Before publishing:

- [ ] Question stated in opening
- [ ] **Motivation section explains what depends on this article**
- [ ] Scope boundaries clear (what's in/out)
- [ ] Each synthesis section has: claim → evidence → limitations → **design implication**
- [ ] Confidence level stated and justified per section
- [ ] Anchor papers have quotes, annotations, and **role** statements
- [ ] **Gaps documented with instrument impact**
- [ ] `enables` and `validates` frontmatter completed
- [ ] Sources count in frontmatter is accurate

---

## Example: Complete Article Opening

```mdx
---
id: LIB-001
slug: linguistic-markers
title: "Linguistic Markers of Identity"
question: "What features of language reliably encode identity at scale?"
status: drafting
confidence: moderate
sources: 14
enables:
  instruments: [INS-001.1, INS-001.2]
  hypotheses: [H1.2, H1.7, H1.8]
  methods: [MTH-002]
validates:
  - claim: "Semantic networks vary meaningfully across individuals"
    status: supported
    strength: moderate
  - claim: "Embeddings capture semantic distance"
    status: supported
    strength: moderate
  - claim: "Semantic spread measures divergent thinking"
    status: supported
    strength: moderate
depends_on: []
updated: 2026-01-18
---

# Linguistic Markers of Identity

**Question:** What features of language reliably encode and communicate identity, and which are measurable at scale in conversational data?

**Scope:** This article synthesizes research on linguistic identity markers—from pronoun use to semantic network structure. It focuses on *expression* (what language encodes), not platform effects (LIB-003) or measurement validity (LIB-002).

---

## Motivation

### What Depends on This Article

INS-001 (Semantic Association Instruments) measures divergent thinking via semantic spread. This requires establishing:

1. **Semantic networks vary meaningfully across individuals** — If everyone's semantic structure is identical, INS-001 measures noise
2. **Embeddings capture cognitive semantic distance** — If embedding distance diverges from human judgment, INS-001's scoring is invalid
3. **Semantic spread correlates with creativity** — If divergence doesn't predict creative ability, INS-001 measures the wrong construct

### The Literature Gap

The creativity-association literature (Beaty & Kenett 2023, Olson et al. 2021) validates semantic spread as a creativity measure in controlled settings. What remains unclear:

- Whether these findings generalize to brief, chat-like interactions
- Whether embedding-based scoring aligns with human semantic judgment at the individual level
- Whether task-based measures converge with naturalistic chat-derived measures

### Design Decisions at Stake

| If we establish... | Then we can justify... |
|-------------------|----------------------|
| Embedding distances reflect semantic cognition | Using cosine similarity for INS-001 scoring |
| DAT methodology is valid | Using mean pairwise distance as spread metric |
| Semantic spread correlates with creativity | Interpreting INS-001 as creativity measure |
| Individual differences are stable | Treating INS-001 results as trait-like |

---

## Synthesis

[Sections follow with claim → evidence → limitations → design implication structure...]
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2026-01-18 | Added Motivation section; added design implications to synthesis; added `enables`/`validates` frontmatter; restructured for instrument justification |
| 2.0 | 2026-01-15 | Simplified schema aligned with pipeline |
| 1.0 | 2026-01-07 | Original detailed schema |
