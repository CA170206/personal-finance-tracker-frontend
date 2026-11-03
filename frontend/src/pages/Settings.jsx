import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  RotateCcw,
  LogOut,
  Save,
  Server,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import ConfirmationModal from '../components/common/ConfirmationModal';

export const Settings = () => {
  const { user, updateProfile, logout, isMock, toggleMockMode } = useAuth();
  const { resetData } = useFinance();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'INR',
    theme: theme || 'dark',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        currency: user.currency || 'INR',
        theme: user.theme || theme || 'dark',
      }));
    }
  }, [user, theme]);

  const [isSaving, setIsSaving] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleThemeChange = (newTheme) => {
    setFormData((prev) => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
    toast.info(`Theme switched to ${newTheme} mode.`);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      toast.success('Profile settings updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDemoData = async () => {
    await resetData();
    setResetModalOpen(false);
  };

  const handleLogout = () => {
    navigate('/');
    logout();
    toast.info('Signed out of FinTrack.');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
          Account Profile & System Settings
        </h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Manage your credentials, currency localization, theme preferences, and backend integration.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-7 shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-emerald via-teal-500 to-blue-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-elevated flex-shrink-0">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-lg font-bold text-brand-text">{formData.name}</h3>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                PRO Member
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">{formData.email}</p>
            <p className="text-xs text-brand-subtle mt-2">
              Default Currency: <span className="text-brand-text font-semibold">Indian Rupee (INR — ₹)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Information Form */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-7 shadow-card">
        <h3 className="text-base font-bold text-brand-text mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-emerald" />
          Personal Information
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-elevated border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-elevated border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">Currency Format</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-elevated border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-emerald cursor-pointer"
              >
                <option value="INR">INR (₹) — Indian Rupee (Default)</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">Theme Preference</label>
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-elevated border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-emerald cursor-pointer"
              >
                <option value="dark">Dark Mode (Fintech Dashboard)</option>
                <option value="light">Light Mode (Clean Modern)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-emerald hover:bg-brand-emeraldHover active:scale-95 shadow-glow-emerald transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backend & Mock Mode Telemetry */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-7 shadow-card">
        <h3 className="text-base font-bold text-brand-text mb-2 flex items-center gap-2">
          <Server className="w-4 h-4 text-brand-blue" />
          Backend API Integration & Telemetry
        </h3>
        <p className="text-xs text-brand-muted mb-5 leading-relaxed">
          FinTrack includes an enterprise Axios service layer pre-configured to communicate with the Node.js / Express / MongoDB JWT backend.
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-brand-elevated border border-brand-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-text">Centralized API Base URL</p>
              <p className="text-[11px] text-brand-subtle font-mono mt-0.5">
                {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-brand-card border border-brand-border text-brand-muted">
              VITE_API_URL
            </span>
          </div>

          <div className="p-4 rounded-xl bg-brand-elevated border border-brand-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-text">Development Mock Storage Mode</p>
              <p className="text-[11px] text-brand-subtle mt-0.5">
                Simulates real server delay, isolates user sessions in local storage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                toggleMockMode(!isMock);
                toast.info(`Mock mode ${!isMock ? 'enabled' : 'disabled'}`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isMock
                  ? 'bg-brand-emerald text-white shadow-glow-emerald'
                  : 'bg-brand-card text-brand-muted hover:text-brand-text border border-brand-border'
              }`}
            >
              {isMock ? 'Active' : 'Disabled'}
            </button>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-elevated hover:bg-brand-border border border-brand-border text-brand-muted hover:text-brand-text text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo INR Transactions & Budgets</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out of Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetDemoData}
        title="Reset Demo Data"
        message="This will restore all default transactions (Salary: ₹45,000, Rent: ₹8,000, Groceries: ₹3,500, etc.) and reset all budgets to their original states."
        confirmText="Reset All Data"
        isDanger={false}
      />
    </div>
  );
};

export default Settings;