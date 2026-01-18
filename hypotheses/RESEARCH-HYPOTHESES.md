# Phronos Research Hypotheses

**Date:** 2026-01-15  
**Status:** Working document  
**Source:** Phronos-Research-Goals.md

---

## Overview

This document translates Phronos research goals into testable hypotheses, organized by Library article. Each hypothesis is stated in complete sentences with dependencies, evidence requirements, and confidence assessments.

**Notation:**
- **H[n]** — Hypothesis number (sequential within article)
- **G[n]** — Reference to Research Goals document
- **→** — Depends on
- **⇒** — Unlocks/enables

---

## Foundational Claims (Tier 0)

These claims underlie the entire research program. They must be defensible before downstream work proceeds.

### F1: Cognitive Phenotypes Are Real and Measurable

**Claim:** Stable patterns of cognition—"cognitive phenotypes"—exist as individual differences that can be reliably measured from behavioral traces in human-AI interaction data.

**Unpacked:**
- Cognitive phenotypes are not artifacts of measurement
- They reflect genuine variation in how people think, not just how they write
- They are stable enough to be meaningful (not purely situational)
- They can be distinguished from LLM-generated patterns

**Evidence needed:**
- Convergent validity with established cognitive measures
- Discriminant validity from linguistic style alone
- Test-retest reliability across sessions
- Distinguishability from LLM outputs on same tasks

**Status:** Assumed, requires validation  
**Maps to:** LIB-001, LIB-002  
**Source:** G1, G2

---

### F2: Chat Data Reveals Cognition, Not Just Communication

**Claim:** What people type in conversations with AI systems encodes cognitive processes (reasoning, association, belief structures) beyond mere communicative intent.

**Unpacked:**
- Text is a window into thought, not just social performance
- The cognitive signal is extractable despite communicative noise
- Human-AI interaction reduces some social filtering present in human-human text

**Evidence needed:**
- Correlation between chat-derived measures and cognitive task performance
- Demonstration that chat features predict outcomes beyond self-report
- Analysis of what chat captures that surveys miss (and vice versa)

**Status:** Theoretical foundation, moderate empirical support  
**Maps to:** LIB-001, LIB-002  
**Source:** G1, G2

---

## LIB-001: Linguistic Markers of Identity

**Question:** What features of language reliably encode identity at scale in chat data?

### H1.1: Pronoun Patterns Encode Psychological States

First-person pronoun usage patterns (frequency, shifts, I/we ratio) correlate with measurable psychological states including self-focus, distress, and relational orientation.

**Confidence:** High  
**Evidence:** LIWC tradition, clinical validation studies  
**Source:** Established literature

### H1.2: Semantic Network Structure Varies Across Individuals

The structure of associations between concepts in memory—measurable through word associations or embedding distances—shows stable individual differences that correlate with cognitive style and creative ability.

**Confidence:** Moderate  
**Evidence:** Small World of Words, creativity research  
**Gap:** Validation in chat contexts  
**Source:** G12 (semantic network robustness)

### H1.3: Semantic Networks Can Be Assessed via Chat

An individual's semantic network structure can be inferred from their chat behavior—prompt content, associative patterns, topic transitions—without explicit association tasks.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Correlation between chat-derived and task-derived semantic measures  
**Source:** G12

### H1.4: Chat Captures Identity Constructs

Self-concept, values, and beliefs can be reliably measured from chat interactions, with validity comparable to or exceeding traditional self-report instruments.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Convergent/discriminant validity studies  
**Dependency:** → F1, F2  
**Source:** G4

### H1.5: Chat Captures Personality

Big Five personality traits and related constructs can be reliably inferred from chat interaction patterns.

**Confidence:** Moderate (for text generally), Low (for chat specifically)  
**Evidence:** Some validation of text-based personality inference  
**Gap:** Chat-specific validation  
**Source:** G3

### H1.6: Chat Captures Reasoning Style

Individual differences in reasoning (analytical vs. intuitive, logical structure, metacognitive accuracy) are detectable from chat interaction patterns.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Correlation with reasoning tasks, think-aloud protocols  
**Source:** G5

### H1.7: Embedding Validity for Semantic Distance

Semantic distances computed from word embeddings correlate with human judgments of semantic similarity and predict performance on semantic tasks.

**Confidence:** Moderate  
**Evidence:** Sentence-BERT validation, SimLex evaluations, priming studies  
**Key literature:** Reimers & Gurevych 2019, Hill et al. 2015  
**Instruments:** INS-001.1, INS-001.2

### H1.8: Divergent Thinking via Semantic Spread (DAT)

Divergent thinking—the capacity to generate varied responses to open prompts—is measurable via mean pairwise semantic distance and correlates with broader creative ability.

