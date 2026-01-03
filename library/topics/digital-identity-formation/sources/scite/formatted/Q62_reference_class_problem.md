---
cluster: 16
query: What is the reference class problem in statistical inference? How do researchers
  select appropriate comparison groups for individual prediction or description?
question_id: Q62
reference_count: 19
source_date: '2026-01-02'
title: Reference Class Problem
---


# The Reference Class Problem in Statistical Inference: Definition, Challenges, and Selection of Comparison Groups


## Introduction

The reference class problem represents a fundamental challenge in statistical inference that arises when assigning probabilities to individual cases or making predictions about specific entities. This problem emerges because a single individual or event can be classified in multiple ways, and the probability assigned to that individual may vary substantially depending on which classification scheme—or reference class—is employed. Understanding this problem and developing principled approaches to selecting appropriate comparison groups is essential for rigorous statistical practice across diverse fields, from clinical medicine to legal proceedings.
  - Citations: H (2007)


## Definition and Nature of the Reference Class Problem


### Core Conceptualization

The reference class problem occurs fundamentally when "we want to assign a probability to a proposition (or sentence, or event) X, which may be classified in various ways, yet its probability can change depending on how it is classified". This problem has long been recognized as a critical issue in statistical inference, particularly within frequentist approaches to probability. The challenge is not merely academic; it has profound practical implications for how researchers make inferences about individual cases based on population-level data.
  - Citations: H (2007)

The problem can be illustrated through a concrete example: when making a prediction about an individual patient's treatment outcome, that patient can be classified according to numerous characteristics—age, gender, disease severity, comorbidities, treatment type, and countless other variables. Each classification scheme constitutes a different reference class, and the frequency of the outcome of interest may differ substantially across these classes. The question of which reference class should be used for inference about that specific patient remains philosophically and practically contentious.
  - Citations: H (2007)


### Historical Development

The reference class problem has deep roots in the philosophy of probability and statistics. Reichenbach's foundational work established the problem as central to frequentist inference, and subsequent scholars have grappled with its implications. Early attempts to resolve the problem, such as Kyburg's system presented in "The Logical Foundations of Statistical Inference," encountered "certain technical difficulties, and from a major practical difficulty; it was hard to be sure, in discussing examples and applications, when you had got hold of the right reference class". This practical difficulty remains relevant today, as researchers must make concrete decisions about which comparison groups to employ in their analyses.
  - Citations: Roth (2025), Kyburg (1983)

The debate surrounding reference class selection has involved prominent philosophers and statisticians. For instance, a longstanding dispute between Kyburg and Levi concerning statistical inferences centered on "Kyburg's and Levi's accounts of randomness and choosing reference classes," highlighting the enduring nature of this problem.
  - Citations: Stone (1987)


## Theoretical Frameworks for Understanding the Problem


### Probabilistic Approaches

The reference class problem manifests differently across various probabilistic frameworks. Within standard Bayesianism and logical probability approaches, neither the Principle of the Narrowest Reference Class nor the Principal Principle can adequately resolve the problem when situated within these dominant probabilistic frameworks. This limitation suggests that the problem is not merely a matter of choosing the most specific available reference class, as such an approach creates its own complications.
  - Citations: Williamson (2022)

The principle of relevance, which can be derived using the principle of maximum entropy, appears as the reference class problem in statistical inference and "subsumes the mathematics of inheritance" in knowledge representation systems. This connection suggests that the reference class problem is not isolated to probability theory but reflects deeper issues about how information should be used in reasoning and inference.
  - Citations: Shastri (1988)


### Direct Inference and Reference Class Selection

Direct inference—the process of inferring probabilities about individuals from frequency statements about populations—requires careful consideration of reference class selection. Research has demonstrated that "a direct inference based on a more specific reference class can trigger the defeat of a direct inference based on a less specific reference class, even if the conclusions of the two direct inferences are mutually consistent". This finding indicates that the relationship between reference class specificity and inferential validity is more complex than simple hierarchical ordering might suggest.
  - Citations: Thorn (2019)

