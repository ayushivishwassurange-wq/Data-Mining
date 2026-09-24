# AI & Machine Learning Foundations: Data Pipelines, Tensors, and Architecture

This directory contains fully executed Google Colab notebooks exploring the foundational data engineering, linear algebra, tensor representations, calculus optimization, probability theory, and visualization techniques that underpin Artificial Intelligence and Deep Learning architectures.

---

## 📺 Complete Index of Walkthrough Videos & Executed Notebooks

All 16 notebooks are pre-executed with complete inputs, outputs, and plots stored.

| # | Topic / Notebook | Core Concepts & Mathematical Focus | Executed Notebook | YouTube Walkthrough Video |
|---|---|---|---|---|
| **01** | **NumPy Foundations for Deep Learning** | N-dimensional tensors, broadcasting, matrix multiplication, activation functions, manual backpropagation from scratch | [Open Notebook](./final_numpy_foundations_for_deep_learning.ipynb) | [▶️ Watch Video](https://youtu.be/GL3Zc5GpNpY?si=FgHctsvD5UB9r5Nm) |
| **02** | **Pandas: Zero to Hero** | Series/DataFrame architecture, label-based index alignment, vectorization, data cleaning (MCAR/MAR/MNAR), GroupBy (agg/transform/apply), reshaping, time series, performance benchmarking | [Open Notebook](./final_pandas_zero_to_hero.ipynb) | [▶️ Watch Video](https://youtu.be/d6XSuV845nc?si=x4mQBLesH_B4I6Nd) |
| **03** | **Matplotlib: Zero to Hero** | Object-Oriented Figure/Axes architecture, artist trees, chart selection mathematics, tick/locator control, coordinate transforms, GridSpec multi-panel layouts, perceptually uniform colormaps | [Open Notebook](./final_matplotlib_zero_to_hero.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_MATPLOTLIB_VIDEO_ID) |
| **04** | **Foundations 1: The Learning Machine** | AI vs ML vs DL taxonomy, scaling laws & learning curves, the universal 4-beat cycle (Data, Model, Loss, Update), generalization vs lookup tables, model capacity & overfitting | [Open Notebook](./final_foundations_1_the_learning_machine.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_FOUNDATIONS_1_VIDEO_ID) |
| **05** | **Foundations 2: Linear Algebra (The MODEL Box)** | Matrices as spatial transformations, tracking unit basis vectors $\hat{i}$ and $\hat{j}$, dot products as projections, determinants as volume scaling factors, rank-nullity collapse, eigenvectors & PCA | [Open Notebook](./final_foundations_2_linear_algebra.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_FOUNDATIONS_2_VIDEO_ID) |
| **06** | **Foundations 3: Probability (The DATA Box)** | Conditional probability as sample space restriction, Bayes' theorem symmetry, base rate fallacy in rare events, discrete/continuous distributions, Naive Bayes classifier, accuracy paradox & ROC/AUC | [Open Notebook](./final_foundations_3_probability.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_FOUNDATIONS_3_VIDEO_ID) |
| **07** | **Foundations 4: Calculus (The LOSS & UPDATE Boxes)** | Instantaneous derivatives, multivariable gradients as steepest ascent directions, gradient descent dynamics, Chain Rule through composite functions, backpropagation computational graph caching, gradient checking | [Open Notebook](./final_foundations_4_calculus.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_FOUNDATIONS_4_VIDEO_ID) |
| **08** | **Python for Machine Learning** | Primitives, lists vs tuples vs dictionaries, control flow, C-level list comprehensions, modular functional programming, OOP encapsulation (`nn.Module` design patterns), scientific package bridging | [Open Notebook](./final_Intro_to_Python_for_Machine_Learning.ipynb) | [▶️ Watch Video](https://youtu.be/NvgRUzRqLTM?si=mvV0BgvOU3JLgSwQ) |
| **09** | **Linear Algebra for Deep Learning** | Tensor ranks (scalars to 4D batches), vector angles, non-commutative matrix multiplication in dense layers, Transformer Scaled Dot-Product Attention ($QK^T$), matrix properties, $L_1$/$L_2$ regularization norms | [Open Notebook](./linear_algebra_for_deep_learning.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_LA_DL_VIDEO_ID) |
| **10** | **Calculus for Deep Learning** | Multivariate gradient vectors, Chain Rule gear ratios, step-by-step manual backpropagation through a 2-layer neural network, vanishing/exploding gradient analysis, PyTorch dynamic autograd DAGs | [Open Notebook](./final_calculus_for_deep_learning.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_CALC_DL_VIDEO_ID) |
| **11** | **Probability Fundamentals for Deep Learning** | Gaussian/Bernoulli/Categorical PDFs, empirical expectation & variance in loss functions, Maximum Likelihood Estimation (MLE), Shannon entropy, cross-entropy loss, KL divergence | [Open Notebook](./final_probability_fundamentals_for_deep_learning.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_PROB_DL_VIDEO_ID) |
| **12** | **Statistics for Deep Learning** | The 3 statistical pillars of DL, descriptive statistics, z-score standardization, Batch Normalization forward mechanics ($\hat{x} \gamma + \beta$), Xavier & He Normal weight initialization, hypothesis testing on models | [Open Notebook](./final_statistics_for_deep_learning.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_STATS_DL_VIDEO_ID) |
| **13** | **Zero to Hero: Linear Algebra for ML** | Feature spaces, vector arithmetic & linear spans, dot products & cosine similarity, matrices as spatial linear operators, determinants, matrix inverses, rank-nullity theorem, eigenvectors & full PCA from scratch | [Open Notebook](./final_intro_to_linear_algebra_zero_to_hero_for_ml.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_ZTH_LA_VIDEO_ID) |
| **14** | **Zero to Hero: Calculus for ML** | Secant rates of change to instantaneous tangent limits, activation derivatives (Sigmoid, Tanh, ReLU), Chain Rule derivation, partial derivatives & tangent planes, gradient descent dynamics, computational graphs | [Open Notebook](./final_intro_to_calculus_zero_to_hero_for_ml.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_ZTH_CALC_VIDEO_ID) |
| **15** | **Zero to Hero: Probability for ML** | Kolmogorov axioms, combining events (AND, OR, NOT), conditional probability as sample space restriction, Bayes' rule derivation, discrete/continuous distributions, covariance matrices, Anscombe's quartet, MLE | [Open Notebook](./final_intro_to_probability_zero_to_hero_for_ml.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_ZTH_PROB_VIDEO_ID) |
| **16** | **Zero to Hero: Statistics for ML** | Descriptive metrics, sampling variability & i.i.d. assumptions, Central Limit Theorem (CLT) simulation, confidence intervals (bootstrap vs t), hypothesis testing & p-values, Welch's t-test, OLS regression, Simpson's paradox | [Open Notebook](./final_intro_to_statistics_zero_to_hero_for_ml.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_ZTH_STATS_VIDEO_ID) |

---

## 🧠 Core Engineering & Mathematical Foundations

### 1. The Learning Machine Architecture
* **The Four Beats:** Every AI algorithm consumes Data ($X, Y$), projects through a parameterized Model ($\hat{y} = f(x; \theta)$), evaluates scalar error via a Loss Function ($L(\hat{y}, y)$), and computes downhill parameter Updates ($\theta \leftarrow \theta - \eta \nabla L$).
* **Scaling Laws:** While human-crafted heuristic rule engines plateau rapidly, machine learning models exhibit power-law scaling, continually refining decision boundaries as data volume increases.

### 2. Linear Algebra: The MODEL Box
* **Geometric Spatial Mapping:** A matrix is a dynamic geometric transformation. Its columns are the exact coordinates where the unit basis vectors $\hat{i}$ and $\hat{j}$ land after transformation.
* **The Dot Product:** Measures directional projection and geometric similarity. Powers modern Transformer Self-Attention: $\text{softmax}(QK^T / \sqrt{d_k})V$.
* **Spectral Analysis (Eigenvectors & SVD):** Eigenvectors are the invariant axes that maintain their spatial orientation under transformation. Computing the eigenvectors of the data covariance matrix enables optimal dimensionality reduction via Principal Component Analysis (PCA).

### 3. Calculus: The LOSS & UPDATE Boxes
* **The Gradient:** The multivariate vector of partial derivatives $\nabla L$ points in the direction of steepest ascent. Subtracting the gradient ($\theta \leftarrow \theta - \eta \nabla L$) guarantees descent toward minimal loss.
* **The Chain Rule & Backpropagation:** Deep networks are composite functions. The Chain Rule decomposes global loss sensitivities into products of local derivatives. Backpropagation caches intermediate activations on the forward pass and flows gradients backward across the Directed Acyclic Graph (DAG) without redundant operations.
* **Gradient Checking:** Comparing analytical backprop derivatives against numerical two-sided finite difference approximations ($\frac{L(\theta + \epsilon) - L(\theta - \epsilon)}{2\epsilon}$) verifies gradient code integrity to a tolerance of $< 10^{-7}$.

### 4. Probability & Statistics: The DATA Box
* **Conditional Probability & Bayes' Rule:** Conditioning restricts the sample space universe. Bayes' Rule ($P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}$) inverts causal directions, enabling Bayesian parameter updating and medical diagnostic inference.
* **Maximum Likelihood Estimation (MLE):** Optimizing neural network parameters is mathematically equivalent to finding parameters that maximize the likelihood of the training data, which reduces directly to minimizing Cross-Entropy loss under categorical distributions.
* **Statistical Rigor & Normalization:** Batch Normalization stabilizes internal covariate shift by standardizing layer inputs ($\hat{x} = \frac{x - \mu}{\sigma}$). Statistical hypothesis testing (paired permutation tests, Welch's t-tests) prevents researchers from chasing random noise in model comparisons.

---

## 🛠️ Directory Structure

```text
notebooks/
├── final_numpy_foundations_for_deep_learning.ipynb              # Executed NumPy notebook
├── final_pandas_zero_to_hero.ipynb                             # Executed Pandas notebook
├── final_matplotlib_zero_to_hero.ipynb                         # Executed Matplotlib notebook
├── final_foundations_1_the_learning_machine.ipynb              # Executed Foundations 1 notebook
├── final_foundations_2_linear_algebra.ipynb                    # Executed Foundations 2 notebook
├── final_foundations_3_probability.ipynb                       # Executed Foundations 3 notebook
├── final_foundations_4_calculus.ipynb                          # Executed Foundations 4 notebook
├── final_Intro_to_Python_for_Machine_Learning.ipynb            # Executed Python for ML notebook
├── linear_algebra_for_deep_learning.ipynb                      # Executed Linear Algebra for DL notebook
├── final_calculus_for_deep_learning.ipynb                      # Executed Calculus for DL notebook
├── final_probability_fundamentals_for_deep_learning.ipynb      # Executed Probability for DL notebook
├── final_statistics_for_deep_learning.ipynb                    # Executed Statistics for DL notebook
├── final_intro_to_linear_algebra_zero_to_hero_for_ml.ipynb     # Executed Zero to Hero LA notebook
├── final_intro_to_calculus_zero_to_hero_for_ml.ipynb           # Executed Zero to Hero Calculus notebook
├── final_intro_to_probability_zero_to_hero_for_ml.ipynb        # Executed Zero to Hero Probability notebook
├── final_intro_to_statistics_zero_to_hero_for_ml.ipynb         # Executed Zero to Hero Statistics notebook
└── README.md                                                   # Master curriculum guide
```
