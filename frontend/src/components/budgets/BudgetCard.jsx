import React from 'react';
import { Edit2, Trash2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import ProgressBar from '../common/ProgressBar';
import { formatINR } from '../../utils/formatters';

export const BudgetCard = ({
  budget,
  spent = 0,
  onEdit,
  onDelete,
}) => {
  const allocated = Number(budget.allocated) || 0;
  const remaining = allocated - spent;
  const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
  const isExceeded = spent > allocated;
  const isNearLimit = percentage >= 80 && !isExceeded;

  return (
    <div
      className={`bg-brand-card border rounded-2xl p-5 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 ${
        isExceeded
          ? 'border-rose-500/40 bg-rose-500/5'
          : isNearLimit
          ? 'border-amber-500/40 bg-amber-500/5'
          : 'border-brand-border'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <CategoryBadge category={budget.category} size="md" />
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 text-brand-muted hover:text-brand-blue hover:bg-brand-elevated rounded-lg transition-colors"
            title="Edit budget"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(budget)}
            className="p-1.5 text-brand-muted hover:text-brand-rose hover:bg-brand-elevated rounded-lg transition-colors"
            title="Delete budget"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Amounts Overview */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <span className="text-[11px] font-medium text-brand-subtle uppercase tracking-wider block">Spent</span>
          <span className={`text-lg font-bold font-sans ${isExceeded ? 'text-brand-rose' : 'text-brand-text'}`}>
            {formatINR(spent)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-medium text-brand-subtle uppercase tracking-wider block">Limit</span>
          <span className="text-lg font-bold font-sans text-brand-muted">
            {formatINR(allocated)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <ProgressBar value={spent} max={allocated} />
      </div>

      {/* Footer Status Indicators */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-brand-border">
        <div className="flex items-center gap-1.5 font-medium">
          {isExceeded ? (
            <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              Exceeded by {formatINR(Math.abs(remaining))}
            </span>
          ) : isNearLimit ? (
            <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              80% Warning ({formatINR(remaining)} left)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-brand-emerald">
              <CheckCircle2 className="w-3.5 h-3.5" />
              On Track ({formatINR(remaining)} left)
            </span>
          )}
        </div>
        <span className="font-semibold text-brand-muted">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default BudgetCard;