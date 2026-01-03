---
cluster: 16
query: How should uncertainty be communicated when providing personalized behavioral
  predictions or comparisons? What framing avoids overconfidence?
question_id: Q65
reference_count: 35
source_date: '2026-01-02'
title: Communicating Uncertainty in Personal Inference
---


# Communicating Uncertainty in Personalized Behavioral Predictions: Frameworks for Avoiding Overconfidence


## Introduction

The communication of uncertainty in personalized behavioral predictions represents a critical challenge at the intersection of decision science, machine learning, and human communication. As predictive systems increasingly inform personal decisions—from health behaviors to financial choices—the manner in which uncertainty is conveyed profoundly influences how recipients interpret and act upon such information. Research demonstrates that both human experts and computational models exhibit systematic tendencies toward overconfidence, producing predictions with certainty levels that exceed their actual accuracy,. This overconfidence can lead to "miscalibrated uncertainty assessments" that result in "inaccurate scientific summaries and overconfident decisions that do not incorporate sufficient hedging". The present synthesis examines evidence-based approaches for communicating uncertainty in ways that promote appropriate calibration and avoid the pitfalls of overconfidence.
  - Citations: Vallone et al. (1990), Risbey (2008), Draper (1995)


## The Nature of Overconfidence in Behavioral Predictions


### Sources of Overconfidence in Human Judgment

Overconfidence in behavioral predictions stems from multiple identifiable sources. Vallone et al.demonstrated that overconfidence in predicting future actions can be traced to two primary mechanisms: first, expressions of particularly high confidence rarely prove warranted, with the gap between accuracy and confidence widening as confidence increases; second, predictions that contradict relevant base rates yield very low accuracy despite relatively unattenuated confidence levels. This finding suggests that individuals systematically fail to appropriately weight statistical information when making personalized predictions.
  - Citations: Vallone et al. (1990)

Furthermore, people tend to be overconfident in their existing knowledge, which leads them to "underestimate how much new information may reduce uncertainty, biasing their estimate of its cognitive value". This cognitive bias has profound implications for how uncertainty should be communicated, as recipients may discount uncertainty information that challenges their prior beliefs about predictive accuracy.
  - Citations: Sharot (2020)


### Overconfidence in Computational Prediction Systems

Modern machine learning systems, particularly deep neural networks, exhibit pronounced overconfidence that parallels human cognitive biases. Gawlikowski et al.note that "basic neural networks do not deliver certainty estimates or suffer from over- or under-confidence," presenting a fundamental challenge for their deployment in personalized prediction contexts. This problem is particularly acute because "deep learning models typically lack a representation of uncertainty, and provide overconfident and miscalibrated predictions".
  - Citations: Gawlikowski et al. (2023), Maddox et al. (2019)

The calibration problem in neural networks has been extensively documented. Guo et al.discovered that "modern neural networks, unlike those from a decade ago, are poorly calibrated," with factors including depth, width, weight decay, and batch normalization significantly affecting calibration quality. Similarly, research on medical image analysis reveals that "conventional segmentation pipelines tend to yield overconfident" predictions, while uncertainty quantification research confirms that "a poorly calibrated model could often result in overconfident predictions".
  - Citations: Guo et al. (2017), Gros et al. (2021), Rajaraman et al. (2022)

The consequences of such overconfidence extend beyond mere inaccuracy. In healthcare applications, "managing these uncertainties is not merely an optimization goal but a foundational requirement" because overconfidence can lead to profound consequences from erroneous predictions. Machine learning models that "fail to communicate uncertainty in regions with scarce or no data" produce overconfident predictions that may mislead users.
  - Citations: Wabina et al. (2025), Bashar et al. (2020)


## Frameworks for Communicating Uncertainty


### Prediction Intervals as Uncertainty Communication

One established approach for communicating uncertainty involves the use of prediction intervals rather than point estimates. Ak et al.argue that "Prediction Intervals (PIs) are a simple way to communicate a measure of the uncertainty in the predictions" and are "preferable results of the prediction, rather than point estimates, because they provide information on the confidence in the prediction." This approach transforms abstract uncertainty into concrete ranges that users can more readily interpret.
  - Citations: Ak et al. (2015)

