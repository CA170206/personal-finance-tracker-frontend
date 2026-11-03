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
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
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

export const CashFlowChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  const gridColor = isDark ? '#232D42' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <ChartCard
      title="Income vs Expenses Cash Flow"
      subtitle="Comparison across temporal intervals in selected range"
      className="h-full flex flex-col justify-between"
    >
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px' }}
              formatter={(val) => <span className="text-xs text-brand-muted ml-1 mr-3">{val}</span>}
            />
            <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default CashFlowChart;