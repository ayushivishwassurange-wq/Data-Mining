import math
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Optional, Tuple, Dict, Any, List

class RMSNorm(nn.Module):
    """
    Root Mean Square Layer Normalization (LLaMA / Mistral standard).
    Faster and more stable than standard LayerNorm by omitting mean-centering.
    """
    def __init__(self, dim: int, eps: float = 1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # RMS = sqrt(mean(x^2) + eps)
        norm = torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)
        return x * norm * self.weight

class RotaryPositionalEmbedding(nn.Module):
    """
    Rotary Position Embedding (RoPE) for relative position awareness 
    and superior length extrapolation.
    """
    def __init__(self, dim: int, max_seq_len: int = 512, base: float = 10000.0):
        super().__init__()
        self.dim = dim
        inv_freq = 1.0 / (base ** (torch.arange(0, dim, 2).float() / dim))
        self.register_buffer("inv_freq", inv_freq, persistent=False)

        t = torch.arange(max_seq_len, dtype=torch.float32)
        freqs = torch.outer(t, inv_freq)
        # Shape: [max_seq_len, dim // 2, 2]
        emb = torch.cat((freqs, freqs), dim=-1)
        self.register_buffer("cos_cached", emb.cos(), persistent=False)
        self.register_buffer("sin_cached", emb.sin(), persistent=False)

    def forward(self, x: torch.Tensor, seq_len: int) -> Tuple[torch.Tensor, torch.Tensor]:
        return self.cos_cached[:seq_len, :], self.sin_cached[:seq_len, :]

