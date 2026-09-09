import { 
  ChatMessage, 
  GenerationChunk, 
  TokenizeResult, 
  AttentionResult, 
  ModelTelemetry, 
  TrainingHistory, 
  CrispPhase 
} from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  },

  async tokenize(text: string): Promise<TokenizeResult> {
    const res = await fetch(`${API_BASE}/tokenizer/tokenize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Tokenization failed');
    return res.json();
  },

  async inspectAttention(text: string): Promise<AttentionResult> {
    const res = await fetch(`${API_BASE}/attention/inspect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Attention extraction failed');
    return res.json();
  },

  async getTelemetry(): Promise<ModelTelemetry> {
    const res = await fetch(`${API_BASE}/telemetry`);
    if (!res.ok) throw new Error('Failed to fetch telemetry');
    return res.json();
  },

  async getTrainingHistory(): Promise<TrainingHistory> {
    const res = await fetch(`${API_BASE}/training/history`);
    if (!res.ok) throw new Error('Failed to fetch training history');
    return res.json();
  },

  async getCrispDm(): Promise<{ phases: CrispPhase[] }> {
    const res = await fetch(`${API_BASE}/crisp-dm`);
    if (!res.ok) throw new Error('Failed to fetch CRISP-DM info');
    return res.json();
  },

  async fineTune(text: string, epochs: number = 3) {
    const res = await fetch(`${API_BASE}/training/finetune`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, epochs }),
    });
    if (!res.ok) throw new Error('Fine-tuning failed');
    return res.json();
  },

  async streamChat(
    messages: ChatMessage[],
    options: {
      temperature: number;
      top_k: number;
      top_p: number;
      repetition_penalty: number;
      max_tokens: number;
    },
    onChunk: (chunk: GenerationChunk) => void,
    signal?: AbortSignal
  ) {
    const res = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        temperature: options.temperature,
        top_k: options.top_k,
        top_p: options.top_p,
        repetition_penalty: options.repetition_penalty,
        max_tokens: options.max_tokens,
      }),
      signal,
    });

    if (!res.ok || !res.body) {
      throw new Error(`Chat stream failed with status ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const dataStr = trimmed.slice(6);
            const parsed = JSON.parse(dataStr);
            onChunk(parsed);
          } catch {
            // Ignore malformed chunks
          }
        }
      }
    }
  }
};
