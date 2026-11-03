import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully! Welcome to FinTrack.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-black/10 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black dark:bg-zinc-900 border border-zinc-800 text-white shadow-sm mb-4 hover:scale-105 transition-transform">
            <Wallet className="w-7 h-7 text-white" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-brand-muted mt-2">
            Start tracking budgets and financial independence in INR
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-brand-subtle" />
                <input
                  type="text"
                  placeholder="Chaitanya Anmulwar"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-brand-elevated border text-brand-text text-sm placeholder-brand-subtle focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-brand-border focus:border-black focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-subtle" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-brand-elevated border text-brand-text text-sm placeholder-brand-subtle focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-brand-border focus:border-black focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-brand-subtle" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-brand-elevated border text-brand-text text-sm placeholder-brand-subtle focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-brand-border focus:border-black focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-brand-subtle hover:text-brand-text transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-brand-subtle" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-brand-elevated border text-brand-text text-sm placeholder-brand-subtle focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-brand-border focus:border-black focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Agree Terms */}
            <div>
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, agreeTerms: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-brand-border text-black dark:text-white bg-brand-elevated focus:ring-black dark:focus:ring-white cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-brand-muted select-none leading-relaxed">
                  I agree to the{' '}
                  <span className="text-black dark:text-white hover:underline cursor-pointer font-medium">
                    Terms of Service
                  </span>{' '}
                  and acknowledge the{' '}
                  <span className="text-black dark:text-white hover:underline cursor-pointer font-medium">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-xs text-rose-500 mt-1 ml-6">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 active:scale-98 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-6 border-t border-brand-border text-center">
            <p className="text-xs text-brand-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-black dark:text-white hover:underline font-semibold ml-1">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-brand-subtle">
          <ShieldCheck className="w-4 h-4 text-black dark:text-white" />
          <span>Encrypted storage & zero telemetry sharing</span>
        </div>
      </div>
    </div>
  );
};

export default Register;