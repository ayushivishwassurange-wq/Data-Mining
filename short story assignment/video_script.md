# 10–15 Minute Video Presentation Script: CMPE 255 Short Story
**Topic:** *Beyond Holistic Models: Systematic Component-Level Benchmarking of Deep Multivariate Time-Series Forecasting (TSCOMP)*  
**Primary Paper:** Liang et al. (KDD Datasets & Benchmarks Track / [arXiv:2605.26562](https://arxiv.org/abs/2605.26562))  
**Companion Surveys:** TFB (VLDB 2024 / `arXiv:2403.20150`), Foundation Models for Time Series Survey (KDD 2024 / `arXiv:2403.14735`)  
**Slide Deck:** `slides/TSCOMP_Short_Story_Slides.pptx` (14 Slides)  
**Target Duration:** ~12 to 14 minutes (at a comfortable speaking pace of ~140 words/minute)

---

## Slide 1: Title & Overview (`0:00 – 1:00`)
**[Visual: Slide 1 — Title Slide with 3 Literature Pillars & Core Thesis]**

"Hi everyone! Welcome to my CMPE 255 Data Mining Short Story presentation. Today, I’m excited to walk you through a recent KDD Datasets and Benchmarks paper titled **'Beyond Holistic Models: Systematic Component-Level Benchmarking of Deep Multivariate Time-Series Forecasting'**, published on arXiv as `2605.26562` by Shuang Liang and colleagues at the SUFE AI Lab.

In keeping with the assignment goals, I haven't just looked at this paper in isolation. I’ve synthesized it alongside two major companion survey and benchmark papers—specifically **TFB (Towards Comprehensive and Fair Benchmarking)** from VLDB 2024, and the **KDD 2024 Survey on Time-Series Foundation Models**—plus key architectural milestones like **DLinear**, **PatchTST**, and **iTransformer**.

Rather than getting bogged down in dense equations, we’re going to focus on the big-picture gist: the system architecture, how the authors deconstruct monolithic models into 49 atomic building blocks, what 20,000+ ablation experiments reveal about what *actually* drives forecasting accuracy, and finally, my own two cents on where the field is heading."

---

## Slide 2: The 'Holistic Black-Box' Crisis (`1:00 – 2:10`)
**[Visual: Slide 2 — The Architecture Wars vs. Three Fundamental Blindspots]**

"Let’s start with the motivation on **Slide 2**. If you’ve followed time-series data mining over the last five years, it’s looked like a non-stop 'Architecture War.'
- First, around 2020 to 2021, papers like **Informer**, **Autoformer**, and **FEDformer** claimed that custom sparse self-attention was essential for long-term forecasting.
- Then in 2023, **DLinear** shocked everyone at AAAI by showing that a single linear layer with moving-average decomposition beat all of those complex Transformers.
- Next, Transformers struck back with **PatchTST** at ICLR 2023 and **iTransformer** at ICLR 2024.
- And most recently, researchers started strapping billion-parameter LLMs like **Time-LLM** and **GPT4TS** onto sensor data.

Why do these papers keep contradicting each other? Because of what I call the **'Package Deal Fallacy.'**
When a paper proposes a new model, they don't just change the neural network backbone. They quietly bundle a specific normalization trick, a specific tokenization scheme, a channel-mixing rule, and a custom learning-rate schedule into one monolithic black box. When that package wins, they give 100% of the credit to the backbone!
On top of that, as the companion **TFB survey at VLDB 2024** proved, many codebases had unfair evaluation habits—like tuning lookback windows inconsistently or setting `drop_last=True` on the test loader.
**TSCOMP** solves this by unbundling the black box."

---

## Slide 3: System Architecture & Paradigm Shift (`2:10 – 3:15`)
**[Visual: Slide 3 — Figure 1: Traditional Paradigm vs. TSCOMP Pipeline]**

"Moving to **Slide 3**, you can see **Figure 1** from my Medium article, which contrasts the traditional holistic paradigm at the top with the **TSCOMP paradigm** at the bottom.

In the top panel, models like PatchTST, iTransformer, DLinear, and Time-LLM are treated as separate silos. We can't tell if PatchTST wins because of its Transformer layers or because of Reversible Instance Normalization and patching.

In the bottom panel, TSCOMP factors *every* deep forecaster into a sequential **4-Stage Pipeline**:
1. **Stage 1: Series Preprocessing**
2. **Stage 2: Encoding Strategies**
3. **Stage 3: Network Backbones**, and
4. **Stage 4: Optimization and Training Mechanics.**

Now, if you multiply all 49 component choices across the 11 dimensions in this pipeline, you get over **one million possible architectures**. You obviously can't brute-force a million deep learning runs. So the authors use **Constrained Orthogonal Experimental Design** to prune invalid pairs and sample a statistically balanced set of **over 20,000 model-dataset evaluations**. And at the far right, they train a **TabPFN Zero-Shot Meta-Predictor** on that corpus so you can automatically assemble the best pipeline for any brand-new dataset."

---

## Slide 4: The Full TSCOMP Taxonomy (`3:15 – 4:15`)
**[Visual: Slide 4 — Figure 2: 4 Stages, 11 Dimensions, 49 Components]**

"On **Slide 4**, **Figure 2** gives us a bird's-eye view of all **4 stages, 11 dimensions, and 49 atomic components** inside TSCOMP:
- **Stage 1 (in blue)** covers 3 dimensions: Series Normalization (like Z-Score, RevIN, and DishTS), Series Decomposition (Moving Average, Fourier DFT, Hybrid), and Sampling/Denoising.
- **Stage 2 (in indigo)** covers 3 dimensions: Tokenization Granularity (Point-wise, Patch-level, Inverted Variate-level), Channel Modeling (Channel-Independence vs. Channel-Mixing), and Positional/Temporal Embeddings.
- **Stage 3 (in teal)** covers 2 dimensions: the Core Architecture Family—spanning 14 backbones across MLPs, Transformers, 2D-Convolutions like TimesNet, RNNs/Mamba State-Space models, and Foundation Models—plus the Forecasting Projection Head.
- **Stage 4 (in amber)** covers 3 dimensions: the Training Loss Function, Learning Rate Scheduler, and Regularization."

---

## Slide 5: Deep Dive into Stages 1 & 2 (`4:15 – 5:25`)
**[Visual: Slide 5 — Stage 1 (Preprocessing) & Stage 2 (Encoding)]**

"Let’s zoom into **Stages 1 and 2 on Slide 5**, because—spoiler alert—this is where **63% of total performance variance** actually lives!

In **Stage 1**, the number-one enemy of real-world time-series data mining is **non-stationarity**. The mean and variance of electricity load or currency exchange rates drift over time. **Reversible Instance Normalization (RevIN)** fixes this by stripping out each input window's mean and standard deviation before the model, and restoring them after the prediction head. Adaptive versions like **SAN** and **DishTS** go a step further and learn how the distribution will shift over the forecast horizon. Meanwhile, **Moving-Average** and **DFT Decomposition** explicitly separate slow macroscopic trends from periodic seasonal waves.

In **Stage 2**, we look at how numbers become tokens:
- Early Transformers used **Point-wise tokens**—one timestamp equals one token. That fails because a single timestamp has no slope or shape semantics, and attention scales quadratically as $O(L^2)$.
- **Patch Tokenization** groups 16 adjacent timestamps into one vector, capturing local motifs and cutting sequence length by 16x.
- **Inverted Variate Tokenization** flips the matrix on its side: the entire lookback history of Sensor 1 becomes Token 1, and self-attention now computes spatial correlations *between sensors*!
- That directly connects to **Channel-Independence (CI) vs. Channel-Mixing (CM)**: when you only have 7 noisy sensors, CI prevents overfitting; when you have 862 highway traffic detectors, CM lets sensors see upstream traffic jams coming."

---

## Slide 6: Deep Dive into Stages 3 & 4 (`5:25 – 6:30`)
**[Visual: Slide 6 — Stage 3 (Backbones) & Stage 4 (Optimization)]**

"On **Slide 6**, we examine **Stages 3 and 4**.
In **Stage 3**, TSCOMP benchmarks six neural backbone families on a level playing field:
1. **Linear & MLP models** like DLinear, RLinear, TiDE, and TSMixer, which are tiny, fast, and resistant to overfitting on ultra-long horizons.
2. **Transformers** and **2D-Frequency models** like TimesNet, which shine on complex short-to-medium patterns.
3. **RNNs and State-Space Models** like SegRNN and Mamba.
4. **Frozen LLMs** (`Time-LLM`, `GPT4TS`) and **Pre-trained Foundation Models** (`Chronos`, `MOMENT`).

Then in **Stage 4**, TSCOMP uncovers one of my favorite insights in the entire paper: **the MSE Training Loss Trap**.
Because benchmark tables evaluate models on MSE and MAE, almost every paper trains their network using **L2 (MSE) loss**. But in noisy sensor streams, occasional anomaly spikes create huge squared errors that blow up gradients and force the model to predict a flat line!
By simply swapping the training objective in Stage 4 to **Smooth L1 (Huber) Loss** or a **Frequency-Domain Spectral Loss**, TSCOMP improves *both* test MAE and test MSE across 68% of all tested backbones!"

---

## Slide 7: Component-Level Ablation Studies (`6:30 – 7:45`)
**[Visual: Slide 7 — Figure 3: Ablation Bar Chart & ANOVA Variance Breakdown]**

"Now let's look at the hard numbers on **Slide 7 (Figure 3)** from the 20,000-model ablation study.

On the left bar chart, we see the average relative MSE reduction when enabling each component across backbones:
- Enabling **RevIN instance normalization** cuts MSE by **18.4%**.
- Switching from point-wise tokens to **Patch Tokenization** cuts MSE by **14.7%**, and **Inverted Variate Tokens** cut MSE by **13.2%** on high-dimensional datasets.
- Adding **Decomposition** yields **11.6%**, **Channel-Independence** yields **9.8%**, and **Hybrid Frequency/L1 Loss** yields **8.9%**.
- Now look at the bottom red bar: once Stage 1 and Stage 2 are fixed, **swapping the neural backbone from an MLP to a Transformer changes average MSE by only 4.1%!**

Look at the ANOVA variance attribution on the right side of Figure 3:
- **Stage 1 (Preprocessing)** accounts for **34%** of accuracy variance.
- **Stage 2 (Encoding)** accounts for **29%**.
- **Stage 4 (Optimization)** accounts for **19%**.
- And **Stage 3 (the Neural Backbone)** accounts for just **18%**!

Even more striking is **Ablation Study C** in the bottom right box: when lightweight MLPs and PatchTST are given the exact same RevIN, patching, and cosine learning-rate schedule as frozen 7-billion-parameter LLMs, the lightweight models match or beat the LLM backbones on **75% of full-shot benchmarks** at 1/50th the compute cost!"

---

## Slide 8: Evaluation Metrics & Fair Benchmarking Protocols (`7:45 – 8:45`)
**[Visual: Slide 8 — Core Metrics & Protocol Pitfalls from TFB VLDB'24]**

"On **Slide 8**, we synthesize how TSCOMP and the companion **TFB (VLDB 2024)** paper handle evaluation metrics and protocol fairness.

First, why report both **MSE** and **MAE** alongside **Spectral Distance** and **Pairwise Win-Rates**?
- **MSE** squares errors, so it acts as a stress test for how badly a model misses extreme peaks or regime shifts.
- **MAE** measures average L1 deviation, giving a much cleaner picture of day-to-day operational accuracy.
- And **Critical-Difference Ranks / Win-Rates** prevent a single high-variance dataset from skewing cross-dataset averages.

Second, on the right card, TSCOMP and TFB eliminate four notorious benchmarking bugs:
1. The infamous `drop_last=True` bug where incomplete test batches at the end of the split were silently dropped.
2. **Lookback window starvation**, where older baselines were forced to use a short 96-step lookback while new models used 336 or 512 steps.
3. Cherry-picking small 7-channel `ETT` datasets while ignoring 862-channel `Traffic` datasets.
4. Ignoring FLOPs, GPU memory, and wall-clock training time."

---

## Slide 9: Multi-Horizon Benchmark Results (`8:45 – 9:45`)
**[Visual: Slide 9 — Figure 4: Horizon Degradation & 6-Dataset Benchmark Table]**

"Let’s examine the multi-horizon benchmark results on **Slide 9 (Figure 4)**.

On the left grouped bar chart, we track average MSE as the prediction horizon $H$ stretches from **short ($H=96$)** to **medium ($H=192$)**, **long ($H=336$)**, and **ultra-long ($H=720$)**.
Notice how monolithic attention models degrade steepened at $H=720$ because self-attention weights blur over long noisy sequences. By contrast, **TSCOMP’s green bars** maintain the lowest error at every single horizon because the framework dynamically adapts its component recipe—using patch/variate attention at $H=96$, and shifting toward trend decomposition, linear/SSM backbones, and frequency loss at $H=720$.

On the right table, across six canonical benchmarks—`ETTh1`, `ETTm2`, `Weather`, `Electricity`, `Traffic`, and `Exchange`—TSCOMP’s zero-shot assembled pipelines consistently outperform holistic SOTA models including `DLinear`, `PatchTST`, `iTransformer`, and `Time-LLM`."

---

## Slide 10: Cross-Component Synergy Matrix (`9:45 – 10:45`)
**[Visual: Slide 10 — Figure 5: Backbone x Component Synergy Heatmap]**

"Why can’t we just turn on every single component at the same time? **Slide 10 (Figure 5)** answers that with the **Backbone-by-Component Synergy Matrix**.

- Look at Column 1 (`RevIN / DishTS`): it is dark green (`++`, +15% to +21%) across every single row. Instance normalization is a **universal positive booster**.
- Now look at Column 2 (`Trend-Seasonal Decomposition`): it gives a massive **+16% boost** to `Linear / MLP` backbones, but yields **0% to +2%** on `iTransformer` and `LLM` backbones. Why? Because variate attention and pre-trained patch embeddings already separate low-frequency trends internally; pre-splitting the signal is redundant and slightly hurts cross-channel phase alignment.
- Look at Columns 5 and 6 (`Channel-Independence` vs. `Channel-Mixing`): `PatchTST` and `MLPs` love Channel-Independence (+12% to +14%) and suffer under naive Channel-Mixing (-6% to -7%). Conversely, `iTransformer` *requires* Channel-Mixing (+16%) and collapses under Channel-Independence (-9%) because its tokens *are* the channels!

That’s why component *interactions* matter just as much as individual components."

---

## Slide 11: Automated Zero-Shot Model Synthesis (`10:45 – 11:35`)
**[Visual: Slide 11 — TabPFN Zero-Shot Pipeline Construction]**

"On **Slide 11**, we see how TSCOMP turns these 20,000 evaluations into a practical Auto-ML engine:
1. When you bring a brand-new time-series dataset, TSCOMP extracts fast statistical and spectral **meta-features**—stationarity, trend/seasonality ratio, spectral entropy, channel count $C$, and cross-channel correlation.
2. It passes those meta-features and your target horizon $H$ into a **TabPFN (Prior-Data Fitted Network)** meta-predictor trained on the 20,000-run corpus.
3. In **less than one second—with zero GPU training search**—TabPFN predicts the highest-ranking combination of Stage 1, 2, 3, and 4 components and builds the PyTorch pipeline automatically."

---

## Slide 12: Synthesizing Companion Survey Papers (`11:35 – 12:20`)
**[Visual: Slide 12 — Connecting TSCOMP, TFB (VLDB'24), and TSFM Survey (KDD'24)]**

"On **Slide 12**, let's tie our three survey pillars together:
- **TSCOMP (KDD)** gives us *intra-model* component deconstruction across 49 modules.
- **TFB (VLDB 2024)** gives us *inter-model* protocol fairness across 10 application domains.
- And the **KDD 2024 Foundation Models Survey** maps out pre-trained Time-Series Foundation Models (`Chronos`, `MOMENT`, `Time-LLM`).

Together, all three papers point to the exact same conclusion: **architecture fetishism is dead.** Data characteristics—stationarity, channel count, periodicity, and data scarcity—dictate which modular building blocks win."

---

## Slide 13: "My Two Cents" — Critical Analysis (`12:20 – 13:15`)
**[Visual: Slide 13 — Strengths vs. Limitations & Open Questions]**

"On **Slide 13**, I want to share **my own two cents**—both what I loved about TSCOMP and where I think it falls short.

**What I loved:**
1. It brings much-needed scientific honesty to ML benchmarking by auditing every preprocessing and loss trick transparently.
2. Using **Constrained Orthogonal Design** to compress a million combinations into 20,000 runs is brilliant data mining.
3. Proving that **Stage 4 (Optimization & Loss)** explains more variance (19%) than the **Backbone (18%)** is a massive practical takeaway—changing one line of loss code in PyTorch is free!

**Where the paper falls short:**
1. **Point Forecasting Only:** TSCOMP only evaluates point MSE and MAE. In real supply chains, finance, and energy grids, we need **probabilistic quantile intervals** (evaluated with CRPS or Pinball Loss) to quantify uncertainty.
2. **Missing Exogenous Variables:** Real-world forecasting depends heavily on known future covariates—like holiday calendars, retail promotions, or weather forecasts—which standard endogenous benchmarks ignore.
3. **Static Splits vs. Online Drift:** Production streams experience continuous concept drift, requiring online continual adaptation rather than fixed offline splits."

---

## Slide 14: Summary & Actionable Cheat Sheet (`13:15 – 14:00`)
**[Visual: Slide 14 — Top 4 Takeaways & Repository Artifacts]**

"Finally, wrapping up on **Slide 14**, if you are building a time-series forecaster tomorrow, here are the four rules to take away from our short story:
1. **Stop treating models as monoliths**—think in terms of Stage 1 (Prep), Stage 2 (Encoding), Stage 3 (Backbone), and Stage 4 (Optimization).
2. **Fix Stage 1 & Stage 2 first (63% of variance):** Always turn on **RevIN**, and let your channel count $C$ choose between **Patch Tokenization + Channel-Independence** (for low/noisy $C$) vs. **Inverted Variate Tokenization + Channel-Mixing** (for $C > 100$ correlated sensors).
3. **Ditch default MSE training loss on noisy data:** Train with **Smooth L1 (Huber)** or **Hybrid Frequency Loss** so outlier spikes don't ruin your gradients.
4. **Use Corpus-Driven Meta-Learning** (`SUFE-AILAB/TSCOMP`) or pre-trained TSFMs (`Chronos`) for cold-start regimes instead of brute-force guesswork.

All of the artifacts for this assignment—my original Medium article, all five custom visualization figures, the 14-slide presentation deck, and this video walkthrough—are linked in the public GitHub `README.md`. Thank you so much for watching!"

