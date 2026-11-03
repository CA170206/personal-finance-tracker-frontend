export const INITIAL_USER = {
  id: 'usr_01',
  name: 'Chaitanya Anmulwar',
  email: 'chaitanya@example.com',
  currency: 'INR',
  currencySymbol: '₹',
  theme: 'dark',
  avatarUrl: null,
  role: 'Pro Member',
  monthlySalary: 45000,
  joinedDate: '2026-01-15',
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx_01',
    title: 'Monthly Salary',
    amount: 45000,
    type: 'income',
    category: 'Salary',
    date: '2026-11-01',
    notes: 'Direct deposit from TechCorp India',
    createdAt: '2026-11-01T09:00:00Z',
  },
  {
    id: 'tx_02',
    title: 'Apartment Rent',
    amount: 8000,
    type: 'expense',
    category: 'Housing',
    date: '2026-11-02',
    notes: 'Monthly rental payment via UPI',
    createdAt: '2026-11-02T10:15:00Z',
  },
  {
    id: 'tx_03',
    title: 'Groceries at Nature Basket',
    amount: 3500,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-11-02',
    notes: 'Monthly household organic vegetables & pantry staples',
    createdAt: '2026-11-02T13:45:00Z',
  },
  {
    id: 'tx_04',
    title: 'Electricity Bill',
    amount: 1200,
    type: 'expense',
    category: 'Utilities',
    date: '2026-10-29',
    notes: 'MSEDCL residential electricity bill',
    createdAt: '2026-10-29T11:20:00Z',
  },
  {
    id: 'tx_05',
    title: 'Freelance UI/UX Project',
    amount: 12000,
    type: 'income',
    category: 'Freelancing',
    date: '2026-10-28',
    notes: 'Milestone 2 payment for FinTech mobile app revamp',
    createdAt: '2026-10-28T16:00:00Z',
  },
  {
    id: 'tx_06',
    title: 'Fine Dining Restaurant',
    amount: 850,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-10-26',
    notes: 'Weekend dinner with colleagues',
    createdAt: '2026-10-26T20:30:00Z',
  },
  {
    id: 'tx_07',
    title: 'High-speed Fiber Internet',
    amount: 999,
    type: 'expense',
    category: 'Utilities',
    date: '2026-10-25',
    notes: 'Airtel Xstream 200 Mbps broadband',
    createdAt: '2026-10-25T14:10:00Z',
  },
  {
    id: 'tx_08',
    title: 'Fuel & Metro Recharge',
    amount: 1500,
    type: 'expense',
    category: 'Transportation',
    date: '2026-10-24',
    notes: 'Monthly commute & fuel top-up',
    createdAt: '2026-10-24T08:30:00Z',
  },
  {
    id: 'tx_09',
    title: 'Index Mutual Fund SIP',
    amount: 5000,
    type: 'expense',
    category: 'Shopping', // or savings / investment
    date: '2026-10-20',
    notes: 'Nifty 50 Index Fund SIP auto-debit',
    createdAt: '2026-10-20T05:00:00Z',
  },
  {
    id: 'tx_10',
    title: 'Annual Health Checkup & Meds',
    amount: 2400,
    type: 'expense',
    category: 'Healthcare',
    date: '2026-10-18',
    notes: 'Prescriptions and diagnostic labs',
    createdAt: '2026-10-18T11:45:00Z',
  },
  {
    id: 'tx_11',
    title: 'Client Retention Bonus',
    amount: 15000,
    type: 'income',
    category: 'Business',
    date: '2026-10-15',
    notes: 'Q3 performance bonus from agency client',
    createdAt: '2026-10-15T12:00:00Z',
  },
  {
    id: 'tx_12',
    title: 'Cult.fit Gym & Fitness',
    amount: 1200,
    type: 'expense',
    category: 'Personal Care',
    date: '2026-10-12',
    notes: 'Monthly gym and fitness pass',
    createdAt: '2026-10-12T07:15:00Z',
  },
  {
    id: 'tx_13',
    title: 'Swiggy Gourmet Delivery',
    amount: 620,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-10-10',
    notes: 'Friday night meal order',
    createdAt: '2026-10-10T21:00:00Z',
  },
  {
    id: 'tx_14',
    title: 'System Architecture Books',
    amount: 750,
    type: 'expense',
    category: 'Education',
    date: '2026-10-05',
    notes: 'OReilly software engineering book on Amazon',
    createdAt: '2026-10-05T15:20:00Z',
  },
  {
    id: 'tx_15',
    title: 'Previous Month Salary',
    amount: 45000,
    type: 'income',
    category: 'Salary',
    date: '2026-10-01',
    notes: 'Direct deposit from TechCorp India',
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'tx_16',
    title: 'Previous Month Rent',
    amount: 8000,
    type: 'expense',
    category: 'Housing',
    date: '2026-10-02',
    notes: 'October apartment rental',
    createdAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'tx_17',
    title: 'Zomato & Dining Out',
    amount: 2800,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-09-22',
    notes: 'Family dining gathering',
    createdAt: '2026-09-22T19:30:00Z',
  },
  {
    id: 'tx_18',
    title: 'September Salary',
    amount: 45000,
    type: 'income',
    category: 'Salary',
    date: '2026-09-01',
    notes: 'September TechCorp India Salary',
    createdAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'tx_19',
    title: 'September Rent',
    amount: 8000,
    type: 'expense',
    category: 'Housing',
    date: '2026-09-02',
    notes: 'September apartment rental',
    createdAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'tx_20',
    title: 'Stock Dividend Payout',
    amount: 3200,
    type: 'income',
    category: 'Investments',
    date: '2026-09-15',
    notes: 'Quarterly dividend from TCS & Infosys',
    createdAt: '2026-09-15T11:00:00Z',
  }
];

