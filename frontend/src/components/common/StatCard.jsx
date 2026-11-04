import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const StatCard = ({
  title,
  amount,
  isCurrency = true,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  accentColor = 'emerald', // 'emerald', 'blue', 'rose', 'purple', 'amber'
  isInverseTrend = false, // for expenses, a decrease is positive (green)
}) => {
  // Determine if trend is positive or negative
  const isPositive = trend > 0;
  const isZero = trend === 0 || trend === null || trend === undefined;

  let isGood = isPositive;
  if (isInverseTrend) {
    isGood = !isPositive;
  }

  const accentStyles = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-brand-emerald',
      glow: 'group-hover:border-emerald-500/40',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-brand-blue',
      glow: 'group-hover:border-blue-500/40',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-brand-rose',
      glow: 'group-hover:border-rose-500/40',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-brand-amber',
      glow: 'group-hover:border-amber-500/40',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-brand-purple',
      glow: 'group-hover:border-purple-500/40',
    },
  };

  const style = accentStyles[accentColor] || accentStyles.emerald;

  return (
    <div
      className={`group relative bg-brand-card hover:bg-brand-cardHover border border-brand-border ${style.glow} rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-card hover:shadow-elevated hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-brand-muted tracking-wide">{title}</span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg} ${style.border} ${style.text} border transition-transform duration-300 group-hover:scale-105`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mb-3">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight font-sans">
          {isCurrency ? formatINR(amount) : `${amount}%`}
        </h3>
      </div>

      {trend !== undefined && trend !== null && (
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md ${
              isZero
                ? 'bg-black/5 dark:bg-white/10 text-brand-subtle'
                : isGood
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {isZero ? (
              <Minus className="w-3 h-3" />
            ) : isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
          <span className="text-brand-subtle">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
