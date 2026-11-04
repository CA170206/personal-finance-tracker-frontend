import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  TrendingDown,
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
  BrainCircuit,
  Bot,
  Calendar,
  LineChart,
  ShieldAlert,
  XCircle,
  Check,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState('spending');
  const [selectedCapability, setSelectedCapability] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCapability(null);
        setSelectedFeature(null);
      }
    };
    if (selectedCapability || selectedFeature) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedCapability, selectedFeature]);

  const handleTryDemo = (scenarioKey) => {
    setSelectedCapability(null);
    if (scenarioKey && sampleScenarios[scenarioKey]) {
      setActiveScenario(scenarioKey);
    }
    setTimeout(() => {
      const el = document.getElementById('ai-preview');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleLaunchAI = () => {
    setSelectedCapability(null);
    if (isAuthenticated) {
      navigate('/ai-assistant');
    } else {
      navigate('/register');
    }
  };

  const handleFeatureNavigate = (feature) => {
    setSelectedFeature(null);
    if (isAuthenticated) {
      navigate(feature.route);
    } else {
      navigate('/register');
    }
  };

  const aiCapabilities = [
    {
      id: 'spending-analysis',
      icon: LineChart,
      title: 'Intelligent Spending Analysis',
      description: 'AI analyzes recorded transactions and identifies spending patterns.',
      tag: 'Analysis',
      scenarioKey: 'spending',
      details:
        'Continuously aggregates and classifies your recorded expenses across temporal windows (this month vs last month, quarterly, or yearly) to expose peak burn categories and hidden spending surges without manual spreadsheets.',
      highlights: [
        'Automated category breakdown and period-over-period percentage delta computation',
        'Top-spending merchant identification with transaction counts and totals',
        'Direct connection to Supabase transactions ledger with zero hallucination',
      ],
      samplePrompt: 'Where did most of my money go this month?',
      sampleResponse:
        'Based on your recorded transactions, your highest spending category this month is Food at ₹4,500 (+22% vs last month). Reducing food expenses by ₹1,000 could improve your monthly savings.',
    },
    {
      id: 'saving-recommendations',
      icon: TrendingDown,
      title: 'Personalized Saving Recommendations',
      description: 'Discover unnecessary expenses and opportunities to save based on your income and spending habits.',
      tag: 'Savings',
      scenarioKey: 'spending',
      details:
        'Evaluates your net savings rate against target benchmarks and isolates discretionary leaks in dining, recurring subscriptions, and impulse purchases, providing achievable incremental targets.',
      highlights: [
        'Realistic monthly spending reduction targets tailored to your cashflow',
        'Actionable surplus optimization without sacrificing essential living expenses',
        'Proactive recommendations stored in your persistent financial memory',
      ],
      samplePrompt: 'How can I increase my monthly savings by ₹5,000?',
      sampleResponse:
        'Reducing Food & Dining by ₹2,000 and pausing 2 inactive subscriptions would recover ₹3,400 monthly. Reallocating from discretionary entertainment covers the remaining ₹1,600.',
    },
    {
      id: 'financial-memory',
      icon: BrainCircuit,
      title: 'Financial Memory',
      description: 'Ask questions about previous transactions, monthly spending, income, and financial history.',
      tag: 'Memory',
      scenarioKey: 'spending',
      details:
        'Maintains user-specific context across sessions without resending raw database dumps. Remembers your long-term savings goals, preferred category caps, and past financial queries.',
      highlights: [
        'Persistent cross-session intelligence grounded in your private financial record',
        'Remembers previous recommendations and tracks whether you followed through',
        'Zero cross-tenant leakage with strict user ID row-level isolation',
      ],
      samplePrompt: 'What was my average grocery bill over the last 3 months?',
      sampleResponse:
        'Your average monthly grocery spend was ₹4,230 across 18 transactions from January to March, trending down 6% over the quarter.',
    },
    {
      id: 'smart-budget-monitoring',
      icon: Sliders,
      title: 'Smart Budget Monitoring',
      description: 'Receive personalized warnings when spending approaches or exceeds budget limits.',
      tag: 'Budgets',
      scenarioKey: 'action',
      details:
        'Proactively tracks live expenditure against established category thresholds. Prepares guarded budget modifications with one-click user authorization before updating your database.',
      highlights: [
        'Deterministic calculation of burn rates and days remaining in the month',
        'Guarded proposal workflows: AI prepares changes, you approve before writing to DB',
        'Visual threshold indicators before critical overspending occurs',
      ],
      samplePrompt: 'Set a monthly food budget of ₹6,000',
      sampleResponse:
        'I have prepared a proposed budget update: Food budget limit set to ₹6,000/month. Please review and confirm below to execute this in your database.',
    },
    {
      id: 'unusual-spending-detection',
      icon: ShieldAlert,
      title: 'Unusual Spending Detection',
      description: 'Identify unexpected expenses and changes in normal spending patterns.',
      tag: 'Anomalies',
      scenarioKey: 'spending',
      details:
        'Flags statistical anomalies such as duplicate vendor debits, unexpected price hikes, or atypical one-off withdrawals before they skew your monthly plan.',
      highlights: [
        'Anomaly scoring based on your standard baseline transaction distributions',
        'Instant alerts for high-value single transactions outside routine bounds',
        'Differentiates between one-time capital purchases and chronic overspending',
      ],
      samplePrompt: 'Were there any unusual transactions this month?',
      sampleResponse:
        'Detected 1 unusual transaction: ₹18,000 to Apartment Lease on 02 Apr (4.2x your median daily transaction size). All other routine debits match normal patterns.',
    },
    {
      id: 'upcoming-bill-awareness',
      icon: Calendar,
      title: 'Upcoming Bill Awareness',
      description: 'Get reminders and insights about recorded upcoming bills.',
      tag: 'Bills',
      scenarioKey: 'affordability',
      details:
        'Cross-references your recorded bank balances against upcoming utility, subscription, and loan obligations so you always know true spendable liquidity.',
      highlights: [
        'Deducts pending obligations when answering purchase affordability questions',
        'Days-to-due countdowns and overdue status tracking',
        'Safeguards against accidental overdrafts or missed payment deadlines',
      ],
      samplePrompt: 'Which bills are due next week?',
      sampleResponse:
        'You have 2 bills due next week: Tata Power electricity (₹3,400, due in 4 days) and Airtel Fiber (₹1,180, due in 6 days). Total obligation: ₹4,580.',
    },
    {
      id: 'monthly-financial-insights',
      icon: BarChart3,
      title: 'Monthly Financial Insights',
      description: 'Understand where your money goes and how your financial habits change over time.',
      tag: 'Insights',
      scenarioKey: 'spending',
      details:
        'Synthesizes monthly summaries comparing income, total expenditure, net savings rate, and category velocity into executive summaries you can read in seconds.',
      highlights: [
        'High-level monthly cash flow synthesis with net savings calculation',
        'Month-over-month percentage comparisons across core categories',
        'Interactive insight cards generated directly alongside narrative answers',
      ],
      samplePrompt: 'Compare this month with last month',
      sampleResponse:
        'Net income rose 5.0% to ₹85,000, while expenses dropped 8.1% to ₹28,400. Your net savings rate reached an exceptional 66.5%.',
    },
    {
      id: 'conversational-financial-assistance',
      icon: Bot,
      title: 'Conversational Financial Assistance',
      description: 'Ask questions naturally and receive answers based on your actual FinnTrack financial records.',
      tag: 'Natural Language',
      scenarioKey: 'affordability',
      details:
        'No need to parse confusing dashboards or configure SQL queries. Converse naturally in plain English and receive responses grounded in your actual ledger.',
      highlights: [
        'Dynamic multi-turn tool calling with streaming assistant responses',
        'Context-aware follow-up suggestion chips to dive deeper in one click',
        'Complete separation between financial data retrieval and generative synthesis',
      ],
      samplePrompt: 'Can I afford a ₹12,000 smartwatch purchase?',
      sampleResponse:
        'Easily Affordable. Your recorded balance is ₹85,000. After reserving ₹3,400 for bills and living costs, you retain a ₹55,600 surplus buffer.',
    },
    {
      id: 'adaptive-intelligence',
      icon: Sparkles,
      title: 'Adaptive Intelligence',
      description: 'AI recommendations become more personalized using user feedback and financial history.',
      tag: 'Adaptive',
      scenarioKey: 'action',
      details:
        'Learns your feedback preferences over time. If you reject high-frugality suggestions or favor investment allocations, the assistant adapts its tone and recommendations.',
      highlights: [
        'Explicit thumbs-up / thumbs-down feedback loop feeds memory refinement',
        'Tailors tone between strict budgeting and growth-oriented wealth tracking',
        'Autonomous refinement without manual configuration or complex prompts',
      ],
      samplePrompt: 'What should I do with my leftover ₹30,000 this month?',
      sampleResponse:
        'Based on your balanced investment preference, consider allocating ₹20,000 to Index Funds and ₹10,000 to your Emergency Fund.',
    },
  ];

  const sampleScenarios = {
    spending: {
      title: 'Spending Breakdown Inquiry',
      userQuestion: 'Where did most of my money go this month?',
      aiAnswer:
        'Based on your recorded transactions, your highest spending category this month is Food. You have spent ₹4,500, which is 22% higher than last month. Reducing food expenses by ₹1,000 could help improve your monthly savings.',
      insightType: 'category',
      insightCategory: 'Food & Dining',
      insightAmount: '₹4,500',
      insightDelta: '+22% vs last month',
      insightSuggestion: 'Target ₹3,500 monthly limit to save ₹1,000',
      followUps: ['Show food transactions', 'Create a ₹3,500 food budget', 'Compare with last month'],
    },
    affordability: {
      title: 'Purchase Affordability Assessment',
      userQuestion: 'Can I afford a ₹12,000 smartwatch purchase?',
      aiAnswer:
        'Affordability Assessment: Easily Affordable. Your recorded balance is ₹85,000. After reserving ₹3,400 for your upcoming Tata Power electricity bill and estimating remaining living expenses, you maintain a healthy surplus buffer of ₹55,600.',
      insightType: 'affordability',
      insightScore: '95/100',
      insightStatus: 'Affordable',
      insightBuffer: '₹55,600',
      insightBills: '₹3,400 reserved for bills',
      followUps: ['How will this affect savings?', 'Show pending bills this month', 'What is my daily burn rate?'],
    },
    action: {
      title: 'Guarded Action Proposal',
      userQuestion: 'Set a monthly food budget of ₹6,000',
      aiAnswer:
        'I have prepared a proposed budget update for you: Set monthly Food budget limit to ₹6,000. To ensure security, please confirm below to execute this action in your database.',
      insightType: 'proposal',
      proposalAction: 'Create / Update Category Budget',
      proposalCategory: 'Food',
      proposalAmount: '₹6,000 / month',
      proposalStatus: 'Pending Confirmation',
      followUps: ['Show all current budgets', 'Show food spending this month', 'What is my overall budget?'],
    },
  };

  const features = [
    {
      id: 'income-expense-tracking',
      icon: TrendingUp,
      title: 'Income & Expense Tracking',
      description:
        'Log cash flow instantly with detailed categories, notes, and tags in Indian Rupees (₹).',
      badge: 'Real-time',
      route: '/transactions',
      actionText: 'Transactions',
      details:
        'Effortlessly record every rupee coming in and going out. Categorize transactions by Food, Housing, Utilities, Travel, and more, complete with notes, dates, and payment methods.',
      highlights: [
        'Instant transaction logging with real-time balance recalculation',
        'Custom tagging and categorization in Indian Rupees (₹)',
        'Full search and filter by amount, date range, and keyword',
      ],
    },
    {
      id: 'smart-financial-analytics',
      icon: BarChart3,
      title: 'Smart Financial Analytics',
      description:
        'Gain deep clarity with temporal bar graphs, cash flow trends, and net savings rate computations.',
      badge: 'Automated',
      route: '/analytics',
      actionText: 'Analytics',
      details:
        'Transform raw expense records into crystal-clear financial clarity. Inspect month-over-month trends, category allocation percentages, and your net savings trajectory.',
      highlights: [
        'Temporal income vs expense comparison charts',
        'Dynamic savings rate calculations updated with every entry',
        'Multi-month velocity trends to project your future runway',
      ],
    },
    {
      id: 'budget-management',
      icon: Sliders,
      title: 'Budget Management',
      description:
        'Set monthly limits for essential living expenses and receive visual progress alerts before overspending.',
      badge: 'Control',
      route: '/budgets',
      actionText: 'Budgets',
      details:
        'Set hard or soft budget thresholds across categories like Groceries, Entertainment, and Dining. Keep your lifestyle in sync with your financial goals before the month ends.',
      highlights: [
        'Category-specific spending ceilings with percentage progress bars',
        'Clear threshold alerts (safe, warning, exceeded)',
        'Integrated with FinTrack AI for automated budget adjustments',
      ],
    },
    {
      id: 'spending-visualization',
      icon: PieChart,
      title: 'Spending Visualization',
      description:
        'Interactive donut breakdowns and comparative charts show exactly where your money goes every month.',
      badge: 'Clarity',
      route: '/analytics',
      actionText: 'Charts',
      details:
        'Interactive visual representations that break down every rupee spent. Hover over category arcs to inspect exact totals, transaction counts, and proportion of total outflow.',
      highlights: [
        'Interactive donut charts with high-contrast monochrome aesthetic',
        'Instant category drill-downs to inspect underlying transactions',
        'Monthly and yearly comparative views to track lifestyle inflation',
      ],
    },
    {
      id: 'transaction-history-export',
      icon: FileSpreadsheet,
      title: 'Transaction History & Export',
      description:
        'Search, filter by date range or category, sort by highest amounts, and export clean CSV reports with one click.',
      badge: 'Export',
      route: '/transactions',
      actionText: 'Export Records',
      details:
        'Your complete financial ledger at your fingertips. Search by payee, filter by date or payment method, sort by highest transaction amount, and export to CSV anytime.',
      highlights: [
        'One-click clean CSV export formatted for accounting & taxes',
        'Advanced multi-parameter filtering (date, category, min/max amount)',
        'Fast pagination and sorting with instantaneous client feedback',
      ],
    },
    {
      id: 'secure-personal-accounts',
      icon: ShieldCheck,
      title: 'Secure Personal Accounts',
      description:
        'Bank-grade architecture, isolated user databases, and ready-to-deploy JWT backend authentication.',
      badge: 'Encrypted',
      route: '/bank-accounts',
      actionText: 'Bank Accounts',
      details:
        'Your privacy is paramount. FinTrack encrypts passwords using bcryptjs, secures API calls with signed JWTs, and enforces strict row-level tenant isolation in PostgreSQL.',
      highlights: [
        'Isolated user tenant data: your records are never visible to others',
        'Encrypted credentials and industry-standard JWT authorization tokens',
        'Zero ad tracking or third-party data broker sharing',
      ],
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
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('ai-features')}
              className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>AI Assistant</span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-black text-white dark:bg-white dark:text-black">
                AI
              </span>
            </button>
            <button
              onClick={() => scrollToSection('ai-preview')}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Interactive Preview
            </button>
            <button
              onClick={() => scrollToSection('ai-advantage')}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              AI Advantage
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Finance Core
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
              {isDark ? <Sun className="w-4 h-4 text-black dark:text-white" /> : <Moon className="w-4 h-4 text-black dark:text-white" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-sm border border-zinc-800 dark:border-white transition-all active:scale-95"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-brand-elevated transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-sm border border-zinc-800 dark:border-white transition-all active:scale-95"
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
              {isDark ? <Sun className="w-4 h-4 text-black dark:text-white" /> : <Moon className="w-4 h-4 text-black dark:text-white" />}
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
                className="text-left px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-brand-elevated"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('ai-features')}
                className="text-left px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-brand-elevated flex items-center justify-between"
              >
                <span>AI Assistant Features</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                  AI
                </span>
              </button>
              <button
                onClick={() => scrollToSection('ai-preview')}
                className="text-left px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-brand-elevated"
              >
                Interactive Preview
              </button>
              <button
                onClick={() => scrollToSection('ai-advantage')}
                className="text-left px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-brand-elevated"
              >
                AI Advantage
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-left px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-brand-elevated"
              >
                Finance Core
              </button>
            </div>
            <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full text-center py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-sm border border-zinc-800 dark:border-white"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl font-semibold text-sm text-zinc-600 dark:text-zinc-400 border border-brand-border hover:bg-brand-elevated hover:text-black dark:hover:text-white"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-sm border border-zinc-800 dark:border-white"
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
        <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-black/5 dark:bg-white/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-card border border-brand-border shadow-sm mb-6 animate-fadeIn">
              <span className="flex h-2 w-2 rounded-full bg-black dark:bg-white animate-pulse" />
              <span className="text-xs font-semibold text-black dark:text-white">
                FinTrack AI is Live
              </span>
              <span className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs">• Adaptive Financial Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black dark:text-white tracking-tight leading-[1.15] mb-6">
              Your Money. Your Goals.{' '}
              <span className="block mt-2 text-black dark:text-white">
                Your AI Financial Assistant.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Take control of your finances with intelligent AI that understands your spending habits, analyzes transactions, identifies saving opportunities, and helps you make smarter financial decisions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-base text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md border border-zinc-800 dark:border-white active:scale-95 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => scrollToSection('ai-features')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-black dark:text-white bg-brand-card hover:bg-brand-elevated border border-brand-border transition-colors"
              >
                <span>Explore AI Features</span>
                <ChevronRight className="w-4 h-4 text-black dark:text-white" />
              </button>
            </div>

            {/* Small reassurance stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white" /> Deterministic calculations
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white" /> Action confirmation guardrail
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white" /> 100% private & secure
              </span>
            </div>
          </div>

          {/* ===================================================
              AI ASSISTANT HERO PREVIEW (MARKETING ILLUSTRATION)
          =================================================== */}
          <div className="mt-14 sm:mt-18 relative">
            {/* Ambient Background Glow & Depth Shades */}
            <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-zinc-500/10 via-zinc-400/10 to-zinc-500/10 rounded-3xl blur-3xl opacity-60 dark:opacity-40 pointer-events-none" />

            {/* Main AI Chat Mockup Container */}
            <div className="relative mx-auto max-w-4xl rounded-3xl bg-slate-950 text-white p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_50px_rgba(255,255,255,0.05)] ring-1 ring-white/10 overflow-hidden group">
              {/* Top Mac-style bar */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.08] text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline">
                    https://fintrack.app/ai-assistant
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  <Sparkles className="w-3 h-3 text-white" /> Product Preview • Demonstration with Sample Data
                </div>
              </div>

              {/* Chat Interior */}
              <div className="bg-[#0B0F19] rounded-2xl p-4 sm:p-6 space-y-4 shadow-inner">
                {/* Assistant Context Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">FinTrack AI Assistant</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15 font-semibold">
                          Adaptive Engine
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Context: 42 Transactions • 3 Budgets • 2 Pending Bills</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex text-[11px] text-slate-400 items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" /> Memory Synced
                  </span>
                </div>

                {/* Message 1: User Prompt */}
                <div className="flex justify-end">
                  <div className="max-w-md bg-white/15 border border-white/15 rounded-2xl rounded-tr-sm px-4 py-3 text-white shadow-sm">
                    <p className="text-xs sm:text-sm font-medium">Where did most of my money go this month?</p>
                    <span className="text-[10px] text-slate-400 block text-right mt-1">Today, 10:14 AM</span>
                  </div>
                </div>

                {/* Message 2: AI Response */}
                <div className="flex gap-3 items-start max-w-2xl">
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="bg-[#141B2D] border border-white/[0.08] rounded-2xl rounded-tl-sm p-4 text-slate-200 text-xs sm:text-sm leading-relaxed shadow-sm">
                      <p>
                        Based on your recorded transactions, your highest spending category this month is{' '}
                        <strong className="text-white font-semibold">Food</strong>. You have spent{' '}
                        <strong className="text-white font-bold">₹4,500</strong>, which is{' '}
                        <span className="text-rose-400 font-semibold inline-flex items-center gap-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5 inline" /> 22% higher
                        </span>{' '}
                        than last month. Reducing food expenses by ₹1,000 could help improve your monthly savings.
                      </p>
                    </div>

                    {/* Interactive Insight Card */}
                    <div className="p-3.5 rounded-xl bg-[#141B2D] border border-white/[0.08] text-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Spending Analysis</span>
                          <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                            +22% vs last month
                          </span>
                        </div>
                        <span className="text-white font-extrabold text-sm">₹4,500</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Budget consumed (₹4,500 / ₹5,000)</span>
                          <span className="font-semibold text-white">90%</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-400 rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        💡 Recommendation: Setting a ₹3,500 monthly limit would yield ~₹1,000 in monthly savings.
                      </p>
                    </div>

                    {/* Context Prompt Pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium">
                        Show food transactions
                      </span>
                      <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium">
                        Create a ₹3,500 food budget
                      </span>
                      <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium">
                        Compare with last month
                      </span>
                    </div>
                  </div>
                </div>

                {/* Input Simulation */}
                <div className="pt-2 flex items-center gap-2">
                  <div className="flex-1 bg-[#141B2D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-400 flex items-center justify-between">
                    <span>Ask about your expenses, budgets, bills, or savings...</span>
                    <Sparkles className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          2. DEDICATED AI FEATURES SECTION
      =================================================== */}
      <section id="ai-features" className="py-20 sm:py-28 bg-brand-sidebar/40 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-black dark:text-white px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 inline-block mb-3">
              FinTrack AI Engine
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              Meet Your Personal AI Financial Assistant
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3">
              A financial brain that continuously understands your behavior, remembers context across sessions, and delivers deterministic, data-grounded insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {aiCapabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCapability(cap)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCapability(cap);
                    }
                  }}
                  className="bg-brand-card hover:bg-brand-cardHover border border-brand-border rounded-2xl p-6 transition-all duration-300 shadow-card hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-black dark:text-white" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
                        {cap.tag}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-black dark:text-white tracking-tight mb-2">
                      {cap.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCapability(cap);
                    }}
                    className="pt-4 mt-4 border-t border-brand-border/40 flex items-center justify-between w-full text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors"
                  >
                    <span>Explore capability</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 text-black dark:text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================
          3. INTERACTIVE AI PREVIEW SECTION
      =================================================== */}
      <section id="ai-preview" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-black dark:text-white px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 inline-block mb-3">
              Interactive Demo
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              See FinTrack AI in Action
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3">
              Select a financial scenario below to preview how the assistant synthesizes records, computes comparisons, and safeguards actions.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {Object.entries(sampleScenarios).map(([key, item]) => {
              const active = activeScenario === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveScenario(key)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                    active
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md'
                      : 'bg-brand-card text-zinc-600 dark:text-zinc-400 border-brand-border hover:bg-brand-elevated'
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>

          {/* Chat Demonstration Window */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-slate-950 text-white p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">
                  fintrack://ai-preview/{activeScenario}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Demonstration with Sample Data
              </span>
            </div>

            <div className="space-y-4">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="max-w-md bg-white/15 border border-white/15 rounded-2xl rounded-tr-sm px-4 py-3 text-white shadow-sm">
                  <p className="text-xs sm:text-sm font-medium">
                    {sampleScenarios[activeScenario].userQuestion}
                  </p>
                </div>
              </div>

              {/* AI Bubble */}
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="bg-[#141B2D] border border-white/[0.08] rounded-2xl rounded-tl-sm p-4 text-slate-200 text-xs sm:text-sm leading-relaxed">
                    <p>{sampleScenarios[activeScenario].aiAnswer}</p>
                  </div>

                  {/* Dynamic Insight Card based on activeScenario */}
                  {activeScenario === 'spending' && (
                    <div className="p-4 rounded-xl bg-[#141B2D] border border-white/[0.08] text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Category Leader</span>
                          <span className="font-bold text-white text-base">Food & Dining</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-extrabold text-base">₹4,500</span>
                          <span className="text-[10px] text-rose-400 font-semibold block">+22% vs last month</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-[11px] text-slate-300">
                        Target recommendation: Capping food expenses to ₹3,500 would preserve an extra ₹1,000 per month.
                      </div>
                    </div>
                  )}

                  {activeScenario === 'affordability' && (
                    <div className="p-4 rounded-xl bg-[#141B2D] border border-white/[0.08] text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Affordability Index</span>
                          <span className="font-bold text-emerald-400 text-base">95 / 100 • Safe Purchase</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Surplus Buffer</span>
                          <span className="text-white font-extrabold text-base">₹55,600</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-[11px] text-slate-300">
                        ⚡ Scheduled commitments protected: ₹3,400 reserved for Tata Power bill due in 4 days.
                      </div>
                    </div>
                  )}

                  {activeScenario === 'action' && (
                    <div className="p-4 rounded-xl bg-[#141B2D] border border-white/[0.08] text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Guarded Action
                          </span>
                          <span className="font-bold text-white text-xs">Set Category Budget</span>
                        </div>
                        <span className="text-white font-extrabold text-sm">₹6,000 / mo</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        The assistant never modifies your database automatically. You must confirm each proposed action.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button disabled className="px-3.5 py-1.5 rounded-lg bg-white/20 text-slate-400 text-xs font-semibold cursor-not-allowed">
                          Confirm & Execute
                        </button>
                        <button disabled className="px-3.5 py-1.5 rounded-lg bg-transparent text-slate-500 text-xs font-medium cursor-not-allowed">
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-ups */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {sampleScenarios[activeScenario].followUps.map((fu, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium"
                      >
                        {fu}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. AI-POWERED ADVANTAGE SECTION
      =================================================== */}
      <section id="ai-advantage" className="py-20 sm:py-28 bg-brand-sidebar/40 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-black dark:text-white px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 inline-block mb-3">
              The AI Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              Traditional Expense Trackers vs. FinTrack PRO
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3">
              Why manual spreadsheet logging is outdated and how intelligent financial assistants transform money management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Card */}
            <div className="bg-brand-card border border-brand-border rounded-3xl p-7 sm:p-9 shadow-card">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-border">
                <div>
                  <h4 className="text-lg font-bold text-black dark:text-white">Traditional Trackers</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Passive Logging & Static Spreadsheets</p>
                </div>
                <span className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500">
                  <XCircle className="w-4 h-4 text-zinc-500" />
                </span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <span>Only record numbers after manual entry with zero smart feedback.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <span>Display raw charts and force you to calculate trends and percentages yourself.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <span>Treat each month as an isolated bucket with no memory of prior habits.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <span>Silent when you are about to overspend or face an unbudgeted utility bill.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <span>Generic, one-size-fits-all tips without understanding your personal lifestyle.</span>
                </li>
              </ul>
            </div>

            {/* FinTrack AI Card */}
            <div className="bg-brand-card border-2 border-black dark:border-white rounded-3xl p-7 sm:p-9 shadow-elevated relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-black dark:text-white">FinTrack PRO</h4>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                      AI-Powered
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Adaptive Intelligence & Safe Execution</p>
                </div>
                <span className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-black dark:text-white font-medium">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span>Continuously analyzes financial activity across your transactions and bank records.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span>Explains spending patterns in clear natural language with exact percentage deltas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span>Long-term financial memory of your preferences, goals, and recurring commitments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span>Proactive budget warnings and unusual spending anomaly detection.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-black dark:text-white flex-shrink-0 mt-0.5" />
                  <span>Safe, guarded action proposals that require your explicit confirmation before changing data.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. CORE FINANCIAL DASHBOARD & TOOLKIT
      =================================================== */}
      <section id="features" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-black dark:text-white px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 inline-block mb-3">
              Core Toolkit & Dashboard
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              Designed for modern financial clarity
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3">
              Everything you need to track money, build savings, and make smart financial decisions without complexity.
            </p>
          </div>

          {/* DASHBOARD PREVIEW (MARKETING ILLUSTRATION) */}
          <div className="mb-16 relative">
            {/* Ambient Background Glow & Depth Shades */}
            <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-60 dark:opacity-40 pointer-events-none" />

            {/* Main Mockup Container - Clean shaded elevation without harsh wireframe borders */}
            <div className="relative mx-auto max-w-5xl rounded-3xl bg-slate-950 text-white p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_50px_rgba(16,185,129,0.08)] ring-1 ring-white/10 overflow-hidden group">
              {/* Top Mac-style bar */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.08] text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline">
                    https://fintrack.app/dashboard
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" /> Product Preview • Illustrative Data
                </div>
              </div>

              {/* Mock Dashboard Interior - Borderless with deep layered shades */}
              <div className="bg-[#0B0F19] rounded-2xl p-4 sm:p-6 space-y-5 shadow-inner">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl bg-[#141B2D] shadow-md shadow-black/25 hover:bg-[#182137] transition-all">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Net Balance</span>
                    <span className="text-lg sm:text-2xl font-extrabold text-white font-sans block mt-1">₹1,24,500</span>
                    <span className="text-[11px] text-emerald-400 font-semibold inline-flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +14.2% vs last mo
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141B2D] shadow-md shadow-black/25 hover:bg-[#182137] transition-all">
                    <span className="text-[11px] text-slate-400 block font-medium">Monthly Income</span>
                    <span className="text-lg sm:text-2xl font-extrabold text-emerald-400 font-sans block mt-1 drop-shadow-[0_2px_8px_rgba(16,185,129,0.35)]">₹85,000</span>
                    <span className="text-[11px] text-emerald-400 font-semibold inline-flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +5.0% vs last mo
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141B2D] shadow-md shadow-black/25 hover:bg-[#182137] transition-all">
                    <span className="text-[11px] text-slate-400 block font-medium">Monthly Expenses</span>
                    <span className="text-lg sm:text-2xl font-extrabold text-rose-400 font-sans block mt-1 drop-shadow-[0_2px_8px_rgba(244,63,94,0.35)]">₹28,400</span>
                    <span className="text-[11px] text-emerald-400 font-semibold inline-flex items-center gap-0.5 mt-1">
                      <ArrowDownLeft className="w-3 h-3" /> -8.1% vs last mo
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141B2D] shadow-md shadow-black/25 hover:bg-[#182137] transition-all">
                    <span className="text-[11px] text-slate-400 block font-medium">Savings Rate</span>
                    <span className="text-lg sm:text-2xl font-extrabold text-purple-400 font-sans block mt-1 drop-shadow-[0_2px_8px_rgba(168,85,247,0.35)]">66.5%</span>
                    <span className="text-[11px] text-emerald-400 font-semibold inline-flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +4.2% healthy
                    </span>
                  </div>
                </div>

                {/* Simulated Chart & Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Overview Bars */}
                  <div className="lg:col-span-2 p-5 rounded-xl bg-[#141B2D] shadow-md shadow-black/25">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-white tracking-wide">Monthly Cash Flow</span>
                      <div className="flex items-center gap-4 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                          <span className="text-slate-300 font-medium">Income</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                          <span className="text-slate-300 font-medium">Expenses</span>
                        </span>
                      </div>
                    </div>
                    {/* Visual simulated bars - GREEN beside RED! */}
                    <div className="h-32 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-white/[0.08] pb-2">
                      {[
                        { m: 'Nov', inc: 70, exp: 35 },
                        { m: 'Dec', inc: 75, exp: 45 },
                        { m: 'Jan', inc: 80, exp: 40 },
                        { m: 'Feb', inc: 85, exp: 32 },
                        { m: 'Mar', inc: 85, exp: 30 },
                        { m: 'Apr', inc: 90, exp: 33 },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full flex items-end justify-center gap-1.5 h-24">
                            <div
                              style={{ height: `${item.inc}%` }}
                              className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all hover:brightness-110"
                            />
                            <div
                              style={{ height: `${item.exp}%` }}
                              className="w-1/2 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-sm shadow-[0_0_12px_rgba(244,63,94,0.4)] transition-all hover:brightness-110"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium mt-1">{item.m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="p-5 rounded-xl bg-[#141B2D] shadow-md shadow-black/25 space-y-3">
                    <span className="text-xs font-bold text-white tracking-wide block">Recent Ledger</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1B243B]/70 hover:bg-[#1B243B] transition-colors">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-200 truncate">TechCorp India Salary</p>
                          <p className="text-[10px] text-slate-400">01 Apr • Salary</p>
                        </div>
                        <span className="font-bold text-emerald-400 text-xs">+₹85,000</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1B243B]/70 hover:bg-[#1B243B] transition-colors">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-200 truncate">Apartment Lease</p>
                          <p className="text-[10px] text-slate-400">02 Apr • Housing</p>
                        </div>
                        <span className="font-bold text-rose-400 text-xs">-₹18,000</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1B243B]/70 hover:bg-[#1B243B] transition-colors">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-200 truncate">Nature's Basket</p>
                          <p className="text-[10px] text-slate-400">03 Apr • Groceries</p>
                        </div>
                        <span className="font-bold text-rose-400 text-xs">-₹3,450</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedFeature(feature)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedFeature(feature);
                    }
                  }}
                  className="bg-brand-card hover:bg-brand-cardHover border border-brand-border rounded-2xl p-6 transition-all duration-300 shadow-card hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-black dark:text-white" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
                        {feature.badge}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-black dark:text-white tracking-tight mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeature(feature);
                    }}
                    className="pt-4 mt-4 border-t border-brand-border/40 flex items-center justify-between w-full text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 text-black dark:text-white group-hover:translate-x-1 transition-transform" />
                  </button>
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
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-black dark:text-white mb-2">
              Simple 3-Step Flow
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              From day one to complete mastery
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3">
              No complicated spreadsheets. No financial jargon. Get started and organized in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-brand-card border border-brand-border rounded-2xl p-7 relative shadow-card hover:border-black/30 dark:hover:border-white/30 transition-colors"
              >
                <div className="text-3xl sm:text-4xl font-black text-black dark:text-white mb-4 font-mono">
                  {step.number}
                </div>
                <h4 className="text-lg font-bold text-black dark:text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
              <h3 className="text-2xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight mb-6">
                Engineered for people who value financial intentionality
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                Most budgeting tools are bloated, filled with advertisements, or require complex setup.
                FinTrack gives you pristine clarity, instantaneous metrics, and dynamic insights without noise.
              </p>

              <div className="space-y-3.5">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-black dark:text-white">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border border-zinc-800 dark:border-white shadow-sm transition-all active:scale-95"
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
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs">
                    ₹
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-black dark:text-white">Dynamic Calculations</h5>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Zero seeded or fabricated fallbacks</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700 font-semibold">
                  Active Sync
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-brand-elevated border border-brand-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-brand-subtle block">Calculated Savings Target</span>
                    <span className="font-bold text-black dark:text-white text-sm">65% Target Achieved</span>
                  </div>
                  <span className="text-black dark:text-white font-bold text-sm">+18.5% Growth</span>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-elevated border border-brand-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-brand-subtle block">Monthly Budget Protection</span>
                    <span className="font-bold text-black dark:text-white text-sm">Under Budget by ₹14,200</span>
                  </div>
                  <span className="text-black dark:text-white font-bold text-sm">Optimal</span>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-elevated border border-brand-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-brand-subtle block">Bank-Grade Privacy</span>
                    <span className="font-bold text-black dark:text-white text-sm">No Third-party Data Sharing</span>
                  </div>
                  <span className="text-black dark:text-white font-bold text-sm">100% Private</span>
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
            <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight mb-4">
              Your Financial Journey Starts Here.
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of mindful individuals taking control of their finances with FinTrack today.
              Set up your account in 30 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-lg border border-zinc-800 dark:border-white active:scale-95 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-black dark:text-white bg-brand-elevated hover:bg-brand-border border border-brand-border transition-colors"
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
                <span className="font-extrabold text-base text-black dark:text-white">FinTrack PRO</span>
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
              <h6 className="font-bold text-xs uppercase tracking-wider text-black dark:text-white mb-3">Navigation</h6>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('hero')} className="hover:text-black dark:hover:text-white transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('ai-features')} className="hover:text-black dark:hover:text-white transition-colors">
                    AI Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('ai-preview')} className="hover:text-black dark:hover:text-white transition-colors">
                    Interactive Demo
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('ai-advantage')} className="hover:text-black dark:hover:text-white transition-colors">
                    AI Advantage
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-black dark:hover:text-white transition-colors">
                    Core Toolkit
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-black dark:hover:text-white transition-colors">
                    How It Works
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Authentication */}
            <div>
              <h6 className="font-bold text-xs uppercase tracking-wider text-black dark:text-white mb-3">Access</h6>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="hover:text-black dark:hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-black dark:hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-black dark:hover:text-white transition-colors">
                    User Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Localization & Security */}
            <div>
              <h6 className="font-bold text-xs uppercase tracking-wider text-black dark:text-white mb-3">Platform</h6>
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
              <span className="hover:text-black dark:hover:text-white cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-black dark:hover:text-white cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-black dark:hover:text-white cursor-pointer">Security Overview</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================================================
          AI CAPABILITY DEEP-DIVE MODAL
      =================================================== */}
      {selectedCapability && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedCapability(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center">
                  {React.createElement(selectedCapability.icon, { className: 'w-5 h-5 text-black dark:text-white' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight">
                      {selectedCapability.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
                      {selectedCapability.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">FinTrack AI Adaptive Intelligence</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCapability(null)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:bg-zinc-900 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm text-zinc-600 dark:text-zinc-300">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-2">
                  Capability Overview
                </h4>
                <p className="leading-relaxed">
                  {selectedCapability.details || selectedCapability.description}
                </p>
              </div>

              {/* Highlights */}
              {selectedCapability.highlights && selectedCapability.highlights.length > 0 && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-2.5">
                    Key Features & Guardrails
                  </h4>
                  <ul className="space-y-2">
                    {selectedCapability.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Demonstration */}
              {selectedCapability.samplePrompt && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-2">
                    Sample Interaction
                  </span>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-black dark:text-white shrink-0">You:</span>
                      <span className="text-zinc-700 dark:text-zinc-300 italic">"{selectedCapability.samplePrompt}"</span>
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
                      <span className="font-bold text-black dark:text-white shrink-0">AI:</span>
                      <span className="text-zinc-700 dark:text-zinc-300">{selectedCapability.sampleResponse}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleTryDemo(selectedCapability.scenarioKey)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-black dark:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-black dark:text-white" />
                <span>Try in Live Demo</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCapability(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleLaunchAI}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  <span>{isAuthenticated ? 'Open in FinTrack AI' : 'Get Started Free'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          CORE TOOLKIT FEATURE DEEP-DIVE MODAL
      =================================================== */}
      {selectedFeature && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedFeature(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center">
                  {React.createElement(selectedFeature.icon, { className: 'w-5 h-5 text-black dark:text-white' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight">
                      {selectedFeature.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
                      {selectedFeature.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">FinTrack PRO Core Platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeature(null)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:bg-zinc-900 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm text-zinc-600 dark:text-zinc-300">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-2">
                  Module Capabilities
                </h4>
                <p className="leading-relaxed">
                  {selectedFeature.details || selectedFeature.description}
                </p>
              </div>

              {/* Highlights */}
              {selectedFeature.highlights && selectedFeature.highlights.length > 0 && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-2.5">
                    What You Can Do
                  </h4>
                  <ul className="space-y-2">
                    {selectedFeature.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick specs / security notice */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-black dark:text-white block">Status</span>
                  <span className="text-zinc-500 dark:text-zinc-400">Production ready • Multi-tenant Supabase PostgreSQL</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
                  Active
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                {isAuthenticated ? 'Authenticated session active' : 'Free account • No credit card required'}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedFeature(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleFeatureNavigate(selectedFeature)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  <span>{isAuthenticated ? `Open ${selectedFeature.actionText || 'Feature'}` : 'Get Started Free'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;