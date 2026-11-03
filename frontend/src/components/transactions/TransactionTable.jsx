import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import EmptyState from '../common/EmptyState';
import { formatINR, formatDate } from '../../utils/formatters';

export const TransactionTable = ({
  transactions = [],
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(transactions.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No transactions match your criteria"
        description="Try adjusting your search query, clearing filters, or adding a new transaction."
        actionLabel="Add Transaction"
        onAction={onAddNew}
      />
    );
  }

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl shadow-card overflow-hidden">
      {/* Desktop & Tablet Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse hidden sm:table">
          <thead>
            <tr className="border-b border-brand-border text-brand-subtle text-xs uppercase tracking-wider bg-brand-elevated/40">
              <th className="py-3.5 px-4 font-semibold">Transaction</th>
              <th className="py-3.5 px-4 font-semibold">Category</th>
              <th className="py-3.5 px-4 font-semibold">Date</th>
              <th className="py-3.5 px-4 font-semibold">Type</th>
              <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
              <th className="py-3.5 px-4 font-semibold text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40 text-sm">
            {paginatedTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <tr
                  key={tx.id}
                  className="hover:bg-brand-elevated/30 transition-colors group"
                >
                  <td className="py-3.5 px-4">
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
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-brand-text truncate">{tx.title}</p>
                        {tx.notes && (
                          <p className="text-xs text-brand-subtle truncate">{tx.notes}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <CategoryBadge category={tx.category} />
                  </td>
                  <td className="py-3.5 px-4 text-xs text-brand-muted">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-bold font-sans ${
                        isIncome ? 'text-brand-emerald' : 'text-brand-rose'
                      }`}
                    >
                      {isIncome ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-brand-muted hover:text-brand-blue hover:bg-brand-elevated rounded-lg transition-colors"
                        title="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(tx)}
                        className="p-1.5 text-brand-muted hover:text-brand-rose hover:bg-brand-elevated rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Presentation */}
      <div className="sm:hidden divide-y divide-brand-border/40 p-2">
        {paginatedTransactions.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <div key={tx.id} className="p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-text text-xs truncate">{tx.title}</p>
                    <p className="text-[10px] text-brand-subtle">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold text-xs ${
                      isIncome ? 'text-brand-emerald' : 'text-brand-rose'
                    }`}
                  >
                    {isIncome ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <CategoryBadge category={tx.category} size="sm" />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1.5 text-brand-muted hover:text-brand-blue rounded-md"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(tx)}
                    className="p-1.5 text-brand-muted hover:text-brand-rose rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-t border-brand-border bg-brand-elevated/20 text-xs">
          <span className="text-brand-muted">
            Showing <span className="font-semibold text-brand-text">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-brand-text">
              {Math.min(startIndex + pageSize, transactions.length)}
            </span>{' '}
            of <span className="font-semibold text-brand-text">{transactions.length}</span> entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-brand-text font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;