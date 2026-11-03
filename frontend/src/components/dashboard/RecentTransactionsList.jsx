import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ArrowRight, Clock, Plus } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import EmptyState from '../common/EmptyState';
import { formatINR, formatDate } from '../../utils/formatters';

export const RecentTransactionsList = ({ transactions = [], onAddClick }) => {
  const recent = transactions.slice(0, 6);

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-5 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-brand-text tracking-tight">Recent Transactions</h3>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5">Latest financial activities and transfers</p>
        </div>
        <div className="flex items-center gap-2">
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-elevated hover:bg-brand-border text-brand-text text-xs font-semibold rounded-xl border border-brand-border transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Add New</span>
            </button>
          )}
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-emerald hover:text-emerald-500 transition-colors px-2 py-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No transactions recorded yet"
          description="Start tracking your cash flow by logging your first transaction."
          actionLabel="Log Transaction"
          onAction={onAddClick}
        />
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop & Tablet Table */}
          <table className="w-full text-left border-collapse hidden sm:table">
            <thead>
              <tr className="border-b border-brand-border text-brand-subtle text-xs uppercase tracking-wider">
                <th className="py-3 px-3 font-semibold">Transaction</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-3 font-semibold">Type</th>
                <th className="py-3 px-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 text-sm">
              {recent.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-brand-elevated/40 transition-colors group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-text truncate max-w-xs">{tx.title}</p>
                          {tx.notes && (
                            <p className="text-xs text-brand-subtle truncate max-w-xs">{tx.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <CategoryBadge category={tx.category} />
                    </td>
                    <td className="py-3.5 px-3 text-xs text-brand-muted">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isIncome
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`font-bold font-sans ${
                          isIncome ? 'text-brand-emerald' : 'text-brand-rose'
                        }`}
                      >
                        {isIncome ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile Card Presentation */}
          <div className="sm:hidden space-y-3">
            {recent.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-brand-elevated/40 border border-brand-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-brand-text text-xs truncate">{tx.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-brand-subtle">{formatDate(tx.date)}</span>
                        <CategoryBadge category={tx.category} size="sm" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span
                      className={`font-bold text-xs ${
                        isIncome ? 'text-brand-emerald' : 'text-brand-rose'
                      }`}
                    >
                      {isIncome ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsList;