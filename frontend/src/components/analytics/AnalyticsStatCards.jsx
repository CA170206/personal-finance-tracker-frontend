import React from 'react';
import { TrendingUp, CreditCard, PiggyBank, Wallet } from 'lucide-react';
import StatCard from '../common/StatCard';

export const AnalyticsStatCards = ({ data }) => {
  if (!data) return null;

  const {
    totalIncome = 0,
    totalExpenses = 0,
    netSavings = 0,
    savingsRate = 0,
    savingsPercentage,
    trends = {},
  } = data;

  const activeSavingsRate = savingsRate || savingsPercentage || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Period Income"
        amount={totalIncome}
        icon={TrendingUp}
        trend={trends?.incomeChange}
        trendLabel="vs previous period"
        accentColor="blue"
      />
      <StatCard
        title="Period Expenses"
        amount={totalExpenses}
        icon={CreditCard}
        trend={trends?.expenseChange}
        trendLabel="vs previous period"
        accentColor="rose"
        isInverseTrend={true}
      />
      <StatCard
        title="Net Period Savings"
        amount={netSavings}
        icon={Wallet}
        trend={trends?.balanceChange}
        trendLabel="net cash preserved"
        accentColor="emerald"
      />
      <StatCard
        title="Savings Percentage"
        amount={activeSavingsRate.toFixed(1)}
        isCurrency={false}
        icon={PiggyBank}
        trend={trends?.savingsRateChange}
        trendLabel="rate vs previous"
        accentColor="purple"
      />
    </div>
  );
};

export default AnalyticsStatCards;