**Confidence:** Moderate  
**Evidence:** Olson et al. 2021 (PNAS) — r=0.40 with composite creativity  
**Key literature:** Olson et al. 2021, Beaty & Kenett 2023  
**Instruments:** INS-001.1, INS-001.2

---

## LIB-002: Digital Validity

**Question:** Under what conditions can chat data serve as valid proxies for cognitive states?

### H2.1: Chat Data Has Ecological Validity

Cognitive patterns observed in naturalistic chat interactions reflect real-world cognition more accurately than laboratory tasks for certain constructs.

**Confidence:** Moderate  
**Evidence:** Digital phenotyping literature, ecological momentary assessment  
**Qualifier:** Validity varies by construct

### H2.2: Anonymity Alters Disclosure

Anonymous chat interactions (like WildChat) elicit different—potentially more authentic—self-disclosure than identified interactions.

**Confidence:** Moderate  
**Evidence:** Online disinhibition literature  
**Source:** G1

### H2.3: Measurements Are Stable Within Individuals

Cognitive phenotype measurements from chat show acceptable test-retest reliability (r > 0.7) across measurement occasions separated by meaningful time intervals.

**Confidence:** Unknown (empirical question)  
**Evidence needed:** Longitudinal measurement study  
**Dependency:** → H1.4, H1.5, H1.6 (must have valid measures first)  
**Source:** G6

### H2.4: Measurements Generalize Across Platforms

Cognitive phenotypes identified in one AI system (e.g., ChatGPT) are detectable in interactions with other systems (Claude, Gemini) and modalities (voice, code).

**Confidence:** Unknown (empirical question)  
**Evidence needed:** Cross-platform validation study  
**Source:** G15

### H2.5: Selection Effects Are Characterizable

The population that generates chat data (particularly power users) differs systematically from the general population in ways that can be measured and adjusted for.

**Confidence:** High (that differences exist), Moderate (that adjustment is possible)  
**Evidence:** WildChat power user analysis (DSP-001)  
**Source:** G16

### H2.6: Task-Based vs. Naturalistic Measurement

Task-based semantic assessments (structured prompts with embedding-scored responses) provide valid measures of cognitive constructs, with different validity properties than naturalistic chat-derived measures. The two modalities should show convergent validity for the same constructs.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Convergent validity between task-based (INS-001) and chat-derived measures  
**Instruments:** INS-001.1, INS-001.2

---

## LIB-003: Reflexive Identity

**Question:** How do AI interactions shape cognition while purporting to measure it?

### H3.1: AI Interaction Alters Reasoning

Extended interaction with LLMs changes measurable aspects of human reasoning—potentially including analytical depth, source reliance, or metacognitive calibration.

**Confidence:** Low (hypothesis with theoretical basis)  
**Evidence needed:** Pre-post or longitudinal design  
**Dependency:** → H1.6 (reasoning measurement)  
**Source:** G18

### H3.2: AI Interaction Alters Identity

Extended interaction with LLMs changes measurable aspects of self-concept, values, or beliefs—beyond what would occur through other information sources.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Pre-post or longitudinal design with control condition  
**Dependency:** → H1.4 (identity measurement)  
**Source:** G19

### H3.3: Sycophancy Shapes Beliefs

AI systems' tendency toward agreement and validation reinforces users' existing beliefs, with measurable effects on belief confidence and resistance to counterevidence.

**Confidence:** Moderate (theoretical), Low (empirical)  
**Evidence needed:** Experimental manipulation of AI agreement levels  
**Source:** G11, G13

### H3.4: Persuasion Susceptibility Varies

Individuals differ in their susceptibility to being persuaded by LLM-generated arguments, and this susceptibility is measurable and stable.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Experimental persuasion paradigm  
**Source:** G11

### H3.5: Belief Networks Have Measurable Robustness

An individual's semantic network around a topic or belief has a measurable "robustness"—resistance to restructuring when challenged—that varies across individuals and topics.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Operationalization and measurement study  
**Dependency:** → H1.2, H1.3  
**Source:** G12

### H3.6: Specific Inputs Destabilize Belief Networks

Certain types of AI responses (questions, counterarguments, reframings) are more effective at destabilizing belief networks than others, and effectiveness varies by individual.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Experimental study  
**Dependency:** → H3.5 (robustness defined)  
**Source:** G13

### H3.7: Self-Observation Changes Cognition

Using cognitive instruments to observe one's own thinking changes subsequent cognition—the act of measurement is an intervention.

**Confidence:** Moderate (theoretical basis strong)  
**Evidence needed:** Measurement-naive vs. exposed comparison  
**Dependency:** → LIB-008 (instruments exist)  
**Source:** G21

