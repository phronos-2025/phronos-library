---
cluster: 13
query: How have semantic embeddings (word2vec, BERT, sentence transformers) been used
  to characterize users, predict behavior, or segment populations in HCI, marketing,
  or social computing research?
question_id: Q50
reference_count: 26
source_date: '2026-01-02'
title: Text Embeddings for User Modeling
---


# Semantic Embeddings for User Characterization, Behavior Prediction, and Population Segmentation in HCI, Marketing, and Social Computing Research


## Introduction

Semantic embeddings have emerged as transformative tools for representing textual data in continuous vector spaces, enabling sophisticated analyses of user-generated content across human-computer interaction (HCI), marketing, and social computing domains. These techniques—spanning from word-level representations like Word2Vec and GloVe to contextualized models such as BERT and sentence transformers—have fundamentally altered how researchers characterize users, predict behaviors, and segment populations. This synthesis examines the methodological foundations and applications of these embedding approaches, drawing upon the available literature to illuminate their utility in understanding human behavior through computational means.


## Foundational Embedding Technologies


### Word-Level Embeddings

The development of distributed word representations marked a paradigm shift in natural language processing and its downstream applications. Word2Vec and GloVe represent foundational approaches that capture semantic relationships between words through vector representations. These word embedding techniques have been employed across various domains, with GloVe (Global Vectors for Word Representation) demonstrating utility in various tasks, including named entity recognition. The success of unsupervised word embeddings across multiple applications naturally prompted researchers to explore whether similar methods could derive improved representations for word sequences, enabling a more nuanced understanding of user-generated content.
  - Citations: Pennington et al. (2014), Pagliardini et al. (2018)

Word embeddings like Word2Vec and GloVe have become increasingly popular as means of effectively capturing semantic information in document classification and text analysis tasks. These distributed representations offer advantages over traditional bag-of-words approaches by encoding semantic relationships that prove valuable for understanding user expressions and behaviors. In stance detection systems analyzing social media content, earlier works focused primarily on word embedding techniques such as Word2Vec for representing text for deep learning classifiers.
  - Citations: Wani et al. (2020)


### Contextualized Embeddings: BERT and Variants

BERT (Bidirectional Encoder Representations from Transformers) introduced a revolutionary approach to language representation by pre-training deep bidirectional representations from unlabeled text, conditioning on both left and right context across all layers. This bidirectional conditioning enables BERT to capture nuanced contextual meanings that prove essential for understanding user-generated content in social computing contexts. The pre-trained BERT model can be fine-tuned with minimal additional architecture to create state-of-the-art models for diverse tasks, including question answering and language inference.
  - Citations: Devlin et al. (2018)

RoBERTa represents a robustly optimized approach to BERT pretraining, with research demonstrating that hyperparameter choices significantly impact final results. This optimization has implications for researchers seeking to apply these models to user characterization tasks, as careful tuning can substantially improve performance. Domain-specific adaptations have also emerged, such as BioBERT, which demonstrates that pre-training on domain-specific corpora can substantially outperform general BERT models in specialized text mining tasks.
  - Citations: Liu et al. (2019), Lee et al. (2019)


### Sentence-Level Embeddings

While BERT and RoBERTa achieved state-of-the-art performance on sentence-pair regression tasks like semantic textual similarity, their architecture presents computational challenges for large-scale user analysis. Finding the most similar pair in a collection of 10,000 sentences requires approximately 50 million inference computations with standard BERT, making it unsuitable for semantic similarity search and unsupervised clustering tasks essential for population segmentation. Sentence-BERT addresses these limitations by producing semantically meaningful independent sentence embeddings suitable for clustering and similarity search,.
  - Citations: Reimers (2019), Liao (2021)

The Universal Sentence Encoder provides sentence embeddings that can be trivially used to compute sentence-level semantic similarity scores, achieving excellent performance on semantic textual similarity benchmarks. These embeddings can be incorporated into larger model graphs for specific tasks and fine-tuned using gradient-based updates. SimCSE advances sentence embedding quality through contrastive learning, with supervised models achieving 81.6% Spearman's correlation on semantic textual similarity tasks. The approach incorporates annotated pairs from natural language inference datasets, using entailment pairs as positives and contradiction pairs as hard negatives.
  - Citations: Cer et al. (2018), Gao et al. (2021)


