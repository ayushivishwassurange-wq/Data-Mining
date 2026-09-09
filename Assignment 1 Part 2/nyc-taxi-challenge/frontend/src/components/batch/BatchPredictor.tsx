import React, { useState } from 'react';
import { api } from '../../api/client';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BatchPredictor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setErrorMsg(null);
    }
  };

  const handleProcessBatch = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await api.uploadCsv(file);
      if (res.success) {
        setBatchResult(res);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process batch CSV');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportResults = () => {
    if (!batchResult?.data_preview) return;

    const data = batchResult.data_preview;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row: any) => Object.values(row).join(','));
    const csvContent = [headers, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `predicted_nyc_taxi_fares_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Batch Prediction Engine</span>
          <h2 className="text-2xl font-extrabold text-white">Upload CSV for Bulk Fare Inferences</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Process thousands of trips simultaneously using the champion XGBoost pipeline with sub-millisecond per-row processing.
          </p>
        </div>

        <a
          href={api.getSampleCsvUrl()}
          download="sample_nyc_trips.csv"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors w-fit shrink-0"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Download Sample CSV</span>
        </a>
      </div>

      {/* Upload Drop Zone */}
      <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-colors">
          <Upload className="w-8 h-8 text-amber-400 mb-2" />
          <span className="text-sm font-bold text-slate-200">
            {file ? file.name : 'Click or Drag CSV trip file here'}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Required columns: pickup_longitude, pickup_latitude, dropoff_longitude, dropoff_latitude
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
        </label>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleProcessBatch}
            disabled={!file || isLoading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all ${
              file && !isLoading
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing batch predictions...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" />
                <span>Run Batch Predictions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Summary & Table */}
      {batchResult && (
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Batch Inference Completed</h3>
                <span className="text-xs text-slate-400">
                  Processed {batchResult.rows_processed} rows • Mean Fare: <strong>${batchResult.mean_fare}</strong> • Total Revenue: <strong>${batchResult.total_fare_sum.toLocaleString()}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={handleExportResults}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV with Predictions</span>
            </button>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Pickup (Lat, Lon)</th>
                  <th className="py-2.5 px-3">Dropoff (Lat, Lon)</th>
                  <th className="py-2.5 px-3 text-right">Distance (mi)</th>
                  <th className="py-2.5 px-3 text-center">Passengers</th>
                  <th className="py-2.5 px-3 text-right text-amber-300 font-bold">Predicted Fare ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {batchResult.data_preview.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{i + 1}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      {row.pickup_latitude?.toFixed(4)}, {row.pickup_longitude?.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      {row.dropoff_latitude?.toFixed(4)}, {row.dropoff_longitude?.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-sky-400">{row.distance_miles} mi</td>
                    <td className="py-2.5 px-3 text-center">{row.passenger_count || 1}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                      ${row.predicted_fare?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
