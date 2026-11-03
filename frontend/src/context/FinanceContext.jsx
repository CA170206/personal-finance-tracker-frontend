import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';
import budgetService from '../services/budgetService';
import dashboardService from '../services/dashboardService';
import { resetMockData } from '../services/mockData';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [overallBudget, setOverallBudget] = useState(35000);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    savingsRate: 0,
    trends: { balanceChange: 0, incomeChange: 0, expenseChange: 0, savingsRateChange: 0 },
  });
  const [charts, setCharts] = useState({
    monthlyOverview: [],
    expenseBreakdown: [],
    spendingTrends: [],
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      const [txResult, bgResult, ovBudget, sumResult, chResult] = await Promise.all([
        transactionService.getTransactions(),
        budgetService.getBudgets(),
        budgetService.getOverallBudget(),
        dashboardService.getSummary(),
        dashboardService.getCharts(),
      ]);

      setTransactions(txResult.data || txResult);
      setBudgets(bgResult);
      setOverallBudget(ovBudget);
      setSummary(sumResult);
      setCharts(chResult);
    } catch (err) {
      console.error('Failed to load financial data:', err);
      toast.error('Failed to synchronize financial data');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refreshAll();
  }, [user?.email, refreshAll]);

  // Transaction CRUD handlers
  const addTransaction = async (data) => {
    try {
      const created = await transactionService.createTransaction(data);
      await refreshAll();
      toast.success(`Transaction "${data.title}" added successfully!`);
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to create transaction');
      throw err;
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      const updated = await transactionService.updateTransaction(id, data);
      await refreshAll();
      toast.success(`Transaction "${data.title}" updated successfully!`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update transaction');
      throw err;
    }
  };

  const deleteTransaction = async (id, title = 'Transaction') => {
    try {
      await transactionService.deleteTransaction(id);
      await refreshAll();
      toast.success(`"${title}" deleted successfully.`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete transaction');
      throw err;
    }
  };

  // Budget CRUD handlers
  const addBudget = async (data) => {
    try {
      const created = await budgetService.createBudget(data);
      await refreshAll();
      toast.success(`Budget for ${data.category} created!`);
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to create budget');
      throw err;
    }
  };

  const updateBudget = async (id, data) => {
    try {
      const updated = await budgetService.updateBudget(id, data);
      await refreshAll();
      toast.success(`Budget for ${data.category} updated!`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update budget');
      throw err;
    }
  };

  const deleteBudget = async (id, category = 'Budget') => {
    try {
      await budgetService.deleteBudget(id);
      await refreshAll();
      toast.success(`Budget for ${category} deleted.`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete budget');
      throw err;
    }
  };

  const updateOverallMonthlyBudget = async (amount) => {
    try {
      await budgetService.updateOverallBudget(amount);
      setOverallBudget(Number(amount));
      toast.success('Overall monthly budget updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update overall budget');
    }
  };

  const resetData = async () => {
    resetMockData();
    await refreshAll();
    toast.info('Demo data restored to original state.');
  };

  const value = {
    transactions,
    budgets,
    overallBudget,
    summary,
    charts,
    loading,
    refreshAll,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    updateOverallMonthlyBudget,
    resetData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
