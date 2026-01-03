---
topic: digital-identity-formation
type: addendum
parent: OUTLINE.md
reason: Empirical findings from WildChat analysis invalidated original hypotheses and revealed new patterns requiring theoretical grounding
date: 2025-01-02
status: pending
---

# Literature Review Addendum: MTH-003 Engagement Prediction

## Rationale for Addendum

Ablation and permutation importance analyses revealed that the original theoretical framing (IT-identity markers predict engagement) is empirically unsupported:

| Original Hypothesis | Empirical Finding |
|---------------------|-------------------|
| Pronoun use predicts return | Permutation importance < 0.001 |
| "We" language indicates IT-self integration | Power users show LOWEST "we" rates (0.012 vs 0.045) |
| Relational framing predicts engagement | Power users show LOWEST direct address (0.316 vs 0.709) |
| Linguistic style matters | Word count alone achieves AUC = 0.757; all other features add +0.012 |

These findings require new theoretical grounding in three areas:
1. **Task boundedness**: Why word count (proxy for task type) dominates prediction
2. **Instrumentalization**: Why heavy users show declining social/relational markers
3. **User typologies**: Whether distinct engagement patterns reflect user types or learning trajectories

---

## Cluster IX: Task Boundedness & Completion Dynamics

*Grounding the finding that prompt length predicts engagement*

### Q33: Task Completion and Disengagement
What literature exists on task completion as a driver of disengagement from technology or information systems? When users achieve their goal, what factors predict whether they return for new tasks versus leave the platform entirely?

**Search terms**: task completion disengagement, goal attainment technology use, post-task behavior, single-session users, task closure

### Q34: Bounded vs. Open-Ended Technology Use
How have researchers distinguished bounded (finite task, clear endpoint) from open-ended (ongoing process, no natural termination) technology use? What are the differential engagement patterns, retention rates, and user trajectories for each?

**Search terms**: bounded task technology, open-ended interaction, task finitude engagement, exploratory vs instrumental use, process-oriented technology use

### Q35: Information Sufficiency and Search Termination
What research from information seeking behavior explains when and why users stop engaging once "sufficient" information is obtained? How do satisficing thresholds vary across users and task types?

**Search terms**: information sufficiency, search termination, satisficing information seeking, stopping rules information behavior, enough information threshold

### Q36: Prompt Length as Cognitive Indicator
What does message length signal about the sender's goals, cognitive load, task representation, or communicative intent in computer-mediated communication? Is message length a reliable proxy for task complexity or specificity?

**Search terms**: message length CMC, prompt length cognitive load, text length task complexity, verbosity communication goals, message elaboration

---

## Cluster X: Instrumentalization & Efficiency Learning

*Explaining the inverted pattern: power users show declining relational markers*

### Q37: Expertise and Linguistic Efficiency
How does linguistic style change with tool expertise? Do expert users of technology become more terse, more imperative, less socially marked in their commands? What is the trajectory from novice verbosity to expert efficiency?

**Search terms**: expert user language, expertise linguistic efficiency, skill acquisition communication style, novice expert HCI, command terseness expertise

### Q38: Domestication Theory and Tool Integration
How does Silverstone's domestication framework (appropriation → objectification → incorporation → conversion) explain the shift from relational to instrumental framing in extended technology use? At what phase does "tool" replace "partner"?

**Search terms**: domestication theory technology, Silverstone appropriation incorporation, technology integration household, tool domestication, media domestication

### Q39: Social Presence Decay
Does perceived social presence or anthropomorphism of technology decline with extended use? What evidence exists for habituation to social cues in human-computer interaction? Do users "forget" the AI is an agent over time?

**Search terms**: social presence habituation, anthropomorphism decay, social presence extended use, habituation HCI, novelty social presence

### Q40: Power User Linguistic Signatures
What linguistic features distinguish expert or power users from novices in human-computer interaction contexts (command line, search engines, software interfaces)? Are there universal signatures of mastery?

**Search terms**: power user behavior, expert user linguistics, command line expertise, search query expertise, advanced user patterns

---

## Cluster XI: User Typologies & Orientation

*Supporting the hypothesis of distinct user types (tool-oriented vs partner-oriented)*

