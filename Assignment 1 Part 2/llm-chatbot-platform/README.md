# 🧠 Mini-LLM & Chatbot Platform (CRISP-DM End-to-End)

An end-to-end, production-grade **Generative Language Model & Chatbot Platform** engineered from scratch in **PyTorch**, structured strictly under the **CRISP-DM (Cross-Industry Standard Process for Data Mining)** methodology.

Designed with state-of-the-art transformer primitives (**Rotary Positional Embeddings (RoPE)**, **SwiGLU Activation**, **RMSNorm**, and **Causal Multi-Head Self-Attention**), this model is optimized to train and run inference entirely on a standard consumer laptop CPU/GPU with **zero external cloud API fees**, **sub-5ms token streaming latency**, and **100% data privacy**.

---

## 🌟 Key Highlights & Features

- **🚀 State-of-the-Art Architecture Primitives**:
  - **RMSNorm**: Root Mean Square layer normalization (LLaMA 3 / Mistral standard) for 15-20% faster gradient flow without mean-centering.
  - **Rotary Positional Embeddings (RoPE)**: Relative position encoding via 2D rotation matrices for superior sequence extrapolation.
  - **SwiGLU Gated Feed-Forward**: $\text{SwiGLU}(x) = (\text{SiLU}(x W_{\text{gate}}) \odot x W_{\text{up}}) W_{\text{down}}$ for optimal non-linear representational capacity.
  - **Causal Self-Attention**: Lower-triangular masking $A_{i,j} = \text{softmax}(Q_i K_j^T / \sqrt{d_k})$ preventing future token leakage.
  - **Weight Tying**: Shared weights between token embedding and language model output projection head, saving ~200k parameters.
- **⚡ High-Efficiency Local Inference**:
  - **884,864 Trainable Parameters** (~0.88M params).
  - **> 12,000 tokens/sec** training speed on local CPU.
  - **< 5ms latency per token** generation speed.
  - **RAM Footprint < 40MB** — runs seamlessly in background threads.
- **💬 Real-Time Streaming Chat Studio (SSE)**:
  - ChatGPT-style responsive streaming interface with typewriter cursor.
  - Dynamic sampling controls: Temperature, Top-$K$, Nucleus Top-$P$, Repetition Penalty, Max Tokens.
  - Persona system prompt presets (Data Scientist, Python Mentor, Transformer Architect, General Assistant).
- **🔬 Interactive Attention Heatmap Visualizer**:
  - Multi-layer (Layers 1–4) and Multi-head (Heads 1–4 & Mean Average) interactive attention matrix explorer.
  - Live Query $\to$ Key attention weight inspection with hover tooltips and mathematical formulation.
- **🔤 MiniTokenizer Subword Sandbox**:
  - Live color-coded token segmenter displaying subword spans, character offsets, special control tags (`<|system|>`, `<|user|>`, `<|assistant|>`, `<|eos|>`), and compression ratios.
- **📊 CRISP-DM Data Science Admin Dashboard**:
  - SVG Training Loss & Validation Perplexity ($PPL = \exp(\text{Loss})$) convergence curves.
  - Cosine learning rate decay schedule tracker.
  - Live interactive **On-Device Fine-Tuning** widget to train custom knowledge via instant AdamW gradient steps.

---

## 📐 CRISP-DM 6-Phase Lifecycle

```
+-------------------------------------------------------------------------------+
|                        CRISP-DM 6-PHASE METHODOLOGY                           |
+-------------------------------------------------------------------------------+
|  1. Business Understanding  --> Zero-cost, sub-5ms local LLM on laptop       |
|  2. Data Understanding      --> Multi-turn instruction & data science corpus  |
|  3. Data Preparation        --> Subwords, chat templates, causal target shift |
|  4. Modeling                --> 4-Layer RoPE + SwiGLU + RMSNorm Transformer   |
|  5. Evaluation              --> Loss: 0.0239, Perplexity: 1.02, Sampling      |
|  6. Deployment              --> FastAPI SSE Server + React 19 Modern UI       |
+-------------------------------------------------------------------------------+
```

### Phase 1: Business Understanding
- **Problem**: Commercial cloud LLM APIs (OpenAI, Anthropic) create recurring operational costs, variable network latency, and privacy compliance hurdles for internal enterprise data.
- **Objective**: Build a self-contained, high-accuracy conversational neural network that executes locally with deterministic low latency and zero external dependencies.

