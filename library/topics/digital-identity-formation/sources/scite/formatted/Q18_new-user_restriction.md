---
cluster: 5
query: How have other researchers addressed the new-user restriction problem in engagement
  prediction to avoid information leakage?
question_id: Q18
reference_count: 17
source_date: '2026-01-01'
title: New-User Restriction
---


# Addressing the New-User Restriction Problem in Engagement Prediction: A Review of Approaches to Avoid Information Leakage


## Introduction

Information leakage represents a fundamental challenge in machine learning-based prediction systems, occurring when models inadvertently access information during training that would not be available during real-world deployment,. This phenomenon leads to artificially inflated performance metrics and compromises the validity of model evaluations,. In the context of engagement prediction, the new-user restriction problem presents a particularly challenging form of potential leakage, as models must be evaluated on their ability to generalize to users whose data was entirely absent from the training process. This review synthesizes the methodological approaches researchers have developed to address this challenge while maintaining rigorous separation between training and evaluation data.
  - Citations: Kapoor (2023), Kaufman et al. (2012), Bri (2025)


## Conceptual Framework for Understanding Information Leakage


### Defining Leakage in Predictive Modeling

Information leakage in machine learning occurs through multiple mechanisms that compromise model validity. Kaufman et al.provide a foundational definition, demonstrating that leakage can be systematically addressed through careful data management and what they term "learn-predict separation." This separation principle ensures that any information used during model training is strictly isolated from evaluation data. The framework identifies two primary sources of leakage: features that inappropriately encode target information and training samples that overlap with test conditions.
  - Citations: Kaufman et al. (2012)

In the broader context of machine learning-based science, Kapoor and Narayanandocument how leakage has contributed to a reproducibility crisis, with exaggerated performance estimates appearing even in consequential prediction settings. Their analysis reveals that leakage detection and mitigation require fundamentally different approaches depending on whether the application is engineering-focused or insight-oriented. For engagement prediction research, where understanding user behavior patterns is often as important as deployment performance, this distinction carries significant methodological implications.
  - Citations: Kapoor (2023)

Data leakage can manifest in three primary forms: inadequate separation between training and test sets, models leveraging illegitimate features, and test sets that fail to accurately reflect real-world inference scenarios. The new-user restriction problem specifically addresses the first and third concerns, ensuring that evaluation conditions mirror the deployment reality where predictions must be made for users with no historical data in the training corpus.
  - Citations: Bri (2025)


### The New-User Problem as a Specific Leakage Concern

The new-user restriction problem emerges from a fundamental tension in engagement prediction: models trained on user interaction data may inadvertently learn user-specific patterns that inflate performance when the same users appear in both training and test sets. Park and Marcottedemonstrated that this causes significant inflation of prediction performance due to training data leakage. When random splitting is employed without user-level constraints, the same users can occur in both training and test sets, allowing models to exploit memorized patterns rather than learning generalizable engagement predictors.
  - Citations: Bernett et al. (2023)

This concern parallels findings in protein-protein interaction prediction, where Bernett et al.showed that random splitting of interaction data leads to the same entities appearing across data partitions, fundamentally compromising evaluation validity. The analogous situation in engagement prediction occurs when user identifiers or user-specific behavioral signatures leak across the train-test boundary, enabling models to achieve artificially high performance through pattern matching rather than genuine predictive capability.
  - Citations: Bernett et al. (2023)


## Methodological Approaches to Preventing New-User Leakage


### Cross-Validation Design and Nested Procedures

The establishment of best practices for prediction studies emphasizes that all processing operations must be contained within cross-validation loops to prevent potential leakage. Poldrack et al.articulate that when searching across analytic methods or selecting optimal model parameters, nested cross-validation becomes essential. In this approach, a second cross-validation loop operates within the training data to determine optimal methods or parameters, ensuring that no information from the held-out test fold influences model development.
  - Citations: Poldrack et al. (2020)

