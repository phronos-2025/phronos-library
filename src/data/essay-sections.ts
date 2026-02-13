export interface Citation {
  authors: string;
  year: string;
  title: string;
  publication: string;
  doi?: string;
  citationCount?: number;
}

/** One entry in a section's visual legend */
export interface LegendItem {
  /** Type of miniature rendering: 'particle' = filled circle, 'halo-particle' = particle with pulsing halo,
   *  'bond' = line between two dots, 'grid' = small grid icon, 'convexity' = grid bump,
   *  'entity' = translucent sphere, 'floor' = row of dots */
  icon: 'particle' | 'halo-particle' | 'bond' | 'grid' | 'convexity' | 'entity' | 'floor';
  /** CSS color string for the icon (matches canvas palette) */
  color: string;
  /** Optional second color (e.g. for bonds connecting two particle colors) */
  color2?: string;
  /** Short label displayed next to the icon */
  label: string;
}

export interface EssaySection {
  number: number;
  numeral: string;
  title: string;
  subtitle: string;
  coreThought: string;
  deepDive: string;
  citations: Citation[];
  visualState: string;
  /** Visual elements first introduced in this section */
  legend?: LegendItem[];
}

export const essayMeta = {
  title: "Creativity in the Age of Generative AI",
  subtitle: "An Illustrative Review of Divergent Thought",
  description:
    "An illustrative review of how generative AI reshapes the cognitive pathways of human creativity, supported by empirical research across psychology, cognitive science, and organizational behavior.",
  author: "Phronos",
  datePublished: "2026-02-11",
  dateModified: "2026-02-12",
};

