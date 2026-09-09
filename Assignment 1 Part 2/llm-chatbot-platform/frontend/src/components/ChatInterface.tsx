import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Sliders, 
  Sparkles, 
  Bot, 
  User, 
  Zap, 
  Clock, 
  Activity, 
  RotateCcw,
  Copy,
  Check,
  Cpu,
  StopCircle,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, GenerationChunk } from '../types';
import { api } from '../api/client';
import confetti from 'canvas-confetti';

const SYSTEM_PROMPTS = [
  {
    name: 'General Assistant',
    prompt: 'You are a helpful, brilliant, and concise AI assistant.',
    desc: 'Versatile and friendly everyday conversational agent.'
  },
  {
    name: 'CRISP-DM & Data Scientist',
    prompt: 'You are an expert data scientist and machine learning engineer.',
    desc: 'Deep knowledge of ML frameworks, CRISP-DM, and statistics.'
  },
  {
    name: 'Python Developer Mentor',
    prompt: 'You are a Python programming mentor.',
    desc: 'Code examples, algorithmic logic, and best practices.'
  },
  {
    name: 'Transformer Architect',
    prompt: 'You are an expert on transformer architectures.',
    desc: 'Attention mechanics, RoPE, SwiGLU, and autoregression.'
  }
];

const SUGGESTIONS = [
  'What is the CRISP-DM framework?',
  'Why do transformers use Self-Attention?',
  'What are Rotary Position Embeddings (RoPE)?',
  'What is Perplexity in language models?',
  'How do you define a function in Python?',
  'What is the difference between Top-k and Top-p sampling?',
];

export const ChatInterface: React.FC = () => {
  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPTS[0].prompt);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am Mini-LLM, a custom decoder transformer running locally in your browser session. Ask me anything about machine learning, the CRISP-DM framework, or Python code!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Hyperparameters
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(40);
  const [topP, setTopP] = useState(0.9);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.15);
  const [maxTokens, setMaxTokens] = useState(120);

  // Telemetry state
  const [genStats, setGenStats] = useState<{
    tokens: number;
    tps: number;
    latency: number;
  }>({ tokens: 0, tps: 0, latency: 0 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isGenerating) return;

    const userMessage: ChatMessage = { role: 'user', content: textToSend.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsGenerating(true);
    setGenStats({ tokens: 0, tps: 0, latency: 0 });

    // Prepare message stack with system prompt at top
    const fullConversation: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...newMessages
    ];

    // Placeholder for assistant stream
    const assistantIndex = newMessages.length;
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedContent = '';

    try {
      await api.streamChat(
        fullConversation,
        {
          temperature,
          top_k: topK,
          top_p: topP,
          repetition_penalty: repetitionPenalty,
          max_tokens: maxTokens,
        },
        (chunk: GenerationChunk) => {
          accumulatedContent += chunk.token;
          setMessages((prev) => {
            const copy = [...prev];
            copy[assistantIndex] = {
              role: 'assistant',
              content: accumulatedContent,
            };
            return copy;
          });

          if (chunk.total_tokens && chunk.tokens_per_second) {
            setGenStats({
              tokens: chunk.total_tokens,
              tps: chunk.tokens_per_second,
              latency: chunk.latency_ms || 0,
            });
          }
        },
        controller.signal
      );

      // Trigger light confetti if informative answer completed
      if (accumulatedContent.length > 20) {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.85 },
          colors: ['#a78bfa', '#818cf8', '#c084fc']
        });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages((prev) => {
          const copy = [...prev];
          copy[assistantIndex] = {
            role: 'assistant',
            content: accumulatedContent || 'An error occurred during local inference generation. Please check backend connection.',
          };
          return copy;
        });
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat session reset. Ask me anything to begin again!'
      }
    ]);
    setGenStats({ tokens: 0, tps: 0, latency: 0 });
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {/* Top Banner / HUD Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-3 shadow-lg">
        {/* System Prompt Selector */}
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Bot className="w-5 h-5 text-purple-400 shrink-0" />
          <div className="w-full">
            <select
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-200 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            >
              {SYSTEM_PROMPTS.map((sp) => (
                <option key={sp.name} value={sp.prompt}>
                  Persona: {sp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Generation Telemetry HUD */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Speed: <strong className="text-amber-300">{genStats.tps || 0}</strong> tok/s</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Tokens: <strong className="text-purple-300">{genStats.tokens || 0}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Latency: <strong className="text-cyan-300">{genStats.latency || 0}</strong> ms</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              showSettings 
                ? 'bg-purple-600/30 border-purple-500/50 text-purple-300' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Sampling</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-all"
            title="Clear chat history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="bg-slate-900/95 border border-purple-500/30 rounded-xl p-4 mb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div>
            <div className="flex justify-between mb-1 text-slate-300">
              <span>Temperature</span>
              <span className="font-mono text-purple-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Lower = deterministic, Higher = creative</p>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-slate-300">
              <span>Top-K</span>
              <span className="font-mono text-purple-400">{topK}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Limits pool to K highest probability tokens</p>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-slate-300">
              <span>Top-P (Nucleus)</span>
              <span className="font-mono text-purple-400">{topP}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Cumulative mass threshold probability</p>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-slate-300">
              <span>Repetition Penalty</span>
              <span className="font-mono text-purple-400">{repetitionPenalty}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.5"
              step="0.05"
              value={repetitionPenalty}
              onChange={(e) => setRepetitionPenalty(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Penalizes repeatedly generated tokens</p>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-slate-300">
              <span>Max Tokens</span>
              <span className="font-mono text-purple-400">{maxTokens}</span>
            </div>
            <input
              type="range"
              min="20"
              max="256"
              step="10"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Maximum token output budget</p>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 rounded-xl bg-slate-900/40 p-4 border border-slate-900">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shrink-0 mt-0.5">
                  <div className="h-full w-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
              )}

              <div className={`relative group max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                isUser
                  ? 'bg-purple-600 text-white rounded-tr-none shadow-md shadow-purple-900/30'
                  : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none shadow-lg'
              }`}>
                {/* Header tag */}
                <div className="flex items-center justify-between text-[11px] mb-1 opacity-70 font-mono">
                  <span>{isUser ? 'You' : 'Mini-LLM (4-Layer Transformer)'}</span>
                  {!isUser && msg.content && (
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-purple-300"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="whitespace-pre-wrap">
                  {msg.content}
                  {!isUser && isGenerating && idx === messages.length - 1 && (
                    <span className="typewriter-cursor" />
                  )}
                </div>
              </div>

              {isUser && (
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && (
        <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> Prompts:
          </span>
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="text-xs bg-slate-900/80 hover:bg-purple-900/30 hover:border-purple-500/50 border border-slate-800 text-slate-300 hover:text-purple-200 px-3 py-1.5 rounded-full shrink-0 transition-all"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="mt-2 relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-2 focus-within:border-purple-500/60 focus-within:ring-1 focus-within:ring-purple-500/40 shadow-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isGenerating ? "Mini-LLM is generating response..." : "Ask Mini-LLM about CRISP-DM, Transformers, Python code, etc..."}
            disabled={isGenerating}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none disabled:opacity-50"
          />

          {isGenerating ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-900/40 transition-all"
            >
              <StopCircle className="w-4 h-4" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-900/40 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Generate</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
