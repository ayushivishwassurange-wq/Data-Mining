import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../../context/TaskContext';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Timer,
  Coffee,
} from 'lucide-react';
import { soundEngine } from '../../utils/sound';
import { triggerBigCelebration } from '../../utils/confetti';

export const PomodoroModal: React.FC = () => {
  const {
    isPomodoroOpen,
    closePomodoro,
    pomodoroTask,
    tasks,
    recordFocusTime,
    toggleTask,
  } = useTasks();

  const [mode, setMode] = useState<'work' | 'short_break' | 'long_break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(pomodoroTask?.id || '');

  const timerRef = useRef<any>(null);

  const initialTimes = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  useEffect(() => {
    if (pomodoroTask) {
      setSelectedTaskId(pomodoroTask.id);
    }
  }, [pomodoroTask]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            soundEngine.playComplete();
            triggerBigCelebration();

            if (mode === 'work' && selectedTaskId) {
              recordFocusTime(selectedTaskId, 25);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedTaskId, recordFocusTime]);

  if (!isPomodoroOpen) return null;

  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  const handleModeChange = (newMode: 'work' | 'short_break' | 'long_break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(initialTimes[newMode]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTimes[mode]);
  };

  const toggleRunning = () => {
    soundEngine.playPop();
    setIsRunning(!isRunning);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((initialTimes[mode] - timeLeft) / initialTimes[mode]) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 flex flex-col items-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closePomodoro}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            onClick={() => handleModeChange('work')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'work' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Focus (25m)
          </button>
          <button
            onClick={() => handleModeChange('short_break')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'short_break' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ☕ Short Break (5m)
          </button>
          <button
            onClick={() => handleModeChange('long_break')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'long_break' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌴 Long Break (15m)
          </button>
        </div>

        {/* Circular Countdown Display */}
        <div className="relative w-56 h-56 flex items-center justify-center my-2">
          {/* Outer SVG Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="96"
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="112"
              cy="112"
              r="96"
              className={`transition-all duration-1000 ${
                mode === 'work'
                  ? 'stroke-indigo-500'
                  : mode === 'short_break'
                  ? 'stroke-emerald-500'
                  : 'stroke-sky-500'
              }`}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 96}
              strokeDashoffset={2 * Math.PI * 96 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time Digits */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-5xl font-extrabold tracking-tight text-white drop-shadow">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 mt-1">
              {isRunning ? 'Session Active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Focus Task Picker */}
        <div className="w-full mt-4 mb-6">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-center">
            Task being worked on
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 truncate"
          >
            <option value="">-- No specific task attached --</option>
            {tasks
              .filter((t) => !t.isArchived && t.status !== 'completed')
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
          </select>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleRunning}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl transition-all active:scale-95 ${
              mode === 'work'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-indigo-600/30'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-emerald-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          {currentTask && (
            <button
              onClick={async () => {
                await toggleTask(currentTask.id);
                closePomodoro();
              }}
              className="p-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-2xl transition-all"
              title="Mark task completed"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