For new-user scenarios, this principle extends to ensuring that user-level grouping is respected throughout all cross-validation folds. The nested structure prevents the common pitfall where hyperparameter optimization inadvertently accesses test user information. Barnett et al.specifically note that the interaction between data leakage due to hyperparameter optimization and training size represents an important consideration, as larger datasets make it more difficult for models to find non-generalizable patterns while simultaneously making leakage detection more challenging.
  - Citations: Barnett et al. (2022)


### Homology and Redundancy Removal Strategies

Approaches developed in computational biology offer transferable insights for engagement prediction. Guo et al.demonstrate the necessity of avoiding redundancy and homology bias in training data, constructing non-redundant datasets by removing pairs with high sequence identity from the original data. This principle of removing similar entities to prevent information leakage translates directly to user-based prediction scenarios.
  - Citations: Guo et al. (2008)

In knowledge graph completion research, Akrami et al.identify that excessive data redundancy due to semantic duplication, correlation, or data incompleteness constitutes a case of data leakage where models are trained using features that would not be available during real prediction. Their work emphasizes that benchmark datasets must be carefully curated to remove such redundancies. For engagement prediction, this suggests that users with highly similar behavioral profiles or demographic characteristics may need special handling to prevent implicit leakage through pattern similarity.
  - Citations: Akrami et al. (2020)


### Strict Train-Test Separation Protocols

Richoux et al.explicitly address the problem of overfitting validation data, termed "information leak," noting that this concern is frequently neglected in deep learning prediction models. Their work demonstrates that carefully designed evaluation protocols with strict separation conditions can achieve accurate predictions while maintaining methodological rigor. The emphasis on "very strict conditions both for training and testing"underscores the importance of protocol design in preventing leakage.
  - Citations: Richoux et al. (2019)

The learn-predict separation framework proposed by Kaufman et al.provides a systematic approach to avoiding leakage through careful data management. This methodology requires explicit tracking of which data elements are available at prediction time versus training time, with strict enforcement of temporal and entity-based boundaries. For new-user engagement prediction, this translates to ensuring that no user-identifying information or user-specific derived features from test users contaminate the training process.
  - Citations: Kaufman et al. (2012)


## Addressing Cold-Start and New-User Challenges


### Federated Learning Approaches

Federated learning has emerged as a paradigm that inherently addresses certain aspects of the new-user problem while simultaneously protecting privacy. Li et al.propose mobile application start-up prediction methods based on federated learning combined with attributed heterogeneous network embedding, specifically designed to alleviate cold-start problems for new users while guaranteeing privacy. This approach distributes model training across user devices, preventing centralized access to individual user data.
  - Citations: Li et al. (2021)

The federated framework naturally enforces user-level separation because individual user data never leaves local devices during training,. Li et al.further examine privacy defenses in federated learning, noting that while the framework provides privacy benefits by allowing multiple clients to participate without exchanging private data, careful attention must still be paid to information that might leak through shared gradient information. This suggests that even privacy-preserving architectures require additional safeguards against subtle forms of leakage.
  - Citations: Li et al. (2021), Li et al. (2022)

Gupta and Raskarextend this discussion to distributed learning of deep neural networks, addressing scenarios where data entities have vested interests in developing algorithms while being obligated to maintain user privacy. Their methods enable training using multiple data sources while maintaining separation, providing a template for engagement prediction systems that must respect user boundaries.
  - Citations: Gupta (2018)


### Cross-Domain and Transfer Learning Considerations

Cross-domain recommendation frameworks face similar challenges when users appear in multiple domains. Huang and Fengnote that existing cross-domain systems relying on shared data assumptions between domains create significant privacy risks as sensitive information may leak between domains during model training. Their federated cross-domain framework addresses these concerns by preventing direct data sharing while still enabling knowledge transfer.
  - Citations: Huang (2025)

The challenge of generalizing across different user populations connects to broader questions of model transferability. Sledzieski et al.demonstrate in the protein interaction domain that sequence-based approaches can generalize better across different contexts compared to methods that rely on specific structural information. This finding suggests that engagement prediction models designed for new-user scenarios should prioritize features that capture generalizable patterns rather than user-specific signatures.
  - Citations: Sledzieski et al. (2021)


