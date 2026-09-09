from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role: system, user, or assistant")
    content: str = Field(..., description="Message text content")

class ChatStreamRequest(BaseModel):
    messages: List[ChatMessage]
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_k: int = Field(default=40, ge=0, le=100)
    top_p: float = Field(default=0.9, ge=0.0, le=1.0)
    repetition_penalty: float = Field(default=1.15, ge=1.0, le=2.0)
    max_tokens: int = Field(default=120, ge=1, le=512)

class TokenizeRequest(BaseModel):
    text: str = Field(..., description="Input text to segment into tokens")

class TokenSegment(BaseModel):
    token: str
    token_id: int
    start: int
    end: int
    is_special: bool

class TokenizeResponse(BaseModel):
    text: str
    tokens: List[str]
    token_ids: List[int]
    segments: List[TokenSegment]
    token_count: int
    character_count: int
    compression_ratio: float

class AttentionRequest(BaseModel):
    text: str = Field(..., description="Text sequence to calculate attention weights for")

class LayerAttention(BaseModel):

    layer_index: int
    heads: List[List[List[float]]]

class AttentionResponse(BaseModel):
    tokens: List[str]
    token_ids: List[int]
    seq_len: int
    n_layers: int
    n_heads: int
    layers: List[LayerAttention]


class ModelTelemetryResponse(BaseModel):
    model_architecture: str
    parameters: int
    layers: int
    heads: int
    d_model: int
    hidden_dim: int
    max_seq_len: int
    vocab_size: int
    training_time_seconds: float
    final_train_loss: float
    final_val_loss: float
    final_perplexity: float
    device: str
    timestamp: str

class TrainingHistoryResponse(BaseModel):
    epochs: List[int]
    train_loss: List[float]
    val_loss: List[float]
    train_perplexity: List[float]
    val_perplexity: List[float]
    learning_rate: List[float]

class FineTuneRequest(BaseModel):
    text: str
    epochs: int = Field(default=5, ge=1, le=20)
    learning_rate: float = Field(default=1e-3, ge=1e-5, le=1e-2)
