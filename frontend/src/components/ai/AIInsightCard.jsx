import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  PieChart,
} from 'lucide-react';

export const AIInsightCard = ({ insight }) => {
  if (!insight) return null;
  const { type, title, data } = insight;

  // 1. AFFORDABILITY METER CARD
  if (type === 'affordability_meter' && data) {
    const isAffordable = data.status === 'affordable';
    const isCaution = data.status === 'caution';

    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                isAffordable
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : isCaution
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isAffordable ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : isCaution ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="font-bold text-brand-text block text-xs">
                {title || 'Affordability Analysis'}
              </span>
              <span className="text-[10px] text-brand-subtle capitalize">
                Status: {data.status} • Score: {data.score}/100
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
              isAffordable
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : isCaution
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}
          >
            {data.status}
          </span>
        </div>

        {/* Progress bar meter */}
        <div className="w-full bg-brand-border/60 rounded-full h-2 mb-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isAffordable
                ? 'bg-emerald-500'
                : isCaution
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(10, data.score))}%` }}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Purchase</span>
            <span className="font-bold text-brand-text">₹{data.purchaseAmount?.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Balance</span>
            <span className="font-bold text-brand-text">₹{data.availableFunds?.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Bills Reserve</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">₹{data.upcomingBillsAmount?.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Safe Buffer</span>
            <span className={`font-bold ${data.surplusAfterPurchase >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
              ₹{data.surplusAfterPurchase?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPARISON CARD
  if (type === 'comparison_card' && data) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title}</span>
          </div>
          <span className="text-[10px] text-brand-muted">
            {data.currentPeriod} vs {data.previousPeriod}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-brand-card border border-brand-border/60 mb-2.5">
          <div>
            <span className="text-brand-subtle text-[10px] block">Net Spending Delta</span>
            <span className="font-bold text-brand-text text-sm">
              ₹{Math.abs(data.difference || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <span
            className={`font-bold text-xs px-2 py-0.5 rounded-full ${
              data.difference > 0
                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {data.percentageChange > 0 ? '+' : ''}{data.percentageChange}%
          </span>
        </div>

        {data.categoryDeltas && data.categoryDeltas.length > 0 && (
          <div className="space-y-1.5 text-[11px]">
            {data.categoryDeltas.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-brand-card">
                <span className="text-brand-muted">{c.category}</span>
                <span className="font-semibold text-brand-text">
                  ₹{c.current.toLocaleString('en-IN')}{' '}
                  <span className={c.difference > 0 ? 'text-rose-500' : 'text-emerald-500'}>
                    ({c.percentageChange > 0 ? '+' : ''}{c.percentageChange}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. CATEGORY BREAKDOWN CARD
  if (type === 'category_breakdown_card' && data) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title}</span>
          </div>
          <span className="font-bold text-brand-text">
            Total: ₹{data.totalExpense?.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="space-y-2">
          {(data.breakdown || []).slice(0, 4).map((b, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-medium text-brand-text">{b.category}</span>
                <span className="font-semibold text-brand-text">
                  ₹{b.amount?.toLocaleString('en-IN')} ({b.percentage}%)
                </span>
              </div>
              <div className="w-full bg-brand-border/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-black dark:bg-white h-full rounded-full"
                  style={{ width: `${Math.min(100, b.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. BILLS SUMMARY CARD
  if (type === 'bills_summary_card' && data) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title}</span>
          </div>
          <span className="font-bold text-amber-600 dark:text-amber-400">
            Pending: ₹{data.pendingTotal?.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          {(data.bills || []).slice(0, 3).map((b, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-xl bg-brand-card border border-brand-border/60"
            >
              <div>
                <span className="font-semibold text-brand-text block">{b.provider}</span>
                <span className="text-[10px] text-brand-subtle">Due {b.dueDate}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-brand-text block">₹{b.amount?.toLocaleString('en-IN')}</span>
                <span className="text-[9px] uppercase font-bold text-amber-500">{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. MONTH-END PROJECTION CARD
  if (type === 'projection_card' && data) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title}</span>
          </div>
          <span className="text-[10px] text-brand-subtle">
            Day {data.currentDay} of {data.totalDaysInMonth}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
          <div className="p-2.5 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Daily Burn Rate</span>
            <span className="font-bold text-brand-text">₹{data.dailyBurnRate?.toLocaleString('en-IN')}/day</span>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Projected Expense</span>
            <span className="font-bold text-brand-text">₹{data.projectedTotalExpense?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback generic card
  return (
    <div className="mt-3 p-3.5 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-3.5 h-3.5 text-brand-text" />
        <span className="font-bold text-brand-text">{title || 'Financial Insight'}</span>
      </div>
      <p className="text-brand-muted text-[11px]">
        {typeof data === 'string' ? data : JSON.stringify(data)}
      </p>
    </div>
  );
};

export default AIInsightCard;

