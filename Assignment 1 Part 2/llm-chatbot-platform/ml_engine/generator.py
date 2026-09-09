import time
import torch
import torch.nn.functional as F
from typing import List, Generator, Dict, Any, Optional
from tokenizer import MiniTokenizer
from model import MiniLLM

class TextGenerator:
    """
    Autoregressive decoding engine supporting Temperature, Top-K, 
    Nucleus Top-P sampling, and Repetition Penalty with streaming.
    """
    def __init__(self, model: MiniLLM, tokenizer: MiniTokenizer, device: str = "cpu"):
        self.model = model.to(device)
        self.model.eval()
        self.tokenizer = tokenizer
        self.device = device

    def sample_next_token(
        self,
        logits: torch.Tensor,
        generated_ids: List[int],
        temperature: float = 0.7,
        top_k: int = 40,
        top_p: float = 0.9,
        repetition_penalty: float = 1.15,
    ) -> int:
        """
        Apply temperature scaling, repetition penalty, top-k and top-p filtering.
        """
        logits = logits.squeeze(0).clone() # Shape: [vocab_size]

        # 1. Repetition Penalty
        if repetition_penalty != 1.0 and generated_ids:
            for prev_id in set(generated_ids):
                if logits[prev_id] < 0:
                    logits[prev_id] *= repetition_penalty
                else:
                    logits[prev_id] /= repetition_penalty

        # 2. Temperature scaling
        temperature = max(temperature, 1e-5)
        logits = logits / temperature

        # 3. Top-K filtering
        if top_k > 0:
            top_k_val = min(top_k, logits.size(-1))
            indices_to_remove = logits < torch.topk(logits, top_k_val)[0][..., -1, None]
            logits[indices_to_remove] = float("-inf")

        # 4. Top-P (Nucleus) filtering
        if top_p < 1.0:
            sorted_logits, sorted_indices = torch.sort(logits, descending=True)
            cumulative_probs = torch.cumsum(F.softmax(sorted_logits, dim=-1), dim=-1)

            # Remove tokens with cumulative probability above the threshold
            sorted_indices_to_remove = cumulative_probs > top_p
            # Shift the indices to the right to keep also the first token above the threshold
            sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[..., :-1].clone()
            sorted_indices_to_remove[..., 0] = 0

            indices_to_remove = sorted_indices[sorted_indices_to_remove]
            logits[indices_to_remove] = float("-inf")

        # 5. Softmax to probability distribution
        probs = F.softmax(logits, dim=-1)
        next_token_id = torch.multinomial(probs, num_samples=1).item()
        return next_token_id

    @torch.no_grad()
    def generate(
        self,
        prompt: str,
        max_new_tokens: int = 100,
        temperature: float = 0.7,
        top_k: int = 40,
        top_p: float = 0.9,
        repetition_penalty: float = 1.15,
        stop_tokens: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        start_time = time.time()
        input_ids = self.tokenizer.encode(prompt)
        generated_ids = list(input_ids)

        stop_token_ids = [self.tokenizer.eos_token_id]
        if stop_tokens:
            for st in stop_tokens:
                if st in self.tokenizer.vocab:
                    stop_token_ids.append(self.tokenizer.vocab[st])

        for _ in range(max_new_tokens):
            cur_tensor = torch.tensor([generated_ids], dtype=torch.long, device=self.device)
            # Clip to max context length
            if cur_tensor.size(1) > self.model.config["max_seq_len"]:
                cur_tensor = cur_tensor[:, -self.model.config["max_seq_len"]:]

            logits, _, _ = self.model(cur_tensor)
            next_logits = logits[:, -1, :]

            next_id = self.sample_next_token(
                next_logits,
                generated_ids,
                temperature=temperature,
                top_k=top_k,
                top_p=top_p,
                repetition_penalty=repetition_penalty,
            )

            generated_ids.append(next_id)
            if next_id in stop_token_ids:
                break

        elapsed_sec = time.time() - start_time
        num_new_tokens = len(generated_ids) - len(input_ids)
        tokens_per_sec = num_new_tokens / max(elapsed_sec, 1e-4)

        full_text = self.tokenizer.decode(generated_ids)
        response_text = self.tokenizer.decode(generated_ids[len(input_ids):])

        return {
            "prompt": prompt,
            "response": response_text.replace("<|eos|>", "").strip(),
            "full_text": full_text,
            "tokens_generated": num_new_tokens,
            "elapsed_seconds": round(elapsed_sec, 3),
            "tokens_per_second": round(tokens_per_sec, 1),
        }

    @torch.no_grad()
    def generate_stream(
        self,
        prompt: str,
        max_new_tokens: int = 150,
        temperature: float = 0.7,
        top_k: int = 40,
        top_p: float = 0.9,
        repetition_penalty: float = 1.15,
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Streaming token generator yielding real-time chunks for SSE.
        """
        input_ids = self.tokenizer.encode(prompt)
        generated_ids = list(input_ids)
        start_time = time.time()

        for step in range(max_new_tokens):
            cur_tensor = torch.tensor([generated_ids], dtype=torch.long, device=self.device)
            if cur_tensor.size(1) > self.model.config["max_seq_len"]:
                cur_tensor = cur_tensor[:, -self.model.config["max_seq_len"]:]

            logits, _, _ = self.model(cur_tensor)
            next_logits = logits[:, -1, :]

            next_id = self.sample_next_token(
                next_logits,
                generated_ids,
                temperature=temperature,
                top_k=top_k,
                top_p=top_p,
                repetition_penalty=repetition_penalty,
            )

            generated_ids.append(next_id)
            token_text = self.tokenizer.decode([next_id])

            # Check for EOS
            is_eos = (next_id == self.tokenizer.eos_token_id)

            yield {
                "token": token_text,
                "token_id": next_id,
                "step": step + 1,
                "is_eos": is_eos,
                "elapsed_ms": round((time.time() - start_time) * 1000, 1),
            }

            if is_eos:
                break

    @torch.no_grad()
    def extract_attention_weights(self, text: str) -> Dict[str, Any]:
        """
        Extract multi-head attention weight matrices across all layers 
        for interactive attention heatmap visualization.
        """
        tokens_info = self.tokenizer.tokenize_with_segments(text)
        token_ids = [t["token_id"] for t in tokens_info]
        token_labels = [t["token"] for t in tokens_info]

        input_tensor = torch.tensor([token_ids], dtype=torch.long, device=self.device)
        _, _, all_attentions = self.model(input_tensor, return_attention=True)

        layers_data = []
        if all_attentions:
            for l_idx, layer_attn in enumerate(all_attentions):
                # layer_attn shape: [1, n_heads, seq_len, seq_len]
                attn_matrix = layer_attn.squeeze(0).cpu().numpy() # [n_heads, S, S]
                heads_matrices = []
                for h_idx in range(attn_matrix.shape[0]):
                    heads_matrices.append(attn_matrix[h_idx].tolist())

                layers_data.append({
                    "layer_index": l_idx,
                    "heads": heads_matrices
                })

        return {
            "tokens": token_labels,
            "token_ids": token_ids,
            "seq_len": len(token_labels),
            "n_layers": len(layers_data),
            "n_heads": self.model.config["n_heads"],
            "layers": layers_data
        }
