import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import ChartCard from '../common/ChartCard';
import { formatINR } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-brand-card border border-brand-border p-3 rounded-xl shadow-elevated">
        <p className="text-xs font-bold text-brand-text mb-1">{data.name}</p>
        <p className="text-xs text-brand-muted">
          Amount: <span className="text-brand-text font-semibold">{formatINR(data.value)}</span>
        </p>
        <p className="text-xs text-brand-muted">
          Share: <span className="text-brand-emerald font-semibold">{data.payload.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export const ExpenseBreakdownChart = ({ data = [], totalExpenses = 0 }) => {
  const { isDark } = useTheme();

  // Pure dynamic data - NO fabricated dummy fallbacks!
  const chartData = Array.isArray(data) ? data : [];
  const total = totalExpenses || chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartCard
      title="Expense Breakdown"
      subtitle="Category distribution and proportion"
      className="h-full flex flex-col justify-between"
    >
      {chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-muted">
            <PieIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-text">No expenses logged yet</p>
            <p className="text-xs text-brand-muted mt-1 max-w-xs">
              When you record expense transactions, your category breakdown will automatically populate here.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-full h-56 sm:h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[entry.name] || '#3B82F6'}
                      stroke={isDark ? '#121215' : '#FFFFFF'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] font-medium text-brand-muted uppercase tracking-wider">Total Spent</span>
              <span className="text-lg sm:text-xl font-extrabold text-brand-text font-sans mt-0.5">
                {formatINR(total)}
              </span>
            </div>
          </div>

          {/* Legend with Amounts and Percentages */}
          <div className="mt-4 pt-4 border-t border-brand-border grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {chartData.map((item, idx) => {
              const color = CATEGORY_COLORS[item.name] || '#64748B';
              return (
                <div key={idx} className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-brand-elevated">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-brand-muted truncate text-[11px]">{item.name}</span>
                  </div>
                  <span className="text-brand-text font-semibold text-[11px] ml-1.5">
                    {item.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </ChartCard>
  );
};

export default ExpenseBreakdownChart;