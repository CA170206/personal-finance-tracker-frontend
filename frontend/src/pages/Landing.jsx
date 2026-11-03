import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  PieChart,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  FileSpreadsheet,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: TrendingUp,
      title: 'Income & Expense Tracking',
      description:
        'Log cash flow instantly with detailed categories, notes, and tags in Indian Rupees (₹).',
      badge: 'Real-time',
      color: 'emerald',
    },
    {
      icon: BarChart3,
      title: 'Smart Financial Analytics',
      description:
        'Gain deep clarity with temporal bar graphs, cash flow trends, and net savings rate computations.',
      badge: 'Automated',
      color: 'blue',
    },
    {
      icon: Sliders,
      title: 'Budget Management',
      description:
        'Set monthly limits for essential living expenses and receive visual progress alerts before overspending.',
      badge: 'Control',
      color: 'purple',
    },
    {
      icon: PieChart,
      title: 'Spending Visualization',
      description:
        'Interactive donut breakdowns and comparative charts show exactly where your money goes every month.',
      badge: 'Clarity',
      color: 'amber',
    },
    {
      icon: FileSpreadsheet,
      title: 'Transaction History & Export',
      description:
        'Search, filter by date range or category, sort by highest amounts, and export clean CSV reports with one click.',
      badge: 'Export',
      color: 'emerald',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Personal Accounts',
      description:
        'Bank-grade architecture, isolated user databases, and ready-to-deploy JWT backend authentication.',
      badge: 'Encrypted',
      color: 'blue',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create your account',
      description:
        'Sign up in less than 30 seconds. Your private financial vault is created with zero clutter.',
    },
    {
      number: '02',
      title: 'Record your income and expenses',
      description:
        'Quickly log your monthly earnings, recurring bills, investments, and day-to-day spending.',
    },
    {
      number: '03',
      title: 'Understand and manage your finances',
      description:
        'Watch your net worth and savings rate grow with dynamic, real-time analytics and intelligent budgets.',
    },
  ];

  const benefits = [
    'Understand spending habits with instant category breakdowns',
    'Track monthly savings and reach financial independence faster',
    'Monitor expenses with zero hidden fees or advertisements',
    'Manage budgets with proactive threshold indicators',
    'Make data-driven financial decisions with confidence',
  ];

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
      {/* ===================================================
          1. NAVBAR
      =================================================== */}
      <header className="sticky top-0 z-50 bg-brand-bg/85 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-zinc-900 border border-zinc-800 dark:border-zinc-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-brand-text flex items-center gap-1.5">
                FinTrack
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-black text-white dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-800 dark:border-zinc-700">
                  PRO
                </span>
              </span>
              <span className="text-[11px] text-brand-muted hidden sm:block">Personal Wealth OS</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-muted">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-brand-text transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-brand-text transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-brand-text transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="hover:text-brand-text transition-colors"
            >
              Benefits
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Dark/Light Theme Toggle */}
            <button
              data-testid="theme-toggle"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-text transition-all"
              aria-label="Toggle dark/light theme"
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 shadow-sm border border-zinc-800 transition-all active:scale-95"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm text-brand-muted hover:text-brand-text hover:bg-brand-elevated transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 shadow-sm border border-zinc-800 transition-all active:scale-95"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-brand-card border border-brand-border text-brand-muted"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-brand-border bg-brand-sidebar px-4 py-5 space-y-3 animate-fadeIn">
            <div className="flex flex-col space-y-2 text-sm font-medium">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-left px-3 py-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-elevated"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-left px-3 py-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-elevated"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left px-3 py-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-elevated"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('benefits')}
                className="text-left px-3 py-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-elevated"
              >
                Benefits
              </button>
            </div>
            <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full text-center py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 shadow-sm border border-zinc-800"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl font-semibold text-sm text-brand-muted border border-brand-border hover:bg-brand-elevated"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 shadow-sm border border-zinc-800"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ===================================================
          2. HERO SECTION
      =================================================== */}
      <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle Decorative Background Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-black/5 dark:bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-brand-blue/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-card border border-brand-border shadow-sm mb-6 animate-fadeIn">
              <span className="flex h-2 w-2 rounded-full bg-black dark:bg-white animate-pulse" />
              <span className="text-xs font-semibold text-brand-text">
                FinTrack 2.0 is Live
              </span>
              <span className="text-brand-subtle text-xs">• INR (₹) Financial Suite</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-text tracking-tight leading-[1.15] mb-6">
              Take Control of Your Money.{' '}
              <span className="text-black dark:text-white">
                Build a Better Financial Future.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed mb-8">
              Track your income, manage expenses, monitor budgets and understand your spending habits
              — all in one simple, powerful financial dashboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-base text-white bg-black hover:bg-zinc-800 shadow-sm border border-zinc-800 active:scale-95 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-brand-text bg-brand-card hover:bg-brand-elevated border border-brand-border transition-colors"
              >
                <span>Explore Features</span>
                <ChevronRight className="w-4 h-4 text-brand-muted" />
              </button>
            </div>

            {/* Small reassurance stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-brand-subtle">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white" /> Indian Rupee (₹) native
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white" /> 100% private & secure
              </span>
            </div>
          </div>

          {/* ===================================================
              DASHBOARD PREVIEW (MARKETING ILLUSTRATION)
          =================================================== */}
          <div className="mt-14 sm:mt-18 relative">
            <div className="relative mx-auto max-w-5xl rounded-2xl sm:rounded-3xl border border-brand-border bg-brand-card p-3 sm:p-5 shadow-elevated overflow-hidden group">
              {/* Top Mac-style bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-border/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-brand-subtle hidden sm:inline">
                    https://fintrack.app/dashboard
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-black dark:text-zinc-200 bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-full border border-black/10 dark:border-white/10">
                  <Sparkles className="w-3 h-3" /> Product Preview • Illustrative Data
                </div>
              </div>

              {/* Mock Dashboard Interior */}
              <div className="bg-brand-bg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-brand-border/60 space-y-5">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-brand-card border border-brand-border">
                    <span className="text-[11px] text-brand-muted block font-medium">Total Net Balance</span>
                    <span className="text-lg sm:text-2xl font-extrabold text-brand-text font-sans block mt-1">₹1,24,500</span>
                    <span className="text-[11px] text-emerald-500 font-semibold inline-flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +14.2% vs last mo
                    </span>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-brand-card border border-brand-border">
                    <span className="text-[11px] text-brand-muted block font-medium">Monthly Income</span>
                    <span className="text-lg sm:text-2xl font-extrabold text-brand-emerald font-sans block mt-1">₹85,000</span>
                    <span className="text-[11px] text-emerald-500 font-semibold inline-flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +5.0% vs last mo
                    </span>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-brand-card border border-brand-border">
                    <span className="text-[11px] text-brand-muted block font-medium">Monthly Expenses</span>
                    <span className="text-lg sm:text-2xl font-extrabold text-brand-rose font-sans block mt-1">₹28,400</span>
                    <span className="text-[11px] text-emerald-500 font-semibold inline-flex items-center gap-0.5 mt-1">
                      <ArrowDownLeft className="w-3 h-3" /> -8.1% vs last mo
                    </span>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-brand-card border border-brand-border">
                    <span className="text-[11px] text-brand-muted block font-medium">Savings Rate</span>
                    <span className="text-lg sm:text-2xl font-extrabold text-brand-purple font-sans block mt-1">66.5%</span>
                    <span className="text-[11px] text-emerald-500 font-semibold inline-flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +4.2% healthy
                    </span>
                  </div>
                </div>

                {/* Simulated Chart & Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Overview Bars */}
                  <div className="lg:col-span-2 p-4 rounded-xl bg-brand-card border border-brand-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-brand-text">Monthly Cash Flow</span>
                      <div className="flex items-center gap-3 text-[11px] text-brand-muted">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-emerald" /> Income</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-rose" /> Expenses</span>
                      </div>
                    </div>
                    {/* Visual simulated bars */}
                    <div className="h-32 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-brand-border/40 pb-2">
                      {[
                        { m: 'Nov', inc: 70, exp: 35 },
                        { m: 'Dec', inc: 75, exp: 45 },
                        { m: 'Jan', inc: 80, exp: 40 },
                        { m: 'Feb', inc: 85, exp: 32 },
                        { m: 'Mar', inc: 85, exp: 30 },
                        { m: 'Apr', inc: 90, exp: 33 },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div className="w-full flex items-end justify-center gap-1 h-24">
                            <div
                              style={{ height: `${item.inc}%` }}
                              className="w-1/2 bg-brand-emerald rounded-t-sm transition-all"
                            />
                            <div
                              style={{ height: `${item.exp}%` }}
                              className="w-1/2 bg-brand-rose rounded-t-sm transition-all"
                            />
                          </div>
                          <span className="text-[10px] text-brand-subtle mt-1">{item.m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-3">
                    <span className="text-xs font-bold text-brand-text block">Recent Ledger</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-brand-elevated/60">
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-text truncate">TechCorp India Salary</p>
                          <p className="text-[10px] text-brand-subtle">01 Apr • Salary</p>
                        </div>
                        <span className="font-bold text-brand-emerald text-xs">+₹85,000</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-brand-elevated/60">
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-text truncate">Apartment Lease</p>
                          <p className="text-[10px] text-brand-subtle">02 Apr • Housing</p>
                        </div>
                        <span className="font-bold text-brand-rose text-xs">-₹18,000</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-brand-elevated/60">
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-text truncate">Nature's Basket</p>
                          <p className="text-[10px] text-brand-subtle">03 Apr • Groceries</p>
                        </div>
                        <span className="font-bold text-brand-rose text-xs">-₹3,450</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. FEATURES SECTION
      =================================================== */}
      <section id="features" className="py-20 bg-brand-sidebar/40 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-black dark:text-white mb-2">
              Comprehensive Toolkit
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
              Designed for modern financial clarity
            </h3>
            <p className="text-sm sm:text-base text-brand-muted mt-3">
              Everything you need to track money, build savings, and make smart financial decisions without complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-brand-card hover:bg-brand-cardHover border border-brand-border rounded-2xl p-6 transition-all duration-300 shadow-card hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-elevated border border-brand-border flex items-center justify-center text-black dark:text-white group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-brand-elevated text-brand-muted border border-brand-border">
                        {feature.badge}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-brand-text tracking-tight mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-brand-border/40 flex items-center text-xs font-semibold text-black dark:text-white">
                    <span>Learn more</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================
          4. HOW IT WORKS SECTION
      =================================================== */}
      <section id="how-it-works" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-blue mb-2">
              Simple 3-Step Flow
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
              From day one to complete mastery
            </h3>
            <p className="text-sm sm:text-base text-brand-muted mt-3">
              No complicated spreadsheets. No financial jargon. Get started and organized in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-brand-card border border-brand-border rounded-2xl p-7 relative shadow-card hover:border-black/40 dark:hover:border-white/40 transition-colors"
              >
                <div className="text-3xl sm:text-4xl font-black text-black/20 dark:text-white/20 mb-4 font-mono">
                  {step.number}
                </div>
                <h4 className="text-lg font-bold text-brand-text mb-2">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          5. BENEFITS SECTION
      =================================================== */}
      <section id="benefits" className="py-20 bg-brand-sidebar/40 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-black dark:text-white mb-2">
                Why Choose FinTrack
              </h2>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-brand-text tracking-tight mb-6">
                Engineered for people who value financial intentionality
              </h3>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-8">
                Most budgeting tools are bloated, filled with advertisements, or require complex setup.
                FinTrack gives you pristine clarity, instantaneous metrics, and dynamic insights without noise.
              </p>

              <div className="space-y-3.5">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-brand-text">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 shadow-sm transition-all active:scale-95"
                >
                  <span>Start Tracking Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Side Visual Highlight Card */}
            <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black/10 text-black dark:bg-white/10 dark:text-white flex items-center justify-center font-bold text-xs">
                    ₹
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-brand-text">Dynamic Calculations</h5>
                    <p className="text-[11px] text-brand-muted">Zero seeded or fabricated fallbacks</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-elevated text-black dark:text-white font-semibold">
                  Active Sync
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-brand-elevated border border-brand-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-brand-subtle block">Calculated Savings Target</span>
                    <span className="font-bold text-brand-text text-sm">65% Target Achieved</span>
                  </div>
                  <span className="text-emerald-500 font-bold text-sm">+18.5% Growth</span>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-elevated border border-brand-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-brand-subtle block">Monthly Budget Protection</span>
                    <span className="font-bold text-brand-text text-sm">Under Budget by ₹14,200</span>
                  </div>
                  <span className="text-blue-400 font-bold text-sm">Optimal</span>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-elevated border border-brand-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-brand-subtle block">Bank-Grade Privacy</span>
                    <span className="font-bold text-brand-text text-sm">No Third-party Data Sharing</span>
                  </div>
                  <span className="text-purple-400 font-bold text-sm">100% Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          6. FINAL CALL TO ACTION
      =================================================== */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 dark:via-white/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="bg-brand-card border border-brand-border rounded-3xl p-8 sm:p-14 shadow-elevated">
            <h2 className="text-3xl sm:text-5xl font-black text-brand-text tracking-tight mb-4">
              Your Financial Journey Starts Here.
            </h2>
            <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of mindful individuals taking control of their finances with FinTrack today.
              Set up your account in 30 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-white bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 shadow-sm active:scale-95 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-brand-text bg-brand-elevated hover:bg-brand-border border border-brand-border transition-colors"
              >
                <span>Sign In to Existing Account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          7. FOOTER
      =================================================== */}
      <footer className="border-t border-brand-border bg-brand-sidebar py-12 sm:py-16 text-xs text-brand-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1: Brand */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black dark:bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shadow-sm">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-brand-text">FinTrack PRO</span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                The next-generation personal finance tracker designed for modern professionals and smart savers.
              </p>
              <p className="text-[11px] text-brand-subtle">
                Built with React, Vite & Tailwind CSS
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h6 className="font-bold text-xs uppercase tracking-wider text-brand-text mb-3">Navigation</h6>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('hero')} className="hover:text-brand-text transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-brand-text transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-brand-text transition-colors">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('benefits')} className="hover:text-brand-text transition-colors">
                    Benefits
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Authentication */}
            <div>
              <h6 className="font-bold text-xs uppercase tracking-wider text-brand-text mb-3">Access</h6>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="hover:text-brand-text transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-brand-text transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-brand-text transition-colors">
                    User Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Localization & Security */}
            <div>
              <h6 className="font-bold text-xs uppercase tracking-wider text-brand-text mb-3">Platform</h6>
              <ul className="space-y-1.5 text-[11px] text-brand-subtle">
                <li>Currency: Indian Rupee (₹)</li>
                <li>Security: JWT & 256-bit encryption</li>
                <li>Theme: Dark & Light Mode Support</li>
                <li>Status: Operational</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-subtle">
            <p>© {new Date().getFullYear()} FinTrack PRO. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-brand-text cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-brand-text cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-brand-text cursor-pointer">Security Overview</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;