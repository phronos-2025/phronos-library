# INS-001 Library Support Analysis

## What INS-001 Measures

**INS-001.1 (Semantic Radiation):** Given a seed word, generate associated words that are both relevant (connected to seed) and divergent (spread apart from each other).

**INS-001.2 (Semantic Union):** Given two words (anchor + target), generate words that bridge them—relevant to both endpoints while divergent from each other.

**Core constructs:**
- Divergent thinking (semantic spread)
- Associative fluency (generating relevant associations)
- Semantic network "reach" (how far one can travel while staying connected)

**Scoring:**
- **Relevance:** Cosine similarity to prompt(s) in embedding space
- **Divergence:** Mean pairwise distance (DAT methodology, Olson 2021)

---

## Mapping to Current Hypotheses

### Strong Support

| Hypothesis | Relevance to INS-001 | Gap? |
|------------|---------------------|------|
| **H1.2** (Semantic networks vary across individuals and correlate with creativity) | Direct support—INS-001 measures semantic network "shape" | No |
| **H5.3** (Cognitive fitness is domain-specific) | INS-001 targets creativity/divergent thinking domain | No |

### Partial Support

| Hypothesis | Relevance to INS-001 | Gap? |
|------------|---------------------|------|
| **H1.3** (Semantic networks can be inferred from chat) | INS-001 is a *structured task*, not naturalistic chat | **Yes—modality mismatch** |
| **H5.4** (Cognitive fitness measurable via LLM interaction) | INS-001 uses embeddings, not conversational LLM | **Partial—different mechanism** |
| **H2.3** (Test-retest reliability) | Critical for INS-001 but not yet tested | **Yes—needs empirical work** |

### Not Addressed

| INS-001 Requirement | Current Hypotheses | Gap |
|--------------------|-------------------|-----|
| Embedding validity for semantic distance | None | **Major gap** |
| DAT methodology validity | None | **Major gap** |
| Divergence as creativity proxy | Implicit in H1.2, not explicit | **Minor gap** |
| Task-based vs. naturalistic measurement | All hypotheses assume chat | **Structural gap** |
| Relevance-divergence orthogonality | None | **Minor gap** |

---

## Identified Gaps

### Gap 1: Embedding Validity (Critical)

INS-001 entirely depends on the claim that cosine distance in embedding space reflects semantic distance in human cognition. This is a foundational assumption with its own literature base.

**Needed hypothesis:**
> Semantic distances computed from word embeddings correlate with human judgments of semantic similarity and predict performance on semantic tasks.

**Literature:** Reimers & Gurevych 2019 (Sentence-BERT), Auguste et al. 2017 (embeddings vs. priming), Fatima et al. 2021

### Gap 2: DAT Validity (Critical)

The divergence metric directly implements DAT. Its validity for measuring creativity should be an explicit hypothesis.

**Needed hypothesis:**
> Mean pairwise semantic distance between word sets (DAT methodology) correlates with established creativity measures and reflects divergent thinking capacity.

**Literature:** Olson et al. 2021 (PNAS), r=0.40 with composite creativity

### Gap 3: Task-Based Measurement (Structural)

Current hypotheses focus on naturalistic chat. INS-001 is a structured task. These are different measurement modalities with different validity considerations.

**Needed distinction:**
- **Naturalistic measurement:** Inferring constructs from unstructured behavior (chat logs)
- **Task-based measurement:** Eliciting constructs through structured prompts (INS-001)

Both are valid; they have different strengths and validity concerns.

### Gap 4: Construct Definition for Divergent Thinking

H1.2 mentions "creativity" but doesn't explicitly define divergent thinking as the target construct.

**Needed clarification:**
> Divergent thinking—the capacity to generate multiple, varied responses to an open-ended prompt—is measurable via semantic spread and correlates with broader creative ability.

---

## Recommended Schema Augmentations

### Option A: Augment Existing Hypotheses

Add to **LIB-001** seed file:

```markdown
**H1.7:** Semantic distances in embedding space correlate with human semantic judgments and cognitive task performance. *(Moderate confidence—validated for similarity, less for individual differences)*

**H1.8:** Divergent thinking—generating varied responses to open prompts—is measurable via mean pairwise semantic distance (DAT methodology) and correlates with creative ability. *(Moderate confidence—Olson 2021 validation)*
```

Add to **LIB-002** seed file:

```markdown
**H2.6:** Task-based semantic assessments (structured prompts with embedding-scored responses) provide valid measures of cognitive constructs, complementing naturalistic chat-derived measures. *(Low confidence—hypothesis)*
```

### Option B: Create New Article (LIB-010?)

If task-based measurement is central enough to Phronos, it may warrant its own article:

```markdown
# LIB-010: Task-Based Cognitive Assessment

## Question
Under what conditions can structured semantic tasks validly measure cognitive constructs?

## Core Hypotheses

**H10.1:** Word embeddings capture semantic relationships that align with human cognition. *(Moderate)*

**H10.2:** Divergent Association Task methodology (mean pairwise distance) validly measures divergent thinking. *(Moderate—Olson 2021)*

**H10.3:** Relevance and divergence are orthogonal dimensions capturing distinct cognitive capacities. *(Low—hypothesis)*

**H10.4:** Task-based and naturalistic measures of the same construct show convergent validity. *(Low—hypothesis)*
```

---

## My Recommendation

**Augment LIB-001 and LIB-002** rather than create a new article. The gaps are:

1. **Embedding validity** → Add H1.7 to LIB-001
2. **DAT/divergence validity** → Add H1.8 to LIB-001  
3. **Task-based modality** → Add H2.6 to LIB-002
4. **Test-retest for INS-001** → Already covered by H2.3 (just needs execution)

This keeps the library structure tight while covering INS-001's theoretical foundations.

---

## Literature to Add

### For H1.7 (Embedding Validity)

- Reimers & Gurevych 2019 — Sentence-BERT validation
- Auguste et al. 2017 — Embeddings vs. priming RT
- Hill et al. 2015 — SimLex-999 evaluation
- Fatima et al. 2021 — DASentimental (prediction from embeddings)

### For H1.8 (DAT/Divergent Thinking)

- **Olson et al. 2021** — Naming unrelated words predicts creativity (PNAS) ← **Anchor paper**
- Beaty & Kenett 2023 — Associative thinking (already in LIB-001)
- Kenett et al. 2014 — Semantic networks and creativity
- Silvia et al. 2008 — Divergent thinking measurement

### For H2.6 (Task-Based Assessment)

- Measurement invariance literature
- Ecological validity comparisons (task vs. naturalistic)

---

## Updated LIB-001 Seed (Proposed)

```markdown
# LIB-001: Linguistic Markers of Identity

## Question
What features of language reliably encode cognition, and which are measurable at scale?

## Core Hypotheses

**H1.1:** Pronoun patterns correlate with psychological states. *(High confidence)*

**H1.2:** Semantic network structure varies across individuals and correlates with cognitive style/creativity. *(Moderate)*

**H1.3:** Semantic networks can be inferred from chat behavior. *(Low)*

**H1.4:** Self-concept and values can be measured from chat. *(Low)*

**H1.5:** Personality can be inferred from chat patterns. *(Moderate/Low)*

**H1.6:** Reasoning style is detectable from chat. *(Low)*

### NEW: Embedding & Task-Based Measurement

**H1.7:** Semantic distances in embedding space correlate with human semantic judgments. *(Moderate—validated for similarity judgments, less for individual differences)*

**H1.8:** Divergent thinking is measurable via semantic spread (DAT methodology) and correlates with creative ability. *(Moderate—Olson 2021, r=0.40)*

## Key Sources

- Pennebaker 2015 — LIWC
- De Deyne 2019 — Small World of Words
- Beaty & Kenett 2023 — Associative creativity
- **Olson et al. 2021 — DAT validation (PNAS)** ← NEW
- **Reimers & Gurevych 2019 — Sentence-BERT** ← NEW

## Confidence

Mixed. H1.1 well-established. H1.7-H1.8 have moderate support from specific validation studies. H1.3-H1.6 are hypotheses.

## Instruments Supported

- **INS-001.1** (Semantic Radiation) — H1.2, H1.7, H1.8
- **INS-001.2** (Semantic Union) — H1.2, H1.7, H1.8
```

---

## Summary

| Gap | Resolution | Priority |
|-----|------------|----------|
| Embedding validity | Add H1.7 to LIB-001 | Critical |
| DAT validity | Add H1.8 to LIB-001 | Critical |
| Task vs. naturalistic | Add H2.6 to LIB-002 | Medium |
| Test-retest for INS-001 | Covered by H2.3 | Execute empirically |

INS-001 is well-grounded in the associative creativity literature. The main gaps are making the embedding and DAT validity claims explicit in your hypothesis structure.