export const essaySections: EssaySection[] = [
  // ── I. Genesis ──────────────────────────────────────────────
  {
    number: 1,
    numeral: "I",
    title: "Genesis",
    subtitle: "The Primordial Soup of Thought",
    visualState: "genesis",
    legend: [
      { icon: 'particle', color: 'rgba(255, 255, 255, 0.8)', label: 'Thought' },
    ],
    coreThought: `<p>Nascent in the dark matter of one's mind, a solitary thought lies impotent. The atomic units of thought are types of information &mdash; sensations, sounds, images, words &mdash; and, when multiple units begin to associate, a creative thought is born. When the atomic units are words (or "tokens" in machine speak), their emergence is due, in part, to the background, where invisible gravitational forces, like personality, shape the likelihood of creativity itself. The survival of a creative thought in one's mind follows a Darwinian logic of variation and retention: new ideas are generated through the attraction of distant concepts, and then selected through evaluation. Further afield, the survival of a creative thought <strong>outside of</strong> one's mind - in the form of, say, a published or produced piece of work - depends entirely on the precise level of pressure in one's environment. Too little, and an idea may fail to coalesce; too much, and innovation will be suffocated. The conditions that allow this process to flourish, and the conditions that quietly erode it, are the subject of this essay.</p>`,
    deepDive: ``,
    citations: [],
  },

  // ── II. The Measure of a Thought ───────────────────────────
  {
    number: 2,
    numeral: "II",
    title: "The Measure of a Thought",
    subtitle: "Divergent Associations",
    visualState: "measure",
    legend: [
      { icon: 'halo-particle', color: 'rgba(255, 245, 200, 0.8)', label: 'Constraint' },
      { icon: 'bond', color: 'rgba(255, 255, 255, 0.4)', color2: 'rgba(255, 255, 255, 0.4)', label: 'Association' },
    ],
    coreThought: `<p>If we learn to observe our thoughts, we might notice that they have a form: sometimes they appear as visions or sounds, and at other times as symbols or words. The linguistic shaping of thought affords scientists tools to measure creativity - surveys, interviews, journaling - and a salient concept unifying semantic creativity has emerged: our ability to produce sets of different words provides a measure of divergent thinking. The Divergent Associations Task demonstrates that naming words as far apart from each other as possible is a strong indicator of creative thought. In fact, this characteristic of creativity spans domains - visual and musical artists have been found to produce greater semantic divergence - and is associated not only with thought, but with creative achievement, as well. The essence of semantic divergence lies in calculating the "difference" between words. While this calculation was previously a highly subjective task, the recent advent of embedding models - compressed statistical representations of large text corpora - have provided an efficient, objective alternative. A test of divergence is a slight misnomer, for arriving at a set of highly diverse words requires converging. Convergent thinking involves evaluating an existing set of constraints and identifying common patterns amongst them, and this happens before and after searching for differences. This dual-process rhythm of expansion and evaluation, far from passive free association, depends on executive function, an actively managed cognitive capacity that strengthens with use and weakens with neglect. Constraints play an important role in both bounding our search space, but also in stimulating us searcher harder.</p>`,
    deepDive: `<p>The strength of divergent thinking as a predictor of real-world creative capacity is not an artifact of measurement convenience. Divergent thinking is defined as the process of generating a variety of solutions where responses are considered creative if they are both novel and appropriate (Gerwig et al., 2021); creative thinking is widely assessed with tests of divergent thinking, particularly the Alternative Uses Task, which has shown consistent evidence of validity with moderate to large correlations between performance and real-world creative achievement in the arts and sciences (Beaty et al., 2021). The Divergent Association Task also has strong validity correlations with the Alternative Uses Task and the Bridge-the-Associative-Gap Task (Olson et al., 2021). Originality &mdash; assessed either by subjective ratings or computational measures &mdash; is the strongest predictor of real-world creative achievements, including scientific innovation, artistic production, and entrepreneurial success, outperforming fluency, flexibility, and elaboration as predictive dimensions (Skurnik et al., 2025).</p>
<p>Creative thinking involves two components &mdash; generation of novelty via divergent thinking, and evaluation of that novelty via convergent thinking. Without the convergent phase, divergent production yields output that may be novel, but not useful - surprising yet not meaningful (Cropley, 2006). Standard creativity measures inherently require both divergent and convergent thinking, and individual differences in creativity reflect variation in both capacities, not divergence alone (Cortes et al., 2019). The cycle is iterative: diverge to generate candidates, converge to evaluate the set and identify patterns, then diverge again from the new position &mdash; a rhythm that is not passive free association but an actively managed cognitive operation.</p>
<p>The engine driving this dual-process rhythm is executive function. Executive shifting &mdash; one of the three core executive functions alongside inhibition and updating &mdash; predicts successful performance on the Alternative Uses Task, establishing that divergent thinking requires strategic category switching rather than undirected semantic wandering (Nusbaum &amp; Silvia, 2011). A network science approach extends this finding, showing that both semantic memory structure and executive control contribute to creative thought as complementary rather than redundant pathways; broad retrieval ability and fluid intelligence each independently predict divergent thinking, with the former reflecting the richness of the associative substrate and the latter reflecting the efficiency of the search process that traverses it (Benedek et al., 2017). The implication for what follows in this essay is direct: if the convergent-evaluation phase depends on executive function, and executive function is use-dependent &mdash; strengthened by exercise, weakened by neglect &mdash; then the habitual offloading of this phase to an external agent may quietly erode the very cognitive machinery that makes creative search productive.</p>`,
    citations: [
      {
        authors: "Olson, J. A. et al.",
        year: "2021",
        title: "Naming unrelated words predicts creativity",
        publication: "Proceedings of the National Academy of Sciences",
        doi: "10.1073/pnas.2022340118",
        citationCount: 138,
      },
      {
        authors: "Beaty, R. E. et al.",
        year: "2021",
        title:
          "Automating creativity assessment with SemDis: An open platform for computing semantic distance",
        publication: "Behavior Research Methods",
        doi: "10.3758/s13428-020-01453-w",
        citationCount: 247,
      },
      {
        authors: "Gerwig, T. et al.",
        year: "2021",
        title:
          "The Relationship between Intelligence and Divergent Thinking\u2014A Meta-Analytic Update",
        publication: "Journal of Intelligence",
        doi: "10.3390/jintelligence9020023",
        citationCount: 84,
      },
      {
        authors: "Skurnik, H. et al.",
        year: "2025",
        title: "Semantic memory and creative evaluation",
        publication: "BMC Psychology",
        doi: "10.1186/s40359-025-03124-x",
        citationCount: 1,
      },
      {
        authors: "Cropley, A.",
        year: "2006",
        title: "In Praise of Convergent Thinking",
        publication: "Creativity Research Journal",
        doi: "10.1207/s15326934crj1803_13",
        citationCount: 706,
      },
      {
        authors: "Cortes, R. A. et al.",
        year: "2019",
        title:
          "Re-examining prominent measures of divergent and convergent creativity",
        publication: "Current Opinion in Behavioral Sciences",
        doi: "10.1016/j.cobeha.2018.09.017",
        citationCount: 90,
      },
      {
        authors: "Nusbaum, E. C. et al.",
        year: "2011",
        title:
          "Are intelligence and creativity really so different? Fluid intelligence, executive processes, and strategy use in divergent thinking",
        publication: "Intelligence",
        doi: "10.1016/j.intell.2010.11.002",
        citationCount: 440,
      },
      {
        authors: "Benedek, M. et al.",
        year: "2017",
        title:
          "How semantic memory structure and intelligence contribute to creative thought: a network science approach",
        publication: "Thinking & Reasoning",
        doi: "10.1080/13546783.2016.1278034",
        citationCount: 198,
      },
    ],
  },

  // ── III. The Dark Matter ───────────────────────────────────
  {
    number: 3,
    numeral: "III",
    title: "The Dark Matter",
    subtitle: "Intrinsic Factors",
    visualState: "darkMatter",
    legend: [
      { icon: 'grid', color: 'rgba(210, 170, 50, 0.5)', label: 'Intrinsic factors' },
      { icon: 'convexity', color: 'rgba(210, 170, 50, 0.5)', label: 'Personality' },
    ],
    coreThought: `<p>The dual-process rhythm of divergence and convergence is shaped by intrinsic forces &mdash; the dark matter of one's mind &mdash; that predispose creative capacity. Five prerequisites feed the generative process: personality, motivation, sufficient material (breadth), domain expertise (depth), and unexpected connections ("creative skills"). Among the intrinsic factors that predispose divergent association, openness to experience is the personality trait most strongly correlated with creative capacity, yet the same loose associative processing that allows creative individuals to discover novel patterns also predispose us to finding meaning in unrelated experiences. This may explain, in part, why human's metacognitive estimation of their own work is unreliable: more creative individuals tend to underestimate the novelty of their work, while less creative individuals overestimate their own novelty. It is hypopthesized that more creative individuals underestimate their creativity because it required relatively less effort for them to develop the solution, indicating that we associate our effort - not our output - with feeling creative.</p>`,
    deepDive: `<p>The prerequisites synthesized in this essay &mdash; motivation, sufficient material, depth of domain understanding, and unexpected connections &mdash; represent a reorganization of constructs from Amabile, Csikszentmihalyi (1988), and Simonton into a sequence ordered by their role in the generative process: intrinsic motivation and creative skills (Amabile), the field and domain as resource environments (Csikszentmihalyi), and depth of expertise as the substrate for both generation and evaluation (Simonton).</p>
<p>While personality was not systematically measured in many of the field's frameworks, the evidence is overwhelming that personality plays a predisposing role in creative thought and creative achievement. The personality trait most consistently implicated in creative capacity is Openness to Experience, a Big Five dimension whose most central markers include "imaginative," "creative," and "original" (DeYoung, 2015). The neurocognitive mechanism underlying this trait suggests it is a structural feature of associative processing: highly creative persons exhibit defocused attention and reduced latent inhibition, attending to stimuli that domain expertise would typically filter as irrelevant, because surprising ideas emerge precisely when something deemed irrelevant turns out to be highly relevant (Simonton, 2012). The neural substrate for this process involves the default mode network &mdash; medial prefrontal cortex, posterior cingulate, and lateral temporal regions &mdash; which collectively activates during memory retrieval, imagination, and mind wandering (Beaty et al., 2023). The evidence strongly suggests that one's Openness to Experience, a part of our innate personality, underlies many of the features observed in creative individuals.</p>
<p>The same loose associative processing that generates creative connections also generates false ones: magical ideation, schizotypy, apophenia (finding meaning in coincidences) and paranormal beliefs are all more prevalent in individuals that have a high Openness to Experience (Rominger et al., 2022), yet these individuals also produce a greater number of unusual words and show less inhibited spreading activation in semantic priming tasks (Mohr et al., 2001). Thus, the evidence suggests that both creative and delusional pattern detection may share a common cognitive mechanism, with the balance between the two poles mediated by the brain's executive functioning.</p>
<p>Our evaluative filter is itself unreliable. Our self-evaluation influences our creative output, moderated by our perceived capacity for improvement (Silvia &amp; Phillips, 2004). People tend to underestimate the creativity of their ideas, with the most creative individuals showing the most pronounced underestimation (Kaufman &amp; Beghetto, 2013). The mechanism appears to involve what has been called the <strong>fluency heuristic</strong> &mdash; in richly connected semantic networks, novel associations are retrieved with relative ease, and this ease of retrieval is mistaken for ordinariness; the creator judges the idea as unremarkable precisely because it arrived without the subjective experience of effort. Conversely, less creative individuals, whose sparser networks require more laborious traversal to produce even moderately novel associations, experience the process as difficult and interpret that difficulty as evidence of originality. The accuracy of our confidence judgments varies systematically with task characteristics and individual differences: metacognitive calibration errors are the norm rather than the exception (Steyvers et al., 2025).</p>
<p>The introduction of generative AI into this already-miscalibrated system produces a compounding effect. While AI can improve task performance, it simultaneously degrades the accuracy of self-assessment; higher AI literacy is paradoxically associated with less accurate self-evaluation, suggesting that fluency with the tool breeds a false sense of evaluative competence (Fernandes et al., 2026). When combined with the baseline creative self-evaluation asymmetry &mdash; creative individuals undervaluing their own output, less creative individuals overvaluing theirs &mdash; the prediction compounds: when creative individuals who already undervalue their ideas encounter AI output, they tend to accept the superficially superior appearance at face value, and the deferral is experienced not as capitulation but as good judgment (Skurnik et al., 2025; Vicente &amp; Matute, 2023).</p>`,
    citations: [
      {
        authors: "DeYoung, C. G.",
        year: "2015",
        title:
          "Openness/intellect: A dimension of personality reflecting cognitive exploration",
        publication: "APA Handbook of Personality and Social Psychology",
        doi: "10.1037/14343-017",
        citationCount: 281,
      },
      {
        authors: "Simonton, D. K.",
        year: "2012",
        title:
          "Taking the U.S. Patent Office Criteria Seriously: A Quantitative Three-Criterion Creativity Definition and Its Implications",
        publication: "Creativity Research Journal",
        doi: "10.1080/10400419.2012.676974",
        citationCount: 293,
      },
      {
        authors: "Beaty, R. E. et al.",
        year: "2023",
        title: "Associative thinking at the core of creativity",
        publication: "Trends in Cognitive Sciences",
        doi: "10.1016/j.tics.2023.04.004",
        citationCount: 154,
      },
      {
        authors: "Mohr, C. et al.",
        year: "2001",
        title: "Loose but Normal: A Semantic Association Study",
        publication: "Journal of Psycholinguistic Research",
        doi: "10.1023/A:1010461429079",
        citationCount: 110,
      },
      {
        authors: "Rominger, C. et al.",
        year: "2022",
        title:
          "Creative, yet not unique? Paranormal belief, but not self-rated creative ideation behavior is associated with a higher propensity to perceive unique meanings in randomness",
        publication: "Heliyon",
        doi: "10.1016/j.heliyon.2022.e09269",
        citationCount: 7,
      },
      {
        authors: "Silvia, P. J. & Phillips, A. G.",
        year: "2004",
        title: "Self-Awareness, Self-Evaluation, and Creativity",
        publication: "Personality and Social Psychology Bulletin",
        doi: "10.1177/0146167204264073",
        citationCount: 250,
      },
      {
        authors: "Kaufman, J. C. & Beghetto, R. A.",
        year: "2013",
        title:
          "Creative metacognition and self-ratings of creative performance: A 4-C perspective",
        publication: "Learning and Individual Differences",
        doi: "10.1016/j.lindif.2013.01.011",
        citationCount: 220,
      },
      {
        authors: "Steyvers, M. et al.",
        year: "2025",
        title:
          "Metacognition and Uncertainty Communication in Humans and Large Language Models",
        publication: "Current Directions in Psychological Science",
        doi: "10.1177/09637214251391158",
        citationCount: 0,
      },
      {
        authors: "Fernandes, P. et al.",
        year: "2026",
        title:
          "AI makes you smarter but none the wiser: The disconnect between performance and metacognition",
        publication: "Computers in Human Behavior",
        doi: "10.1016/j.chb.2025.108779",
        citationCount: 7,
      },
      {
        authors: "Skurnik, H. et al.",
        year: "2025",
        title: "Semantic memory and creative evaluation",
        publication: "BMC Psychology",
        doi: "10.1186/s40359-025-03124-x",
        citationCount: 1,
      },
      {
        authors: "Vicente, L. & Matute, H.",
        year: "2023",
        title: "Humans inherit artificial intelligence biases",
        publication: "Scientific Reports",
        doi: "10.1038/s41598-023-42384-8",
        citationCount: 120,
      },
    ],
  },

  // ── IV. The Constraints That Create ────────────────────────
  {
    number: 4,
    numeral: "IV",
    title: "The Constraints That Create",
    subtitle: "Extrinsic Factors",
    visualState: "constraints",
    legend: [
      { icon: 'particle', color: 'rgba(220, 140, 140, 0.8)', label: 'Extrinsic constraint' },
    ],
    coreThought: `<p>Rarely is creative thought free from constraint, and the most divergent thoughts, paradoxically, arise under imposed constraints &mdash; specifically semantic constraints of knowledge, of what exists and what is known, within which the creative mind can discover and define the unknown. Environmental constraints, like time pressure or budgetary pressure, can have both positive and negative effects on creativity, with too little pressure leaving the search space unbounded and too much pressure culling good ideas too soon. Generative AI finds its foothold here, as it is a tool in our external environment deployed under production conditions &mdash; producing work faster, aligned with the constraints of the task, yet measurably less divergent than human responses. This homogenization is detectable in short-form output, yet increasingly difficult to notice as documents grow longer, where prior paragraphs, established tone, and structural logic recursively impose additional constraints that require engaging more memory and executive functioning to understand.</p>`,
    deepDive: `<p>The paradox of constraint has deep empirical roots. From Picasso's self-imposed color restrictions to Stravinsky's tonal constraints, creative breakthroughs emerge not from the removal of boundaries but from their deliberate imposition (Stokes, 2005). The mechanism eliminates large regions of the solution space and forcing the creator to explore unfamiliar territory within the remaining space. Convergent constraints in creative tasks channel search processes productively &mdash; the walls of the maze are what make navigation generative rather than random (Cortes et al., 2019). The double edge appears when the constraints shift from semantic to environmental: an analysis of over 9,000 daily diary entries from knowledge workers finds that high time pressure without focused protection consistently suppresses creative thinking, a finding that held even when workers themselves believed they were being more creative under pressure (Amabile et al., 2002). The relationship is curvilinear: moderate time pressure can enhance creativity when individuals possess high openness to experience and receive supportive supervision, yet the relationship inverts beyond a threshold; the boundary conditions are precise and context-dependent, not amenable to the blanket intensification that AI-augmented production workflows tend to impose (Baer &amp; Oldham, 2006).</p>
<p>The Darwinian logic of variation and retention &mdash; the framework positing creativity as the generation of novel associations followed by the selective retention of the most promising ones &mdash; has been formalized across independent research traditions. The dynamic componential model decomposes the creative process into stages with distinct cognitive dependencies: idea generation draws upon creativity-relevant processes and intrinsic motivation, while idea validation requires domain-specific skills for checking nascent associations against established criteria, and the number and novelty of ideas generated increases with stronger intrinsic motivation and more developed creative thinking skills (Amabile et al., 2016). The evaluative dimension finds an unexpected institutional parallel in the U.S. Patent Office's three requirements &mdash; novelty, usefulness, and non-obviousness &mdash; where non-obviousness corresponds to the surprise criterion in psychological definitions of creativity, a correspondence that emerged through entirely independent institutional reasoning and that underscores the robustness of the variation-retention framework across domains (Simonton, 2012).</p>
<p>Generative AI finds its foothold in the gap between these two constraint types. AI is overwhelmingly deployed under production conditions &mdash; consultants used it to produce work 40% faster &mdash; and this deployment pattern determines whether AI enhances or degrades output quality (Dell'Acqua et al., 2023). The downstream consequence is measurable: among AI-adopting artists, creative productivity and artwork value significantly increased while novelty in both conceptual and visual features decreased over time, establishing that production-oriented deployment of AI systematically favors constraint satisfaction over divergent exploration (Zhou et al., 2024). The pattern is consistent: when AI is used to satisfy existing constraints more efficiently, it succeeds; when the task requires generating genuinely novel associations that violate or transcend those constraints, the architecture's bias toward statistical central tendency becomes a liability. Empirical comparisons of LLM-generated and human-generated free association networks confirm this: LLM semantic networks cluster more tightly around high-frequency connections, exhibiting less variance and fewer remote associations than those derived from human participants (Abramski et al., 2025) &mdash; a structural deficit that the user, operating under the very time pressure that AI was deployed to relieve, is poorly positioned to detect.</p>
<p>The detectability varies inversely with the scale of the output. The transformer architecture of LLM's &mdash; predicting a held-out token based on preceding tokens, with each generated token conditioning the probability distribution of subsequent tokens &mdash; progressively narrows the viable output space by design (Mahowald et al., 2024). Textual cohesion &mdash; the overlap of lexical and semantic content within a text &mdash; operates at multiple levels: lexical repetition, reference chains, and thematic continuity, to name a few (Skalicky et al., 2017). As documents grow longer, these legitimate cohesion constraints compound with the architectural constraints of next-token prediction, making AI's convergent bias increasingly indistinguishable from the coherence demands of the document itself. In a haiku, the constraint space is small and divergence is immediately visible. In a ten-page report, each paragraph constrains the next through prior framing, established argument, and evidence selection: when insufficient attention is dedicated to the task, we tend to accept the output as "correct" because it satisfies every "local" constraint, and our memory fails to detect the "global" omissions that would signal genuine novelty (Cai et al., 2024).</p>`,
    citations: [
      {
        authors: "Stokes, P. D.",
        year: "2005",
        title: "Creativity from Constraints: The Psychology of Breakthrough",
        publication: "Springer",
        citationCount: 350,
      },
      {
        authors: "Cortes, R. A. et al.",
        year: "2019",
        title:
          "Re-examining prominent measures of divergent and convergent creativity",
        publication: "Current Opinion in Behavioral Sciences",
        doi: "10.1016/j.cobeha.2018.09.017",
        citationCount: 90,
      },
      {
        authors: "Amabile, T. M., Hadley, C. N., & Kramer, S. J.",
        year: "2002",
        title: "Creativity under the gun",
        publication: "Harvard Business Review, 80(8), 52\u201361",
        citationCount: 567,
      },
      {
        authors: "Baer, M. & Oldham, G. R.",
        year: "2006",
        title:
          "The curvilinear relation between experienced creative time pressure and creativity",
        publication: "Journal of Applied Psychology, 91(4), 963\u2013970",
        doi: "10.1037/0021-9010.91.4.963",
        citationCount: 944,
      },
      {
        authors: "Amabile, T. M. et al.",
        year: "2016",
        title:
          "The dynamic componential model of creativity and innovation in organizations: Making progress, making meaning",
        publication: "Research in Organizational Behavior",
        doi: "10.1016/j.riob.2016.10.001",
        citationCount: 1330,
      },
      {
        authors: "Simonton, D. K.",
        year: "2012",
        title:
          "Taking the U.S. Patent Office Criteria Seriously: A Quantitative Three-Criterion Creativity Definition and Its Implications",
        publication: "Creativity Research Journal",
        doi: "10.1080/10400419.2012.676974",
        citationCount: 293,
      },
      {
        authors: "Dell\u2019Acqua, F. et al.",
        year: "2023",
        title: "Navigating the Jagged Technological Frontier",
        publication: "HBS Working Paper No. 24-013",
        doi: "10.2139/ssrn.4573321",
        citationCount: 505,
      },
      {
        authors: "Zhou, E. et al.",
        year: "2024",
        title: "Generative artificial intelligence, human creativity, and art",
        publication: "PNAS Nexus",
        doi: "10.1093/pnasnexus/pgae052",
        citationCount: 245,
      },
      {
        authors: "Abramski, K. et al.",
        year: "2025",
        title:
          "The LLM World of Words English free association norms generated by large language models",
        publication: "Scientific Data",
        doi: "10.1038/s41597-025-05156-9",
      },
      {
        authors: "Mahowald, K. et al.",
        year: "2024",
        title:
          "Dissociating language and thought in large language models",
        publication: "Trends in Cognitive Sciences",
        doi: "10.1016/j.tics.2024.01.011",
        citationCount: 247,
      },
      {
        authors: "Skalicky, S. et al.",
        year: "2017",
        title:
          "Identifying Creativity During Problem Solving Using Linguistic Features",
        publication: "Creativity Research Journal",
        doi: "10.1080/10400419.2017.1376490",
        citationCount: 22,
      },
      {
        authors: "Cai, Z. G. et al.",
        year: "2024",
        title:
          "Do large language models resemble humans in language use?",
        publication: "Proceedings of the Workshop on Cognitive Modeling and Computational Linguistics",
        doi: "10.18653/v1/2024.cmcl-1.4",
        citationCount: 63,
      },
    ],
  },

  // ── V. The Fading Paths ────────────────────────────────────
  {
    number: 5,
    numeral: "V",
    title: "The Fading Paths",
    subtitle: "What Fades and Why You Won't Notice",
    visualState: "fadingPaths",
    legend: [
      { icon: 'entity', color: 'rgba(180, 140, 220, 0.6)', label: 'AI' },
      { icon: 'particle', color: 'rgba(180, 140, 220, 0.8)', label: 'AI-generated content' },
    ],
    coreThought: `<p>AI's errors have shifted from commission to omission: from hallucinations and false positives in 2024, to missing nuance, suppressed outliers, and false negatives in 2026. Human metacognitive monitoring is better calibrated to detect fabrication than absence, which means omissions accumulate insidiously. When AI handles the divergent search on the user's behalf, our evaluative skills may remain intact &mdash; we can still judge whether an output is "correct" &mdash; but our ability to produce divergent alternatives may atrophy from disuse. Furthermore, the average human is reaching for generative AI in precisely those domains where they know the least. Thus, with insufficient expertise to critically evaluate the output, many of us are accepting and imbibing de facto AI outputs, which have been proven to be less diverse in the long run.</p>`,
    deepDive: `<p>In recent studies in healthcare, omissions are the most frequent error type in AI-generated clinical summaries at 25%, while inaccuracies appear in 20% and hallucinations are rare at only 2% (Grolleau et al., 2026). The cognitive basis for why this goes unnoticed comes from semantic illusion experiments, which find that people routinely fail to detect conspicuous errors when the erroneous word is semantically close to the correct one, suggesting that human comprehension monitoring relies on local semantic plausibility rather than global completeness (Cai et al., 2024). The evidence strongly indicates that AI has been optimized away from the error type humans are best equipped to catch &mdash; hallucination, which triggers the mismatch detectors of factual monitoring &mdash; and toward the error type humans are worst equipped to catch &mdash; omission, which requires the perceiver to notice the absence of something they may never have known to expect.</p>
<p>When AI handles the divergent search on the user's behalf, the dual-process cycle identified in Section II falters at its first step: the convergent evaluation may remain intact &mdash; the person can still judge whether an output is adequate &mdash; while the generative capacity to produce alternatives atrophies from disuse. Habitual AI cognitive offloading is inversely correlated with independent problem-solving capacity (Gerlich, 2025), and AI assistance can improve surface-level task performance while simultaneously accelerating the decay of the underlying skills &mdash; a dissociation between apparent competence and actual capability that the user does not perceive because the performance metrics look favorable (Macnamara et al., 2024).</p>
<p>Generative AI disproportionately benefits below-average performers &mdash; less-skilled workers saw the largest productivity gains, precisely because the AI could substitute for expertise they lacked (Brynjolfsson et al., 2023). While AI lowers the barrier to entry, it may come at a cost: in another study, consultants who lacked the domain expertise to recognize which tasks fell outside the frontier suffered the worst outcomes &mdash; not because they used AI recklessly, but because they could not distinguish between the terrain where AI excels and the terrain where it misleads (Dell'Acqua et al., 2023). Expert-level evaluation requires thousands of hours of deliberate, domain-specific practice, a finding that holds across chess, music, medicine, and other domains (Ericsson et al., 1993); a user without this accumulated expertise cannot distinguish between an AI response that is genuinely novel and one that is merely fluent. The combination creates a feedback loop: users gravitate toward AI in domains where they lack competence, which is exactly where they lack the evaluative capacity to detect AI's convergent tendencies, and the more proficient they become at prompting and integrating AI output, the less aware they become that their independent evaluative and generative capacities are quietly eroding.</p>`,
    citations: [
      {
        authors: "Grolleau, F. et al.",
        year: "2026",
        title:
          "Safety and Utility of an Agentic Large Language Model-Based Hospital Course Summarizer",
        publication: "medRxiv",
        doi: "10.64898/2026.02.05.26345607",
        citationCount: 0,
      },
      {
        authors: "Cai, Z. G. et al.",
        year: "2024",
        title:
          "Do large language models resemble humans in language use?",
        publication: "Proceedings of the Workshop on Cognitive Modeling and Computational Linguistics",
        doi: "10.18653/v1/2024.cmcl-1.4",
        citationCount: 63,
      },
      {
        authors: "Gerlich, M.",
        year: "2025",
        title:
          "AI Tools in Society: Impacts on Cognitive Offloading and the Future of Critical Thinking",
        publication: "Societies",
        doi: "10.3390/soc15010006",
        citationCount: 359,
      },
      {
        authors: "Macnamara, B. N. et al.",
        year: "2024",
        title: "Does using AI assistance accelerate skill decay?",
        publication: "Cognitive Research, 9, 40",
        doi: "10.1186/s41235-024-00572-8",
        citationCount: 30,
      },
      {
        authors: "Brynjolfsson, E. et al.",
        year: "2023",
        title: "Generative AI at Work",
        publication: "NBER Working Paper No. 31161",
        doi: "10.3386/w31161",
        citationCount: 838,
      },
      {
        authors: "Dell\u2019Acqua, F. et al.",
        year: "2023",
        title: "Navigating the Jagged Technological Frontier",
        publication: "HBS Working Paper No. 24-013",
        doi: "10.2139/ssrn.4573321",
        citationCount: 505,
      },
      {
        authors: "Ericsson, K. A., Krampe, R. T., & Tesch-R\u00f6mer, C.",
        year: "1993",
        title:
          "The role of deliberate practice in the acquisition of expert performance",
        publication: "Psychological Review, 100(3), 363\u2013406",
        doi: "10.1037/0033-295X.100.3.363",
        citationCount: 8790,
      },
    ],
  },

  // ── VI. The Homogenization Engine ──────────────────────────
  {
    number: 6,
    numeral: "VI",
    title: "The Homogenization Engine",
    subtitle: "How LLMs Reshape the Soup",
    visualState: "homogenization",
    legend: [],
    coreThought: `<p>As our language faculties and fluency shape the structure and diversity of our thoughts, an increasingly mindless dependence on AI appears to be having the unintended side effect of eroding our syntactical abilities. The semantic network is not static but use-dependent &mdash; restructured by what one reads, hears, and processes &mdash; and when the dominant input shifts from the varied, idiosyncratic output of diverse human minds to the polished, statistically averaged output of generative AI, our network's associative pathways are pruned toward the center while our divergent periphery quietly atrophies. Passive exposure to AI-generated ideas narrows subsequent human ideation, and when AI systems are trained on AI-generated data, distributional tails are progressively lost in each generation, producing collapse toward the statistical mean. The process is self-reinforcing: as the network narrows, the individual's search trajectories become less divergent, producing output that is itself more convergent, which, when fed back into organizational knowledge bases or training corpora, further narrows the input environment from which the next generation of associations will be drawn.</p>`,
    deepDive: `<p>Cognitive offloading &mdash; the externalization of cognitive processes into external aids &mdash; has been a concern since Socrates, and the dominant worry has been about storage: that external memory aids, like written text, substitute for internal memory, producing forgetfulness (Risko &amp; Gilbert, 2016). The creativity-relevant mechanism is not storage, but search. GPS-dependent drivers develop weaker spatial representations and reduced hippocampal gray matter volume not because they lose knowledge of the city's layout but because they stop actively navigating it (Dahmani &amp; Bohbot, 2020). Spatial memory depends on both egocentric (i.e. mapping the world relative to one's bodily location) and allocentric (i.e. mapping the world relative to objects around you) reference frames, and both processes involve neural structures in the medial temporal lobe structures, like the hippocampus, that are engaged by active navigation and disengaged by passive following (Abraham et al., 2015). The internet already functions as a primary transactive memory source, priming people to think about where to find information rather than encoding the information itself (Sparrow et al., 2011). While offloading saves internal cognitive resources, it reduces the internal demands that would otherwise strengthen those capacities through use (Grinschgl et al., 2020). Since it is the search &mdash; the active, effortful traversal of associative pathways &mdash; not the storage of their contents, that underlies divergent association, offloading search in the early stages of creative work may lead to an atrophy of those associative pathways in the long run.</p>
<p>The structural prerequisites for divergent thought are not merely cognitive dispositions but measurable features of an individual's semantic network. Network science methods reveal that the semantic networks of highly creative individuals differ structurally from those of less creative individuals: they exhibit shorter path lengths between nodes, lower clustering coefficients, and more small-world properties &mdash; an architecture that facilitates the traversal of remote associations by ensuring that any given concept can reach any other through fewer intermediate steps (Kenett et al., 2014). Percolation analysis extends this finding, showing that creative individuals' networks remain connected under greater degradation &mdash; their associative pathways are more robust and redundant, capable of sustaining creative traversal even when individual concepts are theoretically removed (Kenett et al., 2018). This network structure contributes to creative thought independently of intelligence &mdash; a critical finding for what follows, because it means that changes to the network's topology alter creative capacity even when executive function remains intact, establishing that the substrate through which search operates is itself a variable, not merely a passive medium through which cognitive ability expresses itself (Benedek et al., 2017).</p>
<p>The dynamics of search within this network follow a pattern borrowed from behavioral ecology. Memory search follows foraging dynamics: individuals exploit local associative patches &mdash; clusters of semantically related concepts &mdash; until the local yield is depleted, then make costly transitions to more distant patches, where the process repeats (Hills et al., 2012). The structure of the semantic network determines where patches are, how rich they are, and how far transitions must travel; a network pruned toward the statistical center would offer fewer distant patches and shorter transition distances, producing less divergent search trajectories even if the search process itself remains intact. Direct evidence suggests the pruning is already underway: passive exposure to AI-generated ideas narrows subsequent human ideation, documenting the causal direction &mdash; less diverse input produces less diverse output, not because the individual's generative capacity is permanently impaired but because the search environment has been restructured to favor shorter, more central foraging paths (Ashkinaze et al., 2024).</p>
<p>The evidence of this restructuring converges from multiple domains of cognitive offloading. Uncritical calculator use is associated with reduced mental computation ability &mdash; students who habitually reach for calculators lose the arithmetic fluency that would otherwise strengthen through practice (LaCour et al., 2019). The neuroanatomical consequence is visible in spatial cognition: GPS-dependent drivers develop smaller hippocampal gray matter volumes and reduced spatial memory performance, even after controlling for age and total navigation experience (Dahmani &amp; Bohbot, 2020). When AI-generated content replaces human-generated content in medical datasets, the variability that carries diagnostic information is systematically suppressed &mdash; a finding whose implications extend directly to the creative domain, where variability is not noise to be smoothed but the raw material from which novel associations are drawn (He et al., 2026). A synthesis of recent evidence on AI's impact on academic writing documents that heavy reliance on AI writing tools erodes foundational writing skills, with users showing reduced syntactic independence and weakened metacognitive monitoring of their own prose (Frontiers in Education, 2025). The semantic network is not a fixed architecture but a use-dependent structure, continuously restructured by what one reads, hears, and processes; when the dominant input shifts from the varied, idiosyncratic output of diverse human minds to the polished, statistically central output of generative AI, the network's associative pathways are pruned toward the center and its divergent periphery quietly atrophies.</p>
<p>The process compounds through recursive feedback at multiple levels. Algorithmic monoculture &mdash; the widespread adoption of common foundation models &mdash; leads to correlated failures and outcome homogenization across systems, reducing the diversity of the information ecosystem from which both humans and future models draw (Bommasani et al., 2022). At the model level, the mechanism is mathematical: when AI systems are trained on AI-generated data, distributional tails are progressively lost in each generation, producing model collapse toward the statistical mean &mdash; a finding that establishes the inevitability of diversity loss under recursive self-training (Shumailov et al., 2024). The paradox at the human level is equally stark: while AI assistance makes individual outputs more creative by elevating below-average performers toward the mean, it simultaneously decreases collective diversity by pulling all performers toward the same center &mdash; a gain in individual quality purchased at the cost of population-level variance (Doshi &amp; Hauser, 2024). The recursive loop operates at individual, organizational, and technological levels simultaneously, and the process is self-reinforcing: as the individual's network narrows, their search trajectories become less divergent, producing output that is itself more convergent, which, when fed back into organizational knowledge bases or AI training data, further narrows the input environment from which the next generation of associations will be drawn.</p>`,
    citations: [
      {
        authors: "Risko, E. F. & Gilbert, S. J.",
        year: "2016",
        title: "Cognitive Offloading",
        publication: "Trends in Cognitive Sciences",
        doi: "10.1016/j.tics.2016.07.002",
        citationCount: 610,
      },
      {
        authors: "Dahmani, L. & Bohbot, V. D.",
        year: "2020",
        title: "Habitual use of GPS negatively impacts spatial memory",
        publication: "Scientific Reports, 10, 6310",
        doi: "10.1038/s41598-020-62877-0",
        citationCount: 120,
      },
      {
        authors: "Abraham, A. et al.",
        year: "2015",
        title: "Semantic memory as the root of imagination",
        publication: "Frontiers in Psychology",
        doi: "10.3389/fpsyg.2015.00325",
        citationCount: 98,
      },
      {
        authors: "Sparrow, B. et al.",
        year: "2011",
        title:
          "Google Effects on Memory: Cognitive Consequences of Having Information at Our Fingertips",
        publication: "Science",
        doi: "10.1126/science.1207745",
        citationCount: 1243,
      },
      {
        authors: "Grinschgl, S. et al.",
        year: "2020",
        title:
          "Interface and interaction design: How mobile touch devices foster cognitive offloading",
        publication: "Computers in Human Behavior",
        doi: "10.1016/j.chb.2020.106317",
        citationCount: 34,
      },
      {
        authors: "Kenett, Y. N. et al.",
        year: "2014",
        title:
          "Investigating the structure of semantic networks in low and high creative persons",
        publication: "Frontiers in Human Neuroscience",
        doi: "10.3389/fnhum.2014.00407",
        citationCount: 332,
      },
      {
        authors: "Kenett, Y. N. et al.",
        year: "2018",
        title:
          "Flexibility of thought in high creative individuals represented by percolation analysis",
        publication: "Proceedings of the National Academy of Sciences",
        doi: "10.1073/pnas.1717362115",
        citationCount: 178,
      },
      {
        authors: "Benedek, M. et al.",
        year: "2017",
        title:
          "How semantic memory structure and intelligence contribute to creative thought: a network science approach",
        publication: "Thinking & Reasoning",
        doi: "10.1080/13546783.2016.1278034",
        citationCount: 198,
      },
      {
        authors: "Hills, T. T. et al.",
        year: "2012",
        title: "Optimal foraging in semantic memory",
        publication: "Psychological Review",
        doi: "10.1037/a0027373",
        citationCount: 450,
      },
      {
        authors: "Ashkinaze, J. et al.",
        year: "2024",
        title:
          "How AI Ideas Affect the Creativity, Diversity, and Evolution of Human Ideas",
        publication: "arXiv:2401.13481",
        citationCount: 15,
      },
      {
        authors: "LaCour, M. et al.",
        year: "2019",
        title:
          "When calculators lie: A demonstration of uncritical calculator usage among college students",
        publication: "PLOS ONE, 14(10), e0223736",
        doi: "10.1371/journal.pone.0223736",
        citationCount: 6,
      },
      {
        authors: "He, T. et al.",
        year: "2026",
        title:
          "AI-generated data contamination erodes pathological variability and diagnostic reliability",
        publication: "medRxiv",
        doi: "10.64898/2026.01.19.26344383",
        citationCount: 0,
      },
      {
        authors: "Various",
        year: "2025",
        title:
          "The impact of generative AI on academic reading and writing: a synthesis of recent evidence (2023-2025)",
        publication: "Frontiers in Education",
        doi: "10.3389/feduc.2025.1711718",
        citationCount: 15,
      },
      {
        authors: "Bommasani, R. et al.",
        year: "2022",
        title:
          "On the Opportunities and Risks of Foundation Models",
        publication: "arXiv:2108.07258",
        citationCount: 120,
      },
      {
        authors: "Shumailov, I. et al.",
        year: "2024",
        title:
          "AI models collapse when trained on recursively generated data",
        publication: "Nature, 631, 755\u2013759",
        doi: "10.1038/s41586-024-07566-y",
        citationCount: 565,
      },
      {
        authors: "Doshi, A. R. & Hauser, O. P.",
        year: "2024",
        title:
          "Generative AI enhances individual creativity but reduces the collective diversity of novel content",
        publication: "Science Advances, 10(28), eadn5290",
        doi: "10.1126/sciadv.adn5290",
        citationCount: 368,
      },
    ],
  },

  // ── VII. The Rising Floor ──────────────────────────────────
  {
    number: 7,
    numeral: "VII",
    title: "The Rising Floor",
    subtitle: "Organizations and the Attention Economy",
    visualState: "risingFloor",
    legend: [
      { icon: 'floor', color: 'rgba(180, 140, 220, 0.5)', label: 'Noise floor' },
    ],
    coreThought: `<p>We are an innately creative species, and there are many (myself included) who find generative AI liberating, as it opens up a world of creative possibilities that had previously been technically elusive. Yet, particularly among creatives, the amplified volume and velocity of thought-provoking - and often incendiary - content being produced becomes an internalized pressure to be "more productive." Generative AI, always willing and available, makes this nagging desire harder to ignore. Recent evidence indicates this intensification is having detrimental effects on wellbeing: AI tools do not reduce workloads but instead create consistent work intensification, producing cognitive fatigue that degrades the reflective conditions that creative thought requires. Among 53,000 artists, creative productivity and artwork value significantly increased with AI adoption while novelty decreased over time. When every manuscript is polished and every report structurally sound, the evaluator's task shifts from detection of flaws to detection of absence - precisely the faculty that cognitive offloading to AI threatens to erode. The pressure to produce is contributing to the workslop in organizations and the homogenization of content on creative platforms, and five upstream mechanisms &mdash; architectural bias toward statistical central tendency, self-selection into low-expertise domains, search offloading, evaluative erosion, and organizational homogenization &mdash; are each contributing to this shift toward higher volume and lower novelty.</p>`,
    deepDive: `<p>The individual-level mechanisms described in previous sections are compounded by a structural intensification fanned by AI itself. An eight-month ethnographic study documents that AI tools do not reduce employee workloads but, instead, create consistent work intensification through voluntary adoption &mdash; task expansion across role boundaries, blurred work-life boundaries as workers integrate tasks into previously protected breaks, and increased multitasking. This was found to produce a self-reinforcing cycle in which accelerated tasks raised speed expectations, wider task scope intensified work density, and the resulting cognitive fatigue, burnout, and decision-making impairment degraded the reflective conditions that creative thought requires (Ranganathan &amp; Ye, 2026). The content-level manifestation is equally striking: major social media platforms, whose monetization programs actively reward volume over value, are flooded with AI-generated content at a scale that exceeds earlier forms of low-quality material, saturating the information environment from which both creators and evaluators draw their reference standards (Madsen et al., 2025). March (1991) provides the theoretical framework for the organizational consequence: organizations face a fundamental tension between exploration &mdash; the search for new possibilities &mdash; and exploitation &mdash; the refinement of existing competencies &mdash; and organizations that overweight exploitation achieve short-term productivity gains at the cost of long-term adaptive failure, a dynamic that AI's efficiency orientation systematically exacerbates.</p>
<p>The empirical signature of this dynamic is now visible at population scale. Among 53,000 artists, creative productivity and artwork value significantly increased with AI adoption, while adopters' artworks exhibited decreasing novelty over time in both conceptual and visual features &mdash; higher surface quality coexisting with lower divergence, the production-quality floor rising as the novelty ceiling compresses (Zhou et al., 2024). The five upstream mechanisms traced through this essay &mdash; AI's architectural bias toward statistical central tendency, self-selection of AI use into low-expertise domains, search offloading weakening associative pathways, evaluative erosion through signal compression, and organizational homogenization of creative substrate &mdash; each independently predict precisely this outcome: a shift toward higher volume and lower novelty, with the volume increase masking the novelty decrease because the metrics most organizations track &mdash; throughput, consistency, stakeholder satisfaction &mdash; register the former while remaining blind to the latter.</p>
<p>Our evaluative standards tend to shift toward the mean of recently encountered stimuli (the well-known recency bias). When AI raises the quality floor uniformly &mdash; every draft polished, every report structurally sound, every proposal superficially plausible &mdash; our adaptation level rises correspondingly, and output that would once have registered as merely competent now registers as adequate (Helson, 1964). Viewed another way, uniform surface quality compresses the signal-to-noise ratio on which evaluators depend, reducing the discriminability between genuinely novel work and competently average work (Steyvers et al., 2025). For managers, editors, and publishers, the managerial task has shifted away from detecting flaws to detecting absence, which requires the perceiver to notice what is not there against a uniformly polished surface. Yet, this is precisely the faculty that the metacognitive asymmetry identified in Sections III and V threatens to erode..</p>`,
    citations: [
      {
        authors: "Ranganathan, A. & Ye, X. M.",
        year: "2026",
        title:
          "AI Doesn\u2019t Reduce Work\u2014It Intensifies It",
        publication: "Harvard Business Review",
        citationCount: 0,
      },
      {
        authors: "Madsen, A. K. et al.",
        year: "2025",
        title:
          "The 7Vs of AI Slop: A Typology of Generative Waste",
        publication: "SSRN",
        doi: "10.2139/ssrn.5558018",
        citationCount: 0,
      },
      {
        authors: "March, J. G.",
        year: "1991",
        title:
          "Exploration and Exploitation in Organizational Learning",
        publication: "Organization Science, 2(1), 71\u201387",
        doi: "10.1287/orsc.2.1.71",
        citationCount: 11477,
      },
      {
        authors: "Zhou, E. et al.",
        year: "2024",
        title: "Generative artificial intelligence, human creativity, and art",
        publication: "PNAS Nexus",
        doi: "10.1093/pnasnexus/pgae052",
        citationCount: 245,
      },
      {
        authors: "Helson, H.",
        year: "1964",
        title:
          "Current trends and issues in adaptation-level theory",
        publication: "American Psychologist, 19, 26\u201338",
        doi: "10.1037/H0040013",
        citationCount: 240,
      },
      {
        authors: "Steyvers, M. et al.",
        year: "2025",
        title:
          "Metacognition and Uncertainty Communication in Humans and Large Language Models",
        publication: "Current Directions in Psychological Science",
        doi: "10.1177/09637214251391158",
        citationCount: 0,
      },
    ],
  },

  // ── VIII. Liberation Through Understanding ─────────────────
  {
    number: 8,
    numeral: "VIII",
    title: "Liberation Through Understanding",
    subtitle: "What To Do",
    visualState: "liberation",
    legend: [],
    coreThought: `<p>The conditions that allow the creative process to flourish, and those that quietly erode it, have been the subject of this essay &mdash; and the answer returns us to the collision that started it. Nascent in the dark matter of one's mind, a solitary thought is impotent until it encounters another; generative AI can supply those encounters at scale, yet its output is, by design, the statistical transformation of all prior human expression: the well-worn path.</p>
<p>For individuals, the evidence points to two approaches: AI can be used antagonistically, prompting to reveal the convergent center so the creator can deliberately diverge away from it. However, the triteness of your AI's response may not be apparent at first blush, and antagonistic use requires practicing restraint and training one's judgment. Since generative AI boosts creativity in the moment yet exhibits less divergence in the long run, the second approach is to create divergent constraints <strong>within which</strong> AI finds associations: we specify the outline, with each section logically diverging around a central thesis. In other words, instead of prompting AI linearly to write an essay, the optimal approach is to for you to specify the outline, and then rely upon AI to interpolate between sections. This is the approach I took in writing this essay.</p>
<p>For those organizing human ingenuity at scale, the evidence from organizational psychology suggests that organizations themselves bound the space of ideation. Thus, the optimal implementation of AI would involve creating sufficiently divergent organizational constraints <strong>a priori</strong> within which AI-human collaboration can bridge the associative gap. This process might resemble the OKR framework, where constraints are percolated top-down, with individual contributors interleaving bottom-up considerations. In addition, rganizational metacognition is imperative: leaders must be aware of the pressures under which their employees operate, for those pressures exacerbate counterproductive offloading &mdash; and only those who discover the jagged frontier through direct experience, not abstract briefing, adjust their reliance appropriately. The creative process is Darwinian, and its substrate is the varied, effortful, sometimes errant collision of ideas in a mind that is searching; to preserve that substrate in an age of generative AI is to understand that the friction is not the obstacle &mdash; it is the mechanism.</p>`,
    deepDive: `<p>The prescriptive implications of the preceding analysis begin with a precise empirical characterization of what generative AI output actually provides. The evidence strongly indicates that AI compresses the tails of variation, producing fewer divergent responses in the long run. Yet, it is these very responses that, by the Darwinian logic described in Section IV, constitute the raw material from which selective retention can operate (Hubert et al., 2024). At the semantic level, AI-generated associations cluster more tightly around the statistical center than human associations, with less variance and fewer remote connections (Abramski et al., 2023). The output of generative AI is, by construction, a reflection of the statistical center of its training distribution &mdash; the aggregated, averaged, most-probable continuation of all prior human expression &mdash; and this is not a limitation to be engineered away but a structural feature of next-token prediction that can be repurposed as a tool. Antagonistic use treats AI output not as a draft to be refined but as a cartographic instrument that maps the convergent center with precision, marking the well-worn path so that the creator can deliberately diverge from it; the triteness of the response, once recognized, becomes the reference point from which genuine novelty is measured.</p>
<p>The cognitive science of learning provides the theoretical justification for why this reorientation matters. Learning conditions which feel difficult &mdash; spacing, interleaving, testing, variability &mdash; produce superior long-term retention and transfer compared to conditions that feel fluent, because effortful retrieval strengthens memory traces and builds more flexible knowledge representations (Bjork &amp; Bjork, 2011). The desirable difficulty principle predicts that the subjective ease of AI-assisted production is itself a warning sign, signaling that the cognitive operations which build independent capacity are being bypassed rather than exercised. Campbell (1960) provides the theoretical foundation from which the essay's entire argument descends: creative thought requires blind variation &mdash; the generation of unpredictable, unguided variations &mdash; followed by selective retention; eliminating the variation phase, as occurs when AI supplies the divergent candidates and the human merely selects among them, eliminates the substrate from which selection can operate. Antagonistic use preserves the desirable difficulty of independent semantic search &mdash; the effortful traversal of one's own associative landscape &mdash; while leveraging AI's unique ability to characterize the convergent center against which that search can be calibrated. As one paradigm for human-AI collaboration, human creativity may be better served not by accepting the de facto output, but by specifying the outline a priori, establishing the semantic constraints within which AI interpolates. This is a division of labor that respects our mutual strengths.</p>
<p>At the organizational level, psychological safety &mdash; a shared belief that the team is safe for interpersonal risk-taking &mdash; is the precondition for failure-based learning; without it, employees suppress the type of experimentation and error-reporting that all innovation - including pressure-testing the limits of AI's capabilities - requires (Edmondson, 1999). Studies have found that only those individuals who discovered the jagged frontier through direct experience &mdash; encountering tasks where AI failed and learning to recognize the terrain &mdash; adjusted their reliance appropriately, while those merely briefed about the limitations continued to over-rely (Dell'Acqua et al., 2023). This implies that organizations must allocate deliberate runway for failure rather than relying on training alone, because the calibration of human judgment to AI's actual capabilities is an experiential process that cannot be transmitted through documentation or policy. The OKR-like framework described in this essay &mdash; divergent constraints percolated top-down, with individual contributors and management interleaving bottom-up considerations and goals &mdash; may create the structural conditions for creative AI use at scale by ensuring that the divergent, boundary-setting work remains human while the convergent, constraint-satisfying work is allocated to AI. Finally, organizational metacognition, the awareness of the pressures under which employees operate and the cognitive consequences of those pressures, is not a management luxury but a structural necessity in an environment where the default mode of AI deployment systematically erodes the exploratory capacity on which long-term innovation depends.</p>`,
    citations: [
      {
        authors: "Hubert, K. F. et al.",
        year: "2024",
        title:
          "The current state of artificial intelligence generative language models is more creative than humans on divergent thinking tasks",
        publication: "Scientific Reports, 14, 3440",
        doi: "10.1038/s41598-024-53303-w",
        citationCount: 129,
      },
      {
        authors: "Abramski, K. et al.",
        year: "2023",
        title:
          "Cognitive Network Science Reveals Bias in GPT-3, GPT-3.5 Turbo, and GPT-4",
        publication: "Big Data and Cognitive Computing, 7(3), 124",
        doi: "10.3390/bdcc7030124",
        citationCount: 62,
      },
      {
        authors: "Bjork, E. L. et al.",
        year: "2011",
        title:
          "Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning",
        publication: "Psychology and the Real World",
        citationCount: 860,
      },
      {
        authors: "Campbell, D. T.",
        year: "1960",
        title:
          "Blind variation and selective retention in creative thought as in other knowledge processes",
        publication: "Psychological Review, 67(6), 380\u2013400",
        citationCount: 1500,
      },
      {
        authors: "Edmondson, A.",
        year: "1999",
        title:
          "Psychological Safety and Learning Behavior in Work Teams",
        publication: "Administrative Science Quarterly",
        doi: "10.2307/2666999",
        citationCount: 9112,
      },
      {
        authors: "Dell\u2019Acqua, F. et al.",
        year: "2023",
        title: "Navigating the Jagged Technological Frontier",
        publication: "HBS Working Paper No. 24-013",
        doi: "10.2139/ssrn.4573321",
        citationCount: 505,
      },
    ],
  },

  // ── IX. The Resolution of the Map ────────────────────
  {
    number: 9,
    numeral: "IX",
    title: "The Resolution of the Map",
    subtitle: "Limitations",
    visualState: "limitations",
    legend: [],
    coreThought: `<p>Every map distorts the territory it represents, and this essay is a map. It attempts to extrapolate from one mechanism of creative cognition &mdash; divergent association &mdash; to derive lessons for human lifestyles and workplaces. The known challenges in deriving general lessons from mechanistic explanations of human biology lie in two fundamental problems: the loss of nuanced understanding of how other variables interact with this mechanism for an outcome, and the assumption that the same mechanism operates in the same way in all people. An additional challenge specific to the cognitive science and psychology literature is the narrowness of the experimental conditions in which these cognitive mechanisms are being inferred &mdash; typically undergraduate students enrolled in college psychology classes, who tend to be predominantly caucasian and female. As a consequence, there is a known risk that the fundamental mechanism of action &mdash; divergent association as a predictor of creative thought and creative achievement &mdash; does not generalize across every culture and every population. The measurement instruments themselves &mdash; the Divergent Association Task, the Alternative Uses Task, and semantic distance scoring &mdash; are imperfect proxies for creativity, each capturing novelty more reliably than the full construct of creativity, and each carrying its own scoring biases: sample-dependence, cultural variability, and an upper limit to how well computational semantic distance tracks human judgments of originality. In attempting to generalize from the first principle of divergent association as a basis for creative thought, many levels were not acknowledged; for instance, the literature examining the effect of domain expertise or creative skills on creative thinking is vast, and, as it was tangential to the main argument of this review, it was not parsed thoroughly. Several of this essay's central inferences &mdash; the GPS-to-semantic-search analogy, the shared neural wiring of creativity and apophenia, the aggregation of individual convergent bias into organizational homogenization &mdash; involve inferential leaps that extend beyond what any single source individually establishes. The volume-novelty tradeoff prediction on which the essay's prescriptive arguments rest assumes that current usage patterns persist; the essay's own prescription for antagonistic use, if adopted, could interrupt the predicted cycle &mdash; a reflexive limitation that is itself a form of optimism.</p>`,
    deepDive: `<p>The first category of limitation concerns the instruments through which divergent association is measured. The Divergent Association Task &mdash; the primary measure linking semantic distance to creative capacity &mdash; has several acknowledged shortcomings: it measures originality with better face validity than appropriateness, and DAT scores may partly reflect constructs more related to divergence than creativity, such as overinclusive thinking or schizotypy (Olson et al., 2021). Participants may artificially modulate their scores by intentionally choosing rare words, drawing on environmental cues, or employing letter-based strategies, though the short time limit reduces this likelihood. The broader class of divergent thinking assessments faces the same structural concern: manual scoring is laborious, sample-dependent, and culturally variable &mdash; uses of objects vary in commonality across cultures and over time, making cross-cultural or longitudinal comparison unreliable (Olson et al., 2021). Semantic distance, the computational approach that underpins much of this essay's evidence on AI's convergent tendency, is a measure of novelty rather than a direct measure of creativity &mdash; it captures conceptual remoteness but lacks the usefulness criterion, meaning it is slightly more sensitive to novelty than to creativity as humans understand the term (Beaty &amp; Johnson, 2021). A counterintuitive finding compounds this concern: among LLM-based embedding models, larger models did not consistently produce better semantic distance scores, and as a model's language understanding improved, the relationship between its semantic distance outputs and human-rated originality weakened &mdash; suggesting an upper limit to this proxy's effectiveness that has yet to be fully understood (Organisciak et al., 2023). Relatively low creativity scores in some study samples may further limit the generalizability of findings linking semantic memory network properties to creative performance, and the potential lack of cross-task generalizability means that findings on laboratory tasks like the Alternative Uses Task may not extend to real-world creativity, which involves goal-directed problem-solving, collaboration, and iterative refinement using different cognitive processes (Skurnik et al., 2025).</p>
<p>The second category concerns the demographic and methodological scope of the evidence base. The cognitive science and psychology studies cited throughout this essay draw predominantly from samples of undergraduate university students &mdash; young, predominantly female, Western-educated, and in the case of AI-related studies, technologically literate and already familiar with generative AI tools. Fan et al. (2025) recruited 117 students of whom 70% were female, and their reliance on a single reading-and-writing task limits cross-task inference. Reza et al. (2025) found that requiring prior AI familiarity inadvertently capped their sample at age 34, excluding older adults and producing educational homogeneity. Lee et al. (2025) acknowledge a demographic skew toward younger, tech-savvy participants surveyed exclusively in English, with no multilingual or cross-cultural representation. Rominger et al. (2022) note reduced variance in their young-student sample for both paranormal beliefs and creative ideation, potentially constraining the observed associations between creativity and apophenia. Multiple studies are cross-sectional rather than longitudinal, meaning they capture a snapshot of AI's effects at one moment rather than tracking how those effects evolve &mdash; a significant constraint given that AI tools are constantly evolving and usage patterns are likely to shift (Lee et al., 2025; Fan et al., 2025). The controlled experimental conditions in which many effects are observed do not fully capture the complexities of real-world creative processes, where task type, organizational climate, domain expertise, and collaborative dynamics can influence both the direction and magnitude of creativity effects (McGuire et al., 2024). Several studies employ quasi-experimental designs or lack contemporaneous control groups, meaning their findings are descriptive associations rather than established causal relationships (Fernandes et al., 2026; Grolleau et al., 2026). When He et al. (2026) modeled AI-generated data contamination, they did so in a controlled, accelerated environment; real-world data contamination may occur more gradually and with different distributional consequences.</p>
<p>The third category is the essay's own inferential architecture &mdash; the scaffolding that holds the argument together across levels of analysis. Several meta-syntheses involve interpretive mappings that extend beyond what any individual source establishes. The GPS-to-semantic-search analogy (Section VI) is suggestive: GPS-dependent drivers develop weaker spatial representations, and by extension, AI-dependent writers may develop weaker associative pathways. Yet spatial navigation and semantic association, while both implicating the hippocampus, involve non-identical neural circuits &mdash; semantic association additionally recruits prefrontal and temporal regions &mdash; and the critical question of whether AI-assisted writing reduces active semantic search or merely redirects it toward evaluation and selection remains open. The shared-neural-wiring claim linking creativity and apophenia (Section III) asserts the mechanistic version of a correlation that most sources establish at the behavioral level; the dopaminergic evidence from de Manzano et al. (2010) is based on small samples, and the default mode network's broad involvement in many cognitive processes limits its specificity as evidence of a shared mechanism. The claim that individual convergent bias aggregates into organizational homogenization (Section VII) involves a further inferential step: organizations have always exerted convergent pressures &mdash; conformity, hierarchy, standardization &mdash; and AI may be accelerating an existing tendency rather than introducing a qualitatively new one. The mapping between established creativity models and the essay's prerequisites (Section I) is interpretive rather than axiomatic. The volume-novelty tradeoff prediction (MS-006) assumes current usage patterns persist; if antagonistic use is widely adopted, as recommended by this essay, the self-reinforcing cycle could be interrupted, and the prediction's unspecified timeframe makes it difficult to falsify. In centering the argument on divergent association as the primary mechanism of creative thought, the essay necessarily underweights other well-established contributors &mdash; domain expertise, deliberate practice, motivational states, social network effects, and the interaction between convergent and divergent thinking &mdash; each of which has its own extensive literature that, while tangential to this review's central thesis, would complicate and in some cases qualify the conclusions drawn here.</p>`,
    citations: [
      {
        authors: "Olson, J. A. et al.",
        year: "2021",
        title:
          "Naming unrelated words predicts creativity",
        publication: "Proceedings of the National Academy of Sciences",
        doi: "10.1073/pnas.2022340118",
        citationCount: 138,
      },
      {
        authors: "Beaty, R. E. & Johnson, D. R.",
        year: "2021",
        title:
          "Automating creativity assessment with SemDis: An open platform for computing semantic distance",
        publication: "Behavior Research Methods",
        doi: "10.3758/s13428-020-01453-w",
        citationCount: 247,
      },
      {
        authors: "Organisciak, P. et al.",
        year: "2023",
        title:
          "Beyond semantic distance: Automated scoring of divergent thinking greatly improves with large language models",
        publication: "Thinking Skills and Creativity",
        doi: "10.1016/j.tsc.2023.101356",
        citationCount: 44,
      },
      {
        authors: "Skurnik, H. et al.",
        year: "2025",
        title: "Semantic memory and creative evaluation",
        publication: "BMC Psychology",
        doi: "10.1186/s40359-025-03124-x",
        citationCount: 1,
      },
      {
        authors: "Fan, Y. et al.",
        year: "2025",
        title:
          "Beware of metacognitive laziness: Effects of generative artificial intelligence on learning motivation, processes, and performance",
        publication: "British Journal of Educational Technology",
        doi: "10.1111/bjet.13544",
        citationCount: 235,
      },
      {
        authors: "Reza, M. et al.",
        year: "2025",
        title: "Co-Writing with AI, on Human Terms",
        publication: "ACM Computing Surveys",
        doi: "10.1145/3757566",
        citationCount: 15,
      },
      {
        authors: "Lee, H.-P. et al.",
        year: "2025",
        title:
          "The Impact of Generative AI on Critical Thinking",
        publication: "CHI Conference on Human Factors in Computing Systems",
        doi: "10.1145/3706598.3713778",
        citationCount: 249,
      },
      {
        authors: "Rominger, C. et al.",
        year: "2022",
        title:
          "Creative, yet not unique? Paranormal belief, but not self-rated creative ideation behavior is associated with a higher propensity to perceive unique meanings in randomness",
        publication: "Heliyon",
        doi: "10.1016/j.heliyon.2022.e09269",
        citationCount: 7,
      },
      {
        authors: "Fernandes, P. et al.",
        year: "2026",
        title:
          "AI makes you smarter but none the wiser: The disconnect between performance and metacognition",
        publication: "Computers in Human Behavior",
        doi: "10.1016/j.chb.2025.108779",
        citationCount: 7,
      },
      {
        authors: "McGuire, J. et al.",
        year: "2024",
        title:
          "Establishing the importance of co-creation and self-efficacy in creative collaboration with artificial intelligence",
        publication: "Scientific Reports",
        doi: "10.1038/s41598-024-69423-2",
        citationCount: 56,
      },
      {
        authors: "Grolleau, F. et al.",
        year: "2026",
        title:
          "Safety and Utility of an Agentic Large Language Model-Based Hospital Course Summarizer",
        publication: "medRxiv",
        doi: "10.64898/2026.02.05.26345607",
        citationCount: 0,
      },
      {
        authors: "He, T. et al.",
        year: "2026",
        title:
          "AI-generated data contamination erodes pathological variability and diagnostic reliability",
        publication: "medRxiv",
        doi: "10.64898/2026.01.19.26344383",
        citationCount: 0,
      },
    ],
  },
];
