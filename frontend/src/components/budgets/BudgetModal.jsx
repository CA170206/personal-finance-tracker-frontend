import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../../utils/constants';

export const BudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  existingCategories = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    category: EXPENSE_CATEGORIES[0],
    allocated: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || EXPENSE_CATEGORIES[0],
        allocated: initialData.allocated || '',
      });
    } else {
      // Pick first category that hasn't been budgeted yet, or default
      const available = EXPENSE_CATEGORIES.find((c) => !existingCategories.includes(c)) || EXPENSE_CATEGORIES[0];
      setFormData({
        category: available,
        allocated: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, existingCategories]);

  const validate = () => {
    const newErrors = {};
    const amt = Number(formData.allocated);
    if (!formData.allocated || isNaN(amt) || amt <= 0) {
      newErrors.allocated = 'Please enter a valid monthly allocation amount';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      allocated: Number(formData.allocated),
      color: CATEGORY_COLORS[formData.category] || '#3B82F6',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Budget' : 'Set Category Budget'}
      subtitle={initialData ? 'Modify spending limit for this category' : 'Establish monthly spending threshold to prevent overruns'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selector */}
        <div>
          <label className="block text-xs font-medium text-brand-text mb-1">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.category}
            disabled={!!initialData}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-brand-elevated border border-brand-border text-brand-text text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-brand-card text-brand-text py-1">
                {cat}
              </option>
            ))}
          </select>
          {initialData && (
            <p className="text-[11px] text-brand-subtle mt-1">Category cannot be changed during edit.</p>
          )}
        </div>

        {/* Monthly Limit Input */}
        <div>
          <label className="block text-xs font-medium text-brand-text mb-1">
            Monthly Limit (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-brand-muted font-bold text-sm">₹</span>
            <input
              type="number"
              step="any"
              min="1"
              placeholder="e.g. 8500"
              value={formData.allocated}
              onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
              className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-brand-elevated border text-brand-text text-sm font-semibold placeholder-brand-subtle focus:outline-none focus:ring-2 transition-all ${
                errors.allocated
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-brand-border focus:border-black focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20'
              }`}
            />
          </div>
          {errors.allocated && <p className="text-xs text-rose-500 mt-1">{errors.allocated}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-brand-elevated rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 active:scale-95 transition-all shadow-sm flex items-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{initialData ? 'Save Budget' : 'Create Budget'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;