The construction of appropriate prediction intervals requires careful methodological consideration. Khosravi et al.note that "traditional methods for construction of neural network (NN) based PIs suffer from restrictive assumptions about data distribution and massive computational loads," necessitating new approaches that can provide reliable uncertainty bounds without imposing unrealistic assumptions. The width and coverage of prediction intervals serve as graphical representations that "help to identify if a model is overconfident or underconfident in its predictions".
  - Citations: Khosravi et al. (2011), Lu et al. (2023)


### Linguistic and Modal Framing of Uncertainty

The linguistic framing of uncertainty significantly influences how recipients interpret predictions. Juanchich et al.demonstrate that "speakers can communicate the source of their uncertainty by framing their prediction with either a personal mode ('I am uncertain that the team will win') or with an impersonal mode ('It is uncertain that the team will win')." Their research found that such modal distinctions affect how recipients judge predictions, suggesting that the grammatical structure of uncertainty communication carries meaningful information beyond the uncertainty level itself.
  - Citations: Juanchich et al. (2010)

Scientific communication employs "uncertainty cue words" as "a rhetorical device or a communicative technique to convey the degree of uncertainty associated with a statement or an assertion". This linguistic approach acknowledges that uncertainty exists on a spectrum and can be communicated through carefully chosen verbal markers that signal appropriate confidence levels.
  - Citations: Guo et al. (2022)


### The Role of Confidence Expression in Advice Contexts

Research on advice-giving provides crucial insights into uncertainty communication. Gaertig and Simmonsfound that "people do not inherently dislike uncertain advice" and that "advisors benefit from expressing themselves with confidence, but not from communicating false certainty." This nuanced finding suggests that appropriate confidence expression—neither excessive hedging nor unwarranted certainty—optimizes the reception of predictive information.
  - Citations: Gaertig (2018)

The distinction between warranted confidence and false certainty is critical. While confidence can enhance the persuasiveness and utility of predictions, overconfidence undermines trust and decision quality. Swolexamined how advisor confidence and motives affect advice utilization, demonstrating that the interpersonal dynamics of uncertainty communication involve complex interactions between expressed confidence and perceived credibility.
  - Citations: Swol (2009)


## Strategies for Avoiding Overconfidence


### Structured Elicitation Techniques

When predictions derive from expert judgment, structured elicitation techniques can mitigate overconfidence. McBride et al.developed "a four-point question format for eliciting quantities to mitigate the overconfidence effects typically observed in expert estimates of uncertainty." This structured approach forces experts to consider multiple scenarios and explicitly quantify their uncertainty rather than providing single-point estimates.
  - Citations: McBride et al. (2012)

Martin et al.emphasize that expert elicitation in conservation science must address "minimizing bias in the elicited information" through "structured elicitation techniques that, if adopted, will improve the accuracy and information content of expert judgment and ensure uncertainty" is appropriately represented. These techniques include methods for working with multiple experts, combining judgments, and verifying accuracy—all of which help counteract individual overconfidence.
  - Citations: Martin et al. (2012)


### Calibration Methods for Computational Systems

For machine learning-based predictions, calibration techniques offer systematic approaches to aligning predicted confidence with actual accuracy. Guo et al.conducted extensive experiments identifying factors that influence calibration and methods for improvement. Temperature scaling and other post-hoc calibration methods can adjust model outputs to better reflect true uncertainty levels.
  - Citations: Guo et al. (2017)

Bayesian approaches provide principled frameworks for uncertainty quantification. Bieringer et al.note that "in Bayesian neural networks (BNNs) and beyond, calibrating uncertainty quantification is crucial for correct application of the prediction results" because "overconfident predictions will lead" to inappropriate decisions. The Bayesian framework naturally incorporates uncertainty through posterior distributions, though ensuring these distributions are well-calibrated remains challenging.
  - Citations: Bieringer et al. (2024)

