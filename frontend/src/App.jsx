import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import UPIPayments from './pages/UPIPayments';
import BankAccounts from './pages/BankAccounts';
import Bills from './pages/Bills';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import AIAssistant from './pages/AIAssistant';
import NotFound from './pages/NotFound';

/**
 * Route guard that redirects already authenticated users away from /login and /register
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <FinanceProvider>
              <Routes>
                {/* 1. Public Landing Page at root "/" (MUST NOT REDIRECT DIRECTLY) */}
                <Route path="/" element={<Landing />} />

                {/* 2. Public Authentication Routes (redirect to /dashboard if logged in) */}
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <Login />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicOnlyRoute>
                      <Register />
                    </PublicOnlyRoute>
                  }
                />

                {/* 3. Protected Authenticated SaaS Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/upi-payments" element={<UPIPayments />} />
                  <Route path="/bank-accounts" element={<BankAccounts />} />
                  <Route path="/bills" element={<Bills />} />
                  <Route path="/budgets" element={<Budgets />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* 4. 404 Catch-All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </FinanceProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;