---

## LIB-004: Power Laws and Extremes

**Question:** What do outliers reveal about the structure of cognition?

### H4.1: Cognitive Phenotypes Follow Power Laws

The distribution of cognitive phenotype expression (like usage intensity) follows power law or heavy-tailed distributions, not normal distributions.

**Confidence:** High (for behavioral measures), Moderate (for cognitive measures)  
**Evidence:** DSP-001, platform usage data  
**Source:** G7

### H4.2: Outliers Are Informative

Individuals at the extremes of cognitive phenotype distributions reveal structural features of cognition not visible in typical samples.

**Confidence:** Moderate (theoretical), requires demonstration  
**Evidence needed:** Comparative analysis of extreme vs. typical cognition  
**Source:** G9

### H4.3: Distinct Phenotypes Exist

Some cognitive phenotypes represent qualitatively distinct patterns—not just quantitative extremes—that can be empirically distinguished from the general population.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Clustering analysis, discriminant validity  
**Source:** G9

---

## LIB-005: Architecture of Genius

**Question:** What characterizes exceptional cognitive performance?

### H5.1: AI Orchestration Is a Distinct Skill

The ability to effectively coordinate multiple AI systems represents a measurable cognitive phenotype with identifiable characteristics.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Identification and characterization study  
**Source:** G8

### H5.2: Phenotypes Emerge in Group Human-AI Interaction

Dyadic or group contexts involving humans and AI produce emergent cognitive phenotypes not visible in individual interaction.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Group interaction analysis  
**Source:** G10

### H5.3: Cognitive Fitness Is Domain-Specific

"Cognitive fitness"—the capacity to successfully accomplish cognitive tasks—is organized into distinct domains that can be separately assessed.

**Confidence:** Moderate (aligns with intelligence research)  
**Evidence needed:** Factor analysis of fitness measures  
**Source:** G23

### H5.4: Cognitive Fitness Is Measurable via Chat

Markers of cognitive fitness in specific domains can be reliably measured through LLM-based interaction.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Convergent validity with performance measures  
**Dependency:** → H5.3 (fitness defined)  
**Source:** G24

### H5.5: AI Collaboration Proficiency Develops

Individuals acquire proficiency at human-AI collaboration through identifiable developmental stages with measurable markers.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Longitudinal skill development study  
**Source:** G22

---

## LIB-006: Madness and Mediation

**Question:** When does cognitive divergence become pathological?

### H6.1: Vulnerable Users Are Identifiable

Patterns in chat interaction can identify users at elevated risk for harmful outcomes from AI interaction.

**Confidence:** Low (hypothesis with ethical complexity)  
**Evidence needed:** Clinical validation (with appropriate safeguards)  
**Source:** G11, G13

### H6.2: AI Interaction Affects Clinical Outcomes

Cognitive phenotype—or patterns of AI interaction—predict subsequent mental health outcomes in populations with clinical data.

**Confidence:** Unknown (contingent on data availability)  
**Evidence needed:** Prospective longitudinal clinical study  
**Conditional:** Requires clinical outcome data  
**Source:** G28

---

## LIB-007: Reference Classes

**Question:** How can individuals be validly compared to reference populations?

### H7.1: Phenotype Prevalence Is Estimable

The prevalence of specific cognitive phenotypes can be estimated within defined populations using appropriate sampling.

**Confidence:** Moderate (methodologically feasible)  
**Qualifier:** Requires explicit scope limitation or representative sampling  
**Source:** G16

### H7.2: Global Prevalence Requires Cross-Cultural Validation

Measuring cognitive phenotype prevalence globally requires demonstrating cross-cultural measurement invariance.

**Confidence:** High (as a requirement)  
**Evidence needed:** Cross-cultural validation studies  
**Dependency:** → H2.4 (cross-platform generalization)  
**Source:** G17

### H7.3: Phenotypes Have Identifiable Antecedents

Developmental, experiential, or demographic factors predict cognitive phenotype expression.

**Confidence:** Moderate (by analogy to other individual differences)  
**Evidence needed:** Retrospective or developmental sampling  
**Source:** G27

---

## LIB-008: Instrument Design

**Question:** How can instruments present information without causing harm?

### H8.1: Self-Location Is Possible

Individuals can meaningfully locate themselves within distributions of cognitive traits using appropriately designed instruments.

**Confidence:** Moderate (the goal is achievable)  
**Dependency:** → LIB-001 through LIB-007  
**Source:** G30

### H8.2: Phenotypes Associate with Performance

Cognitive phenotypes measured from chat predict performance (task success relative to peers) on external criteria.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Predictive validity studies  
**Source:** G25