Ensemble methods represent another strategy for uncertainty estimation. Abdar et al.describe models utilizing "deep ensemble networks that yielded competitive uncertainty estimation with elevated confidence of prediction interval coverage probability." By aggregating predictions from multiple models, ensemble approaches can capture model uncertainty and provide more reliable confidence estimates.
  - Citations: Abdar et al. (2021)


### Explicit Uncertainty Visualization and Display

The visual presentation of uncertainty significantly affects interpretation. Thompson et al.emphasize that "not displaying information about uncertainty can convey a false confidence in predictions" and that "it is critical that modellers present uncertainty in a way that is understandable and useful for policymakers and the public." This principle applies equally to personalized predictions, where recipients need accessible representations of uncertainty to make informed decisions.
  - Citations: Thompson et al. (2020)

Mackay et al.describe sensitivity analysis as "one way of conveying the potential uncertainty of outcomes to users in an honest and proportionate way." By showing how predictions change under different assumptions, sensitivity analyses help users understand the robustness of predictions and the conditions under which they might fail.
  - Citations: Mackay et al. (2015)


## Domain-Specific Considerations


### Healthcare and Medical Predictions

Healthcare applications demand particularly careful uncertainty communication given the high stakes involved. Seedatargues that "incorporating a human-in-the-loop system when deploying automated decision support is critical in healthcare contexts to create trust, as well as provide reliable performance on a patient-to-patient basis." Deep learning methods, while high-performing, often "do not allow for this patient-centered approach due to the lack of uncertainty representation."
  - Citations: Seedat (2020)

The problem of AI systems generating responses "without citing sources or conveying uncertainty levels" can "foster overconfidence in end-users". This is particularly problematic in healthcare, where the phenomenon of "AI hallucinations"—producing "factually incorrect, misleading, or fabricated information with high confidence"—poses serious risks.
  - Citations: Aslan (2025)

Uncertainty-aware approaches in medical imaging demonstrate practical solutions. Dirks et al.propose that "additional interpretability could be achieved by providing a confidence score along with the segmentation," while Maruccio et al.note that overconfidence in neural networks for medical applications often stems from "overfitting due to the high variable and small-sized dataset which causes the learner to exhibit more confidence in its predictions that do not accurately reflect" true accuracy.
  - Citations: Dirks et al. (2024), Maruccio et al. (2024)


### Policy and Public Communication

When predictions inform policy decisions, uncertainty communication takes on additional dimensions. Chen et al.demonstrate that "knowledge miscalibration on epidemiological uncertainties by policymakers' over- and underconfidence can seriously impact policymaking" and that "ineffective risk communication may lead to conflicting and incoherent information transmission." Public reactions are influenced by policymakers' expressed confidence through mechanisms of public trust.
  - Citations: Chen et al. (2022)

Juston et al.challenge the assumption that "the public and policymakers need, and want, certain (deterministic) predictions," arguing instead for transparent communication of "uncertainties and limitations of scientific knowledge." This perspective suggests that audiences may be more receptive to appropriately hedged predictions than commonly assumed.
  - Citations: Juston et al. (2012)


## Framing Strategies That Promote Appropriate Calibration


### Avoiding Anchoring Effects

Anchoring bias can exacerbate overconfidence by causing individuals to insufficiently adjust from initial estimates. Heywood-Smith et al.describe how anchoring—"the tendency of people to base estimates on any number just seen"—interacts with overconfidence—"the tendency of people to provide too narrow ranges when estimating the range that an uncertain value might fall within." Effective uncertainty communication should avoid providing anchors that might bias interpretation.
  - Citations: Heywood-Smith et al. (2008)


### Task-Based Versus Performance-Based Framing

Clark et al.found that task-based goals were more effective than performance-based goals partly due to "overconfidence and uncertainty about performance." This finding suggests that framing predictions in terms of specific behaviors rather than outcomes may help recipients maintain appropriate uncertainty about results while still providing actionable guidance.
  - Citations: Clark et al. (2016)


