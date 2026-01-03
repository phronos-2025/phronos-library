---
cluster: 15
query: When is it appropriate to use percentile ranks rather than raw counts for engagement?
  What are the tradeoffs of ordinal vs. continuous measures?
question_id: Q61
reference_count: 11
source_date: '2026-01-02'
title: Utilization Percentiles and Ranks
---


# Percentile Ranks versus Raw Counts in Engagement Measurement: Appropriateness, Tradeoffs, and Measurement Considerations


## Introduction

The selection between percentile ranks and raw counts for measuring engagement represents a fundamental methodological decision in research and applied contexts. This choice carries significant implications for data interpretation, comparability across contexts, and the validity of conclusions drawn from engagement metrics. Understanding when each approach is appropriate requires consideration of the underlying measurement properties, contextual factors, and the specific research or practical objectives guiding the analysis.


## Appropriateness of Percentile Ranks for Engagement Measurement


### Contextual Comparability and Normalization

Percentile ranks prove particularly appropriate when engagement must be compared across different contexts, populations, or time periods where raw counts may be influenced by structural differences. In social media research, for instance, raw engagement counts (such as likes, retweets, or comments) are inherently dependent on factors like audience size, platform algorithms, and temporal dynamics that vary substantially across contexts. When researchers seek to identify which content or users are relatively influential within their respective contexts, percentile ranks normalize these structural differences, enabling meaningful cross-context comparison.
  - Citations: Wang et al. (2014), Borgmann et al. (2016)

The use of percentile ranks becomes especially valuable in research examining influence and impact. In one study analyzing Twitter activity at academic conferences, researchers identified that links in Twitter profiles were associated with both higher activity measured by tweet number and popularity measured by retweet rank percentile. This approach allowed researchers to distinguish genuine influence from mere volume, as percentile ranking accounts for the distribution of engagement within the specific conference context rather than treating absolute retweet counts as directly comparable across different user populations.
  - Citations: Borgmann et al. (2016)


### Addressing Distributional Assumptions and Non-Normality

Percentile-based approaches offer advantages when engagement data violate standard statistical assumptions. Raw engagement counts frequently exhibit non-normal distributions, with many observations clustered at lower values and a long tail of high-engagement outliers. This distributional characteristic creates challenges for parametric statistical methods that assume normality. Percentile ranks, being ordinal transformations of the underlying data, do not require normality assumptions and can be analyzed using non-parametric methods that are more robust to extreme values and skewed distributions.
  - Citations: Jones et al. (2023), Congdon (2017)

In health research examining engagement with digital interventions, researchers have encountered overdispersed count data that failed to meet linear modeling assumptions, necessitating alternative analytical approaches. Quantile regression methods, which operate on percentile-based principles, provided more appropriate statistical tools for analyzing such data. This methodological flexibility demonstrates that percentile ranks and related ordinal approaches can be more statistically appropriate than raw counts when data characteristics violate standard assumptions.
  - Citations: Jones et al. (2023), Congdon (2017)


### Fairness and Equity in Comparative Evaluation

Percentile-based metrics address equity concerns that arise when using raw counts for comparative evaluation. Raw metrics such as citation counts or engagement counts can systematically disadvantage certain groups or categories. Research on researcher evaluation has demonstrated that ranking researchers based solely on raw metrics such as citation counts can introduce significant biases, particularly disadvantaging early-career scientists and those working in disciplines with distinct publication norms. Field-adjusted percentile approaches provide more equitable comparison by contextualizing performance within discipline-specific or career-stage-specific reference groups.
  - Citations: Weltz (2025)

This principle extends to engagement measurement in other domains. When evaluating the impact of social media posts or content, raw engagement counts may reflect audience size and platform exposure rather than content quality or relevance. Percentile ranks within comparable contexts provide a more equitable assessment of relative performance.
  - Citations: Borgmann et al. (2016)


## Appropriateness of Raw Counts for Engagement Measurement


### Direct Measurement of Absolute Engagement

