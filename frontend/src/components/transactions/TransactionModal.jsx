import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Modal from '../common/Modal';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constants';

const getTodayString = () => new Date().toISOString().split('T')[0];

export const TransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    date: getTodayString(),
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || (initialData.type === 'income' ? 'Salary' : 'Food & Dining'),
        date: initialData.date ? initialData.date.split('T')[0] : getTodayString(),
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food & Dining',
        date: getTodayString(),
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    const numAmount = Number(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
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
    onSubmit(formData);
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Add New Transaction'}
      subtitle={initialData ? 'Update details for this transaction' : 'Log a new income or expense entry'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle Tabs */}
        <div>
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-brand-elevated rounded-xl border border-brand-border">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                formData.type === 'expense'
                  ? 'bg-brand-rose text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                formData.type === 'income'
                  ? 'bg-brand-emerald text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Title Field */}
        <div>
          <label className="block text-xs font-medium text-brand-text mb-1">
            Transaction Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Swiggy Groceries, Salary, Rent"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-brand-elevated border text-brand-text text-sm placeholder-brand-subtle focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-rose-500 focus:ring-rose-500/30'
                : 'border-brand-border focus:border-black focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20'
            }`}
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Amount & Date in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-brand-text mb-1">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-brand-muted font-bold text-sm">₹</span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-brand-elevated border text-brand-text text-sm font-semibold placeholder-brand-subtle focus:outline-none focus:ring-2 transition-all ${
                  errors.amount
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-brand-border focus:border-black focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20'
                }`}
              />
            </div>
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-text mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-brand-elevated border text-brand-text text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.date
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-brand-border focus:border-black focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20'
                }`}
              />
            </div>
            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-medium text-brand-text mb-1">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-brand-elevated border border-brand-border text-brand-text text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20 transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-brand-card text-brand-text py-1">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Notes (Optional) */}
        <div>
          <label className="block text-xs font-medium text-brand-text mb-1">
            Notes / Description (Optional)
          </label>
          <textarea
            rows="2"
            placeholder="Add payment method, invoice number, or recipient notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-brand-elevated border border-brand-border text-brand-text text-sm placeholder-brand-subtle focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20 transition-all resize-none"
          />
        </div>

        {/* Footer Actions */}
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
            className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border border-black dark:border-white active:scale-95 transition-all shadow-sm flex items-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{initialData ? 'Save Changes' : 'Create Transaction'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;