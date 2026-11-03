# FinTrack PRO — Personal Finance Tracker SaaS

A modern, full-stack Personal Finance SaaS application built with **React 19 + Vite + Tailwind CSS** (Frontend) and **Node.js + Express + MongoDB + JWT** (Backend).

---

## 🏗️ Architecture Overview

The repository is organized into a clean 2-tier monorepo:

```
fintrack/
├── frontend/                   # React 19 + Vite + Tailwind CSS Client
│   ├── src/
│   │   ├── components/         # Reusable UI widgets, layout, modals & charts
│   │   ├── context/            # AuthContext, FinanceContext, ThemeContext, ToastContext
│   │   ├── layouts/            # Persistent MainLayout (Sidebar + Topbar)
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Transactions, Analytics, Budgets, Settings
│   │   ├── services/           # Axios API connectors with mock fallback
│   │   └── utils/              # Dynamic financial calculation engine & currency formatters
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Node.js + Express + MongoDB + JWT API Service
│   ├── src/
│   │   ├── config/             # Database connection manager
│   │   ├── controllers/        # Auth, User, Transaction, Budget, Dashboard logic
│   │   ├── middleware/         # JWT Bearer authentication & centralized error handler
│   │   ├── models/             # Mongoose models (User, Transaction, Budget, OverallBudget)
│   │   ├── routes/             # RESTful API routing endpoints
│   │   ├── scripts/            # Database seeder (realistic 20 transactions + demo profile)
│   │   ├── utils/              # Server-side financial calculations
│   │   └── server.js           # Express app bootstrap
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── package.json                # Root convenience scripts
├── .gitignore                  # Monorepo ignore rules
└── README.md                   # Project documentation
```

---

## ⚡ Quick Start

### 1. Run the Frontend

```bash
# From root directory:
npm run dev:frontend

# Or inside the frontend folder:
cd frontend
npm run dev
```

The frontend will start at **`http://localhost:5173`**.

- **Public Landing Page**: Accessible at `/`
- **Demo Login**: Use the "Auto-fill Demo" button on `/login` (`alex@example.com` / `demo1234`)
- **New User Registration**: Create a clean account with ₹0 balance and onboarding guidance

### 2. Run the Backend

```bash
# Navigate to backend:
cd backend

# Install dependencies (first time only):
npm install

# Start development server:
npm run dev
```

The backend server will start at **`http://localhost:5000/api`**.

### 3. Seed Backend Database (Optional)

```bash
cd backend
npm run seed
```

Seeds the database with `alex@example.com` and 20 sample transactions.

---

## 🔌 Connecting Frontend to Backend

FinTrack includes a zero-config API connector:
- In `frontend/.env`, set `VITE_USE_MOCK=false` to route all queries directly to the Node.js/Express backend at `http://localhost:5000/api`.
- When `VITE_USE_MOCK=true` (default), the frontend runs in self-contained client mode, ideal for instant demonstrations.

