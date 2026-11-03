import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Home,
  HeartPulse,
  GraduationCap,
  Film,
  Zap,
  Smile,
  Briefcase,
  TrendingUp,
  Gift,
  HelpCircle,
  Coins,
} from 'lucide-react';
import { CATEGORY_COLORS } from '../../utils/constants';

const categoryIconMap = {
  'Food & Dining': Utensils,
  'Transportation': Car,
  'Shopping': ShoppingBag,
  'Housing': Home,
  'Healthcare': HeartPulse,
  'Education': GraduationCap,
  'Entertainment': Film,
  'Utilities': Zap,
  'Personal Care': Smile,
  'Salary': Briefcase,
  'Freelancing': TrendingUp,
  'Business': Coins,
  'Investments': TrendingUp,
  'Gifts': Gift,
  'Other': HelpCircle,
};

export const CategoryBadge = ({ category, size = 'md' }) => {
  const Icon = categoryIconMap[category] || HelpCircle;
  const color = CATEGORY_COLORS[category] || '#64748B';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${sizeClasses[size] || sizeClasses.md}`}
      style={{
        backgroundColor: `${color}18`,
        borderColor: `${color}35`,
        color: color,
      }}
    >
      <Icon className={iconSizes[size] || iconSizes.md} />
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
