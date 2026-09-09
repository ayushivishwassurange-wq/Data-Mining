import json
import os
from typing import List, Dict, Tuple

class MiniTokenizer:
    """
    Lightweight Subword & Character Tokenizer with special Chat tokens 
    designed for high-efficiency local inference and visual explainability.
    """
    SPECIAL_TOKENS = [
        "<|pad|>",
        "<|unk|>",
        "<|bos|>",
        "<|eos|>",
        "<|system|>",
        "<|user|>",
        "<|assistant|>",
    ]

    def __init__(self, vocab: Dict[str, int] = None):
        if vocab is not None:
            self.vocab = vocab
            self.inverse_vocab = {v: k for k, v in self.vocab.items()}
        else:
            self.vocab = {}
            self.inverse_vocab = {}
            self._init_default_vocab()

    def _init_default_vocab(self):
        idx = 0
        # 1. Special tokens
        for token in self.SPECIAL_TOKENS:
            self.vocab[token] = idx
            idx += 1

        # 2. Printable ASCII characters
        for i in range(32, 127):
            ch = chr(i)
            if ch not in self.vocab:
                self.vocab[ch] = idx
                idx += 1

        # 3. Common Subwords & Programming Tokens
        common_subwords = [
            "\n", "  ", "    ", "the", "be", "to", "of", "and", "a", "in", "that", "have",
            "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
            "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will",
            "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
            "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time",
            "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some",
            "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its",
            "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first",
            "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most",
            "us", "is", "are", "was", "were", "been", "has", "had", "Python", "code", "model",
            "data", "function", "return", "def ", "class ", "import ", "true", "false", "null",
            "AI", "LLM", "machine", "learning", "neural", "network", "transformer", "attention",
            "CRISP-DM", "pipeline", "predict", "train", "loss", "fast", "smart", "help", "hello",
            "Hi", "Yes", "No", "Thanks", "Sure", "Here", "Explain", "Step", "Algorithm"
        ]

        for word in common_subwords:
            if word not in self.vocab:
                self.vocab[word] = idx
                idx += 1

        self.inverse_vocab = {v: k for k, v in self.vocab.items()}

    @property
    def vocab_size(self) -> int:
        return len(self.vocab)

    @property
    def pad_token_id(self) -> int:
        return self.vocab["<|pad|>"]

    @property
    def unk_token_id(self) -> int:
        return self.vocab["<|unk|>"]

    @property
    def bos_token_id(self) -> int:
        return self.vocab["<|bos|>"]

    @property
    def eos_token_id(self) -> int:
        return self.vocab["<|eos|>"]

    def encode(self, text: str, add_special_tokens: bool = False) -> List[int]:
        """
        Greedy maximal-match tokenization for high efficiency.
        """
        tokens = []
        i = 0
        n = len(text)

        # Sort subwords by length descending to match longest tokens first
        subwords_by_len = sorted(self.vocab.keys(), key=len, reverse=True)

        while i < n:
            matched = False
            # Check for special tokens or longest subwords first
            for token in subwords_by_len:
                if text.startswith(token, i):
                    tokens.append(self.vocab[token])
                    i += len(token)
                    matched = True
                    break
            
            if not matched:
                # Fallback to single character or unknown
                ch = text[i]
                tokens.append(self.vocab.get(ch, self.unk_token_id))
                i += 1

        if add_special_tokens:
            tokens = [self.bos_token_id] + tokens + [self.eos_token_id]

        return tokens

    def decode(self, token_ids: List[int]) -> str:
        """
        Convert token IDs back into string text.
        """
        text = ""
        for tid in token_ids:
            if tid in self.inverse_vocab:
                val = self.inverse_vocab[tid]
                # Filter out raw special markers for cleaner conversational text
                if val not in ["<|pad|>", "<|bos|>"]:
                    text += val
        return text

    def tokenize_with_segments(self, text: str) -> List[Dict[str, any]]:
        """
        Returns structured tokens with index, text slice, and token ID 
        for interactive UI visualization and coloring.
        """
        segments = []
        i = 0
        n = len(text)
        subwords_by_len = sorted(self.vocab.keys(), key=len, reverse=True)

        while i < n:
            matched = False
            for token in subwords_by_len:
                if text.startswith(token, i):
                    tid = self.vocab[token]
                    segments.append({
                        "token": token,
                        "token_id": tid,
                        "start": i,
                        "end": i + len(token),
                        "is_special": token in self.SPECIAL_TOKENS
                    })
                    i += len(token)
                    matched = True
                    break

            if not matched:
                ch = text[i]
                tid = self.vocab.get(ch, self.unk_token_id)
                segments.append({
                    "token": ch,
                    "token_id": tid,
                    "start": i,
                    "end": i + 1,
                    "is_special": False
                })
                i += 1

        return segments

    def save(self, filepath: str):
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(self.vocab, f, ensure_ascii=False, indent=2)

    def save_vocab(self, filepath: str):
        self.save(filepath)

    @classmethod
    def load(cls, filepath: str):
        with open(filepath, "r", encoding="utf-8") as f:
            vocab = json.load(f)
        return cls(vocab=vocab)

    @classmethod
    def load_vocab(cls, filepath: str):
        return cls.load(filepath)

