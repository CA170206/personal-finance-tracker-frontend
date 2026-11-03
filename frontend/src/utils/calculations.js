import { calculateSavingsRate } from './formatters';

/**
 * Calculates core financial totals dynamically from an array of transactions.
 * No hardcoded or fabricated numbers.
 */
export const calculateFinancialSummary = (transactions = [], period = 'all') => {
  const safeTx = Array.isArray(transactions) ? transactions : [];

  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();

  // All-time totals
  let allTimeIncome = 0;
  let allTimeExpenses = 0;

  // Current month totals
  let curMonthIncome = 0;
  let curMonthExpenses = 0;

  // Previous month totals
  const prevMonthIndex = curMonth === 0 ? 11 : curMonth - 1;
  const prevMonthYear = curMonth === 0 ? curYear - 1 : curYear;
  let prevMonthIncome = 0;
  let prevMonthExpenses = 0;
  let hasPrevMonthData = false;

  safeTx.forEach((t) => {
    if (!t || !t.date || isNaN(Number(t.amount))) return;
    const amt = Math.max(0, Number(t.amount));
    const d = new Date(t.date);

    if (t.type === 'income') {
      allTimeIncome += amt;
    } else if (t.type === 'expense') {
      allTimeExpenses += amt;
    }

    if (!isNaN(d.getTime())) {
      const isCurMonth = d.getMonth() === curMonth && d.getFullYear() === curYear;
      const isPrevMonth = d.getMonth() === prevMonthIndex && d.getFullYear() === prevMonthYear;

      if (isCurMonth) {
        if (t.type === 'income') curMonthIncome += amt;
        else if (t.type === 'expense') curMonthExpenses += amt;
      } else if (isPrevMonth) {
        hasPrevMonthData = true;
        if (t.type === 'income') prevMonthIncome += amt;
        else if (t.type === 'expense') prevMonthExpenses += amt;
      }
    }
  });

  const allTimeBalance = allTimeIncome - allTimeExpenses;

  // If period is current month
  const activeIncome = period === 'current_month' ? curMonthIncome : allTimeIncome;
  const activeExpenses = period === 'current_month' ? curMonthExpenses : allTimeExpenses;
  const activeBalance = period === 'current_month' ? curMonthIncome - curMonthExpenses : allTimeBalance;
  const activeSavingsRate = calculateSavingsRate(activeIncome, activeExpenses);

  // Calculate trends ONLY when actual previous month data exists
  let trends = null;
  if (hasPrevMonthData && (prevMonthIncome > 0 || prevMonthExpenses > 0)) {
    const prevBalance = prevMonthIncome - prevMonthExpenses;
    const prevSavingsRate = calculateSavingsRate(prevMonthIncome, prevMonthExpenses);

    const incomeChange =
      prevMonthIncome > 0
        ? Number((((curMonthIncome - prevMonthIncome) / prevMonthIncome) * 100).toFixed(1))
        : null;

    const expenseChange =
      prevMonthExpenses > 0
        ? Number((((curMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100).toFixed(1))
        : null;

    const balanceChange =
      prevBalance !== 0
        ? Number((((activeBalance - prevBalance) / Math.abs(prevBalance)) * 100).toFixed(1))
        : null;

    const savingsRateChange = Number((activeSavingsRate - prevSavingsRate).toFixed(1));

    trends = {
      incomeChange,
      expenseChange,
      balanceChange,
      savingsRateChange,
    };
  }

  return {
    totalBalance: allTimeBalance,
    totalIncome: activeIncome,
    totalExpenses: activeExpenses,
    savingsRate: activeSavingsRate,
    trends,
    hasTransactions: safeTx.length > 0,
  };
};

/**
 * Calculates monthly financial overview bar chart data strictly from real transactions.
 */
export const calculateMonthlyOverview = (transactions = [], monthsCount = 6) => {
  const safeTx = Array.isArray(transactions) ? transactions : [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyMap = {};

  const now = new Date();
  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    monthlyMap[key] = {
      month: key,
      income: 0,
      expenses: 0,
      net: 0,
      year: d.getFullYear(),
      monthNum: d.getMonth(),
    };
  }

  safeTx.forEach((t) => {
    if (!t || !t.date) return;
    const d = new Date(t.date);
    if (isNaN(d.getTime())) return;
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    if (monthlyMap[key]) {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        monthlyMap[key].income += amt;
      } else if (t.type === 'expense') {
        monthlyMap[key].expenses += amt;
      }
    }
  });

  return Object.values(monthlyMap).map((m) => ({
    month: m.month,
    income: m.income,
    expenses: m.expenses,
    net: m.income - m.expenses,
  }));
};

/**
 * Calculates category-wise expense distribution and proportions.
 */
export const calculateExpenseBreakdown = (transactions = []) => {
  const safeTx = Array.isArray(transactions) ? transactions : [];
  const categoryMap = {};
  let totalExpenseAmount = 0;

  safeTx
    .filter((t) => t && t.type === 'expense')
    .forEach((t) => {
      const amt = Number(t.amount) || 0;
      const cat = t.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
      totalExpenseAmount += amt;
    });

  if (totalExpenseAmount === 0) {
    return [];
  }

  return Object.keys(categoryMap)
    .map((cat) => {
      const amount = categoryMap[cat];
      const percentage = Number(((amount / totalExpenseAmount) * 100).toFixed(1));
      return {
        name: cat,
        value: amount,
        percentage,
      };
    })
    .sort((a, b) => b.value - a.value);
};

/**
 * Calculates dynamic analytics metrics for a given date range filter.
 */
export const calculateAnalyticsData = (transactions = [], range = '30d') => {
  const safeTx = Array.isArray(transactions) ? transactions : [];

  const now = new Date();
  const cutoff = new Date();
  let daysInPeriod = 30;

  switch (range) {
    case '7d':
      cutoff.setDate(now.getDate() - 7);
      daysInPeriod = 7;
      break;
    case '30d':
      cutoff.setDate(now.getDate() - 30);
      daysInPeriod = 30;
      break;
    case '3m':
      cutoff.setMonth(now.getMonth() - 3);
      daysInPeriod = 90;
      break;
    case '6m':
      cutoff.setMonth(now.getMonth() - 6);
      daysInPeriod = 180;
      break;
    case '1y':
      cutoff.setFullYear(now.getFullYear() - 1);
      daysInPeriod = 365;
      break;
    default:
      cutoff.setDate(now.getDate() - 30);
      daysInPeriod = 30;
  }

  // Filter transactions within range
  const filtered = safeTx.filter((t) => {
    if (!t || !t.date) return false;
    const txDate = new Date(t.date);
    return txDate >= cutoff && txDate <= now;
  });

  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryMap = {};

  filtered.forEach((t) => {
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += amt;
    } else if (t.type === 'expense') {
      totalExpenses += amt;
      const cat = t.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    }
  });

  const netSavings = totalIncome - totalExpenses;
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);

  // Highest spending category
  let highestCategory = { name: 'None', amount: 0, percentage: 0 };
  const categoryDistribution = Object.keys(categoryMap)
    .map((cat) => {
      const amount = categoryMap[cat];
      const percentage = totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(1)) : 0;
      if (amount > highestCategory.amount) {
        highestCategory = { name: cat, amount, percentage };
      }
      return {
        category: cat,
        amount,
        percentage,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Average monthly expenses
  const monthsCount = Math.max(1, daysInPeriod / 30);
  const averageMonthlyExpenses = Math.round(totalExpenses / monthsCount);

  // Generate temporal groupings for chart
  const intervals = range === '7d' ? 7 : range === '30d' ? 6 : range === '3m' ? 3 : range === '6m' ? 6 : 12;
  const trendPoints = [];

  for (let i = intervals - 1; i >= 0; i--) {
    let label = '';
    let intervalStart = new Date(cutoff);
    let intervalEnd = new Date(cutoff);

    if (range === '7d') {
      const day = new Date();
      day.setDate(now.getDate() - i);
      label = day.toLocaleDateString('en-IN', { weekday: 'short' });
      intervalStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
      intervalEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
    } else if (range === '30d') {
      const stepDays = 5;
      const startDay = new Date();
      startDay.setDate(now.getDate() - (i + 1) * stepDays);
      const endDay = new Date();
      endDay.setDate(now.getDate() - i * stepDays);
      label = `${endDay.getDate()} ${endDay.toLocaleDateString('en-IN', { month: 'short' })}`;
      intervalStart = startDay;
      intervalEnd = endDay;
    } else {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      label = month.toLocaleDateString('en-IN', { month: 'short' });
      intervalStart = new Date(month.getFullYear(), month.getMonth(), 1);
      intervalEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);
    }

    // Sum actual transactions in this specific sub-window
    let inc = 0;
    let exp = 0;
    filtered.forEach((t) => {
      const td = new Date(t.date);
      if (td >= intervalStart && td <= intervalEnd) {
        const a = Number(t.amount) || 0;
        if (t.type === 'income') inc += a;
        else if (t.type === 'expense') exp += a;
      }
    });

    trendPoints.push({
      period: label,
      income: inc,
      expenses: exp,
      savings: Math.max(0, inc - exp),
    });
  }

  return {
    range,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    highestCategory,
    averageMonthlyExpenses,
    categoryDistribution,
    trends: trendPoints,
    hasData: filtered.length > 0,
  };
};
