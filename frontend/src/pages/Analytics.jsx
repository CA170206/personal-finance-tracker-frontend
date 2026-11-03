import React, { useState, useEffect, useCallback } from 'react';
import {
  Flame,
  Activity,
  RefreshCw,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  AnalyticsStatCards,
  CashFlowChart,
  SavingsTrajectoryChart,
  CategoryExpenseDonutChart,
  CategorySpendingList,
} from '../components/analytics';
import analyticsService from '../services/analyticsService';
import { formatINR } from '../utils/formatters';
import { DATE_RANGES } from '../utils/constants';

export const Analytics = () => {
  const [selectedRange, setSelectedRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getAnalytics(selectedRange);
      setData(result);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Page Header with Range Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
            Financial Analytics & Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Deep dive into savings velocity, spending concentrations, and cash flow trends
          </p>
        </div>

        {/* Date Range Selector Pill Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2 rounded-xl bg-brand-card hover:bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-text transition-colors"
            title="Refresh analytics"
            aria-label="Refresh analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-1 p-1 bg-brand-card border border-brand-border rounded-xl overflow-x-auto max-w-full">
            {DATE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedRange === range.value
                    ? 'bg-brand-emerald text-white shadow-glow-emerald'
                    : 'text-brand-muted hover:text-brand-text hover:bg-brand-elevated'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" text="Recalculating analytics for selected window..." />
        </div>
      ) : data ? (
        <>
          {/* 1. Key Metric Stats Grid: Total income, Total expenses, Net savings, Savings percentage */}
          <AnalyticsStatCards data={data} />

          {/* 2. Key Insights Row: Highest spending category & Average monthly expenses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-card flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-brand-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  Highest Spending Category
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h4 className="text-xl font-extrabold text-brand-text">{data.highestCategory.name}</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/20">
                    {data.highestCategory.percentage}% of total
                  </span>
                </div>
                <p className="text-xs text-brand-subtle">
                  Accumulated spend: <span className="text-brand-text font-semibold">{formatINR(data.highestCategory.amount)}</span>
                </p>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-card flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-brand-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-brand-emerald" />
                  Average Monthly Expenses Run-Rate
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h4 className="text-xl font-extrabold text-brand-text">
                    {formatINR(data.averageMonthlyExpenses)}
                  </h4>
                  <span className="text-xs text-brand-subtle">/ month average</span>
                </div>
                <p className="text-xs text-brand-subtle">
                  Normalized based on active period spend
                </p>
              </div>
            </div>
          </div>

          {/* 3. Temporal Comparison Charts: Income vs Expense Comparison & Monthly Spending/Savings Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CashFlowChart data={data.trends} />
            <SavingsTrajectoryChart data={data.trends} />
          </div>

          {/* 4. Category-wise Expense Distribution: Donut Chart + Granular Proportion List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <CategoryExpenseDonutChart
                categoryDistribution={data.categoryDistribution}
                totalExpenses={data.totalExpenses}
              />
            </div>
            <div className="lg:col-span-2">
              <CategorySpendingList
                categoryDistribution={data.categoryDistribution}
                totalExpenses={data.totalExpenses}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Analytics;