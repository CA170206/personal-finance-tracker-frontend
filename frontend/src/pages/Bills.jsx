import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Plus,
  CheckCircle2,
  Receipt,
  Search,
  Trash2,
  Edit2,
  Lock,
  ShieldAlert,
  Droplet,
  Flame,
  Smartphone,
  Wifi,
  Tv,
} from 'lucide-react';
import { billService } from '../services/billService';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BILL_CATEGORIES } from '../utils/constants';
import { formatINR, formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

// Category icon mapper
const CATEGORY_ICONS = {
  Electricity: Zap,
  Water: Droplet,
  Gas: Flame,
  'Mobile recharge': Smartphone,
  Broadband: Wifi,
  DTH: Tv,
  Other: Receipt,
};

export const Bills = () => {
  const toast = useToast();

  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [payTarget, setPayTarget] = useState(null);
  const [logAsExpense, setLogAsExpense] = useState(true);

  // Form
  const [formData, setFormData] = useState({
    category: BILL_CATEGORIES[0],
    provider: '',
    consumer_number: '',
    amount: '',
    due_date: new Date().toISOString().split('T')[0],
    billing_period: 'monthly',
    status: 'pending',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchBillsData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [billsRes, summaryRes] = await Promise.all([
        billService.getBills(params),
        billService.getBillsSummary(),
      ]);

      setBills(billsRes.data || []);
      setSummary(summaryRes.summary || null);
    } catch (err) {
      toast.error('Failed to load bills data');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter, searchQuery, toast]);

  useEffect(() => {
    fetchBillsData();
  }, [fetchBillsData]);

  const openAddModal = () => {
    setEditingBill(null);
    setFormData({
      category: BILL_CATEGORIES[0],
      provider: '',
      consumer_number: '',
      amount: '',
      due_date: new Date().toISOString().split('T')[0],
      billing_period: 'monthly',
      status: 'pending',
      notes: '',
    });
    setFormError(null);
    setIsAddEditOpen(true);
  };

  const openEditModal = (bill) => {
    setEditingBill(bill);
    setFormData({
      category: bill.category || BILL_CATEGORIES[0],
      provider: bill.provider || '',
      consumer_number: '',
      amount: bill.amount ? String(bill.amount) : '',
      due_date: bill.due_date || '',
      billing_period: bill.billing_period || 'monthly',
      status: bill.status || 'pending',
      notes: bill.payment_reference || '',
    });
    setFormError(null);
    setIsAddEditOpen(true);
  };

  const handleSaveBill = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.provider.trim()) {
      setFormError('Please enter the provider/biller name.');
      return;
    }

    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      setFormError('Amount must be a positive number.');
      return;
    }

    if (!formData.due_date) {
      setFormError('Please select a due date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bill_type: formData.category,
        provider: formData.provider.trim(),
        amount: amt,
        due_date: formData.due_date,
        billing_period: formData.billing_period,
        status: formData.status,
        notes: formData.notes.trim() || null,
      };

      if (formData.consumer_number.trim()) {
        payload.consumer_number = formData.consumer_number.trim();
      }

      if (editingBill) {
        await billService.updateBill(editingBill.id, payload);
        toast.success('Bill updated successfully');
      } else {
        await billService.createBill(payload);
        toast.success('Bill added to tracking');
      }

      setIsAddEditOpen(false);
      fetchBillsData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save bill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!payTarget) return;
    try {
      await billService.markBillPaid(payTarget.id, {
        logTransaction: logAsExpense,
        payment_method: 'UPI',
      });
      toast.success(
        logAsExpense
          ? 'Bill marked as paid and logged to transactions'
          : 'Bill marked as paid'
      );
      setPayTarget(null);
      fetchBillsData();
    } catch (err) {
      toast.error('Failed to mark bill as paid');
    }
  };

  const handleDeleteBill = async () => {
    if (!deleteTarget) return;
    try {
      await billService.deleteBill(deleteTarget.id);
      toast.info('Bill removed');
      setDeleteTarget(null);
      fetchBillsData();
    } catch (err) {
      toast.error('Failed to delete bill');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-text tracking-tight flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-black dark:text-white" />
            <span>Bills & Utilities</span>
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Track utility payments, recurring subscriptions, and due date reminders
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm border border-zinc-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bill</span>
        </button>
      </div>

      {/* BBPS Roadmap Banner */}
      <div className="p-4 rounded-2xl bg-brand-card border border-brand-border/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-blue mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-text">
              AES-256 Consumer Encryption & Bharat Connect (BBPS) Architecture
            </h4>
            <p className="text-[11px] text-brand-muted mt-0.5 max-w-2xl leading-relaxed">
              Consumer reference numbers are encrypted using AES-256 at rest and only masked numbers are rendered.
              Automatic bill fetch and one-click settlement will activate upon Bharat Connect (BBPS) agent institution onboarding.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-brand-subtle px-2.5 py-1 rounded-full bg-brand-elevated border border-brand-border whitespace-nowrap">
          BBPS Adapter Ready
        </span>
      </div>

      {/* Monthly Bill Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border">
            <span className="text-[10px] uppercase font-bold text-brand-subtle block">
              Pending Bills Total
            </span>
            <div className="text-xl font-extrabold text-brand-text mt-1">
              {formatINR(summary.total_pending)}
            </div>
            <p className="text-[11px] text-brand-muted mt-0.5">
              {summary.upcoming_count} bills pending
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border">
            <span className="text-[10px] uppercase font-bold text-brand-subtle block">
              Paid This Month
            </span>
            <div className="text-xl font-extrabold text-black dark:text-white mt-1">
              {formatINR(summary.total_paid)}
            </div>
            <p className="text-[11px] text-brand-muted mt-0.5">Cleared utilities</p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border">
            <span className="text-[10px] uppercase font-bold text-brand-subtle block">
              Overdue Alerts
            </span>
            <div className="text-xl font-extrabold text-rose-500 mt-1">
              {summary.overdue_count}
            </div>
            <p className="text-[11px] text-brand-muted mt-0.5">Immediate attention</p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border">
            <span className="text-[10px] uppercase font-bold text-brand-subtle block">
              Due Within 7 Days
            </span>
            <div className="text-xl font-extrabold text-amber-500 mt-1">
              {summary.upcoming_within_7_days?.length || 0}
            </div>
            <p className="text-[11px] text-brand-muted mt-0.5">Upcoming deadlines</p>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-brand-card border border-brand-border">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bills by provider, category or masked number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          >
            <option value="all">All Categories</option>
            {BILL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Bills Cards Grid */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner size="lg" message="Loading bills & utilities..." />
        </div>
      ) : bills.length === 0 ? (
        <div className="py-12 bg-brand-card border border-brand-border rounded-2xl">
          <EmptyState
            title="No bills scheduled"
            description="Add recurring electricity, broadband, water, or mobile bills to track deadlines."
            actionLabel="Add Your First Bill"
            onAction={openAddModal}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bills.map((bill) => {
            const Icon = CATEGORY_ICONS[bill.category] || Receipt;
            const isPaid = bill.status === 'paid';
            const isOverdue = bill.status === 'overdue';

            return (
              <div
                key={bill.id}
                className={`p-5 rounded-2xl bg-brand-card border transition-all flex flex-col justify-between ${
                  isOverdue
                    ? 'border-rose-500/40 shadow-sm'
                    : isPaid
                    ? 'border-brand-border opacity-85'
                    : 'border-brand-border hover:border-black/40 dark:hover:border-white/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          isPaid
                            ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white'
                            : isOverdue
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-brand-elevated text-brand-text'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-brand-text leading-tight">
                          {bill.provider}
                        </h3>
                        <span className="text-[11px] text-brand-subtle">{bill.category}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isPaid
                          ? 'bg-black text-white dark:bg-zinc-800 dark:text-zinc-200 border-zinc-800 dark:border-zinc-700'
                          : isOverdue
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {bill.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="my-4 p-3 rounded-xl bg-brand-elevated/40 border border-brand-border/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-brand-subtle uppercase tracking-wider">
                        Amount Due
                      </span>
                      <span className="text-base font-extrabold text-brand-text">
                        {formatINR(bill.amount)}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-brand-border/40 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-brand-muted">
                        <span>Due Date:</span>
                        <span className="font-semibold text-brand-text">
                          {formatDate(bill.due_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-brand-muted">
                        <span>Ref / Consumer No:</span>
                        <span className="font-mono text-brand-subtle">
                          {bill.masked_consumer_number}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-brand-muted">
                        <span>Cycle:</span>
                        <span className="capitalize">{bill.billing_period}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-brand-border/40 text-xs">
                  {!isPaid ? (
                    <button
                      onClick={() => setPayTarget(bill)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-[11px] shadow-sm border border-zinc-800 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Paid</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-black dark:text-white flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Paid</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(bill)}
                      className="p-1.5 text-brand-muted hover:text-brand-text hover:bg-brand-elevated rounded-lg transition-colors"
                      title="Edit bill"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(bill)}
                      className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete bill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Bill Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingBill ? 'Edit Bill Details' : 'Add Utility Bill'}
        subtitle="Manage biller, encrypted consumer reference, and payment schedule"
      >
        <form onSubmit={handleSaveBill} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-brand-text block mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs focus:ring-1 focus:ring-black dark:focus:ring-white focus:outline-none"
              >
                {BILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-text block mb-1.5">
                Provider / Biller *
              </label>
              <input
                type="text"
                required
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g. Tata Power, Airtel, Indane"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs focus:ring-1 focus:ring-black dark:focus:ring-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-brand-text block mb-1.5">
                Consumer / Account Number
              </label>
              <input
                type="text"
                value={formData.consumer_number}
                onChange={(e) => setFormData({ ...formData, consumer_number: e.target.value })}
                placeholder={editingBill ? 'Leave blank to keep' : 'e.g. 1002938475'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs focus:ring-1 focus:ring-black dark:focus:ring-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-text block mb-1.5">
                Bill Amount (₹) *
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 1850"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs focus:ring-1 focus:ring-black dark:focus:ring-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-brand-text block mb-1.5">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs focus:ring-1 focus:ring-black dark:focus:ring-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-text block mb-1.5">
                Billing Cycle
              </label>
              <select
                value={formData.billing_period}
                onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs focus:ring-1 focus:ring-black dark:focus:ring-white focus:outline-none"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="one-off">One-off / Ad-hoc</option>
              </select>
            </div>
          </div>

          {editingBill && (
            <div>
              <label className="text-xs font-semibold text-brand-text block mb-1.5">
                Payment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs focus:ring-1 focus:ring-black dark:focus:ring-white focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-brand-text block mb-1.5">
              Notes / Remarks
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Due before 5 PM to avoid disconnection"
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs focus:ring-1 focus:ring-black dark:focus:ring-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-brand-text hover:bg-brand-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm border border-zinc-800 transition-all"
            >
              {submitting ? 'Saving...' : editingBill ? 'Update Bill' : 'Add Bill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Pay Modal Dialog */}
      {payTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-6 shadow-elevated">
            <h3 className="text-base font-bold text-brand-text mb-2">Mark Bill as Paid</h3>
            <p className="text-xs text-brand-muted mb-4">
              Mark <strong className="text-brand-text">{payTarget.provider}</strong> bill of{' '}
              <strong className="text-black dark:text-white font-bold">{formatINR(payTarget.amount)}</strong> as paid.
            </p>

            <div className="p-3.5 rounded-xl bg-brand-elevated/40 border border-brand-border mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={logAsExpense}
                  onChange={(e) => setLogAsExpense(e.target.checked)}
                  className="rounded text-black focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-brand-text">
                  Also log ₹{payTarget.amount} as an expense in Transactions
                </span>
              </label>
              <p className="text-[11px] text-brand-subtle mt-1 pl-6">
                Categorized under "Utilities" to update your monthly spending charts
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPayTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-brand-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMarkPaid}
                className="px-5 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm border border-zinc-800"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteBill}
        title="Delete Bill"
        message={`Are you sure you want to delete ${deleteTarget?.provider} bill?`}
        confirmText="Delete Bill"
        type="danger"
      />
    </div>
  );
};

export default Bills;