Raw counts remain appropriate when the research question or practical objective requires understanding absolute levels of engagement rather than relative standing. In intervention studies examining whether engagement with digital health tools predicts behavioral outcomes, raw engagement metrics such as the number of app page clicks, frequency of feature use, and session length provide direct measures of user interaction intensity. These absolute measures capture the actual volume of engagement that may directly influence intervention effectiveness.
  - Citations: Centi et al. (2018)

For example, in studies examining whether early engagement with specific features predicts later outcomes, raw frequency counts provide the necessary precision. One study found that participant food photo frequency counts—measured as each unique photo posted per participant per week—correlated with weight loss outcomes at six months. The absolute count of photos posted, rather than the percentile rank within the study population, captured the behavioral intensity that predicted success.
  - Citations: Deutsch (2025)


### Practical Implementation and Interpretability

Raw counts offer practical advantages in real-time monitoring and feedback systems where percentile calculations may be computationally complex or require reference populations that are not readily available. In activity tracking applications designed to promote physical activity, raw step counts provide immediate, interpretable feedback to users about their daily activity levels. Users can understand and respond to absolute targets (e.g., "10,000 steps per day") more readily than to percentile-based feedback, which requires understanding one's position relative to a reference group.
  - Citations: Mohammadi et al. (2020)

Furthermore, raw counts facilitate longitudinal tracking within individuals. When monitoring changes in engagement over time for a single user or organization, raw counts directly reflect whether engagement is increasing or decreasing. Percentile ranks, by contrast, depend on the reference population's distribution and may obscure individual-level changes if the reference population's distribution shifts over time.
  - Citations: Neil (2023)


### Aggregation and Synthesis Across Studies

Raw counts enable straightforward aggregation and synthesis across multiple studies or contexts. Meta-analytic approaches and systematic reviews often require comparable metrics across diverse studies. Raw engagement counts, despite their context-dependence, can be reported consistently across studies, whereas percentile ranks depend on study-specific reference populations and cannot be directly aggregated.
  - Citations: Neil (2023)


## Tradeoffs Between Ordinal and Continuous Measures of Engagement


### Ordinal Measures: Advantages and Limitations

Ordinal measures, including percentile ranks and ranking-based approaches, preserve information about relative ordering while discarding information about the magnitude of differences between ranks. This characteristic creates both advantages and limitations. The primary advantage is robustness: ordinal measures are less sensitive to extreme values and outliers that may distort continuous measures. In engagement research where a small number of highly engaged users or posts may have disproportionately large engagement counts, ordinal measures provide more stable estimates of central tendency and relationships.
  - Citations: Congdon (2017)

Ordinal measures also accommodate non-parametric statistical methods that do not require distributional assumptions. When analyzing engagement data that violate normality assumptions—a common occurrence with count data—ordinal approaches enable valid statistical inference without data transformation. Additionally, ordinal measures facilitate comparison across different measurement scales; for instance, comparing user engagement across platforms with different engagement mechanisms (likes, retweets, shares) becomes more feasible when converted to ordinal ranks.
  - Citations: Ogu et al. (2013), Jones et al. (2023), Borgmann et al. (2016)

However, ordinal measures discard quantitative information about the magnitude of differences. The difference between the 50th and 51st percentile may represent a trivial difference in absolute engagement, while the difference between the 90th and 91st percentile may represent a substantial difference. This loss of information can obscure important patterns and reduce statistical power in detecting relationships. Furthermore, ordinal measures complicate the interpretation of effect sizes and make it difficult to communicate findings to non-technical audiences who may better understand absolute engagement levels.
  - Citations: Congdon (2017)


### Continuous Measures: Advantages and Limitations

Continuous measures of engagement, such as raw counts or transformed counts, preserve the full quantitative information in the data and enable parametric statistical methods that often have greater statistical power. Continuous measures facilitate precise estimation of relationships and allow for more nuanced interpretation of effect sizes. When engagement metrics are approximately normally distributed or can be appropriately transformed, continuous approaches provide efficient statistical inference.
  - Citations: Congdon (2017)

Continuous measures also align with practical applications where absolute engagement levels matter. In intervention studies, the actual number of times a user engages with an app feature may directly influence intervention effectiveness, making continuous measurement more appropriate than ordinal ranking. Similarly, in social media research examining how engagement influences content visibility or user behavior, absolute engagement counts may be more relevant than percentile ranks.
  - Citations: Centi et al. (2018), Wang et al. (2014)

