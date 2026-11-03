import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = false,
  customColor = null,
  height = 'h-2',
}) => {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const isOverBudget = value > max;

  // Determine color based on threshold if no custom color provided
  let barColorClass = 'bg-brand-emerald';
  if (customColor) {
    barColorClass = '';
  } else if (isOverBudget) {
    barColorClass = 'bg-brand-rose';
  } else if (percentage >= 80) {
    barColorClass = 'bg-brand-amber';
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-brand-muted">
          <span>Utilization</span>
          <span className={isOverBudget ? 'text-brand-rose font-bold' : percentage >= 80 ? 'text-brand-amber font-semibold' : 'text-brand-text'}>
            {((value / (max || 1)) * 100).toFixed(0)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-brand-elevated rounded-full overflow-hidden ${height} border border-brand-border/40`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out ${barColorClass}`}
          style={{
            width: `${Math.min(100, percentage)}%`,
            backgroundColor: customColor || undefined,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
