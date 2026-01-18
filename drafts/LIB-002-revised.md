# LIB-002: Digital Validity

## Question

Under what conditions can digital interactions—chat logs, task responses, game behaviors—serve as valid proxies for cognitive states?

---

## 1. Why This Matters for INS-001

INS-001 instruments exist entirely in digital space. Participants type words into a web interface; we measure semantic distances between those words and draw inferences about their cognitive capacities. This chain of inference rests on several assumptions that must be examined.

The core challenge: digital behavior is *mediated* behavior. Between cognition and measurement sit layers of translation—language production, typing, interface affordances, participant motivation, context effects. Each layer introduces potential slippage between what we measure and what we care about.

This library article addresses whether digital semantic association tasks can yield valid measurements. Five claims require attention:

1. **Digital behavior reflects cognition, not just communication style** (H2.1) — Ecological validity
2. **Measurements are stable across occasions** (H2.3) — Test-retest reliability
3. **Selection effects are characterizable** (H2.5) — Who takes digital assessments?
4. **Task-based and naturalistic measures converge** (H2.6) — Construct validity across contexts
5. **AI interaction doesn't invalidate measurement** — Reflexivity concern

Each claim is evaluated below, with links to empirical findings in [MTH-002.1](https://phronos.org/methods/semantic-association-metrics/spread-fidelity-scoring/) where available.

---

## 2. Enables

| Type | Items |
|------|-------|
| **Instruments** | INS-001.1, INS-001.2 (measurement validity) |
| **Hypotheses** | H2.1, H2.3, H2.5, H2.6 |
| **Methods** | MTH-002 (scoring validity), all future instruments |

---

## 3. Must Establish

### H2.1: Ecological Validity

**Claim:** Digital task responses reflect actual cognitive processes, not artifacts of the digital medium or communication conventions.

**Status:** Supported for game-based cognitive measures; untested for creativity-specific tasks

**Evidence:**
- Pedersen et al. (2023) validated Skill Lab, a suite of mobile cognitive games, against laboratory tasks for memory and attention. Correlations were substantial (r = 0.40–0.60), establishing that game-based digital measures can capture cognitive constructs.

**Complication:** Pedersen validated memory and attention, not divergent thinking. The extent to which their findings transfer to semantic association tasks is unknown.

**Implication for INS-001:** We have domain-general precedent for digital ecological validity, but no direct validation for creativity measures.

---

### H2.3: Test-Retest Reliability

**Claim:** Spread measurements are stable within individuals across testing occasions, reflecting trait-like properties rather than momentary fluctuations.

**Status:** Unknown—critical gap

**Evidence:**
- Olson et al. (2021) did not report test-retest reliability for DAT
- No published studies examine stability of semantic spread measures
- [MTH-002.1 §9](https://phronos.org/methods/semantic-association-metrics/spread-fidelity-scoring/#9-limitations) lists "Single-trial reliability: High variance per trial" as a documented limitation

**Mitigation:** MTH-002.1 recommends using multiple trials and reporting aggregates. However, this addresses measurement precision, not construct stability.

**Implication for INS-001:** We cannot distinguish genuine individual differences from measurement noise or state fluctuations. This is perhaps the most critical validity gap.

---

### H2.5: Selection Effects

**Claim:** The population of digital assessment takers has characterizable properties, allowing appropriate generalization or caveat of findings.

**Status:** Acknowledged but unquantified

**Evidence:**
- No systematic studies of who completes digital semantic association tasks
- Digital assessment takers likely differ from general population in education, technology access, and motivation

**Implication for INS-001:** Findings may not generalize beyond populations willing to engage with digital cognitive tasks.

---

### H2.6: Task-Naturalistic Convergence

**Claim:** Task-based measures (INS-001) and naturalistic measures (derived from chat logs or conversation) tap the same underlying constructs.

**Status:** Entirely hypothetical—zero supporting evidence

**Evidence:**
- No published studies compare INS-001-style structured tasks to semantic measures derived from naturalistic text
- This convergence is conceptually important: if task and naturalistic measures diverge, we cannot claim to measure general semantic cognition

**Implication for INS-001:** The instruments measure behavior in a constrained task context. Whether this reflects broader cognitive style is an open question.

---

### Reflexivity Concern: AI Interaction Effects

**Claim:** The context of AI-mediated assessment does not alter the constructs being measured.

**Status:** Documented concern; not quantified for creativity measures

**Evidence:**
- Vicente & Matute (2023) demonstrated that AI interaction can alter human decision-making and bias inheritance. Users adopt AI-suggested framings and priorities.
- Applied to INS-001: interaction with Claude Haiku (as guesser) or exposure to AI-generated examples could theoretically shift participants' semantic associations

**Complication:** Vicente & Matute studied bias inheritance, not creativity. Whether AI interaction affects divergent thinking measures is unknown.

**Implication for INS-001:** Measurement may be contaminated by the AI context, though we lack evidence on direction or magnitude.

---

## 4. Key Sources

| Source | Contribution | Caveats |
|--------|--------------|---------|
| **Pedersen et al. 2023** | Game-based cognitive assessment validation | Supports H2.1 for memory and attention. Creativity/divergent thinking games not validated. |
| **Vicente & Matute 2023** | AI bias inheritance in decision-making | Documents reflexivity concern. Applied to bias, not creativity measures. |
| **Abramski et al. 2025** | LLM-human semantic comparison methodology | Supports cross-agent validity methodology. Not directly about digital measurement validity. |
| **Olson et al. 2021** | DAT validation | Provides reliability reference but no test-retest data. |
| **Said-Metwaly et al. 2024** | DT-CA meta-analysis | Calibrates effect size expectations (r = 0.18) for creativity measures. |

---

## 5. Scope

**In scope:**
- Ecological validity of digital behavioral measures
- Test-retest reliability for semantic tasks
- Task-based vs. naturalistic measurement convergence
- Selection effects and population representativeness
- Human-AI interaction effects on measurement validity

**Out of scope:**
- Semantic network theory → LIB-001
- Cross-cultural measurement invariance → LIB-007
- Game-based assessment design → LIB-008
- Reflexive identity change → LIB-003

---

## 6. Current Gaps

| Gap | Status | Reference |
|-----|--------|-----------|
| **Test-retest reliability** | Unknown. No published data for DAT or spread measures. MTH-002.1 acknowledges high single-trial variance. | [MTH-002.1 §9](https://phronos.org/methods/semantic-association-metrics/spread-fidelity-scoring/#9-limitations) |
| **Task-naturalistic convergence** | Zero evidence. No studies comparing INS-001-style tasks to chat-derived measures. | H2.6 |
| **AI interaction effects** | Documented for bias but not creativity. Vicente & Matute (2023) establishes the concern; magnitude for semantic measures unknown. | — |
| **Human validation** | Pending. Current scoring uses Claude Haiku 4.5 as standardized reference; human-AI divergence unquantified. | [MTH-002.1 §9](https://phronos.org/methods/semantic-association-metrics/spread-fidelity-scoring/#9-limitations) |
| **Task constraint effects** | Documented but interpretation uncertain. Task constraints significantly affect spread measurement (d = 1.02 between unconstrained DAT and constrained INS-001.2). | [MTH-002.1 §4.6](https://phronos.org/methods/semantic-association-metrics/spread-fidelity-scoring/#4-dat-calibration) |
| **Selection effects quantification** | Not studied. Population characteristics of digital assessment takers are unknown. | H2.5 |

---

## 7. Confidence

**Low.**

Ecological validity for game-based measures (Pedersen 2023) supports domain-specific games (memory, attention) but not creativity tasks. We are extrapolating precedent without direct validation.

Task-naturalistic convergence (H2.6) is conceptually important but has zero supporting evidence. If task-elicited and naturalistic semantic behavior diverge, INS-001 measures task performance rather than cognitive style.

Test-retest reliability (H2.3) is unknown. Without stability data, we cannot distinguish individual differences from measurement noise. The [MTH-002.1 calibration](https://phronos.org/methods/semantic-association-metrics/spread-fidelity-scoring/) documents metric properties (spread, fidelity, constraint effects) but does not address these fundamental validity gaps.

The confidence rating reflects an honest assessment: we have built an instrument with documented metric properties but limited evidence that those metrics capture stable, ecologically valid cognitive constructs.

---

## 8. Joint Confidence Note

Individual confidence ratings treat gaps as independent. When multiple LIB articles are combined for instrument development (e.g., INS-001 depends on LIB-001, LIB-002, and LIB-008), joint confidence is substantially lower than any single rating suggests.

**Key compounding uncertainties for INS-001:**
- Embedding validity for individuals (LIB-001 H1.7) × Test-retest reliability (LIB-002 H2.3) × Creativity-game transfer (LIB-008 H8.1)

Until these are independently validated, INS-001 confidence should be interpreted as **Low** despite moderate ratings on component claims.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.2 | 2026-01-18 | Added narrative structure; integrated MTH-002.1 calibration findings; downgraded confidence from Low-to-Moderate to Low; added task constraint effects gap; added human validation gap; added Joint Confidence Note |
| 1.1 | 2026-01-15 | Revision: added embedding validity section, DAT/divergent thinking section |
| 1.0 | 2026-01-15 | Initial publication |