### Q41: Instrumental vs. Relational Technology Orientation
What individual difference measures capture instrumental versus relational orientation toward technology? Are these stable traits or context-dependent states? How do they predict use patterns?

**Search terms**: instrumental relational technology, utilitarian hedonic technology, technology orientation individual differences, social technology motivation

### Q42: Use Motivation Typologies
Beyond demographics, what typologies of technology users exist based on motivational orientation? How have researchers segmented users by why they engage rather than what they do?

**Search terms**: technology user typology, use motivation segmentation, user motivation clusters, engagement motivation types, technology use profiles

### Q43: Intent as Type Indicator vs. Trajectory Predictor
Does initial intent or task category predict subsequent user trajectory, or do pre-existing user types select into certain intents? Can first-session behavior distinguish types, or only reveal tasks?

**Search terms**: first session user type, initial intent prediction, task selection user type, onboarding behavior segmentation, early use trajectory

---

## Additions to Existing Clusters

### Cluster VI Additions (Ecological Validity)

### Q44: Word Count as Confounder in NLP Studies
How have other NLP and computational social science studies addressed word count or message length as a dominant confounder that absorbs variance from other linguistic features? What corrections or controls are standard?

**Search terms**: word count confounder NLP, message length control, text length normalization, linguistic feature word count, length confound text analysis

---

### Cluster VII Additions (Conversational AI-Specific)

### Q45: Task-Based Segmentation in Chatbot Research
How have chatbot and conversational AI researchers segmented users by task type or intent category? What differential engagement, satisfaction, or retention patterns emerge across task segments?

**Search terms**: chatbot user segmentation, conversational AI task types, intent-based chatbot analysis, chatbot use cases engagement, task category conversational agent

### Q46: The Roleplay Exception
What explains the uniquely high engagement and return rates of roleplay, fiction, and creative users with conversational AI? What psychological needs (narrative identity, parasocial interaction, creative expression) does this use fulfill?

**Search terms**: roleplay chatbot, AI fiction writing, conversational AI creative use, parasocial AI interaction, narrative identity chatbot, AI companion roleplay

---

## Reframing Guidance for Completed Questions

Questions Q5-Q9 (pronoun and linguistic marker literature) returned null empirical results. When synthesizing these completed reviews, frame as:

> "The linguistic marker literature suggested that pronoun use, politeness, and direct address would predict engagement. Our analysis found no support for this in the conversational AI context: permutation importance for all pronoun features was < 0.001. Possible explanations include: (a) word count confounding—longer prompts dilute pronoun density; (b) task heterogeneity—effects may exist within task types but cancel across them; (c) context specificity—CMC findings may not transfer to human-AI interaction."

---

## Summary of Addendum

| Cluster | Questions | Focus |
|---------|-----------|-------|
| IX (New) | Q33-Q36 | Task boundedness and completion dynamics |
| X (New) | Q37-Q40 | Instrumentalization and efficiency learning |
| XI (New) | Q41-Q43 | User typologies and orientation |
| VI (Addition) | Q44 | Word count as confounder |
| VII (Additions) | Q45-Q46 | Chatbot-specific task segmentation |

**Total new questions**: 14

---

## Revised Theoretical Frame

The literature review now supports a task-completion model rather than an identity-integration model:

> **Primary finding**: Task boundedness, not relational orientation, predicts engagement. Users with bounded tasks (signaled by long, context-heavy prompts) disengage upon completion. Users with open-ended needs (signaled by short, conversational prompts) return.
>
> **Secondary finding**: Extended engagement is associated with instrumentalization—declining social markers, increasing linguistic efficiency—suggesting that sustained use reflects tool mastery rather than relationship formation.
>
> **Implication**: The "AI companion" narrative may describe early or niche use (roleplay, emotional support), while mainstream sustained use resembles expert tool operation.

---

## Metadata

| Field | Value |
|-------|-------|
| New Questions | 14 (Q33-Q46) |
| Total Questions (with parent) | 46 |
| Parent Document | OUTLINE.md |
| Related Method | MTH-003 |
| Triggered By | Ablation study, permutation importance analysis |
| Created | 2025-01-02 |
| Status | Pending review |
