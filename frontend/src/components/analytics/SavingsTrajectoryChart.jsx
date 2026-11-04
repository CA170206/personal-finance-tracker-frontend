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

const CustomSavingsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-card border border-brand-border p-3 rounded-xl shadow-elevated">
        <p className="text-xs font-bold text-brand-text mb-1.5">{label}</p>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-brand-muted">Net Surplus / Savings:</span>
          <span className="font-semibold text-brand-emerald">{formatINR(payload[0].value)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const SavingsTrajectoryChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  const gridColor = isDark ? '#27272A' : '#E2E8F0';
  const textColor = isDark ? '#A1A1AA' : '#64748B';
  const dotStroke = isDark ? '#121215' : '#FFFFFF';

  return (
    <ChartCard
      title="Net Cumulative Savings Trajectory"
      subtitle="Surplus capital preserved over the selected timeframe"
      className="h-full flex flex-col justify-between"
    >
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="analyticsSavingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
            <Tooltip content={<CustomSavingsTooltip />} />
            <Area
              type="monotone"
              dataKey="savings"
              name="Net Savings"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#analyticsSavingsGradient)"
              dot={{ fill: '#10B981', stroke: dotStroke, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default SavingsTrajectoryChart;