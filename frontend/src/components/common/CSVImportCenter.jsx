import React, { useState, useRef } from 'react';
import {
  Upload,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Loader2,
} from 'lucide-react';
import Modal from './Modal';
import { parseCSVClient } from '../../utils/csvParser';
import { importService } from '../../services/importService';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_PROVIDERS } from '../../utils/constants';
import { formatINR } from '../../utils/formatters';

const SAMPLE_CSV = `Date,Merchant,Amount,Type,Category,Provider,Reference_ID
2026-11-01,Swiggy Order,480,expense,Food & Dining,Google Pay,UPI-SWIGGY-8921
2026-11-02,Starbucks Coffee,350,expense,Food & Dining,PhonePe,UPI-SBX-1029
2026-11-02,Monthly Salary,55000,income,Salary,Bank Transfer,SAL-TECH-202611
2026-11-03,Airtel Broadband,1179,expense,Utilities,Paytm,UPI-BB-44019
2026-11-03,Shell Petrol Pump,1200,expense,Transportation,Google Pay,UPI-SHL-9921`;

export const CSVImportCenter = ({
  isOpen,
  onClose,
  defaultProvider = 'Google Pay',
  onSuccess,
}) => {
  const [step, setStep] = useState('upload'); // 'upload' | 'preview' | 'result'
  const [csvText, setCsvText] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(defaultProvider);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [fileName, setFileName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [previewData, setPreviewData] = useState(null);
  const [editableRecords, setEditableRecords] = useState([]);
  const [importResult, setImportResult] = useState(null);

  const fileInputRef = useRef(null);

  const resetState = () => {
    setStep('upload');
    setCsvText('');
    setFileName('');
    setError(null);
    setPreviewData(null);
    setEditableRecords([]);
    setImportResult(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Download sample CSV
  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fintrack_sample_statement.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setCsvText(content);
        processCSVContent(content);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the selected CSV file.');
    };
    reader.readAsText(file);
  };

  // Process text into preview
  const processCSVContent = async (textToProcess) => {
    if (!textToProcess.trim()) {
      setError('Please select a valid CSV file or paste statement text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsedRows = parseCSVClient(textToProcess);
      if (parsedRows.length === 0) {
        throw new Error('No valid tabular rows detected in CSV. Please verify column headers.');
      }

      const res = await importService.previewImport({
        csvText: textToProcess,
        provider: selectedProvider,
      });

      if (!res.success) {
        throw new Error(res.message || 'Failed to analyze statement rows.');
      }

      setPreviewData(res);
      setEditableRecords(res.records || []);
      setStep('preview');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to parse CSV.');
    } finally {
      setLoading(false);
    }
  };

  // Category modification in preview
  const handleCategoryChange = (index, newCategory) => {
    setEditableRecords((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        data: {
          ...copy[index].data,
          category: newCategory,
        },
      };
      return copy;
    });
  };

  // Execute actual import
  const handleExecuteImport = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await importService.executeImport({
        records: editableRecords,
        provider: selectedProvider,
        skipDuplicates,
      });

      if (!res.success) {
        throw new Error(res.message || 'Import operation failed.');
      }

      setImportResult(res);
      setStep('result');
      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Import failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Statement & CSV Import Center"
      subtitle="Import transactions from UPI statements, Google Pay, PhonePe, Paytm, or banks"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: UPLOAD / PASTE */}
        {step === 'upload' && (
          <div className="space-y-5">
            {/* Payment provider selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-brand-elevated/40 border border-brand-border">
              <div>
                <label className="text-xs font-semibold text-brand-text block">
                  Default Payment Provider / Source
                </label>
                <p className="text-[11px] text-brand-subtle">
                  Assigned if provider column is missing in CSV
                </p>
              </div>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-brand-text text-xs focus:ring-1 focus:ring-brand-emerald focus:outline-none"
              >
                {PAYMENT_PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-brand-border hover:border-black/60 dark:hover:border-white/60 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-elevated text-brand-muted group-hover:text-black dark:group-hover:text-white group-hover:bg-black/10 dark:group-hover:bg-white/10 flex items-center justify-center mb-3 transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-brand-text mb-1">
                {fileName ? fileName : 'Click to select statement CSV file'}
              </h4>
              <p className="text-xs text-brand-muted max-w-sm mb-4">
                Supports UPI statement exports, bank CSVs, or spreadsheet formats
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-brand-card hover:bg-brand-elevated text-xs font-semibold text-brand-text border border-brand-border shadow-sm transition-colors"
              >
                Browse Files
              </button>
            </div>

            {/* Paste alternative */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-brand-muted">
                  Or paste CSV statement content directly:
                </span>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="flex items-center gap-1.5 text-xs text-black dark:text-white hover:underline font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sample CSV
                </button>
              </div>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Date,Merchant,Amount,Type,Category,Provider&#10;2026-11-01,Swiggy,480,expense,Food & Dining,Google Pay"
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text font-mono text-xs focus:ring-1 focus:ring-black dark:focus:ring-zinc-400 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-brand-text hover:bg-brand-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading || !csvText.trim()}
                onClick={() => processCSVContent(csvText)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-black hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm border border-zinc-800 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Preview & Validate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW & EDIT CATEGORIES */}
        {step === 'preview' && previewData && (
          <div className="space-y-4">
            {/* Summary statistics chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-brand-elevated/40 border border-brand-border">
                <span className="text-[10px] uppercase font-bold text-brand-subtle block">
                  Total Parsed
                </span>
                <span className="text-base font-extrabold text-brand-text">
                  {previewData.summary?.total_rows || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">
                <span className="text-[10px] uppercase font-bold text-black dark:text-white block">
                  Ready to Import
                </span>
                <span className="text-base font-extrabold text-black dark:text-white">
                  {previewData.summary?.valid_count || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold text-amber-500 block">
                  Duplicates Found
                </span>
                <span className="text-base font-extrabold text-amber-500">
                  {previewData.summary?.duplicate_count || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] uppercase font-bold text-rose-500 block">
                  Invalid Rows
                </span>
                <span className="text-base font-extrabold text-rose-500">
                  {previewData.summary?.invalid_count || 0}
                </span>
              </div>
            </div>

            {/* Duplicate policy checkbox */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-brand-elevated/40 border border-brand-border">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="skipDuplicates"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="rounded text-brand-emerald focus:ring-0 cursor-pointer"
                />
                <label
                  htmlFor="skipDuplicates"
                  className="text-xs font-semibold text-brand-text cursor-pointer"
                >
                  Skip duplicate transactions automatically
                </label>
              </div>
              <span className="text-[11px] text-brand-subtle hidden sm:inline">
                Prevents double-counting existing payments
              </span>
            </div>

            {/* Editable Preview Table */}
            <div className="border border-brand-border rounded-xl max-h-72 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead className="bg-brand-elevated text-brand-muted uppercase font-semibold text-[10px] sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Merchant / Title</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Category (Editable)</th>
                    <th className="py-2.5 px-3">Provider</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {editableRecords.map((rec, idx) => {
                    const d = rec.data;
                    const isDup = rec.isDuplicate;
                    const isInv = !rec.isValid;

                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-brand-elevated/30 transition-colors ${
                          isInv
                            ? 'bg-rose-500/5'
                            : isDup
                            ? 'bg-amber-500/5'
                            : ''
                        }`}
                      >
                        <td className="py-2 px-3 text-brand-muted whitespace-nowrap">
                          {d.date || '—'}
                        </td>
                        <td className="py-2 px-3 font-semibold text-brand-text truncate max-w-[150px]">
                          {d.title}
                          {d.external_id && (
                            <span className="block text-[10px] text-brand-subtle font-normal truncate">
                              Ref: {d.external_id}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span
                            className={`font-bold ${
                              d.type === 'income' ? 'text-emerald-500' : 'text-brand-text'
                            }`}
                          >
                            {d.type === 'income' ? '+' : '-'} {formatINR(d.amount)}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={d.category}
                            onChange={(e) => handleCategoryChange(idx, e.target.value)}
                            disabled={isInv}
                            className="px-2 py-1 rounded-lg bg-brand-card border border-brand-border text-brand-text text-[11px] focus:ring-1 focus:ring-brand-emerald focus:outline-none"
                          >
                            {(d.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(
                              (cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="py-2 px-3 text-brand-muted whitespace-nowrap text-[11px]">
                          {d.payment_method || selectedProvider}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {isInv ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                              <AlertCircle className="w-3 h-3" /> Invalid
                            </span>
                          ) : isDup ? (
                            <span
                              title={rec.duplicateReason}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"
                            >
                              <AlertTriangle className="w-3 h-3" /> Duplicate
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-black dark:text-white bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-brand-text hover:bg-brand-elevated transition-colors"
              >
                Back to Upload
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleExecuteImport}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm border border-zinc-800 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Importing to Supabase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Import Records</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {step === 'result' && importResult && (
          <div className="space-y-6 py-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-brand-text mb-1">
                Statement Import Complete
              </h3>
              <p className="text-xs text-brand-muted">
                Audit log recorded to database sync history
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="text-[10px] uppercase font-bold text-brand-subtle block">
                  Imported
                </span>
                <span className="text-lg font-extrabold text-black dark:text-white">
                  {importResult.summary?.imported || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="text-[10px] uppercase font-bold text-brand-subtle block">
                  Skipped (Dup)
                </span>
                <span className="text-lg font-extrabold text-amber-500">
                  {importResult.summary?.duplicates || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border">
                <span className="text-[10px] uppercase font-bold text-brand-subtle block">
                  Failed
                </span>
                <span className="text-lg font-extrabold text-rose-500">
                  {importResult.summary?.failed || 0}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white text-xs font-semibold shadow-sm border border-black dark:border-white transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CSVImportCenter;