## Detection and Mitigation Strategies


### Identifying Leakage in Existing Systems

Alturayeif and Hassinereview approaches for detecting data leakage in machine learning code, examining transfer learning, active learning, and low-shot prompting as potential detection mechanisms. Their analysis of data-level leakage focuses on relationships between input features and target samples, providing a framework for identifying when training samples inappropriately influence predictions.
  - Citations: Alturayeif (2025)

Rosenblatt et al.provide a comprehensive examination of how data leakage inflates prediction performance in connectome-based machine learning models, identifying multiple forms of leakage including temporal leakage, hyperparameter selection in combined training/test data, unsupervised dimensionality reduction across partitions, and standardization procedures that span data splits. While their focus is neuroimaging, the taxonomy of leakage sources applies broadly to engagement prediction scenarios.
  - Citations: Rosenblatt et al. (2024)

The detection of leakage often requires examining whether performance metrics exceed reasonable expectations given the task difficulty. Kapoor and Narayananrecommend deploying models at limited scale in production as one method for detecting leakage, though they note this advice applies primarily to engineering applications rather than research contexts where insights about processes are the primary goal.
  - Citations: Kapoor (2023)


### Systematic Prevention Frameworks

Brière et al.implement systematic benchmarking of data leakage in knowledge graph embeddings, providing a template for rigorous evaluation that could be adapted to engagement prediction. Their framework addresses inadequate separation between training and test sets, illegitimate feature usage, and test set representativeness of real-world scenarios. Each of these concerns maps directly to new-user engagement prediction challenges.
  - Citations: Bri (2025)

The prevention approach based on learn-predict separation,requires analyzing two sources of leakage: features and training samples. For new-user scenarios, this means ensuring that features derived from user behavior do not encode information about specific test users, and that training samples are selected to exclude any data from users who will appear in evaluation,.
  - Citations: Alturayeif (2025), Kaufman et al. (2012)

Singh et al.explore alternative approaches to incorporating information in prediction models by modifying negative example selection in training sets. Their strategy of selecting examples based on confidence scores rather than random sampling provides a template for constructing training sets that better reflect the challenges of new-user prediction.
  - Citations: Singh et al. (2022)


## Implications for Engagement Prediction Research


### Recommended Practices

Based on the synthesized literature, several best practices emerge for addressing new-user restrictions in engagement prediction:

User-level cross-validation: All cross-validation procedures should group data by user, ensuring complete user-level separation between training and evaluation folds,,.
  - Citations: Poldrack et al. (2020), Bernett et al. (2023), Richoux et al. (2019)

Nested hyperparameter optimization: Model selection and hyperparameter tuning must occur within inner cross-validation loops using only training users,.
  - Citations: Barnett et al. (2022), Poldrack et al. (2020)

Feature auditing: Features should be examined for potential user-identifying information that could enable implicit leakage,,.
  - Citations: Rosenblatt et al. (2024), Kaufman et al. (2012), Bri (2025)

Redundancy removal: Users with highly similar profiles may require special handling to prevent leakage through pattern similarity,.
  - Citations: Guo et al. (2008), Akrami et al. (2020)

Temporal consistency: When applicable, temporal ordering should be respected to prevent future information from influencing predictions about past engagement.
  - Citations: Rosenblatt et al. (2024)


### Evaluation Protocol Design

The literature consistently emphasizes that evaluation protocols must reflect deployment conditions,,. For new-user engagement prediction, this means test sets should contain only users with no representation in training data, and performance metrics should be interpreted in light of this constraint. The gap between performance on seen versus unseen users provides important information about model generalizability that would be obscured by protocols permitting user overlap,.
  - Citations: Kapoor (2023), Richoux et al. (2019), Bri (2025), Bernett et al. (2023)


## Conclusion

