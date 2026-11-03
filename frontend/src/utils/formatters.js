/**
 * Formats a number to Indian Rupee (INR) representation with ₹ symbol.
 * Example: 45000 -> ₹45,000, 125000 -> ₹1,25,000
 */
export const formatINR = (amount, includeDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0,
  }).format(absNum);

  return isNegative ? `-${formatted}` : formatted;
};

/**
 * Formats a date string or timestamp into readable presentation.
 */
export const formatDate = (dateString, formatType = 'standard') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (formatType === 'relative') {
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
  }

  // standard: 02 Nov 2026
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
};

/**
 * Formats percentage with 1 decimal place.
 */
export const formatPercent = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  const num = Number(value);
  return `${num.toFixed(1)}%`;
};

/**
 * Calculates percentage savings rate from income and expenses.
 */
export const calculateSavingsRate = (income, expenses) => {
  if (!income || income <= 0) return 0;
  const savings = income - expenses;
  if (savings <= 0) return 0;
  return Math.min(100, Math.max(0, (savings / income) * 100));
};

/**
 * Returns greeting based on current time of day.
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};