The problem of gerrymandered reference classes represents a particular challenge in direct inference. Gerrymandered reference classes are those constructed specifically to support a desired conclusion rather than based on principled criteria for relevance. Distinguishing between legitimately specific reference classes and gerrymandered ones requires careful methodological attention.
  - Citations: Thorn (2011)


## Practical Implications and Applications


### Clinical and Medical Research

In clinical research, the reference class problem manifests when researchers must decide which patient populations to use as comparison groups for individual patient predictions or descriptions. The selection of appropriate comparison groups directly affects the validity of clinical inferences. Clinical trials must "involve the identification of appropriate comparison or control groups and the selection of valid study design", yet the reference class problem complicates this seemingly straightforward task.
  - Citations: Ratain (1990)

For example, when assessing treatment efficacy, researchers must decide whether to compare outcomes within the entire randomized population, within compliant subgroups, or within other defined populations. Different choices yield different estimates of treatment effects, and the reference class problem highlights the need for principled approaches to these decisions.
  - Citations: Sommer (1991)


### Legal and Forensic Applications

The reference class problem has significant implications for legal decision-making based on statistical evidence. "The reference class problem affects legal decisions based on certain types of statistical evidence," and understanding this problem is essential for proper application of statistics in legal contexts. When statistical evidence is presented in legal proceedings, the choice of reference class can substantially affect the probability assigned to a defendant's guilt or innocence, making this problem directly relevant to justice outcomes.
  - Citations: Colyvan (2007)


### Comparative Studies and Control Group Selection

In comparative research designs, the selection of appropriate control or reference groups is fundamental to valid inference. Studies comparing clinical populations to general population samples must carefully define their reference groups. When "a comparison was made with an age and gender-matched general population sample," the researchers explicitly defined their reference class through demographic matching criteria. This approach represents one principled method for reference class selection, though it may not address all relevant dimensions of similarity.
  - Citations: Scheper et al. (2017)


## Methodological Approaches to Reference Class Selection


### Specificity and Narrowness Principles

One prominent approach to reference class selection emphasizes using the most specific or narrowest applicable reference class. Research has shown that "the policy of using direct inference with the most specific applicable reference classes yields personal probabilities whose accuracy is optimal, according to all proper scoring rules". This finding provides theoretical support for preferring narrower reference classes when they are available and appropriately defined.
  - Citations: Thorn (2016)

However, this principle requires careful implementation. The narrowest reference class is not always the most appropriate, particularly when the narrower class is based on gerrymandered criteria or when the evidential basis for forming precise frequencies within that class is insufficient. Researchers must balance the desire for specificity with concerns about sample size, statistical stability, and principled relevance.
  - Citations: Thorn (2017)


### Matching and Stratification Approaches

In comparative research, matching on baseline characteristics represents a practical approach to reference class selection. Studies frequently employ "age and gender matched" comparison groups. This approach operationalizes the intuition that individuals should be compared to others who are similar in relevant respects.
  - Citations: Scheper et al. (2017)

More sophisticated matching approaches, such as propensity score methods, provide frameworks for selecting comparison groups in observational data where randomization is infeasible. These methods "balance covariates between treatment groups" and "mitigate confounding bias in non-randomized comparative effectiveness studies", effectively defining reference classes based on estimated propensity for treatment receipt.
  - Citations: Pietrobon et al. (2025)


### Hierarchical and Nested Reference Classes

Some research designs employ hierarchical structures of reference classes. For instance, in studies examining individual responses to treatment, researchers may compare individuals to their own baseline measurements, to matched controls, and to population norms simultaneously. This multi-level approach acknowledges that different reference classes may be appropriate for different inferential purposes.
  - Citations: Niogi et al. (2020)

When "1 reduced FA tract (± 2.5 standard deviations) was found using the typical normative database reference versus 10 statistically significant (p < 0.05) reduced FA tracts when referencing internal control baseline data," the choice of reference class—population norms versus individual baseline—substantially affected the conclusions. This example illustrates how reference class selection directly impacts research findings.
  - Citations: Niogi et al. (2020)


## Challenges in Reference Class Selection


### The Problem of Multiple Applicable Classes

