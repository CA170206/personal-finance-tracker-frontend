import React from 'react';

export const ChartCard = ({
  title,
  subtitle,
  actions,
  children,
  className = '',
  headerClassName = '',
}) => {
  return (
    <div
      className={`bg-brand-card border border-brand-border rounded-2xl p-5 sm:p-6 shadow-card transition-all duration-300 ${className}`}
    >
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 ${headerClassName}`}>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-brand-text tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs sm:text-sm text-brand-muted mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 self-start sm:self-auto">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ChartCard;
