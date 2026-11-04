import React, { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionModal from '../components/transactions/TransactionModal';
import ConfirmationModal from '../components/common/ConfirmationModal';

export const Transactions = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance();
  const toast = useToast();

  // Filter States
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side filtering & sorting
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (startDate) {
      result = result.filter((t) => t.date >= startDate);
    }

    if (endDate) {
      result = result.filter((t) => t.date <= endDate);
    }

    result.sort((a, b) => {
      if (sortOrder === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOrder === 'amount-desc') {
        return Number(b.amount) - Number(a.amount);
      } else if (sortOrder === 'amount-asc') {
        return Number(a.amount) - Number(b.amount);
      } else {
        // default 'newest'
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [transactions, debouncedSearch, typeFilter, categoryFilter, startDate, endDate, sortOrder]);

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
    setSortOrder('newest');
  };

  const handleOpenAdd = () => {
    setSelectedTransaction(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setSelectedTransaction(tx);
    setModalOpen(true);
  };

  const handleOpenDelete = (tx) => {
    setTransactionToDelete(tx);
    setDeleteModalOpen(true);
  };

  const handleSubmitModal = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, formData);
      } else {
        await addTransaction(formData);
      }
      setModalOpen(false);
      setSelectedTransaction(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteTransaction(transactionToDelete.id, transactionToDelete.title);
      setDeleteModalOpen(false);
      setTransactionToDelete(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.warning('No transactions to export');
      return;
    }
    const headers = ['ID', 'Title', 'Type', 'Category', 'Amount (INR)', 'Date', 'Notes'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.category,
      t.amount,
      t.date,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fintrack-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Transactions CSV exported successfully');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
            Transaction Registry
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Complete history of income credits and expense debits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-brand-card hover:bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-text text-xs font-semibold transition-colors"
            title="Export filtered transactions as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border border-black dark:border-white active:scale-95 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <TransactionFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onReset={handleResetFilters}
      />

      {/* Transaction Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onAddNew={handleOpenAdd}
      />

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialData={selectedTransaction}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transactionToDelete?.title}"? This transaction will be permanently removed from your financial telemetry.`}
        confirmText="Confirm Delete"
        isLoading={isSubmitting}
        isDanger={true}
      />
    </div>
  );
};

export default Transactions;