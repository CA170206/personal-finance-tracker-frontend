import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import ChartCard from '../common/ChartCard';
import { formatINR } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-card border border-brand-border p-3.5 rounded-xl shadow-elevated">
        <p className="text-xs font-bold text-brand-text mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-brand-muted">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}:
              </span>
              <span className="font-semibold text-brand-text">{formatINR(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const MonthlyOverviewChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  const gridColor = isDark ? '#232D42' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  const hasAnyData = data.some((d) => (d.income || 0) > 0 || (d.expenses || 0) > 0);

  return (
    <ChartCard
      title="Monthly Financial Overview"
      subtitle="Income vs expenses comparison over the past 6 months"
      className="h-full flex flex-col justify-between"
    >
      <div className="w-full h-72 sm:h-80 pt-2 relative">
        {!hasAnyData && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-card/40 backdrop-blur-[1px] z-10 rounded-xl">
            <p className="text-xs text-brand-muted bg-brand-elevated px-3 py-1.5 rounded-lg border border-brand-border">
              No monthly activity recorded yet.
            </p>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '16px' }}
              formatter={(val) => <span className="text-xs text-brand-muted font-medium ml-1 mr-3">{val}</span>}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#F43F5E"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default MonthlyOverviewChart;