A fundamental challenge in addressing the reference class problem is that multiple reference classes may be simultaneously applicable and defensible. An individual patient in a clinical trial can be classified as: a member of the overall trial population, a member of a demographic subgroup, a member of a treatment group, a member of a compliant subgroup, and numerous other categories. Each classification is potentially relevant, yet they may yield different probability estimates.


### Balancing Specificity with Statistical Power

Narrower reference classes provide more specific information but may contain fewer observations, reducing statistical power and increasing uncertainty. The trade-off between specificity and statistical stability represents a practical manifestation of the reference class problem. Researchers must decide whether to accept less specific but more stable estimates or more specific but less stable estimates.
  - Citations: Pate et al. (2020)


### Avoiding Gerrymandering and Bias

The risk of gerrymandering—selecting reference classes to support predetermined conclusions—represents a serious threat to valid inference. Researchers may unconsciously or deliberately select reference classes that favor particular outcomes. Addressing this risk requires transparent specification of reference class selection criteria before analyzing data and justification of these criteria based on principled grounds rather than empirical results.
  - Citations: Thorn (2011)


### Handling Competing Dimensions of Similarity

Individuals may be similar to potential comparison groups along some dimensions while differing along others. A patient may match a comparison group on age and gender but differ on disease severity or comorbidities. Deciding which dimensions of similarity are most relevant for defining the reference class requires substantive judgment that cannot be resolved through statistical methods alone.
  - Citations: Ratain (1990)


## Formal Solutions and Recent Developments


### Imprecise Probability Approaches

Recent work has explored using imprecise or interval-valued probabilities to address the reference class problem. When "one lacks an evidential basis for forming a precise-valued frequency" within a narrower reference class, imprecise probability approaches may be appropriate. These methods acknowledge uncertainty about the correct reference class by assigning probability intervals rather than point estimates, reflecting the fundamental indeterminacy inherent in reference class selection.
  - Citations: Thorn (2017)


### Bayesian Model Selection

Bayesian approaches to reference class selection employ model selection criteria to compare different reference class specifications. By "examining how frequently regions of a shape occur within an ensemble," researchers can assign probabilities to different reference class structures. This approach formalizes the comparison of alternative reference classes using principled statistical criteria.
  - Citations: Parkan (2018)


### Nonparametric Predictive Inference

Nonparametric predictive inference (NPI) represents an alternative frequentist approach that is "explicitly aimed at using few modelling assumptions". NPI methods may provide frameworks for inference that are less dependent on specific reference class choices, though they introduce their own methodological considerations.
  - Citations: Coolen (2018)


## Practical Guidelines for Reference Class Selection


### Transparency and Pre-specification

Researchers should specify their reference class selection criteria before analyzing data, documenting the rationale for their choices. This pre-specification reduces the risk of unconscious gerrymandering and allows readers to evaluate whether alternative reference classes might have yielded different conclusions.
  - Citations: Ratain (1990)


### Multiple Reference Classes

When feasible, researchers should present results using multiple defensible reference classes, demonstrating the sensitivity of conclusions to reference class selection. This approach acknowledges the fundamental indeterminacy of the problem while providing readers with a range of plausible estimates.
  - Citations: Niogi et al. (2020)


### Substantive Justification

Reference class selection should be justified based on substantive theory and prior knowledge rather than empirical optimization. Researchers should articulate why particular dimensions of similarity are relevant for their specific inferential purposes.
  - Citations: Thorn (2016)


### Consideration of Sample Size and Stability

Researchers must balance the desire for specificity with practical concerns about sample size and statistical stability. Narrower reference classes should be employed only when they contain sufficient observations to support stable estimates.
  - Citations: Pate et al. (2020)


### Alignment with Inferential Purpose

The appropriate reference class depends partly on the inferential purpose. Predictions about individual outcomes may require different reference classes than descriptions of population-level effects. Researchers should explicitly consider what question they are trying to answer and select reference classes accordingly.
  - Citations: Ratain (1990)


## Conclusion

The reference class problem represents a fundamental challenge in statistical inference that arises from the fact that individuals and events can be classified in multiple ways, with probability estimates varying across classification schemes. This problem is not merely theoretical; it has practical implications for clinical research, legal proceedings, and numerous other domains where statistical inference informs important decisions.
  - Citations: H (2007)

