import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Wallet,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, isMock } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    location.state?.from?.pathname && location.state.from.pathname !== '/login'
      ? location.state.from.pathname
      : '/dashboard';

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to FinTrack!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('chaitanya@example.com');
    setPassword('password123');
    toast.info('Demo credentials pre-filled');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-black/10 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black dark:bg-zinc-900 border border-zinc-800 text-white shadow-sm mb-4 hover:scale-105 transition-transform">
            <Wallet className="w-7 h-7 text-white" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
            Sign in to FinTrack
          </h1>
          <p className="text-sm text-brand-muted mt-2">
            Intelligent wealth management and budget telemetry
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-elevated">
          {isMock && (
            <div className="mb-6 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-border flex items-center justify-between text-xs">
              <span className="text-black dark:text-white font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Mock Mode Ready
              </span>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[11px] font-semibold text-white bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-2.5 py-1 rounded-lg transition-colors shadow-sm"
              >
                Auto-fill Demo
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-subtle" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-brand-elevated border text-brand-text text-sm placeholder-brand-subtle focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-brand-border focus:border-black focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-brand-text">Password</label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info('Password reset is available in the connected backend environment.')
                  }
                  className="text-xs text-black dark:text-white hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-brand-subtle" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-black dark:text-white bg-brand-elevated focus:ring-black dark:focus:ring-white cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-brand-muted select-none cursor-pointer">
                Remember this device for 30 days
              </label>
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
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-6 border-t border-brand-border text-center">
            <p className="text-xs text-brand-muted">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-black dark:text-white hover:underline font-semibold ml-1">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Security Assurance Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-brand-subtle">
          <ShieldCheck className="w-4 h-4 text-black dark:text-white" />
          <span>Bank-grade 256-bit encryption & JWT authentication</span>
        </div>
      </div>
    </div>
  );
};

export default Login;