### H8.3: Phenotypes Associate with Fitness

Cognitive phenotypes measured from chat correlate with cognitive fitness measures.

**Confidence:** Low (hypothesis)  
**Dependency:** → H5.3, H5.4 (fitness framework)  
**Source:** G26

### H8.4: Phenotype Change Is Measurable

Changes in cognitive phenotype over time can be reliably detected, distinguishing true change from measurement error.

**Confidence:** Unknown  
**Evidence needed:** Longitudinal tracking with reliability assessment  
**Dependency:** → H2.3 (test-retest reliability)  
**Source:** G20

---

## LIB-009: Mind Among Extremes

**Question:** How does observing extremes affect the observer?

### H9.1: Proclivity Is Measurable

An individual's proclivity toward a cognitive phenotype—their latent tendency—can be measured before full expression.

**Confidence:** Low (hypothesis)  
**Evidence needed:** Predictive validity study  
**Source:** G14

---

## Causal Claims (Tier 7)

These hypotheses require experimental or strong quasi-experimental designs.

### C1: Phenotype → Outcome (Causal)

Cognitive phenotype causally influences outcomes (performance, fitness, health), not merely correlates with them.

**Confidence:** Very Low (highest evidentiary bar)  
**Evidence needed:** Experimental manipulation or instrumental variable design  
**Dependency:** → All Tier 0-6 hypotheses  
**Note:** May not be achievable for all phenotype-outcome pairs  
**Source:** G29

---

## Hypothesis Priority Matrix

| Priority | Hypothesis | Why |
|----------|------------|-----|
| **Critical** | F1, F2 | Foundation—everything else depends on these |
| **Critical** | H1.7, H1.8 | INS-001 depends on embedding and DAT validity |
| **High** | H1.4, H1.5, H1.6 | Measurement validity enables all discovery |
| **High** | H2.3 | Reliability is prerequisite for dynamics |
| **High** | H2.6 | Task vs. naturalistic validity for INS-001 |
| **Medium** | H1.2, H1.3 | Semantic networks are central to approach |
| **Medium** | H3.1, H3.2 | Reflexivity is core research question |
| **Medium** | H4.3, H5.1 | Phenotype discovery |
| **Lower** | H5.3, H5.4 | Fitness framework (parallel track) |
| **Lower** | H7.1, H7.2 | Prevalence (requires prior validation) |
| **Aspirational** | C1 | Causal claims (highest bar) |

---

## Mapping to Library Articles

| Article | Core Hypotheses | Research Goals | Instruments |
|---------|-----------------|----------------|-------------|
| LIB-001 | H1.1–H1.8 | G3, G4, G5, G12 | INS-001.1, INS-001.2 |
| LIB-002 | H2.1–H2.6 | G1, G2, G6, G15, G16 | INS-001 (reliability) |
| LIB-003 | H3.1–H3.7 | G11, G13, G18, G19, G21 | — |
| LIB-004 | H4.1–H4.3 | G7, G9 | — |
| LIB-005 | H5.1–H5.5 | G8, G10, G22, G23, G24 | — |
| LIB-006 | H6.1–H6.2 | G28 | — |
| LIB-007 | H7.1–H7.3 | G16, G17, G27 | — |
| LIB-008 | H8.1–H8.4 | G14, G20, G25, G26, G30 | All |
| LIB-009 | H9.1 | G14 | — |
| Causal | C1 | G29 | — |

---

## Next Steps

1. **Validate foundations (F1, F2):** Literature review for LIB-001, LIB-002
2. **Design measurement studies:** For H1.4, H1.5, H1.6
3. **Establish reliability:** For H2.3
4. **Pursue discovery:** For H4.3, H5.1 once measurement is solid

---

## Per-Hypothesis Change Log

### H1.7 (Embedding Validity)
| Date | Change | Evidence | Confidence |
|------|--------|----------|------------|
| 2026-01-15 | Created | INS-001-LIBRARY-MAPPING analysis | Moderate |

### H1.8 (DAT Validity)
| Date | Change | Evidence | Confidence |
|------|--------|----------|------------|
| 2026-01-15 | Created | Olson 2021 (r=0.40), INS-001 mapping | Moderate |

### H2.6 (Task vs. Naturalistic)
| Date | Change | Evidence | Confidence |
|------|--------|----------|------------|
| 2026-01-15 | Created | INS-001-LIBRARY-MAPPING gap analysis | Low |

---

## Version History

|Version| Date | Change |
|---|------|--------|
| 0.2 | 2026-01-15 | Initial hypothesis specification from Research Goals |
| 0.1 | 2026-01-15 | Added H1.7, H1.8, H2.6 per INS-001 gap analysis; created per-hypothesis changelog |
