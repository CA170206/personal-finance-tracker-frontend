import React from 'react';
import { Wallet, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';
import StatCard from '../common/StatCard';
import { useFinance } from '../../context/FinanceContext';

export const FinancialSummaryCards = () => {
  const { summary } = useFinance();

  const {
    totalBalance = 0,
    totalIncome = 0,
    totalExpenses = 0,
    savingsRate = 0,
    trends,
  } = summary || {};

  const safeTrends = trends || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Total Net Balance"
        amount={totalBalance}
        icon={Wallet}
        trend={safeTrends.balanceChange}
        trendLabel="vs last month"
        accentColor="emerald"
      />
      <StatCard
        title="Monthly Income"
        amount={totalIncome}
        icon={TrendingUp}
        trend={safeTrends.incomeChange}
        trendLabel="vs last month"
        accentColor="blue"
      />
      <StatCard
        title="Monthly Expenses"
        amount={totalExpenses}
        icon={CreditCard}
        trend={safeTrends.expenseChange}
        trendLabel="vs last month"
        accentColor="rose"
        isInverseTrend={true}
      />
      <StatCard
        title="Savings Rate"
        amount={savingsRate.toFixed(1)}
        isCurrency={false}
        icon={PiggyBank}
        trend={safeTrends.savingsRateChange}
        trendLabel="vs last month"
        accentColor="purple"
      />
    </div>
  );
};

export default FinancialSummaryCards;