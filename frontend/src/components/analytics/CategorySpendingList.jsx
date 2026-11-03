import React from 'react';
import CategoryBadge from '../common/CategoryBadge';
import ProgressBar from '../common/ProgressBar';
import { formatINR } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/constants';

export const CategorySpendingList = ({ categoryDistribution = [], totalExpenses = 0 }) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-5 sm:p-6 shadow-card h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-brand-text mb-1">
          Category Spending Concentration
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted mb-6">
          Granular breakdown of expenses ranked by proportion of total outlay
        </p>

        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
          {categoryDistribution.length === 0 ? (
            <p className="text-xs text-brand-muted py-4 text-center">No category expenses recorded in this period.</p>
          ) : (
            categoryDistribution.map((item) => {
              const color = CATEGORY_COLORS[item.category] || '#64748B';
              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <CategoryBadge category={item.category} size="sm" />
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-brand-text font-sans">{formatINR(item.amount)}</span>
                      <span className="text-brand-muted font-medium w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={item.amount}
                    max={totalExpenses || 1}
                    customColor={color}
                    height="h-2"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySpendingList;