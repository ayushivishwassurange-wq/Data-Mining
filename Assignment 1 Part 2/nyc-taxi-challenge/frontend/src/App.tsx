import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CRISPPhase, PredictionResult } from './types';
import { api } from './api/client';
import { Navbar, PRESETS } from './components/layout/Navbar';
import { NYCTaxiMap } from './components/map/NYCTaxiMap';
import { FareEstimatorCard } from './components/calculator/FareEstimatorCard';
import { BusinessTab } from './components/crisp/BusinessTab';
import { DataUnderstandingTab } from './components/crisp/DataUnderstandingTab';
import { DataPrepTab } from './components/crisp/DataPrepTab';
import { ModelingTab } from './components/crisp/ModelingTab';
import { EvaluationTab } from './components/crisp/EvaluationTab';
import { DeploymentTab } from './components/crisp/DeploymentTab';
import { BatchPredictor } from './components/batch/BatchPredictor';
import {
  Car,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Map,
  Compass,
} from 'lucide-react';

export const App: React.FC = () => {
  const [activePhase, setActivePhase] = useState<CRISPPhase>('business');
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  // Map & Prediction State
  // Default: Times Square to JFK Airport
  const [pickup, setPickup] = useState<[number, number]>([40.7580, -73.9855]);
  const [dropoff, setDropoff] = useState<[number, number]>([40.6413, -73.7781]);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [pickupDatetime, setPickupDatetime] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(false);

  // Health check on mount
  useEffect(() => {
    api.checkHealth().then((res) => {
      setBackendOnline(res.status === 'online');
    });

    const interval = setInterval(() => {
      api.checkHealth().then((res) => setBackendOnline(res.status === 'online'));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Compute prediction whenever coordinates or trip settings change
  const fetchPrediction = useCallback(async () => {
    try {
      setIsLoadingPrediction(true);
      const res = await api.predictTrip({
        pickup_latitude: pickup[0],
        pickup_longitude: pickup[1],
        dropoff_latitude: dropoff[0],
        dropoff_longitude: dropoff[1],
        passenger_count: passengerCount,
        pickup_datetime: pickupDatetime ? `${pickupDatetime.replace('T', ' ')}:00` : undefined,
      });
      setPrediction(res);
    } catch (err) {
      console.error('Prediction calculation error:', err);
    } finally {
      setIsLoadingPrediction(false);
    }
  }, [pickup, dropoff, passengerCount, pickupDatetime]);

  const debounceTimerRef = useRef<any>(null);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchPrediction();
    }, 200);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [fetchPrediction]);

  const handleApplyPreset = (newPickup: [number, number], newDropoff: [number, number]) => {
    setPickup(newPickup);
    setDropoff(newDropoff);
  };

  const handleCoordinatesChange = (newPickup: [number, number], newDropoff: [number, number]) => {
    setPickup(newPickup);
    setDropoff(newDropoff);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar
        activePhase={activePhase}
        setActivePhase={setActivePhase}
        backendOnline={backendOnline}
        onApplyPreset={handleApplyPreset}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-8">
        {/* Top Interactive Geospatial Estimator Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-400/10 text-amber-400">
                  <Map className="w-4 h-4" />
                </span>
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  Real-Time NYC Taxi Fare Estimator & Map Simulator
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Drag pins anywhere across New York City or select a landmark to calculate route and stream live ML inference.
              </p>
            </div>

            {/* Batch Predictor Trigger Button */}
            <button
              onClick={() => setShowBatchModal(!showBatchModal)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showBatchModal
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>{showBatchModal ? 'Hide Batch CSV Tool' : 'Batch CSV Inference'}</span>
            </button>
          </div>

          {/* Batch Predictor Collapsible Section */}
          {showBatchModal && <BatchPredictor />}

          {/* 2-Column Map & Fare Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7">
              <NYCTaxiMap
                pickup={pickup}
                dropoff={dropoff}
                distanceMiles={prediction?.distance_miles || 0}
                bearingDegrees={prediction?.bearing_degrees || 0}
                onCoordinatesChange={handleCoordinatesChange}
              />
            </div>

            <div className="lg:col-span-5">
              <FareEstimatorCard
                prediction={prediction}
                isLoading={isLoadingPrediction}
                passengerCount={passengerCount}
                onPassengerCountChange={setPassengerCount}
                pickupDatetime={pickupDatetime}
                onPickupDatetimeChange={setPickupDatetime}
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent my-8" />

        {/* CRISP-DM Deep Dive Interactive Views */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>CRISP-DM Data Science Lifecycle Deep Dive</span>
            </div>
          </div>

          {/* Active CRISP Tab Renderer */}
          <div className="animate-fade-in">
            {activePhase === 'business' && <BusinessTab />}
            {activePhase === 'data_understanding' && <DataUnderstandingTab />}
            {activePhase === 'data_prep' && <DataPrepTab />}
            {activePhase === 'modeling' && <ModelingTab />}
            {activePhase === 'evaluation' && <EvaluationTab />}
            {activePhase === 'deployment' && <DeploymentTab />}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-900 bg-slate-950/60 text-center text-xs text-slate-500">
        NYC Taxi Challenge — CRISP-DM Data Mining & Machine Learning Pipeline • Powered by XGBoost, FastAPI & React
      </footer>
    </div>
  );
};

export default App;