While no universally satisfactory solution to the reference class problem has been identified, several approaches show promise for addressing it in practice. These include employing the most specific applicable reference classes when they are appropriately defined, using matching and stratification to define reference classes based on relevant similarities, employing hierarchical structures of reference classes for different inferential purposes, and using imprecise probability approaches when evidential bases for precise frequencies are lacking.
  - Citations: Thorn (2016), Pietrobon et al. (2025), Niogi et al. (2020), Thorn (2017)

Ultimately, responsible statistical practice requires that researchers make explicit, justified choices about reference class selection, acknowledge the limitations and assumptions inherent in these choices, and where possible, demonstrate the robustness of conclusions across multiple defensible reference class specifications. The reference class problem cannot be eliminated, but it can be managed through careful methodological attention and transparent reporting.


## References

1. Colyvan, M. and Regan, H. (2007). Legal Decisions and the Reference Class Problem. *The International Journal of Evidence & Proof, 11(4), 274-285*.
2. Coolen‐Maturi, T. and Coolen, F. (2018). Non-parametric Predictive Inference for the Validation of Credit Rating Systems. *Journal of the Royal Statistical Society Series a (Statistics in Society), 182(4), 1189-1204*.
3. Hájek, A. (2007). The reference class problem is your problem too. *Synthese, 156(3), 563-585*.
4. Kyburg, H. (1983). The Reference Class. *Philosophy of Science, 50(3), 374-397*.
5. Niogi, S., Luther, N., Kutner, K., Shetty, T., McCrea, H., Barnes, R., … & Härtl, R. (2020). Increased sensitivity to traumatic axonal injury on postconcussion diffusion tensor imaging scans in National Football League players by using premorbid baseline scans. *Journal of Neurosurgery, 133(4), 1063-1071*.
6. Parkan, M. and Tuia, D. (2018). Estimating Uncertainty of Point-Cloud Based Single-Tree Segmentation with Ensemble Based Filtering. *Remote Sensing, 10(2), 335*.
7. Pate, A., Emsley, R., Sperrin, M., Martin, G., & Staa, T. (2020). Impact of sample size on the stability of risk scores from clinical prediction models: a case study in cardiovascular disease.
8. Pietrobon, R., Machiavelli, A., Rodrigues, L., Agrey, A., Nkeangnyi, L., Zechia, G., … & Teixeira, L. (2025). Propensity Score Methods: A Robust Approach for Causal Inference in Observational Data (Motivated by the Comparative Study on Anesthesia Type and Hip Arthroplasty Outcomes by Lee et al.).
9. Ratain, J. and Hochberg, M. (1990). Clinical trials. *Arthritis & Rheumatism, 33(1), 131-139*.
10. Roth, A. and Tolbert, A. (2025). Resolving the Reference Class Problem at Scale. *Philosophy of Science, 1-15*.
11. Scheper, F., Majdandžić, M., Ven, P., Jansen, L., Doreleijers, T., Schuengel, C., … & Vries, A. (2017). Temperament Traits and Psychopathology in Young Clinically Referred Children Compared to a General Population Sample. *Child Psychiatry & Human Development, 48(6), 841-850*.
12. Shastri, L. (1988). A Connectionist Approach to Knowledge Representation and Limited Inference. *Cognitive Science, 12(3), 331-392*.
13. Sommer, A. and Zeger, S. (1991). On estimating efficacy from clinical trials. *Statistics in Medicine, 10(1), 45-52*.
14. Stone, M. (1987). Kyburg, Levi, and Petersen. *Philosophy of Science, 54(2), 244-255*.
15. Thorn, P. (2011). Two Problems of Direct Inference. *Erkenntnis, 76(3), 299-318*.
16. Thorn, P. (2016). On the preference for more specific reference classes. *Synthese, 194(6), 2025-2051*.
17. Thorn, P. (2017). Direct Inference from Imprecise Frequencies., 347-358.
18. Thorn, P. (2019). A Formal Solution to Reichenbach's Reference Class Problem. *Dialectica, 73(3), 349-366*.
19. Williamson, J. (2022). Direct Inference and Probabilistic Accounts of Induction. *Journal for General Philosophy of Science, 54(3), 451-472*.