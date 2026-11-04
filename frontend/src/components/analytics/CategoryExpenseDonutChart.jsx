import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import ChartCard from '../common/ChartCard';
import { formatINR } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';

const CustomDonutTooltip = ({ active, payload }) => {
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

export const CategoryExpenseDonutChart = ({
  categoryDistribution = [],
  totalExpenses = 0,
}) => {
  const { isDark } = useTheme();

  const chartData = (categoryDistribution || [])
    .filter((item) => item && item.amount > 0)
    .map((item) => ({
      name: item.category,
      value: item.amount,
      percentage: item.percentage,
    }));

  const hasData = chartData.length > 0 && chartData.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <ChartCard
        title="Expense Distribution"
        subtitle="Proportional category breakdown for selected window"
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col items-center justify-center h-64 text-center p-4 border border-dashed border-brand-border rounded-xl my-auto">
          <p className="text-sm font-semibold text-brand-text">No Outflow Recorded</p>
          <p className="text-xs text-brand-muted mt-1 max-w-xs">
            No expenses found within this date range. Try switching to a wider interval.
          </p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Expense Distribution"
      subtitle="Proportional category breakdown for selected window"
      className="h-full flex flex-col justify-between"
    >
      <div className="relative w-full h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomDonutTooltip />} />
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
          <span className="text-[11px] font-medium text-brand-muted uppercase tracking-wider">
            Total Outflow
          </span>
          <span className="text-lg font-extrabold text-brand-text font-sans mt-0.5">
            {formatINR(totalExpenses)}
          </span>
        </div>
      </div>

      {/* Mini Legend */}
      <div className="mt-3 pt-3 border-t border-brand-border grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
        {chartData.map((item, idx) => {
          const color = CATEGORY_COLORS[item.name] || '#64748B';
          return (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-brand-elevated"
            >
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
    </ChartCard>
  );
};

export default CategoryExpenseDonutChart;