export const INITIAL_BUDGETS = [
  {
    id: 'bg_01',
    category: 'Housing',
    allocated: 8500,
    period: 'monthly',
    color: '#8B5CF6',
  },
  {
    id: 'bg_02',
    category: 'Food & Dining',
    allocated: 6500,
    period: 'monthly',
    color: '#F59E0B',
  },
  {
    id: 'bg_03',
    category: 'Transportation',
    allocated: 3000,
    period: 'monthly',
    color: '#3B82F6',
  },
  {
    id: 'bg_04',
    category: 'Utilities',
    allocated: 2800,
    period: 'monthly',
    color: '#6366F1',
  },
  {
    id: 'bg_05',
    category: 'Healthcare',
    allocated: 3000,
    period: 'monthly',
    color: '#EF4444',
  },
  {
    id: 'bg_06',
    category: 'Shopping',
    allocated: 6000,
    period: 'monthly',
    color: '#EC4899',
  },
  {
    id: 'bg_07',
    category: 'Entertainment',
    allocated: 2000,
    period: 'monthly',
    color: '#A855F7',
  },
  {
    id: 'bg_08',
    category: 'Personal Care',
    allocated: 2000,
    period: 'monthly',
    color: '#14B8A6',
  },
];

export const OVERALL_MONTHLY_BUDGET = 35000;

// User-Scoped LocalStorage Persistence Handlers
export const getStoredTransactions = () => {
  const user = getStoredUser();
  const email = user?.email || 'demo';
  const txKey = `fintrack_tx_${email}`;
  const data = localStorage.getItem(txKey);

  if (data !== null) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Only seed initial sample transactions for default demo user
  if (email === 'chaitanya@example.com' || email === 'demo') {
    localStorage.setItem(txKey, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }

  // Brand new users get clean zero transactions
  localStorage.setItem(txKey, JSON.stringify([]));
  return [];
};

export const saveStoredTransactions = (transactions) => {
  const user = getStoredUser();
  const email = user?.email || 'demo';
  localStorage.setItem(`fintrack_tx_${email}`, JSON.stringify(transactions));
  localStorage.setItem('fintrack_mock_transactions', JSON.stringify(transactions));
};

export const getStoredBudgets = () => {
  const user = getStoredUser();
  const email = user?.email || 'demo';
  const bgKey = `fintrack_bg_${email}`;
  const data = localStorage.getItem(bgKey);

  if (data !== null) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  if (email === 'chaitanya@example.com' || email === 'demo') {
    localStorage.setItem(bgKey, JSON.stringify(INITIAL_BUDGETS));
    return INITIAL_BUDGETS;
  }

  localStorage.setItem(bgKey, JSON.stringify([]));
  return [];
};

export const saveStoredBudgets = (budgets) => {
  const user = getStoredUser();
  const email = user?.email || 'demo';
  localStorage.setItem(`fintrack_bg_${email}`, JSON.stringify(budgets));
  localStorage.setItem('fintrack_mock_budgets', JSON.stringify(budgets));
};

export const getStoredOverallBudget = () => {
  const user = getStoredUser();
  const email = user?.email || 'demo';
  const val = localStorage.getItem(`fintrack_overall_${email}`);
  if (val !== null) {
    return Number(val) || 0;
  }
  if (email === 'chaitanya@example.com' || email === 'demo') {
    localStorage.setItem(`fintrack_overall_${email}`, OVERALL_MONTHLY_BUDGET.toString());
    return OVERALL_MONTHLY_BUDGET;
  }
  return 0;
};

export const saveStoredOverallBudget = (amount) => {
  const user = getStoredUser();
  const email = user?.email || 'demo';
  localStorage.setItem(`fintrack_overall_${email}`, amount.toString());
  localStorage.setItem('fintrack_mock_overall_budget', amount.toString());
};

export const getStoredUser = () => {
  const user = localStorage.getItem('fintrack_user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch {
      return INITIAL_USER;
    }
  }
  return INITIAL_USER;
};

export const saveStoredUser = (user) => {
  localStorage.setItem('fintrack_user', JSON.stringify(user));
};

export const resetMockData = () => {
  const demoEmail = 'chaitanya@example.com';
  localStorage.setItem(`fintrack_tx_${demoEmail}`, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(`fintrack_bg_${demoEmail}`, JSON.stringify(INITIAL_BUDGETS));
  localStorage.setItem(`fintrack_overall_${demoEmail}`, OVERALL_MONTHLY_BUDGET.toString());
  localStorage.setItem('fintrack_mock_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem('fintrack_mock_budgets', JSON.stringify(INITIAL_BUDGETS));
  localStorage.setItem('fintrack_mock_overall_budget', OVERALL_MONTHLY_BUDGET.toString());
  localStorage.setItem('fintrack_user', JSON.stringify(INITIAL_USER));
};
