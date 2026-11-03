import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constants';

export const TransactionFilters = ({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortOrder,
  setSortOrder,
  onReset,
}) => {
  const allCategories = ['all', ...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

  const hasActiveFilters =
    search ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    startDate ||
    endDate ||
    sortOrder !== 'newest';

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-5 shadow-card space-y-4">
      {/* Top Search & Reset Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by title, notes, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-elevated border border-brand-border rounded-xl text-sm text-brand-text placeholder-brand-subtle focus:outline-none focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/20 transition-all"
          />
        </div>

        {/* Reset button if filtered */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-elevated hover:bg-brand-border text-brand-muted hover:text-brand-text text-xs font-semibold border border-brand-border transition-colors flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        {/* Type Filter */}
        <div>
          <label className="block text-brand-subtle font-medium mb-1">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-brand-elevated border border-brand-border rounded-xl text-brand-text focus:outline-none focus:border-brand-emerald transition-all cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-brand-subtle font-medium mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-brand-elevated border border-brand-border rounded-xl text-brand-text focus:outline-none focus:border-brand-emerald transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            {allCategories.filter((c) => c !== 'all').map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-brand-subtle font-medium mb-1">Sort By</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 bg-brand-elevated border border-brand-border rounded-xl text-brand-text focus:outline-none focus:border-brand-emerald transition-all cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-brand-subtle font-medium mb-1">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-brand-elevated border border-brand-border rounded-xl text-brand-text focus:outline-none focus:border-brand-emerald transition-all text-xs"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-brand-subtle font-medium mb-1">To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-brand-elevated border border-brand-border rounded-xl text-brand-text focus:outline-none focus:border-brand-emerald transition-all text-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;