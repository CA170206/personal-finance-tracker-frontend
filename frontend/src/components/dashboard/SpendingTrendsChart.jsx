import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import ChartCard from '../common/ChartCard';
import { formatINR } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-card border border-brand-border p-3 rounded-xl shadow-elevated">
        <p className="text-xs font-bold text-brand-text mb-1.5">{label}</p>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-brand-muted">Total Expenses:</span>
          <span className="font-semibold text-rose-500">{formatINR(payload[0].value)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const SpendingTrendsChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  const gridColor = isDark ? '#232D42' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const dotStroke = isDark ? '#151B2B' : '#FFFFFF';

  const hasExpenses = data.some((d) => (d.expenses || 0) > 0);

  return (
    <ChartCard
      title="Spending Trends"
      subtitle="Monthly expenditure velocity and trajectory"
      className="h-full flex flex-col justify-between"
    >
      <div className="w-full h-56 sm:h-64 pt-2 relative">
        {!hasExpenses && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-card/40 backdrop-blur-[1px] z-10 rounded-xl">
            <p className="text-xs text-brand-muted bg-brand-elevated px-3 py-1.5 rounded-lg border border-brand-border">
              No spending history detected.
            </p>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="expenseTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
            <Tooltip content={<CustomLineTooltip />} />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#F43F5E"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#expenseTrendGradient)"
              dot={{ fill: '#F43F5E', stroke: dotStroke, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default SpendingTrendsChart;