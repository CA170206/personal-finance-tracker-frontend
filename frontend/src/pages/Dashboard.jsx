import React, { useState } from 'react';
import { Plus, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import FinancialSummaryCards from '../components/dashboard/FinancialSummaryCards';
import MonthlyOverviewChart from '../components/dashboard/MonthlyOverviewChart';
import ExpenseBreakdownChart from '../components/dashboard/ExpenseBreakdownChart';
import SpendingTrendsChart from '../components/dashboard/SpendingTrendsChart';
import RecentTransactionsList from '../components/dashboard/RecentTransactionsList';
import TransactionModal from '../components/transactions/TransactionModal';

export const Dashboard = () => {
  const { user } = useAuth();
  const {
    transactions,
    charts,
    loading,
    refreshAll,
    addTransaction,
  } = useFinance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';
  const hasZeroTransactions = transactions.length === 0;

  const handleCreateTransaction = async (formData) => {
    setIsSubmitting(true);
    try {
      await addTransaction(formData);
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Page Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
            Welcome back, {firstName}
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Here's an overview of your finances, cash flow, and spending telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAll}
            disabled={loading}
            className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-text transition-colors"
            title="Refresh dashboard metrics"
            aria-label="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 active:scale-95 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Empty State Onboarding Banner for New Users */}
      {hasZeroTransactions && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 sm:p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-black dark:text-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Started</span>
            </div>
            <h3 className="text-base font-bold text-brand-text">
              Your financial dashboard is ready.
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted max-w-xl">
              Start by adding your first income or expense to see your financial insights, spending breakdowns, and savings rate.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 active:scale-95 shadow-sm transition-all flex-shrink-0"
          >
            <span>Add Your First Transaction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Financial Summary Cards */}
      <FinancialSummaryCards />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Overview (2 columns) */}
        <div className="lg:col-span-2">
          <MonthlyOverviewChart data={charts.monthlyOverview} />
        </div>

        {/* Expense Breakdown Donut (1 column) */}
        <div className="lg:col-span-1">
          <ExpenseBreakdownChart
            data={charts.expenseBreakdown}
            totalExpenses={charts.totalExpenses}
          />
        </div>
      </div>

      {/* Secondary Row: Spending Trends & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trends Area Chart (1 column) */}
        <div className="lg:col-span-1">
          <SpendingTrendsChart data={charts.spendingTrends} />
        </div>

        {/* Recent Transactions Table (2 columns) */}
        <div className="lg:col-span-2">
          <RecentTransactionsList
            transactions={transactions}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        </div>
      </div>

      {/* Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaction}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Dashboard;