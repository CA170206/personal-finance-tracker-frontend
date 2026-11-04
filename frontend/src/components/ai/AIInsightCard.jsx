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
  Wallet,
  Building2,
  Repeat,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
} from 'lucide-react';

export const AIInsightCard = ({ insight }) => {
  if (!insight) return null;
  const { type, title, data } = insight;

  // -------------------------------------------------------------
  // 1. FINANCIAL HEALTH CARD (Enhanced Snapshot)
  // -------------------------------------------------------------
  if (type === 'financial_health_card' && data) {
    const balance = Number(data.totalBalance ?? 0);
    const income = Number(data.totalIncome ?? 0);
    const expenses = Number(data.totalExpenses ?? 0);
    const savingsRate = Number(data.savingsRate ?? 0);
    const isDeficit = balance < 0;

    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                isDeficit
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isDeficit ? <AlertTriangle className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-bold text-brand-text block text-xs">
                {title || 'Financial Health Overview'}
              </span>
              <span className="text-[10px] text-brand-subtle">
                Real-time ledger summary
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
              isDeficit
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            }`}
          >
            {isDeficit ? 'Net Deficit' : 'Surplus Cashflow'}
          </span>
        </div>

        {/* Primary Metric: Net Available Balance */}
        <div className="p-3 rounded-xl bg-brand-card border border-brand-border/60 mb-3 flex items-center justify-between">
          <div>
            <span className="text-brand-subtle text-[10px] block font-medium">Net Ledger Balance</span>
            <span
              className={`font-black text-lg tracking-tight ${
                isDeficit ? 'text-rose-600 dark:text-rose-400' : 'text-brand-text'
              }`}
            >
              {balance < 0 ? `-₹${Math.abs(balance).toLocaleString('en-IN')}` : `₹${balance.toLocaleString('en-IN')}`}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-brand-subtle block font-medium">Savings Rate</span>
            <span className="font-bold text-brand-text text-sm">{savingsRate}%</span>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
          <div className="p-2.5 rounded-xl bg-brand-card border border-brand-border/60 flex items-center justify-between">
            <div>
              <span className="text-brand-subtle block text-[10px]">Tracked Income</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                +₹{income.toLocaleString('en-IN')}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-500/70" />
          </div>

          <div className="p-2.5 rounded-xl bg-brand-card border border-brand-border/60 flex items-center justify-between">
            <div>
              <span className="text-brand-subtle block text-[10px]">Tracked Expenses</span>
              <span className="font-bold text-rose-500 text-xs">
                -₹{expenses.toLocaleString('en-IN')}
              </span>
            </div>
            <ArrowDownRight className="w-4 h-4 text-rose-500/70" />
          </div>
        </div>

        {/* Diagnostic explanation callout */}
        {income === 0 && expenses > 0 ? (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Ledger Notice:</strong> No income entries have been recorded yet for this period. All tracked debits are reflected as an active cash deficit.
            </span>
          </div>
        ) : isDeficit ? (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-[11px] leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Your expenses exceed recorded income by ₹{Math.abs(balance).toLocaleString('en-IN')}. Focus on reducing discretionary outflows or logging any pending deposits.
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] leading-relaxed flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Healthy financial standing. You maintain a net positive cash buffer of ₹{balance.toLocaleString('en-IN')}.
            </span>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. RECENT TRANSACTIONS CARD
  // -------------------------------------------------------------
  if (type === 'recent_transactions_card' && data) {
    const txs = Array.isArray(data.transactions) ? data.transactions : [];
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title || 'Recent Ledger Entries'}</span>
          </div>
          <span className="text-[10px] text-brand-subtle font-medium">
            {txs.length} record{txs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {txs.length === 0 ? (
          <p className="text-brand-muted text-[11px] py-2">No transactions recorded for this criteria.</p>
        ) : (
          <div className="space-y-1.5">
            {txs.slice(0, 5).map((t, i) => {
              const isIncome = t.type === 'income';
              const amt = Number(t.amount || 0);
              return (
                <div
                  key={t.id || i}
                  className="flex items-center justify-between p-2 rounded-xl bg-brand-card border border-brand-border/60 hover:bg-brand-elevated transition-colors"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-brand-text block text-[11px] truncate">
                      {t.title || t.description || 'Transaction'}
                    </span>
                    <span className="text-[10px] text-brand-subtle">
                      {t.category || 'General'} • {t.date || 'Recent'}
                    </span>
                  </div>
                  <span
                    className={`font-bold text-xs whitespace-nowrap ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-text'
                    }`}
                  >
                    {isIncome ? '+' : '-'}₹{amt.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. SAVINGS OPPORTUNITIES CARD
  // -------------------------------------------------------------
  if (type === 'savings_opportunities_card' && data) {
    const opportunities = Array.isArray(data.opportunities) ? data.opportunities : [];
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-brand-text">{title || 'Identified Savings Opportunities'}</span>
          </div>
          {data.totalPotentialSavings > 0 && (
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
              Save ~₹{Number(data.totalPotentialSavings).toLocaleString('en-IN')}/mo
            </span>
          )}
        </div>

        <div className="space-y-2">
          {opportunities.slice(0, 3).map((op, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-brand-card border border-brand-border/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-text text-[11px]">{op.category}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[10px]">
                  +₹{Number(op.potentialMonthlySavings || 0).toLocaleString('en-IN')}/mo
                </span>
              </div>
              <p className="text-[10px] text-brand-muted leading-tight">{op.rationale || op.reason}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. RECURRING SUBSCRIPTIONS CARD
  // -------------------------------------------------------------
  if (type === 'recurring_card' && data) {
    const items = Array.isArray(data.items) ? data.items : [];
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title || 'Active Subscriptions'}</span>
          </div>
          <span className="font-bold text-brand-text text-xs">
            ₹{Number(data.totalMonthlyCommitment || 0).toLocaleString('en-IN')}/mo
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-brand-muted text-[11px] py-1">No repeat subscriptions detected.</p>
        ) : (
          <div className="space-y-1.5">
            {items.slice(0, 4).map((r, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-brand-card border border-brand-border/60">
                <div>
                  <span className="font-semibold text-brand-text block text-[11px]">{r.title}</span>
                  <span className="text-[10px] text-brand-subtle">{r.category} • Monthly</span>
                </div>
                <span className="font-bold text-brand-text text-xs">
                  ₹{Number(r.amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. BANK ACCOUNTS CARD
  // -------------------------------------------------------------
  if (type === 'bank_accounts_card' && data) {
    const accounts = Array.isArray(data.accounts) ? data.accounts : [];
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title || 'Recorded Bank Balances'}</span>
          </div>
          <span className="font-bold text-brand-text text-xs">
            Total: ₹{Number(data.totalBalance || 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="space-y-1.5">
          {accounts.map((acc, i) => (
            <div key={acc.id || i} className="flex items-center justify-between p-2 rounded-xl bg-brand-card border border-brand-border/60">
              <div>
                <span className="font-semibold text-brand-text block text-[11px]">{acc.bank_name}</span>
                <span className="text-[10px] text-brand-subtle capitalize">{acc.account_type || 'Account'}</span>
              </div>
              <span className="font-bold text-brand-text text-xs">
                ₹{Number(acc.balance || 0).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6. BUDGET PROGRESS CARD
  // -------------------------------------------------------------
  if (type === 'budget_progress_card' && data) {
    const budgets = Array.isArray(data.budgets) ? data.budgets : [];
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title || 'Budget Utilization'}</span>
          </div>
          <span className="text-[10px] text-brand-subtle font-medium">
            {budgets.length} Category Budgets
          </span>
        </div>

        <div className="space-y-2.5">
          {budgets.map((b, i) => {
            const spent = Number(b.spent || 0);
            const allocated = Number(b.allocated || 1);
            const pct = Math.min(150, Math.round((spent / allocated) * 100));
            const isOver = spent > allocated;

            return (
              <div key={b.id || i} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-brand-text">{b.category}</span>
                  <span className={`font-bold ${isOver ? 'text-rose-500' : 'text-brand-text'}`}>
                    ₹{spent.toLocaleString('en-IN')} / ₹{allocated.toLocaleString('en-IN')} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-brand-border/60 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOver ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 7. AFFORDABILITY METER CARD
  // -------------------------------------------------------------
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
                Score: {data.score}/100 • {data.status}
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
              isAffordable ? 'bg-emerald-500' : isCaution ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(10, data.score))}%` }}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Purchase</span>
            <span className="font-bold text-brand-text">₹{Number(data.purchaseAmount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Balance</span>
            <span className="font-bold text-brand-text">₹{Number(data.availableFunds || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Bills Reserve</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">₹{Number(data.upcomingBillsAmount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2 rounded-xl bg-brand-card border border-brand-border/60">
            <span className="text-brand-subtle block text-[10px]">Safe Buffer</span>
            <span className={`font-bold ${data.surplusAfterPurchase >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
              ₹{Number(data.surplusAfterPurchase || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 8. COMPARISON CARD
  // -------------------------------------------------------------
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
                  ₹{Number(c.current || 0).toLocaleString('en-IN')}{' '}
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

  // -------------------------------------------------------------
  // 9. CATEGORY BREAKDOWN CARD
  // -------------------------------------------------------------
  if (type === 'category_breakdown_card' && data) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title}</span>
          </div>
          <span className="font-bold text-brand-text">
            Total: ₹{Number(data.totalExpense || 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="space-y-2">
          {(data.breakdown || []).slice(0, 4).map((b, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-medium text-brand-text">{b.category}</span>
                <span className="font-semibold text-brand-text">
                  ₹{Number(b.amount || 0).toLocaleString('en-IN')} ({b.percentage}%)
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

  // -------------------------------------------------------------
  // 10. BILLS SUMMARY CARD
  // -------------------------------------------------------------
  if (type === 'bills_summary_card' && data) {
    return (
      <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-text" />
            <span className="font-bold text-brand-text">{title}</span>
          </div>
          <span className="font-bold text-amber-600 dark:text-amber-400">
            Pending: ₹{Number(data.pendingTotal || 0).toLocaleString('en-IN')}
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
                <span className="font-bold text-brand-text block">₹{Number(b.amount || 0).toLocaleString('en-IN')}</span>
                <span className="text-[9px] uppercase font-bold text-amber-500">{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 11. CLEAN FALLBACK CARD (Human-friendly, NEVER dumps raw JSON)
  // -------------------------------------------------------------
  return (
    <div className="mt-3 p-4 rounded-2xl bg-brand-elevated border border-brand-border shadow-sm text-xs">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-brand-border/60">
        <Sparkles className="w-4 h-4 text-brand-text" />
        <span className="font-bold text-brand-text">{title || 'Financial Insight'}</span>
      </div>

      {typeof data === 'string' ? (
        <p className="text-brand-muted text-[11px] leading-relaxed">{data}</p>
      ) : typeof data === 'object' && data !== null ? (
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {Object.entries(data)
            .filter(([k, v]) => v !== null && typeof v !== 'object')
            .slice(0, 6)
            .map(([k, v], i) => {
              const humanKey = k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
              const isNum = typeof v === 'number';
              return (
                <div key={i} className="p-2 rounded-xl bg-brand-card border border-brand-border/60">
                  <span className="text-brand-subtle block text-[10px]">{humanKey}</span>
                  <span className="font-bold text-brand-text text-xs">
                    {isNum ? `₹${v.toLocaleString('en-IN')}` : String(v)}
                  </span>
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-brand-muted text-[11px]">Overview details loaded.</p>
      )}
    </div>
  );
};

export default AIInsightCard;