## Applications in Social Computing and User Analysis


### Social Media Content Analysis and Stance Detection

Semantic embeddings have proven particularly valuable for analyzing social media content and understanding user positions on contentious topics. Research on stance detection during COVID-19 employed sentence embeddings to convert tweet text into vectors, moving beyond word-level representations to capture the fuller semantic content of user expressions. This approach enables a more nuanced understanding of how users position themselves relative to misinformation and public health messaging.
  - Citations: Wani et al. (2020)

Cross-cutting political discussions on social media platforms have been analyzed using Sentence-BERT embeddings, specifically the all-mpnet-base-v2 sentence-transformer model selected for its outstanding performance scores. The embedding results enabled the construction of supervised models using logistic regression and support vector machines to identify cross-cutting comments on YouTube videos from political vloggers and mainstream news outlets. This application demonstrates how sentence embeddings facilitate understanding of political discourse patterns and user engagement behaviors across different content types.
  - Citations: Chae (2024)


### Multi-Modal Content Analysis

Contemporary social computing research increasingly combines textual embeddings with other modalities. Research on automatic misogyny identification extracted sentence and word embeddings using pre-trained fastText models alongside contextual sentence embeddings from BERT. The sentence embeddings were obtained using approaches similar to S-BERT, enabling analysis of both textual and visual content in social media posts. This multi-modal approach reflects the reality that user-generated content often combines text with images, requiring embedding approaches that can capture semantic meaning across modalities.
  - Citations: Garc (2022)


### Mental Health and Well-being Assessment

Semantic embeddings have been applied to detect signs of psychological states from user-generated text. Research on depression detection obtained sentence embeddings from BERT and RoBERTa using the CLS token, with hyperparameter selection conducted across multiple model configurations. Tree of Parzen Estimators guided the selection of optimal configurations for these embedding-based classification systems. This application demonstrates the potential for semantic embeddings to support mental health monitoring through the analysis of user communications.
  - Citations: Garc (2022)

Research examining the impact of psychological constructs on workforce well-being converted text observations into numerical data using pre-trained sentence-transformer models capable of deriving semantically meaningful sentence embeddings. Uniform Manifold Approximation and Projection (UMAP) reduced the dimensionality of these embeddings for clustering applications, enabling the identification of distinct user segments based on their expressed experiences and attitudes.
  - Citations: Khan et al. (2024)


## Methodological Considerations for User Segmentation


### Clustering and Dimensionality Reduction

The application of semantic embeddings to population segmentation requires careful consideration of dimensionality reduction and clustering approaches. Sentence embeddings generated by transformer models can be processed through UMAP to reduce dimensionality and mitigate the impact of high-dimensional distance measures on clustering quality. This preprocessing step proves essential for identifying meaningful user segments from embedding representations.
  - Citations: Khan et al. (2024)

BERTopic represents an approach combining clustering algorithms with vectorial word representations generated by transformer-based models. This strategy leverages embeddings from Sentence-BERT, which generates sentence embeddings in multiple languages using different pre-trained models. The modification of BERT into SBERT enables the generation of semantically meaningful embeddings suitable for topic modeling and user segmentation applications.
  - Citations: Arazzi et al. (2023)


### Semantic Similarity Assessment

Semantic similarity computation forms a core capability enabled by sentence embeddings. Cosine similarity between sentence embeddings of different texts provides a measure of semantic relatedness, with embeddings generated using pre-trained sentence transformer models like All-MiniLM-L6-v2. This capability supports applications ranging from content recommendation to user matching based on expressed interests and preferences.
  - Citations: Liang et al. (2024)

Research has identified that the original BERT model performs poorly for sentence semantic similarity due to static token embedding biases and ineffective BERT layers. PromptBERT addresses these limitations through prompt-based sentence embedding methods that reduce token embedding biases and improve the effectiveness of BERT layers for similarity tasks. These methodological refinements have implications for researchers seeking to apply embeddings to user characterization and matching applications.
  - Citations: Jiang et al. (2022)


### Transfer Learning and Domain Adaptation

The effectiveness of semantic embeddings for user analysis often depends on appropriate domain adaptation. Supervised learning can be leveraged for sentence encoder training, drawing inspiration from computer vision where models are pretrained on ImageNet before transfer. This transfer learning paradigm enables researchers to adapt general-purpose embeddings to specific domains relevant to their user populations.
  - Citations: Conneau et al. (2017)