However, continuous measures are vulnerable to the influence of outliers and extreme values that are common in engagement data. A single highly engaged user or viral post can substantially influence means and correlations calculated from continuous measures. Additionally, continuous measures often require data transformation or specialized statistical methods (such as negative binomial regression or quantile regression) when data violate normality assumptions. These analytical complexities can introduce additional sources of error and may be less transparent to audiences unfamiliar with specialized statistical techniques.
  - Citations: Congdon (2017), Jones et al. (2023)


### Hybrid Approaches and Complementary Use

Research practice increasingly demonstrates the value of using ordinal and continuous measures complementarily rather than exclusively. In studies examining engagement with digital health interventions, researchers have employed both raw engagement metrics (continuous) and percentile-based rankings (ordinal) to capture different aspects of engagement. Raw metrics reveal absolute engagement intensity, while percentile ranks contextualize engagement within the study population.
  - Citations: Centi et al. (2018)

In one study examining stroke survivors' preferences for feedback on functional movement, researchers found that quantitative metrics (step counts) and qualitative metrics (stance descriptions) served complementary purposes in motivating behavior change. Similarly, in research on app engagement, both absolute usage metrics and relative rankings within user populations provided distinct insights into engagement patterns.
  - Citations: Demers et al. (2023), Centi et al. (2018)


## Statistical and Methodological Considerations


### Measurement Scale Properties and Analysis Selection

The choice between ordinal and continuous measures should align with the underlying measurement properties of engagement data. Engagement counts are inherently discrete, non-negative integers with natural lower bounds at zero. This characteristic violates the assumptions of ordinary least squares regression, which assumes continuous, normally distributed outcomes. Quantile regression methods, which operate on ordinal principles, provide more appropriate statistical tools for count data without requiring transformation.
  - Citations: Jones et al. (2023), Congdon (2017)

However, when engagement counts are sufficiently large and approximately normally distributed, continuous approaches may be appropriate. The decision should be informed by empirical examination of the data distribution rather than by default application of either approach.
  - Citations: Congdon (2017), Jones et al. (2023)


### Contextual Factors Influencing Measurement Selection

The appropriateness of ordinal versus continuous measures depends substantially on contextual factors, including the research question, the population being studied, and the practical application of findings. In research examining engagement across diverse populations or contexts with substantially different baseline engagement levels, ordinal measures may be more appropriate for fair comparison. Conversely, in research examining engagement within a relatively homogeneous population or context, continuous measures may provide greater precision and interpretability.
  - Citations: Weltz (2025), Centi et al. (2018)

The temporal dimension also influences measurement selection. When tracking engagement changes over time within individuals or organizations, continuous measures directly reflect change magnitude. When comparing engagement across different time periods or populations, percentile-based approaches may be more appropriate if the reference population's characteristics change substantially.
  - Citations: Neil (2023), Borgmann et al. (2016)


## Practical Implications and Recommendations


### When to Prioritize Percentile Ranks

Percentile ranks should be prioritized when: (1) engagement must be compared across contexts with substantially different baseline engagement levels or audience sizes; (2) the research objective is to identify relative influence or standing within a specific population; (3) engagement data exhibit extreme outliers or non-normal distributions that violate parametric assumptions; (4) fairness and equity in comparative evaluation are important considerations; and (5) the audience requires intuitive understanding of relative performance without technical statistical knowledge,,.
  - Citations: Borgmann et al. (2016), Weltz (2025), Congdon (2017)


### When to Prioritize Raw Counts

Raw counts should be prioritized when: (1) the research question requires understanding absolute engagement levels; (2) engagement metrics will be used for real-time feedback or monitoring within a consistent context; (3) longitudinal tracking of individual or organizational engagement is the primary objective; (4) findings will be aggregated or synthesized across multiple studies; (5) the practical application requires communication of absolute engagement targets; and (6) engagement data are approximately normally distributed and satisfy parametric assumptions,,.
  - Citations: Centi et al. (2018), Deutsch (2025), Neil (2023)