### Acknowledging Multiple Sources of Uncertainty

Comprehensive uncertainty communication should distinguish between different uncertainty types. Spencer et al.identify multiple uncertainty categories including "climatic (i.e., uncertainty in the climatic projections from model formulations, alternative greenhouse gas emission scenarios, etc.), algorithmic (i.e., uncertainties in the predictions from statistical SDMs), and biotic (uncertainties in assumptions of the biology)." Similarly, Zhang et al.distinguish between "aleatoric uncertainty, due to the inherent and irreducible uncertainty of the input data, and epistemic uncertainty due to various deep learning model limitations."
  - Citations: Spencer et al. (2019), Zhang et al. (2023)

By explicitly communicating these distinct uncertainty sources, predictions can help recipients understand which aspects of uncertainty might be reducible through additional information and which represent fundamental limitations.


## Practical Recommendations


### For Prediction System Designers

Implement calibration assessment: Regularly evaluate whether expressed confidence levels match empirical accuracy rates, using calibration curves and reliability diagrams.
  - Citations: Lu et al. (2023)

Provide prediction intervals: Rather than point estimates alone, communicate ranges that capture uncertainty, ensuring interval coverage matches stated confidence levels,.
  - Citations: Ak et al. (2015), Khosravi et al. (2011)

Use ensemble or Bayesian methods: These approaches naturally quantify uncertainty and can reduce overconfidence compared to single-model predictions,.
  - Citations: Abdar et al. (2021), Maddox et al. (2019)

Acknowledge out-of-distribution limitations: Systems should "refrain from confidently predicting when faced with categories of inputs different from those seen during training", explicitly flagging when predictions may be unreliable.
  - Citations: Thulasidasan et al. (2021)


### For Communication of Predictions

Express uncertainty linguistically: Use appropriate hedging language and modal expressions that signal uncertainty levels,.
  - Citations: Juanchich et al. (2010), Guo et al. (2022)

Avoid false certainty while maintaining appropriate confidence: Recipients benefit from confident expression but are harmed by unwarranted certainty.
  - Citations: Gaertig (2018)

Visualize uncertainty explicitly: Present uncertainty information graphically in accessible formats,.
  - Citations: Thompson et al. (2020), Mackay et al. (2015)

Distinguish uncertainty sources: Help recipients understand whether uncertainty stems from data limitations, model limitations, or inherent unpredictability,.
  - Citations: Spencer et al. (2019), Zhang et al. (2023)


### For Recipients of Predictions

Recognize that high confidence often exceeds accuracy: The gap between confidence and accuracy typically widens at higher confidence levels.
  - Citations: Vallone et al. (1990)

Consider base rates: Predictions that deviate substantially from base rates warrant additional skepticism.
  - Citations: Vallone et al. (1990)

Seek multiple perspectives: Aggregating across multiple sources can provide more reliable uncertainty estimates than single predictions.
  - Citations: Martin et al. (2012)


## Conclusion

Effective communication of uncertainty in personalized behavioral predictions requires systematic attention to both the technical calibration of prediction systems and the linguistic and visual framing of uncertainty information. The evidence reviewed demonstrates that overconfidence pervades both human judgment and computational prediction systems, creating systematic risks of miscalibrated decision-making,,. However, established techniques—including structured elicitation,, prediction intervals,, Bayesian methods,, and careful linguistic framing,—can substantially improve uncertainty communication.
  - Citations: Vallone et al. (1990), Guo et al. (2017), Gawlikowski et al. (2023), McBride et al. (2012), Martin et al. (2012), Ak et al. (2015), Khosravi et al. (2011), Bieringer et al. (2024), Maddox et al. (2019), Juanchich et al. (2010), Gaertig (2018)