def rotate_half(x: torch.Tensor) -> torch.Tensor:
    x1 = x[..., : x.shape[-1] // 2]
    x2 = x[..., x.shape[-1] // 2 :]
    return torch.cat((-x2, x1), dim=-1)

def apply_rotary_pos_emb(q: torch.Tensor, k: torch.Tensor, cos: torch.Tensor, sin: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
    # q, k shape: [B, H, S, D] -> cos, sin broadcast to [1, 1, S, D]
    cos = cos.unsqueeze(0).unsqueeze(0)
    sin = sin.unsqueeze(0).unsqueeze(0)
    q_rot = (q * cos) + (rotate_half(q) * sin)
    k_rot = (k * cos) + (rotate_half(k) * sin)
    return q_rot, k_rot

class CausalSelfAttention(nn.Module):
    """
    Multi-Head Self-Attention with RoPE, Causal Triangular Masking, 
    and Attention Weights extraction for explainability.
    """
    def __init__(self, d_model: int, n_heads: int, max_seq_len: int = 512, dropout: float = 0.1):
        super().__init__()
        assert d_model % n_heads == 0, "d_model must be divisible by n_heads"
        self.d_model = d_model
        self.n_heads = n_heads
        self.head_dim = d_model // n_heads

        self.q_proj = nn.Linear(d_model, d_model, bias=False)
        self.k_proj = nn.Linear(d_model, d_model, bias=False)
        self.v_proj = nn.Linear(d_model, d_model, bias=False)
        self.out_proj = nn.Linear(d_model, d_model, bias=False)

        self.dropout = nn.Dropout(dropout)
        self.rope = RotaryPositionalEmbedding(self.head_dim, max_seq_len=max_seq_len)

        # Causal lower-triangular mask
        mask = torch.tril(torch.ones(max_seq_len, max_seq_len)).view(1, 1, max_seq_len, max_seq_len)
        self.register_buffer("causal_mask", mask, persistent=False)

    def forward(self, x: torch.Tensor, return_attention: bool = False) -> Tuple[torch.Tensor, Optional[torch.Tensor]]:
        B, S, C = x.shape

        # Linear projections
        q = self.q_proj(x).view(B, S, self.n_heads, self.head_dim).transpose(1, 2)
        k = self.k_proj(x).view(B, S, self.n_heads, self.head_dim).transpose(1, 2)
        v = self.v_proj(x).view(B, S, self.n_heads, self.head_dim).transpose(1, 2)

        # Apply RoPE
        cos, sin = self.rope(v, S)
        q, k = apply_rotary_pos_emb(q, k, cos, sin)

        # Scaled Dot-Product Attention: (Q * K^T) / sqrt(d_k)
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.head_dim)
        
        # Apply causal mask (prevent attending to future tokens)
        mask = self.causal_mask[:, :, :S, :S]
        scores = scores.masked_fill(mask == 0, float("-inf"))
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights_dropped = self.dropout(attn_weights)

        # Output projection
        out = torch.matmul(attn_weights_dropped, v)
        out = out.transpose(1, 2).contiguous().view(B, S, C)
        out = self.out_proj(out)

        return out, (attn_weights if return_attention else None)

class SwiGLUMlp(nn.Module):
    """
    SwiGLU (Swish Gated Linear Unit) Feed-Forward Network.
    State-of-the-art activation function used in LLaMA 3, PaLM, and Mistral.
    """
    def __init__(self, d_model: int, hidden_dim: int, dropout: float = 0.1):
        super().__init__()
        self.gate_proj = nn.Linear(d_model, hidden_dim, bias=False)
        self.up_proj = nn.Linear(d_model, hidden_dim, bias=False)
        self.down_proj = nn.Linear(hidden_dim, d_model, bias=False)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # SwiGLU(x) = (SiLU(x * W_gate) * (x * W_up)) * W_down
        gate = F.silu(self.gate_proj(x))
        up = self.up_proj(x)
        out = self.down_proj(gate * up)
        return self.dropout(out)

class TransformerBlock(nn.Module):
    """
    Modern Pre-LN Transformer Decoder Block.
    """
    def __init__(self, d_model: int, n_heads: int, hidden_dim: int, max_seq_len: int = 512, dropout: float = 0.1):
        super().__init__()
        self.norm1 = RMSNorm(d_model)
        self.attn = CausalSelfAttention(d_model, n_heads, max_seq_len=max_seq_len, dropout=dropout)
        self.norm2 = RMSNorm(d_model)
        self.mlp = SwiGLUMlp(d_model, hidden_dim, dropout=dropout)

    def forward(self, x: torch.Tensor, return_attention: bool = False) -> Tuple[torch.Tensor, Optional[torch.Tensor]]:
        normed_x = self.norm1(x)
        attn_out, attn_weights = self.attn(normed_x, return_attention=return_attention)
        x = x + attn_out
        x = x + self.mlp(self.norm2(x))
        return x, attn_weights

class MiniLLM(nn.Module):
    """
    State-of-the-Art Compact Autoregressive Decoder-Only LLM.
    Configured for rapid training & sub-2ms inference on laptop CPU/GPU.
    """
    def __init__(
        self,
        vocab_size: int,
        d_model: int = 128,
        n_layers: int = 4,
        n_heads: int = 4,
        hidden_dim: int = 384,
        max_seq_len: int = 256,
        dropout: float = 0.1,
    ):
        super().__init__()
        self.config = {
            "vocab_size": vocab_size,
            "d_model": d_model,
            "n_layers": n_layers,
            "n_heads": n_heads,
            "hidden_dim": hidden_dim,
            "max_seq_len": max_seq_len,
            "dropout": dropout,
        }

        self.tok_embeddings = nn.Embedding(vocab_size, d_model)
        self.dropout = nn.Dropout(dropout)

        self.layers = nn.ModuleList([
            TransformerBlock(d_model, n_heads, hidden_dim, max_seq_len=max_seq_len, dropout=dropout)
            for _ in range(n_layers)
        ])

        self.norm_f = RMSNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)

        # Weight tying (share token embedding weights with output projection)
        self.tok_embeddings.weight = self.lm_head.weight

        # Weight initialization
        self.apply(self._init_weights)

    def _init_weights(self, module):
        if isinstance(module, nn.Linear):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)
            if module.bias is not None:
                torch.nn.init.zeros_(module.bias)
        elif isinstance(module, nn.Embedding):
            torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)

    def count_parameters(self) -> int:
        return sum(p.numel() for p in self.parameters() if p.requires_grad)

    def forward(
        self,
        input_ids: torch.Tensor,
        targets: Optional[torch.Tensor] = None,
        return_attention: bool = False,
    ) -> Tuple[torch.Tensor, Optional[torch.Tensor], Optional[List[torch.Tensor]]]:
        B, S = input_ids.shape
        x = self.tok_embeddings(input_ids)
        x = self.dropout(x)

        all_attentions = [] if return_attention else None

        for layer in self.layers:
            x, attn_w = layer(x, return_attention=return_attention)
            if return_attention and attn_w is not None:
                all_attentions.append(attn_w)

        x = self.norm_f(x)
        logits = self.lm_head(x)

        loss = None
        if targets is not None:
            # Shift targets for next-token Cross-Entropy loss
            loss = F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1), ignore_index=-1)

        return logits, loss, all_attentions
