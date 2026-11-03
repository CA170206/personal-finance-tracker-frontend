import React, { useState, useMemo } from 'react';
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Wallet,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetModal from '../components/budgets/BudgetModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import { formatINR } from '../utils/formatters';

export const Budgets = () => {
  const {
    budgets,
    overallBudget,
    transactions,
    addBudget,
    updateBudget,
    deleteBudget,
    updateOverallMonthlyBudget,
  } = useFinance();

  // Selected Budget Period
  const [selectedPeriod, setSelectedPeriod] = useState('current'); // 'current', 'previous', 'all'

  // Modal States
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [overallModalOpen, setOverallModalOpen] = useState(false);
  const [newOverallLimit, setNewOverallLimit] = useState(overallBudget.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute spent amount per category based on chosen period
  const categorySpentMap = useMemo(() => {
    const map = {};
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    transactions
      .filter((t) => {
        if (t.type !== 'expense') return false;
        if (selectedPeriod === 'all') return true;

        const d = new Date(t.date);
        if (selectedPeriod === 'current') {
          return d.getMonth() === curMonth && d.getFullYear() === curYear;
        } else if (selectedPeriod === 'previous') {
          const prevMonth = curMonth === 0 ? 11 : curMonth - 1;
          const prevYear = curMonth === 0 ? curYear - 1 : curYear;
          return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
        }
        return true;
      })
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      });

    return map;
  }, [transactions, selectedPeriod]);

  // Total spent across all expense categories this month
  const totalSpentMonth = useMemo(() => {
    return Object.values(categorySpentMap).reduce((sum, v) => sum + v, 0);
  }, [categorySpentMap]);

  const totalAllocatedCategories = useMemo(() => {
    return budgets.reduce((sum, b) => sum + Number(b.allocated), 0);
  }, [budgets]);

  const overallRemaining = overallBudget - totalSpentMonth;
  const overallUtilization = overallBudget > 0 ? (totalSpentMonth / overallBudget) * 100 : 0;
  const isOverallExceeded = totalSpentMonth > overallBudget;
  const isOverallWarning = overallUtilization >= 80 && !isOverallExceeded;

  const handleOpenAdd = () => {
    setSelectedBudget(null);
    setBudgetModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setSelectedBudget(b);
    setBudgetModalOpen(true);
  };

  const handleOpenDelete = (b) => {
    setBudgetToDelete(b);
    setDeleteModalOpen(true);
  };

  const handleSubmitBudget = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedBudget) {
        await updateBudget(selectedBudget.id, formData);
      } else {
        await addBudget(formData);
      }
      setBudgetModalOpen(false);
      setSelectedBudget(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteBudget(budgetToDelete.id, budgetToDelete.category);
      setDeleteModalOpen(false);
      setBudgetToDelete(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveOverallBudget = async (e) => {
    e.preventDefault();
    const amt = Number(newOverallLimit);
    if (isNaN(amt) || amt <= 0) return;
    setIsSubmitting(true);
    try {
      await updateOverallMonthlyBudget(amt);
      setOverallModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
            Budget Management & Thresholds
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Establish spending caps, monitor utilization ratios, and avoid budget overruns
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-brand-card border border-brand-border rounded-xl">
            <button
              onClick={() => setSelectedPeriod('current')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriod === 'current'
                  ? 'bg-brand-emerald text-white shadow-glow-emerald'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              Current Month
            </button>
            <button
              onClick={() => setSelectedPeriod('previous')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriod === 'previous'
                  ? 'bg-brand-emerald text-white shadow-glow-emerald'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              Previous Month
            </button>
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriod === 'all'
                  ? 'bg-brand-emerald text-white shadow-glow-emerald'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              All Records
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-emerald hover:bg-brand-emeraldHover active:scale-95 shadow-glow-emerald transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Budget</span>
          </button>
        </div>
      </div>

      {/* Overall Monthly Budget Master Card */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-7 shadow-elevated relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-emerald" />
                Monthly Aggregate Spending Budget
              </span>
              <button
                onClick={() => {
                  setNewOverallLimit(overallBudget.toString());
                  setOverallModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-brand-emerald hover:text-emerald-500 font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Adjust Limit</span>
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight font-sans">
                {formatINR(totalSpentMonth)}
              </h3>
              <span className="text-sm font-semibold text-brand-muted">
                of {formatINR(overallBudget)} limit
              </span>
            </div>

            <div className="pt-2">
              <ProgressBar value={totalSpentMonth} max={overallBudget} height="h-3" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-brand-subtle">
              <span>{overallUtilization.toFixed(1)}% consumed</span>
              <span>
                {isOverallExceeded
                  ? `Exceeded by ${formatINR(Math.abs(overallRemaining))}`
                  : `${formatINR(overallRemaining)} available`}
              </span>
            </div>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-brand-border pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-xs text-brand-muted block mb-1">Allocated in Categories</span>
              <span className="text-lg font-bold text-brand-text font-sans">{formatINR(totalAllocatedCategories)}</span>
            </div>
            <div>
              <span className="text-xs text-brand-muted block mb-1">Status</span>
              {isOverallExceeded ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500">
                  <AlertCircle className="w-4 h-4" /> Over Budget
                </span>
              ) : isOverallWarning ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                  <AlertTriangle className="w-4 h-4" /> &gt;80% Alert
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" /> Healthy
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-brand-text tracking-tight">
            Category Allocations ({budgets.length})
          </h3>
          <span className="text-xs text-brand-subtle">
            Calculated against this month's transactions
          </span>
        </div>

        {budgets.length === 0 ? (
          <div className="p-8 text-center bg-brand-card/30 border border-dashed border-brand-border rounded-2xl">
            <p className="text-sm text-brand-muted mb-4">No category budgets created yet.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-brand-emerald text-white text-xs font-semibold rounded-xl"
            >
              Add First Category Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgets.map((b) => (
              <BudgetCard
                key={b.id}
                budget={b}
                spent={categorySpentMap[b.category] || 0}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Budget Modal */}
      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        onSubmit={handleSubmitBudget}
        initialData={selectedBudget}
        existingCategories={budgets.map((b) => b.category)}
        isLoading={isSubmitting}
      />

      {/* Adjust Overall Monthly Budget Modal */}
      <Modal
        isOpen={overallModalOpen}
        onClose={() => setOverallModalOpen(false)}
        title="Set Overall Monthly Budget"
        subtitle="Specify the aggregate expenditure ceiling across all categories"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveOverallBudget} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-brand-text mb-1">
              Monthly Budget Ceiling (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-brand-muted font-bold text-sm">₹</span>
              <input
                type="number"
                min="1"
                step="any"
                value={newOverallLimit}
                onChange={(e) => setNewOverallLimit(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-brand-elevated border border-brand-border text-brand-text text-sm font-semibold focus:outline-none focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
            <button
              type="button"
              onClick={() => setOverallModalOpen(false)}
              className="px-4 py-2 text-sm text-brand-muted hover:text-brand-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-brand-emerald hover:bg-brand-emeraldHover shadow-glow-emerald"
            >
              Update Budget
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Budget Category"
        message={`Are you sure you want to delete the budget allocation for ${budgetToDelete?.category}? You can re-create it at any time.`}
        confirmText="Confirm Delete"
        isLoading={isSubmitting}
        isDanger={true}
      />
    </div>
  );
};

export default Budgets;