### Integrated Measurement Approaches

Best practice increasingly involves reporting both ordinal and continuous measures, allowing different audiences and applications to benefit from complementary information,. When space or presentation constraints limit reporting options, the choice should be guided by the primary research question and the intended audience for findings. Sensitivity analyses examining whether conclusions differ substantially between ordinal and continuous approaches can strengthen confidence in findings and identify contexts where measurement choice influences conclusions.
  - Citations: Centi et al. (2018), Demers et al. (2023), Congdon (2017)


## Conclusion

The choice between percentile ranks and raw counts for engagement measurement, and more broadly between ordinal and continuous measures, involves substantive tradeoffs that should be guided by the research question, data characteristics, and practical application context. Percentile ranks excel at enabling fair comparison across diverse contexts, accommodating non-normal data distributions, and providing robust estimates resistant to outlier influence. Raw counts preserve quantitative information, enable direct interpretation of absolute engagement levels, and facilitate longitudinal tracking and cross-study synthesis. Neither approach is universally superior; rather, the appropriate choice depends on specific research objectives and contextual factors. Contemporary research practice increasingly demonstrates the value of the complementary use of both approaches, leveraging the distinct advantages each provides for a comprehensive understanding of engagement phenomena.


## References

1. Borgmann, H., Woelm, J., Merseburger, A., Nestler, T., Salem, J., Brandt, M., … & Loeb, S. (2016). Qualitative Twitter analysis of participants, tweet strategies, and tweet content at a major urologic conference. *Canadian Urological Association Journal, 10(1-2), 39*.
2. Centi, A., Palacholla, R., Golas, S., Dyrmishi, O., Agboola, S., Jethwani, K., … & Kvedar, J. (2018). Participant Engagement with a Hyper-Personalized Activity Tracking Smartphone App (Preprint).
3. Congdon, P. (2017). Quantile regression for overdispersed count data: a hierarchical method. *Journal of Statistical Distributions and Applications, 4(1)*.
4. Demers, M., Cain, A., Bishop, L., Gunby, T., Rowe, J., Zondervan, D., … & Winstein, C. (2023). Understanding stroke survivors’ preferences regarding wearable sensor feedback on functional movement: a mixed-methods study. *Journal of Neuroengineering and Rehabilitation, 20(1)*.
5. Deutsch, C. (2025). SAT-710 Early Engagement in a Shared Food Photography Log In a Smartphone App-Based Lifestyle Intervention Predicts Successful Weight Loss Months Later. *Journal of the Endocrine Society, 9(Supplement_1)*.
6. Jones, M., Sone, B., Grauzer, J., Sudec, L., Kaat, A., & Roberts, M. (2023). Characterizing mechanisms of caregiver-mediated naturalistic developmental behavioral interventions for autistic toddlers: A randomized clinical trial. *Autism, 28(7), 1847-1860*.
7. Mohammadi, R., Atif, M., Centi, A., Agboola, S., Jethwani, K., Kvedar, J., … & Kamarthi, S. (2020). Neural Network–Based Algorithm for Adjusting Activity Targets to Sustain Exercise Engagement Among People Using Activity Trackers: Retrospective Observation and Algorithm Development Study. *Jmir Mhealth and Uhealth, 8(9), e18142*.
8. Neil‐Sztramko, S., Dobbins, M., & Williams, A. (2023). Evaluation of a Knowledge Mobilization Campaign to Promote Support for Working Caregivers in Canada: Quantitative Evaluation. *Jmir Formative Research, 7, e44226*.
9. Ogu, L., Janakiram, J., Hoffman, H., McDonough, L., Valencia, A., Mackey, E., … & Klein, C. (2013). Hispanic Overweight and Obese Children. *Ican Infant Child & Adolescent Nutrition, 6(1), 35-43*.
10. Wang, W., Duan, L., Koul, A., & Sheth, A. (2014). YouRank: Let User Engagement Rank Microblog Search Results. *Proceedings of the International Aaai Conference on Web and Social Media, 8(1), 619-622*.
11. Weltz, B. and Szabó, I. (2025). Transforming Researcher Evaluation: A New Global Platform to Measure Impact Across Disciplines.