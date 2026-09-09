import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { api } from '../../api/client';
import {
  X,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ExportImportModal: React.FC = () => {
  const { isExportImportOpen, setIsExportImportOpen, refreshData } = useTasks();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  if (!isExportImportOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setImportStatus(null);
      const text = await file.text();
      const parsed = JSON.parse(text);

      await api.importData(parsed);
      await refreshData();
      setImportStatus('Data imported successfully!');
    } catch (err: any) {
      setImportStatus(`Import failed: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsExportImportOpen(false)}
    >
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Data Portability & Backups</span>
          </div>
          <button
            onClick={() => setIsExportImportOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Export Tasks & Data
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {/* JSON */}
              <a
                href={api.getExportJsonUrl()}
                download
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800/40 transition-all text-center group"
              >
                <FileJson className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-semibold text-slate-200">JSON</span>
                <span className="text-[10px] text-slate-500">Full backup</span>
              </a>

              {/* CSV */}
              <a
                href={api.getExportCsvUrl()}
                download
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800/40 transition-all text-center group"
              >
                <FileSpreadsheet className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-semibold text-slate-200">CSV</span>
                <span className="text-[10px] text-slate-500">Spreadsheets</span>
              </a>

              {/* Markdown */}
              <a
                href={api.getExportMarkdownUrl()}
                download
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 hover:bg-slate-800/40 transition-all text-center group"
              >
                <FileText className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-semibold text-slate-200">Markdown</span>
                <span className="text-[10px] text-slate-500">Checklist doc</span>
              </a>
            </div>
          </div>

          {/* Import section */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Import from Backup (JSON)
            </h3>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-colors">
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-200">
                {isImporting ? 'Importing...' : 'Click to select JSON backup file'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">Supports TaskFlow JSON exports</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isImporting}
                className="hidden"
              />
            </label>

            {importStatus && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  importStatus.includes('failed')
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}
              >
                {importStatus.includes('failed') ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{importStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
