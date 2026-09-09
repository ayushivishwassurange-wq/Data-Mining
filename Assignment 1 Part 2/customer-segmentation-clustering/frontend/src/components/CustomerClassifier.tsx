import React, { useState } from 'react';
import { 
  Users, 
  Target, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Gift, 
  Award, 
  CheckCircle2, 
  RefreshCw,
  Compass
} from 'lucide-react';
import { api } from '../api/client';
import { CustomerPrediction } from '../types';
import confetti from 'canvas-confetti';

const PRESETS = [
  {
    label: 'VIP Luxury Shopper',
    data: { gender: 'Female', age: 32, annual_income: 98, spending_score: 88, recency: 8, frequency: 38, monetary: 8600 }
  },
  {
    label: 'Cautious High-Earner',
    data: { gender: 'Male', age: 48, annual_income: 92, spending_score: 18, recency: 55, frequency: 8, monetary: 1600 }
  },
  {
    label: 'Young Trendsetter',
    data: { gender: 'Female', age: 23, annual_income: 26, spending_score: 82, recency: 12, frequency: 26, monetary: 2200 }
  },
  {
    label: 'Budget Conscious',
    data: { gender: 'Male', age: 56, annual_income: 22, spending_score: 20, recency: 75, frequency: 3, monetary: 450 }
  },
  {
    label: 'Balanced Mainstream',
    data: { gender: 'Female', age: 38, annual_income: 56, spending_score: 52, recency: 28, frequency: 16, monetary: 2900 }
  }
];

export const CustomerClassifier: React.FC = () => {
  const [gender, setGender] = useState('Female');
  const [age, setAge] = useState(32);
  const [income, setIncome] = useState(95);
  const [spending, setSpending] = useState(85);
  const [recency, setRecency] = useState(12);
  const [frequency, setFrequency] = useState(35);
  const [monetary, setMonetary] = useState(8000);

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<CustomerPrediction | null>(null);

  const handlePredict = async (customData?: any) => {
    try {
      setLoading(true);
      const payload = customData || {
        gender,
        age,
        annual_income: income,
        spending_score: spending,
        recency,
        frequency,
        monetary,
      };

      const res = await api.predictCustomer(payload);
      setPrediction(res);

      if (res.persona_name.includes('VIP') || res.persona_name.includes('Champion')) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#10b981', '#fbbf24']
        });
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setGender(p.data.gender);
    setAge(p.data.age);
    setIncome(p.data.annual_income);
    setSpending(p.data.spending_score);
    setRecency(p.data.recency);
    setFrequency(p.data.frequency);
    setMonetary(p.data.monetary);
    handlePredict(p.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Live Customer Persona Classifier & Action Engine
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Simulate any customer profile by tweaking income, spending habits, and RFM metrics to immediately uncover their cluster persona and targeted marketing strategy.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider shrink-0">
              Presets:
            </span>
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => applyPreset(p)}
                className="text-xs bg-slate-800/80 hover:bg-emerald-950 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 px-3 py-1 rounded-md shrink-0 border border-slate-700/60 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Feature Tuning Sliders */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Compass className="w-4 h-4 text-emerald-400" />
            Customer Attributes & RFM Inputs
          </h3>

          <div className="space-y-4 text-xs">
            {/* Annual Income */}
            <div>
              <div className="flex justify-between mb-1.5 text-slate-300">
                <span>Annual Income ($k)</span>
                <span className="font-mono text-emerald-400 text-sm font-bold">${income}k / yr</span>
              </div>
              <input
                type="range"
                min="15"
                max="140"
                step="1"
                value={income}
                onChange={(e) => setIncome(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Spending Score */}
            <div>
              <div className="flex justify-between mb-1.5 text-slate-300">
                <span>Spending Score (1 - 100)</span>
                <span className="font-mono text-purple-400 text-sm font-bold">{spending} / 100</span>
              </div>
              <input
                type="range"
                min="1"
                max="99"
                step="1"
                value={spending}
                onChange={(e) => setSpending(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1.5 text-slate-300">
                  <span>Age</span>
                  <span className="font-mono text-cyan-400 font-bold">{age} yrs</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="72"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <span className="text-slate-300 block mb-1.5">Gender</span>
                <div className="flex gap-2">
                  {['Female', 'Male'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        gender === g ? 'bg-emerald-600 border-emerald-500 text-white shadow' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RFM: Recency, Frequency, Monetary */}
            <div className="pt-2 border-t border-slate-800 space-y-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                E-Commerce RFM Metrics
              </span>

              {/* Recency */}
              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>Recency (Days since last purchase)</span>
                  <span className="font-mono text-amber-400 font-bold">{recency} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  value={recency}
                  onChange={(e) => setRecency(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Frequency */}
              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>Purchase Frequency (Orders / yr)</span>
                  <span className="font-mono text-teal-400 font-bold">{frequency} orders</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={frequency}
                  onChange={(e) => setFrequency(parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              {/* Monetary */}
              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span>Total Monetary Spend ($)</span>
                  <span className="font-mono text-indigo-400 font-bold">${monetary}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="12000"
                  step="100"
                  value={monetary}
                  onChange={(e) => setMonetary(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={() => handlePredict()}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Predicting Segment...' : 'Classify Customer Segment'}</span>
            </button>
          </div>
        </div>

        {/* Right 6 Cols: Persona Intelligence Output */}
        <div className="lg:col-span-6 space-y-4">
          {prediction ? (
            <div 
              style={{ borderColor: `${prediction.color}60` }}
              className="bg-slate-900/90 border-2 rounded-2xl p-6 shadow-2xl space-y-5"
            >
              {/* Persona Header Banner */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Predicted Segment • Cluster #{prediction.cluster_id}
                  </span>
                  <h3 className="text-2xl font-black" style={{ color: prediction.color }}>
                    {prediction.persona_name}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 mt-1 inline-block">
                    {prediction.persona_tag}
                  </span>
                </div>

                <div className="text-right font-mono text-xs space-y-1">
                  <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
                    PCA: <strong className="text-emerald-400">[{prediction.pca_coordinates.x}, {prediction.pca_coordinates.y}]</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Churn Risk: <strong className={prediction.churn_risk === 'Low' ? 'text-emerald-400' : 'text-amber-400'}>{prediction.churn_risk}</strong>
                  </div>
                </div>
              </div>

              {/* Persona Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                {prediction.description}
              </p>

              {/* Actionable Strategy Playbook */}
              <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Recommended Marketing Playbook</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {prediction.actionable_strategy}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-emerald-300 font-mono">
                  <span>Expected Campaign ROI: <strong>{prediction.campaign_roi_potential}</strong></span>
                  <span>Targeting Tier: <strong>Tier 1 High Priority</strong></span>
                </div>
              </div>

              {/* GMM Probabilities if available */}
              {prediction.cluster_probabilities && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Gaussian Mixture Model (GMM) Soft Assignment Probabilities:
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {prediction.cluster_probabilities.map((prob, pIdx) => (
                      <div key={pIdx} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono text-[10px]">
                        <div className="text-slate-500">C{pIdx}</div>
                        <div className="font-bold text-slate-200">{(prob * 100).toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
              <Compass className="w-12 h-12 text-slate-600 animate-pulse" />
              <h4 className="text-base font-bold text-slate-300">Awaiting Customer Input</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Adjust the customer attributes on the left and click "Classify Customer Segment" to generate persona intelligence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