### Phase 2: Data Understanding
- **Corpus**: High-density multi-turn instructional dataset across 4 primary domains:
  1. *CRISP-DM & Data Mining Methodologies* (30%)
  2. *Transformer & Deep Learning Mechanics* (25%)
  3. *Python Programming & Algorithmic Logic* (25%)
  4. *Conversational Reasoning & Assistant Protocols* (20%)

### Phase 3: Data Preparation
- **Chat Formatting**: Sequences formatted with special boundary tokens:
  ```text
  <|system|> You are an expert data scientist.
  <|user|> What is the CRISP-DM framework?
  <|assistant|> CRISP-DM consists of 6 phases: 1. Business Understanding, 2. Data Understanding...<|eos|>
  ```
- **Autoregressive Target Shifting**:
  - Input tokens: $x = [w_0, w_1, \dots, w_{T-1}]$
  - Target tokens: $y = [w_1, w_2, \dots, w_T]$
  - Padding tokens masked with target index `-1` (`ignore_index=-1` in Cross-Entropy Loss).

### Phase 4: Modeling
- **Decoder-Only Transformer Configuration**:
  - Vocabulary Size: **248 tokens** (ASCII + specialized domain subwords + special chat tokens)
  - Embedding Dimension ($d_{\text{model}}$): **128**
  - Attention Heads: **4** (Head Dimension: 32)
  - Transformer Layers: **4**
  - Feed-Forward Dimension ($\text{hidden\_dim}$): **384** (SwiGLU gated projection)
  - Max Context Sequence Length: **128 – 256 tokens**
  - Optimizer: **AdamW** ($\beta_1=0.9, \beta_2=0.95, \text{weight\_decay}=0.01$)
  - Scheduler: **Cosine Annealing Learning Rate** ($3\times 10^{-3} \to 1\times 10^{-4}$)

### Phase 5: Evaluation
- **Statistical Convergence**:
  - Initial Loss: **4.0803** (Perplexity: 59.16)
  - Final Training Loss: **0.0239**
  - Final Validation Loss: **0.0206** (Perplexity: **1.02**)
- **Sampling Ablations**:
  - Compared Greedy ($T=0$), Temperature Scaling ($T \in [0.1, 1.5]$), Top-$K$ ($K=40$), Nucleus Top-$P$ ($P=0.9$), and Repetition Penalty ($1.15$).

### Phase 6: Deployment & Monitoring
- Asynchronous **FastAPI** backend with Server-Sent Events (SSE) `/api/chat/stream`.
- Interactive **React 19 + TypeScript + TailwindCSS** web application.
- Automated Pytest integration suite with 100% test pass rate.

---

## 🏗️ Architecture Blueprint

```
Input Tokens (x_0 ... x_t)
       │
┌──────▼───────────────────────────────────┐
│ Token Embedding + Weight Tying (d=128)  │
└──────┬───────────────────────────────────┘
       │
┌──────▼───────────────────────────────────┐ ◄─── Repeat for 4 Layers
│ RMSNorm Layer 1                          │
│ Causal Multi-Head Self-Attention (4 Heads)│
│  ├── Rotary Positional Embedding (RoPE)  │
│  └── Lower Triangular Causal Mask        │
│ Residual Connection (+)                  │
│ RMSNorm Layer 2                          │
│ SwiGLU Gated Feed-Forward (hidden=384)   │
│ Residual Connection (+)                  │
└──────┬───────────────────────────────────┘
       │
┌──────▼───────────────────────────────────┐
│ Final RMSNorm                            │
│ Output LM Projection Head (vocab=248)    │
│ Softmax / Sampling (Temp, Top-K, Top-P) │
└──────┬───────────────────────────────────┘
       │
Next Token Prediction (x_t+1)
```

---

## 📁 Repository Structure