Multilingual applications benefit from knowledge distillation approaches that extend existing sentence embedding models to new languages. This enables the creation of multilingual versions from previously monolingual models, with training based on the principle that translated sentences should map to the same vector space location as original sentences. Such capabilities prove essential for global user characterization and cross-cultural research.
  - Citations: Reimers (2020)


## Applications in Marketing and Consumer Research


### Demand Estimation and Consumer Preference Analysis

Marketing research has adopted semantic embeddings for understanding consumer preferences and demand patterns. The pre-trained Sentence-BERT model enables the extraction of semantically meaningful sentence embeddings from product descriptions and consumer reviews. This model assesses the context in which words appear in sentences, providing richer representations than word-level approaches for understanding consumer expressions.
  - Citations: Compiani et al. (2023)


### Network and Text Fusion for User Understanding

Social networks with associated text information present opportunities for combined analysis using embedding approaches. In citation networks, each node represents a scientific paper associated with abstracts or titles; in social networks, users serve as nodes with posts as textual attributes. Research has explored how combining text and network embeddings can increase accuracy for downstream tasks, proposing modifications to popular architectures to better capture textual information in network embedding and fusion frameworks. This fusion approach enables more comprehensive user characterization by considering both social connections and expressed content.
  - Citations: Makarov et al. (2021)


## Evaluation and Quality Assessment


### Transcription and Content Quality

Semantic embeddings provide tools for evaluating content quality and transcription accuracy. Sentence transformer embeddings have been employed to measure semantic distance between manual and automatic speech recognition transcriptions, with lower semantic distance indicating lower transcription error. Researchers chose sentence transformers over alternatives like BERT or Word2Vec because off-the-shelf transformer models without fine-tuning often produce representations that perform poorly on semantic similarity tasks.
  - Citations: Min et al. (2021)


### Automated Scoring Systems

Transfer learning with embeddings facilitates the automatic evaluation of user-generated content. Research on clinical language evaluation compared custom word embeddings with pre-trained contextualized embeddings as features for scoring models. Neural machine translation generated synthetic training data to increase diversity for embedding-based scoring systems. These approaches demonstrate how embeddings can support the automated assessment of user communications across various domains.
  - Citations: Wang et al. (2020)


## Challenges and Limitations

Despite their utility, semantic embeddings present several challenges for user characterization research. The computational overhead of BERT-based approaches can be prohibitive for large-scale user analysis, requiring approximately 65 hours to find the most similar pair in 10,000 sentences. This limitation has motivated the development of more efficient approaches like Sentence-BERT that produce independent sentence embeddings suitable for clustering and similarity search.
  - Citations: Reimers (2019)

The poor performance of the original BERT for sentence semantic similarity has been widely discussed, with issues attributed to static token embedding biases and ineffective BERT layers rather than the high cosine similarity of sentence embeddings. Researchers must carefully select and potentially modify embedding approaches to ensure suitability for their specific user characterization tasks.
  - Citations: Jiang et al. (2022)

Alternative approaches like averaging BERT embeddings (A-BERT) may not perform well without fine-tuning steps on pretrained models. Replacing BERT with Sentence-BERT for semantic textual similarity could improve performance due to better sentence embeddings. These considerations highlight the importance of methodological choices in applying embeddings to user analysis.
  - Citations: Yang et al. (2020)


## Conclusion

Semantic embeddings have become indispensable tools for characterizing users, predicting behaviors, and segmenting populations across HCI, marketing, and social computing research. The evolution from word-level representations like Word2Vec and GloVe to contextualized models such as BERT and efficient sentence transformers has enabled increasingly sophisticated analyses of user-generated content. Applications span social media analysis, mental health assessment, consumer research, and multi-modal content understanding. However, researchers must carefully consider computational constraints, domain adaptation requirements, and the specific characteristics of their user populations when selecting and applying embedding approaches. The continued development of more efficient and semantically meaningful embedding methods promises to further expand the possibilities for understanding human behavior through computational analysis of textual expressions.


## References

