import torch
from torch.utils.data import Dataset
from typing import List, Dict, Tuple
from tokenizer import MiniTokenizer

# High-signal conversational, instruction, math, and data science dialogue corpus
INSTRUCTION_DATASET = [
    {
        "system": "You are a helpful, brilliant, and concise AI assistant.",
        "user": "Hello! Who are you?",
        "assistant": "Hello! I am Mini-LLM, a high-efficiency conversational neural network trained from scratch with Rotary Position Embeddings and Multi-Head Self-Attention."
    },
    {
        "system": "You are an expert data scientist and machine learning engineer.",
        "user": "What is the CRISP-DM framework?",
        "assistant": "CRISP-DM stands for Cross-Industry Standard Process for Data Mining. It consists of 6 phases: 1. Business Understanding, 2. Data Understanding, 3. Data Preparation, 4. Modeling, 5. Evaluation, and 6. Deployment."
    },
    {
        "system": "You are a machine learning educator.",
        "user": "Why do transformers use Self-Attention?",
        "assistant": "Self-Attention allows tokens in a sequence to dynamically attend to and weigh all other tokens regardless of distance, enabling parallel computation and capturing complex long-range semantic dependencies."
    },
    {
        "system": "You are a Python programming mentor.",
        "user": "How do you define a function in Python?",
        "assistant": "In Python, you use the 'def' keyword: \ndef greet(name):\n    return f'Hello, {name}!'\nIt defines reusable logic with arguments and return values."
    },
    {
        "system": "You are a math and statistics assistant.",
        "user": "What is Perplexity in language models?",
        "assistant": "Perplexity is the exponentiated Cross-Entropy Loss: PPL = exp(Loss). It measures how well a probability model predicts a sample. Lower perplexity indicates superior predictive confidence."
    },
    {
        "system": "You are a helpful AI assistant.",
        "user": "What is the difference between Top-k and Top-p sampling?",
        "assistant": "Top-k restricts token selection to the k most likely tokens. Top-p (nucleus sampling) dynamically selects the smallest set of tokens whose cumulative probability exceeds threshold p, adapting to model certainty."
    },
    {
        "system": "You are an expert AI software architect.",
        "user": "What is a KV-Cache in Large Language Models?",
        "assistant": "KV-Cache stores previously computed Key and Value attention tensors so each newly generated token only needs to compute attention with cached past states, reducing generation time from O(N^2) to O(1) per step."
    },
    {
        "system": "You are a helpful coding assistant.",
        "user": "Write a quick Python list comprehension.",
        "assistant": "Here is an example: squares = [x**2 for x in range(10)]. It creates a new list by applying an expression to each item."
    },
    {
        "system": "You are a helpful AI assistant.",
        "user": "Can you summarize what an epoch is?",
        "assistant": "An epoch represents one complete pass of the entire training dataset through the neural network during gradient descent optimization."
    },
    {
        "system": "You are an expert on transformer architectures.",
        "user": "What are Rotary Position Embeddings (RoPE)?",
        "assistant": "RoPE encodes relative position by rotating Query and Key vectors in the complex 2D plane. It preserves relative distance naturally without adding static position vectors."
    },
    {
        "system": "You are a creative and friendly AI assistant.",
        "user": "Tell me an inspirational quote about coding.",
        "assistant": "'First, solve the problem. Then, write the code.' — John Johnson. Keep building, iterate quickly, and turn ideas into reality!"
    },
    {
        "system": "You are a helpful assistant.",
        "user": "Thank you for the help!",
        "assistant": "You are very welcome! Let me know whenever you have more questions about machine learning, coding, or AI."
    }
]

class ChatDataset(Dataset):
    """
    Formats multi-turn dialogues into causal autoregressive token sequences:
    <|system|> System <|user|> Question <|assistant|> Answer <|eos|>
    """
    def __init__(self, tokenizer: MiniTokenizer, max_seq_len: int = 128, repeat_factor: int = 30):
        self.tokenizer = tokenizer
        self.max_seq_len = max_seq_len
        self.samples = []

        for _ in range(repeat_factor):
            for item in INSTRUCTION_DATASET:
                formatted_text = (
                    f"<|system|>{item['system']}\n"
                    f"<|user|>{item['user']}\n"
                    f"<|assistant|>{item['assistant']}<|eos|>"
                )
                token_ids = self.tokenizer.encode(formatted_text)
                if len(token_ids) > max_seq_len:
                    token_ids = token_ids[:max_seq_len]
                else:
                    # Pad to max_seq_len
                    token_ids = token_ids + [self.tokenizer.pad_token_id] * (max_seq_len - len(token_ids))

                self.samples.append(torch.tensor(token_ids, dtype=torch.long))

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, torch.Tensor]:
        sample = self.samples[idx]
        # input_ids: tokens from 0 to N-1
        input_ids = sample[:-1]
        # targets: tokens from 1 to N (next-token prediction)
        targets = sample[1:].clone()
        # Ignore padding tokens in loss computation
        targets[targets == self.tokenizer.pad_token_id] = -1
        return input_ids, targets