Addressing the new-user restriction problem in engagement prediction requires systematic attention to multiple potential sources of information leakage. The research community has developed robust methodological frameworks including strict train-test separation protocols,, nested cross-validation procedures,, federated learning architectures,, and systematic leakage detection approaches,,. These methods collectively enable rigorous evaluation of engagement prediction models under conditions that accurately reflect real-world deployment scenarios where predictions must generalize to entirely new users. The consistent finding across domains is that failure to address these concerns leads to inflated performance estimates that do not translate to practical utility,,.
  - Citations: Richoux et al. (2019), Kaufman et al. (2012), Barnett et al. (2022), Poldrack et al. (2020), Li et al. (2021), Li et al. (2022), Alturayeif (2025), Rosenblatt et al. (2024), Bri (2025), Kapoor (2023), Bernett et al. (2023)


## References

1. Akrami, F., Saeef, M., Zhang, Q., Hu, W., & Li, C. (2020). Realistic Re-evaluation of Knowledge Graph Completion Methods: An Experimental Study., 1995-2010.
2. Alturayeif, N. and Hassine, J. (2025). Data leakage detection in machine learning code: transfer learning, active learning, or low-shot prompting?. *Peerj Computer Science, 11, e2730*.
3. Barnett, E., Onete, D., Salekin, A., & Faraone, S. (2022). Genomic Machine Learning Meta-regression: Insights on Associations of Study Features with Reported Model Performance.
4. Bernett, J., Blumenthal, D., & List, M. (2023). Cracking the black box of deep sequence-based protein-protein interaction prediction.
5. Brière, G., STOSSKOPF, T., Loire, B., & Baudot, A. (2025). Benchmarking Data Leakage on Link Prediction in Biomedical Knowledge Graph Embeddings.
6. Guo, Y., Yu, L., Wen, Z., & Li, M. (2008). Using support vector machine combined with auto covariance to predict protein–protein interactions from protein sequences. *Nucleic Acids Research, 36(9), 3025-3030*.
7. Gupta, O. and Raskar, R. (2018). Distributed learning of deep neural network over multiple agents. *Journal of Network and Computer Applications, 116, 1-8*.
8. Huang, D. and Feng, Q. (2025). Federated Cross‐Domain Recommendation Framework With Graph Neural Network. *Expert Systems, 42(8)*.
9. Kapoor, S. and Narayanan, A. (2023). Leakage and the reproducibility crisis in machine-learning-based science. *Patterns, 4(9), 100804*.
10. Kaufman, S., Rosset, S., Perlich, C., & Stitelman, O. (2012). Leakage in data mining. *Acm Transactions on Knowledge Discovery From Data, 6(4), 1-21*.
11. Li, S., Lv, L., Li, X., & Ding, Z. (2021). Mobile App Start-Up Prediction Based on Federated Learning and Attributed Heterogeneous Network Embedding. *Future Internet, 13(10), 256*.
12. Li, Z., Zhang, J., Liu, L., & Liu, J. (2022). Auditing Privacy Defenses in Federated Learning via Generative Gradient Leakage.
13. Poldrack, R., Huckins, G., & Varoquaux, G. (2020). Establishment of Best Practices for Evidence for Prediction. *Jama Psychiatry, 77(5), 534*.
14. Richoux, F., Servantie, C., Borès, C., & Téletchéa, S. (2019). Comparing two deep learning sequence-based models for protein-protein interaction prediction.
15. Rosenblatt, M., Tejavibulya, L., Jiang, R., Noble, S., & Scheinost, D. (2024). Data leakage inflates prediction performance in connectome-based machine learning models. *Nature Communications, 15(1)*.
16. Singh, R., Devkota, K., Sledzieski, S., Berger, B., & Cowen, L. (2022). Topsy-Turvy: integrating a global view into sequence-based PPI prediction. *Bioinformatics, 38(Supplement_1), i264-i272*.
17. Sledzieski, S., Singh, R., Cowen, L., & Berger, B. (2021). D-SCRIPT translates genome to phenome with sequence-based, structure-aware, genome-scale predictions of protein-protein interactions. *Cell Systems, 12(10), 969-982.e6*.