1. Arazzi, M., Ferretti, M., & Nocera, A. (2023). Semantic Hierarchical Indexing for Online Video Lessons Using Natural Language Processing. *Big Data and Cognitive Computing, 7(2), 107*.
2. Cer, D., Yang, Y., Kong, S., Hua, N., Limtiaco, N., John, R., … & Kurzweil, R. (2018). Universal Sentence Encoder for English.
3. Chae, S. and Lee, S. (2024). Where do cross-cutting discussions happen?: Identifying cross-cutting comments on YouTube videos of political vloggers and mainstream news outlets. *Plos One, 19(5), e0302030*.
4. Compiani, G., Morozov, I., & Seiler, S. (2023). Demand Estimation with Text and Image Data. *SSRN Electronic Journal*.
5. Conneau, A., Kiela, D., Schwenk, H., Barrault, L., & Bordes, A. (2017). Supervised Learning of Universal Sentence Representations from.
6. Natural Language Inference Data.. https://doi.org/10.18653/v1/d17-1070
7. Devlin, J., Chang, M., Lee, K., & Toutanova, K. (2018). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding.
8. Gao, T., Yao, X., & Chen, D. (2021). SimCSE: Simple Contrastive Learning of Sentence Embeddings.
9. Garcí­a-Dí­az, J. and Valencia-Garcı́a, R. (2022). UMUTeam@LT-EDI-ACL2022: Detecting Signs of Depression from text.
10. Garcí­a-Dí­az, J., Caparros-Laiz, C., & Valencia‐García, R. (2022). UMUTeam at SemEval-2022 Task 5: Combining image and textual embeddings for multi-modal automatic misogyny identification., 742-747.
11. Jiang, T., Huang, S., Zhang, Z., Wang, D., Zhuang, F., Wei, F., … & Zhang, Q. (2022). PromptBERT: Improving BERT Sentence Embeddings with Prompts.
12. Khan, U., Kauttonen, J., Henttonen, P., & Määttänen, I. (2024). Understanding the impact of sisu on workforce and well-being: A machine learning-based analysis. *Heliyon, 10(2), e24148*.
13. Lee, J., Yoon, W., Kim, S., Kim, D., Kim, S., So, C., … & Kang, J. (2019). BioBERT: a pre-trained biomedical language representation model for biomedical text mining. *Bioinformatics, 36(4), 1234-1240*.
14. Liang, Y., Zhang, R., Li, Y., Huo, M., Ma, Z., Singh, D., … & Xie, P. (2024). Multi-Modal Large Language Model Enables All-Purpose Prediction of Drug Mechanisms and Properties.
15. Liao, D. (2021). Sentence Embeddings using Supervised Contrastive Learning.
16. Liu, Y., Ott, M., Goyal, N., Du, J., Joshi, M., Chen, D., … & Stoyanov, V. (2019). RoBERTa: A Robustly Optimized BERT Pretraining Approach.
17. Makarov, I., Makarov, M., & Kiselev, D. (2021). Fusion of text and graph information for machine learning problems on networks. *Peerj Computer Science, 7, e526*.
18. Min, D., Pérez-Rosas, V., & Mihalcea, R. (2021). Evaluating Automatic Speech Recognition Quality and Its Impact on Counselor Utterance Coding.
19. Pagliardini, M., Gupta, P., & Jaggi, M. (2018). Unsupervised Learning of Sentence Embeddings Using Compositional n-Gram Features.
20. Penchala, S., Murad, S., Roy, I., Gupta, B., & Rahimi, N. Unveiling Text Mining Potential: A Comparative Analysis of Document Classification Algorithms., 98, 103-89. https://doi.org/10.29007/lsgw
21. Pennington, J., Socher, R., & Manning, C. (2014). Glove: Global Vectors for Word Representation.
22. Reimers, N. and Gurevych, I. (2019). Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks.
23. Reimers, N. and Gurevych, I. (2020). Making Monolingual Sentence Embeddings Multilingual using Knowledge Distillation.
24. Wang, Y., Prud’hommeaux, E., Asgari, M., & Dolata, J. (2020). Automated Scoring of Clinical Expressive Language Evaluation Tasks., 177-185.
25. Wani, M., Agarwal, N., & Bours, P. (2020). Impact of Unreliable Content on Social Media Users during COVID-19 and Stance Detection System. *Electronics, 10(1), 5*.
26. Yang, F., Dragut, E., & Mukherjee, A. (2020). Predicting Personal Opinion on Future Events with Fingerprints.