The key principle emerging from this synthesis is that uncertainty should be communicated explicitly, accessibly, and proportionately. Failing to display uncertainty information "can convey a false confidence in predictions", while excessive hedging may undermine the utility of predictions. The optimal approach expresses appropriate confidence without false certainty, provides concrete uncertainty representations such as prediction intervals, and acknowledges the multiple sources and types of uncertainty that affect predictions,. By implementing these evidence-based strategies, personalized behavioral predictions can better serve their intended purpose of informing decisions while maintaining appropriate epistemic humility.
  - Citations: Thompson et al. (2020), Gaertig (2018), Ak et al. (2015), Spencer et al. (2019), Zhang et al. (2023)


## References

1. Abdar, M., Pourpanah, F., Hussain, S., Rezazadegan, D., Liu, L., Ghavamzadeh, M., … & Nahavandi, S. (2021). A review of uncertainty quantification in deep learning: Techniques, applications and challenges. *Information Fusion, 76, 243-297*.
2. Ak, R., Vitelli, V., & Zio, E. (2015). An Interval-Valued Neural Network Approach for Uncertainty Quantification in Short-Term Wind Speed Prediction. *Ieee Transactions on Neural Networks and Learning Systems, 26(11), 2787-2800*.
3. Aslan, M. (2025). Benchmarking AI Chatbots for Maternal Lactation Support: A Cross-Platform Evaluation of Quality, Readability, and Clinical Accuracy. *Healthcare, 13(14), 1756*.
4. Bashar, M., Kieren, A., Kerina, H., & Nayak, R. (2020). Propensity-to-Pay: Machine Learning for Estimating Prediction Uncertainty.
5. Bieringer, S., Diefenbacher, S., Kasieczka, G., & Trabs, M. (2024). Calibrating Bayesian generative machine learning for Bayesiamplification. *Machine Learning Science and Technology, 5(4), 045044*.
6. Chen, X., Dong, Y., & Wu, M. (2022). Medical capacity investment for epidemic disease: The effects of policymaker's confidence and public trust. *Risk Analysis, 43(6), 1187-1211*.
7. Clark, D., Gill, D., Prowse, V., & Rush, M. (2016). Using Goals to Motivate College Students: Theory and Evidence from Field Experiments. *SSRN Electronic Journal*.
8. Dirks, I., Keyaerts, M., Neyns, B., & Vandemeulebroucke, J. (2024). An interpretable deep learning approach for lesion detection and segmentation on whole-body [18F]FDG PET/CT., 40.
9. Draper, D. (1995). Assessment and Propagation of Model Uncertainty. *Journal of the Royal Statistical Society Series B Statistical Methodology, 57(1), 45-70*.
10. Gaertig, C. and Simmons, J. (2018). Do People Inherently Dislike Uncertain Advice?. *Psychological Science, 29(4), 504-520*.
11. Gawlikowski, J., Tassi, C., Ali, M., Lee, J., Humt, M., Feng, J., … & Zhu, X. (2023). A survey of uncertainty in deep neural networks. *Artificial Intelligence Review, 56(S1), 1513-1589*.
12. Gros, C., Lemay, A., & Cohen‐Adad, J. (2021). SoftSeg: Advantages of soft versus binary training for image segmentation. *Medical Image Analysis, 71, 102038*.
13. Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. (2017). On Calibration of Modern Neural Networks.
14. Guo, X., Chen, Y., Du, J., & Dong, E. (2022). Extracting and Measuring Uncertain Biomedical Knowledge from Scientific Statements. *Journal of Data and Information Science, 7(2), 6-30*.
15. Heywood-Smith, A., Welsh, M., & Begg, S. (2008). Cognitive Errors in Estimation: Does Anchoring Cause Overconfidence?.
16. Juanchich, M., Teigen, K., & Gourdon-Kanhukamwe, A. (2010). Variants of verbal uncertainty.
17. Juston, J., Kauffeldt, A., Montano, B., Seibert, J., Beven, K., & Westerberg, I. (2012). Smiling in the rain: Seven reasons to be positive about uncertainty in hydrological modelling. *Hydrological Processes, 27(7), 1117-1122*.
18. Khosravi, A., Nahavandi, S., Creighton, D., & Atiya, A. (2011). Lower Upper Bound Estimation Method for Construction of Neural Network-Based Prediction Intervals. *Ieee Transactions on Neural Networks, 22(3), 337-346*.
19. Lu, X., Vienna, J., & Du, J. (2023). Glass formulation and composition optimization with property models: A review. *Journal of the American Ceramic Society, 107(3), 1603-1624*.
20. Mackay, E., Wilkinson, M., Macleod, C., Beven, K., Percy, B., Macklin, M., … & Haygarth, P. (2015). Digital catchment observatories: A platform for engagement and knowledge exchange between catchment scientists, policy makers, and local communities. *Water Resources Research, 51(6), 4815-4822*.
21. Maddox, W., Izmailov, P., Garipov, T., Vetrov, D., & Wilson, A. (2019). A Simple Baseline for Bayesian Uncertainty in Deep Learning.
22. Martin, T., Burgman, M., Fidler, F., Kuhnert, P., Low‐Choy, S., McBride, M., … & Mengersen, K. (2012). Eliciting Expert Knowledge in Conservation Science. *Conservation Biology, 26(1), 29-38*.
23. Maruccio, F., Eppinga, W., Laves, M., Navarro, R., Salvi, M., Molinari, F., … & Papaconstadopoulos, P. (2024). Clinical assessment of deep learning-based uncertainty maps in lung cancer segmentation. *Physics in Medicine and Biology, 69(3), 035007*.
24. McBride, M., Garnett, S., Szabo, J., Burbidge, A., Butchart, S., Christidis, L., … & Burgman, M. (2012). Structured elicitation of expert judgments for threatened species assessment: a case study on a continental scale using email. *Methods in Ecology and Evolution, 3(5), 906-920*.
25. Rajaraman, S., Zamzmi, G., Yang, F., Xue, Z., Jaeger, S., & Antani, S. (2022). Uncertainty Quantification in Segmenting Tuberculosis-Consistent Findings in Frontal Chest X-rays. *Biomedicines, 10(6), 1323*.
26. Risbey, J. (2008). The new climate discourse: Alarmist or alarming?. *Global Environmental Change, 18(1), 26-37*.
27. Seedat, N. (2020). MCU-Net: A framework towards uncertainty representations for decision support system patient referrals in healthcare contexts.
28. Sharot, T. and Sunstein, C. (2020). How people decide what they want to know. *Nature Human Behaviour, 4(1), 14-19*.
29. Spencer, P., Hollowed, A., Sigler, M., Hermann, A., & Nelson, M. (2019). Trait‐based climate vulnerability assessments in data‐rich systems: An application to eastern Bering Sea fish and invertebrate stocks. *Global Change Biology, 25(11), 3954-3971*.
30. Swol, L. (2009). The Effects of Confidence and Advisor Motives on Advice Utilization. *Communication Research, 36(6), 857-873*.
31. Thompson, R., Hollingsworth, T., Isham, V., Arribas‐Bel, D., Ashby, B., Britton, T., … & Restif, O. (2020). Key questions for modelling COVID-19 exit strategies. *Proceedings of the Royal Society B Biological Sciences, 287(1932)*.
32. Thulasidasan, S., Thapa, S., Dhaubhadel, S., Chennupati, G., Bhattacharya, T., & Bilmes, J. (2021). An Effective Baseline for Robustness to Distributional Shift.
33. Vallone, R., Griffin, D., Lin, S., & Ross, L. (1990). Overconfident prediction of future actions and outcomes by self and others.. *Journal of Personality and Social Psychology, 58(4), 582-592*.
34. Wabina, R., Saowaprut, P., Yang, J., & Pitos, C. (2025). Stochastic Differential Equation Approach as Uncertainty‐Aware Feature Recalibration Module in Image Classification. *International Journal of Imaging Systems and Technology, 35(4)*.
35. Zhang, T., Wang, S., Bouaynaya, N., Călinescu, R., & Mihaylova, L. (2023). Out-of-distribution Object Detection through Bayesian Uncertainty Estimation., 1-8.