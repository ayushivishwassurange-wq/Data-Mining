export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerationChunk {
  token: string;
  token_id: number;
  done: boolean;
  total_tokens?: number;
  tokens_per_second?: number;
  latency_ms?: number;
}

export interface TokenSegment {
  token: string;
  token_id: number;
  start: number;
  end: number;
  is_special: boolean;
}

export interface TokenizeResult {
  text: string;
  tokens: string[];
  token_ids: number[];
  segments: TokenSegment[];
  token_count: number;
  character_count: number;
  compression_ratio: number;
}

export interface LayerAttention {
  layer_index: number;
  heads: number[][][]; // [head][row][col]
}

export interface AttentionResult {
  tokens: string[];
  token_ids: number[];
  seq_len: number;
  n_layers: number;
  n_heads: number;
  layers: LayerAttention[];
}

export interface ModelTelemetry {
  model_architecture: string;
  parameters: number;
  layers: number;
  heads: number;
  d_model: number;
  hidden_dim: number;
  max_seq_len: number;
  vocab_size: number;
  training_time_seconds: number;
  final_train_loss: number;
  final_val_loss: number;
  final_perplexity: number;
  device: string;
  timestamp: string;
}

export interface TrainingHistory {
  epochs: number[];
  train_loss: number[];
  val_loss: number[];
  train_perplexity: number[];
  val_perplexity: number[];
  learning_rate: number[];
}

export interface CrispPhase {
  id: number;
  name: string;
  goal: string;
  deliverables: string[];
  kpis: Record<string, string>;
}
