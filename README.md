# 💼 Gig Economy Finance Tracker

<div align="center">

**A comprehensive financial tracking and analytics platform built for gig economy workers**

[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Themes](#-themes) • [Security](#-security)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Themes](#-themes)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Gig Economy Finance Tracker is a modern, beautifully designed web application that helps freelancers, gig workers, and independent contractors take control of their finances. With features like income tracking, expense management, tax calculation, insurance recommendations, and stunning customizable themes, it's the all-in-one financial companion for the modern gig worker.

### Why This App?

- 📊 **Smart Analytics** - Visualize your financial health with interactive charts
- 💰 **Income Tracking** - Track earnings from 30+ gig platforms (Uber, DoorDash, Fiverr, etc.)
- 💸 **Expense Management** - Categorize spending across 25+ categories
- 🎯 **Goal Setting** - Set and track savings goals with visual progress
- 📋 **Tax Tools** - Calculate quarterly tax estimates with deduction tracking
- 🛡️ **Insurance Advisor** - Get personalized insurance recommendations
- 🎨 **9 Beautiful Themes** - Customize your experience with stunning visual themes
- 🔒 **Secure & Private** - Your data is encrypted and protected

---

## ✨ Features

### 💵 **Financial Management**
- **Income Tracking**: Log earnings from multiple platforms with date, amount, and notes
- **Expense Tracking**: Categorize expenses with 25+ categories (Gas, Food, Equipment, etc.)
- **Net Income Calculation**: Real-time calculation of profits
- **Financial Health Score**: Dashboard showing your overall financial status

### 📊 **Analytics & Insights**
- **Interactive Charts**: Visualize income/expense trends with Recharts
- **Category Breakdown**: See spending patterns by category
- **Platform Analysis**: Track which gig platforms earn you the most
- **Monthly Trends**: Identify seasonal patterns in your income

### 🎯 **Goal Management**
- **Savings Goals**: Set target amounts with deadlines
- **Visual Progress**: Track goal completion with progress bars
- **Multiple Goals**: Manage emergency funds, vacation savings, equipment purchases, etc.
- **Goal Completion**: Celebrate achievements when goals are met

### 💼 **Tax Tools**
- **Quarterly Calculator**: Break down tax obligations by quarter (Q1-Q4)
- **Deduction Tracker**: Track deductible expenses (Gas, Equipment, Software, etc.)
- **Tax Estimates**: Calculate estimated tax bills at 25% rate
- **Tax Checklist**: Prepare for tax season with guided checklist
- **Year Selection**: View tax data for multiple years (2022-2025)

### 🛡️ **Insurance Advisor**
- **Smart Recommendations**: Get personalized insurance suggestions based on income
- **9 Insurance Types**: Health, Auto, Liability, Disability, Life, Equipment, Professional, Cyber, Umbrella
- **Affordability Analysis**: See if insurance fits your budget
- **Priority Levels**: High/Medium/Low priority based on your financial situation
- **Policy Management**: Track active policies, costs, and renewal dates

### 📸 **Receipt Management**
- **Image Upload**: Store receipt photos for tax deductions
- **Categorization**: Link receipts to expense categories
- **Organization**: Search and filter receipts
- **Cloud Storage**: Powered by Supabase Storage

### 📤 **Export & Reports**
- **CSV Export**: Download data for Excel/Google Sheets
- **PDF Reports**: Generate professional financial reports
- **Custom Date Ranges**: Export specific time periods

### 🎨 **Customizable Themes**
**9 Beautiful Themes:**
1. ⚪ **Pure White** - Clean, minimal, professional
2. ⚫ **Midnight Black** - OLED-friendly dark mode
3. 🌸 **Soft Pastels** - Dreamy vintage aesthetic
4. 🌅 **Coral Sunset** - Warm tropical vibes
5. 💜 **Lavender Dream** - Calming purple tones
6. 🌿 **Mint Fresh** - Natural and refreshing
7. 🌊 **Ocean Breeze** - Coastal tranquility with animated waves
8. ☕ **Midnight Latte** - Cozy coffee shop dark mode
9. 🌍 **Seasonal** - Auto-changes with seasons (Spring/Summer/Fall/Winter)

**Theme Features:**
- Animated particle backgrounds (snowflakes, petals, waves)
- Smooth transitions (0.4s ease)
- LocalStorage persistence
- Accessibility support (respects prefers-reduced-motion)

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3+** - Modern hooks-based architecture
- **Vite 5.4+** - Lightning-fast dev server with HMR
- **React Router DOM v6** - Client-side routing with protected routes
- **JavaScript (ES6+)** - Modern syntax with async/await

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Supabase Auth** - JWT-based authentication with email/password
- **Row Level Security** - Database-level security policies

### **State Management**
- **Zustand** - Lightweight state management (< 1KB)
- **Zustand Persist** - LocalStorage persistence for themes and preferences

### **UI & Styling**
- **CSS Variables** - Dynamic theming system
- **Custom CSS** - No UI framework dependencies
- **Lucide React** - 1000+ beautiful icons
- **Recharts** - Data visualization charts

### **Security**
- Environment variables (.env)
- Content Security Policy (CSP)
- XSS protection
- Input validation & sanitization
- HTTPS/SSL encryption

---

## 🚀 Installation

### Prerequisites

- **Node.js** 16+ and npm
- **Supabase Account** (free tier available)
- **Git** (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gig-economy-app.git
   cd gig-economy-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**

   Create the following tables in your Supabase project:

   **incomes**
   ```sql
   CREATE TABLE incomes (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users NOT NULL,
     platform TEXT NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     date DATE NOT NULL,
     notes TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **expenses**
   ```sql
   CREATE TABLE expenses (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users NOT NULL,
     category TEXT NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     date DATE NOT NULL,
     notes TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **goals**
   ```sql
   CREATE TABLE goals (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users NOT NULL,
     name TEXT NOT NULL,
     target_amount DECIMAL(10,2) NOT NULL,
     current_amount DECIMAL(10,2) DEFAULT 0,
     deadline DATE,
     completed BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **insurance**
   ```sql
   CREATE TABLE insurance (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users NOT NULL,
     type TEXT NOT NULL,
     provider TEXT NOT NULL,
     policy_number TEXT,
     monthly_cost DECIMAL(10,2) NOT NULL,
     coverage_amount TEXT,
     renewal_date DATE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Enable Row Level Security (RLS)**

   For each table, run:
   ```sql
   ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
   ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
   ALTER TABLE insurance ENABLE ROW LEVEL SECURITY;

   -- Users can only access their own data
   CREATE POLICY "Users can view own data" ON incomes
     FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own data" ON incomes
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own data" ON incomes
     FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own data" ON incomes
     FOR DELETE USING (auth.uid() = user_id);

   -- Repeat for expenses, goals, insurance tables
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Plaid (Bank Linking)
VITE_PLAID_CLIENT_ID=your_plaid_client_id
VITE_PLAID_SECRET=your_plaid_secret
VITE_PLAID_ENV=sandbox

# Optional: Stripe (Payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Important Security Notes:**
- ✅ `.env` is in `.gitignore` - never commit it
- ✅ Use `VITE_` prefix for all frontend variables
- ⚠️ Never expose secret keys in client-side code

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Output will be in `dist/` directory

---

## 🎨 Themes

The app features 9 professionally designed themes with animated backgrounds:

| Theme | Mode | Description | Special Effects |
|-------|------|-------------|-----------------|
| ⚪ Pure White | Light | Clean, minimal, professional | None |
| ⚫ Midnight Black | Dark | OLED-friendly true blacks | White sparkles |
| 🌸 Soft Pastels | Light | Dreamy vintage aesthetic | Pink petals |
| 🌅 Coral Sunset | Light | Warm tropical vibes | Orange gradient orbs |
| 💜 Lavender Dream | Light | Calming purple fields | Purple petals |
| 🌿 Mint Fresh | Light | Natural and refreshing | Green leaves |
| 🌊 Ocean Breeze | Light | Coastal tranquility | Animated waves |
| ☕ Midnight Latte | Dark | Cozy coffee shop | Steam wisps |
| 🌍 Seasonal | Dynamic | Auto-changes with seasons | Season-specific |

**Seasonal Theme Changes:**
- 🌸 **Spring** (Mar 20 - Jun 20): Pink cherry blossoms
- ☀️ **Summer** (Jun 21 - Sep 22): Golden sunshine
- 🍁 **Fall** (Sep 23 - Dec 20): Autumn leaves
- ❄️ **Winter** (Dec 21 - Mar 19): Snowy twilight

---

## 🔒 Security

### Implemented Security Features

✅ **Authentication**
- JWT token-based sessions (Supabase Auth)
- Secure password hashing (bcrypt)
- Email verification support
- Password reset functionality

✅ **Data Protection**
- Row Level Security (RLS) in Supabase
- Users can only access their own data
- Environment variables for secrets
- No hardcoded credentials

✅ **Frontend Security**
- Content Security Policy (CSP)
- XSS protection headers
- HTTPS/SSL encryption
- Input validation & sanitization
- Secure localStorage wrapper

✅ **Code Security**
- No sensitive data in git history
- `.env` in `.gitignore`
- npm audit for vulnerabilities
- Regular dependency updates

### Security Utilities

The app includes security helper functions in `src/utils/security.js`:

```javascript
import {
  sanitizeString,      // Remove HTML/script tags
  validateAmount,      // Validate money amounts
  validateEmail,       // Check email format
  validateFile,        // Validate file uploads
  secureStorage,       // Safe localStorage wrapper
  maskSensitiveData    // Hide sensitive info
} from './utils/security'
```

## 📁 Project Structure

```
gig-economy-app/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── AnimatedBackground.jsx
│   │   └── ThemeSwitcherModal.jsx
│   ├── layouts/         # Page layouts
│   │   └── DashboardLayout.jsx
│   ├── pages/           # Application pages
│   │   ├── Dashboard.jsx
│   │   ├── Income.jsx
│   │   ├── Expenses.jsx
│   │   ├── Goals.jsx
│   │   ├── Analytics.jsx
│   │   ├── Insurance.jsx
│   │   ├── TaxTools.jsx
│   │   ├── Receipts.jsx
│   │   ├── Export.jsx
│   │   ├── Settings.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── store/           # Zustand state management
│   │   ├── authStore.js
│   │   ├── financeStore.js
│   │   └── themeStore.js
│   ├── config/          # Configuration files
│   │   └── supabase.js
│   ├── utils/           # Utility functions
│   │   └── security.js
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── .env                 # Environment variables (not committed)
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
├── index.html           # HTML template with security headers
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write clear commit messages
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Supabase** - For the amazing backend-as-a-service platform
- **Vite** - For the lightning-fast build tool
- **Zustand** - For the simple state management
- **Lucide** - For the beautiful icon library
- **Recharts** - For the data visualization
- **React Community** - For the excellent ecosystem

---

<div align="center">

**Made with ❤️ for the gig economy community**

[⬆ Back to Top](#-gig-economy-finance-tracker)

</div>