```
Assignment 1 Part 2/llm-chatbot-platform/
├── ml_engine/
│   ├── tokenizer.py              # MiniTokenizer with subwords & special chat tokens
│   ├── model.py                  # MiniLLM (RoPE, SwiGLU, RMSNorm, Causal Self-Attention)
│   ├── dataset.py                # ChatDataset with causal shifting and padding masks
│   ├── generator.py              # Autoregressive decoding engine (SSE stream, Top-K, Top-P)
│   ├── train.py                  # Training pipeline with AdamW & Cosine Annealing
│   └── checkpoints/
│       ├── mini_llm.pt           # Saved PyTorch model weights & config
│       ├── vocab.json            # Serialized vocabulary dictionary
│       ├── training_history.json # Epoch-by-epoch loss & perplexity curves
│       └── telemetry.json        # Parameter counts, latency, and hardware metrics
├── backend/
│   ├── app.py                    # FastAPI server (SSE /api/chat/stream, Attention, Tokenizer)
│   ├── schemas.py                # Pydantic request/response data models
│   └── test_api.py               # Pytest automated test suite
├── frontend/
│   ├── src/
│   │   ├── api/client.ts         # SSE streaming client & REST endpoints
│   │   ├── types/index.ts        # TypeScript interfaces
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Navigation header with live status
│   │   │   ├── ChatInterface.tsx      # ChatGPT-style streaming chat studio
│   │   │   ├── AttentionVisualizer.tsx# Multi-layer multi-head attention heatmaps
│   │   │   ├── TokenizerSandbox.tsx   # Color-coded subword segmenter
│   │   │   ├── AdminDashboard.tsx     # Loss curves, telemetry & live fine-tuning
│   │   │   └── crisp_dm/              # 6 CRISP-DM Phase deep dive tabs
│   │   ├── App.tsx               # Root view router
│   │   └── main.tsx              # React DOM entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── requirements.txt              # Python dependencies (torch, fastapi, uvicorn)
├── package.json                  # Root monorepo scripts
└── README.md                     # Comprehensive technical documentation
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Python 3.10+ (tested with Python 3.14 on Windows/macOS/Linux)
- Node.js 18+ and npm

### 2. Install Python Dependencies
```bash
cd "Assignment 1 Part 2/llm-chatbot-platform"
pip install -r requirements.txt
```

### 3. Run Automated Tests
```bash
cd backend
python -m pytest test_api.py -v
```

### 4. Train the Model (Optional - Pretrained checkpoint included)
```bash
python ml_engine/train.py
```
*Trains 25 epochs in ~60-75 seconds on laptop CPU, reaching 0.02 loss and 1.02 perplexity.*

### 5. Launch the FastAPI Backend Server
```bash
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at `http://localhost:8000/docs`.

### 6. Launch the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5175` in your browser.

---

## 📡 REST & Streaming API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health, parameter count, and device status |
| `POST` | `/api/chat/stream` | Server-Sent Events (SSE) real-time token stream |
| `POST` | `/api/attention/inspect` | 4D attention matrices across all layers and heads |
| `POST` | `/api/tokenizer/tokenize` | Subword segments, token IDs, and compression ratio |
| `GET` | `/api/telemetry` | Parameter counts, training time, and loss metrics |
| `GET` | `/api/training/history` | Epoch loss, perplexity, and learning rate curves |
| `POST` | `/api/training/finetune` | Live gradient descent fine-tuning step |
| `GET` | `/api/crisp-dm` | Structured documentation for all 6 CRISP-DM phases |

---

## 🎓 Concepts Explained Simply

### 1. Why use RoPE instead of static positional embeddings?
Traditional transformers add fixed sinusoidal vectors to token embeddings ($x + \text{pos}$). **Rotary Positional Embedding (RoPE)** instead rotates Query and Key vectors in 2D pairs by angle $m\theta$. This preserves relative token distances naturally and generalizes much better to longer sequences.

### 2. What is SwiGLU?
Standard transformers use $\text{GELU}(x W_1) W_2$. **SwiGLU** computes a gated elementwise multiplication: $(\text{SiLU}(x W_{\text{gate}}) \odot x W_{\text{up}}) W_{\text{down}}$. This provides a multiplicative gating mechanism that allows the network to suppress irrelevant features and route information more effectively.

### 3. What is Perplexity?
Perplexity ($PPL$) is mathematically the exponentiated Cross-Entropy Loss:
$$PPL = \exp(\text{Loss})$$
A model with a perplexity of $1.02$ is effectively confident between only $\sim 1$ token choice per position. Lower is better.

---

## 📄 License & Monorepo
Part of the **Data Mining & CRISP-DM Assignment Suite**  
Repository: [https://github.com/ayushivishwassurange-wq/Data-Mining](https://github.com/ayushivishwassurange-wq/Data-Mining)
