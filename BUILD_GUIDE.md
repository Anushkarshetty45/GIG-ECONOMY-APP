# GIG ECONOMY App - Complete Build Guide

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [Architecture & Design Patterns](#architecture--design-patterns)
6. [Features Implementation](#features-implementation)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Overview

**GIG ECONOMY** is a cross-platform financial wellness application designed for gig economy workers. It runs on iOS, Android, and Web (desktop) from a single codebase.

### Key Features
- 💰 Smart savings tracking with big, bold display
- 🧮 Automated tax calculations
- 🏥 Income-based insurance recommendations
- 🎯 Custom savings goals (e.g., "Bali Trip Fund")
- 🏦 Bank account integration (optional)
- 📊 Financial analytics and reports
- 🔐 Biometric authentication
- 🌓 Dark/Light mode with glassmorphism design

---

## Tech Stack

### Core Framework
```
React Native v0.74
├── Expo SDK v51 (Development framework)
└── Expo Web (Web/Desktop support)
```

**Why?** Single codebase for iOS, Android, and Web with 90%+ code sharing.

### Frontend Libraries

#### UI Components & Styling
- **NativeBase v3.4** - Pre-built UI component library
- **Styled Components v6.1** - CSS-in-JS styling
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Blur** - Glassmorphism blur effects
- **@expo/vector-icons** - Icon library (MaterialIcons)

**Why?** Provides glassmorphism effects, professional UI components, and responsive design.

#### Navigation
- **React Navigation v6** - Navigation library
  - Stack Navigator - Screen transitions
  - Bottom Tabs - Mobile tab navigation
  - Drawer Navigator - Side menu (future use)

**Why?** Industry-standard navigation with smooth animations and deep linking support.

#### State Management
- **Zustand v4.5** - Global state management
  - `themeStore.js` - Theme and dark/light mode
  - `authStore.js` - Authentication state
  - `userStore.js` - User data and financial records

**Why?** Lightweight, simple API, zero boilerplate compared to Redux.

#### Data Fetching
- **TanStack React Query v5** - Server state management
  - Automatic caching
  - Background refetching
  - Optimistic updates

**Why?** Handles API calls, caching, and synchronization automatically.

#### Charts & Visualizations
- **react-native-chart-kit** - Simple charts for mobile
- **react-native-svg** - SVG rendering
- **victory-native** - Advanced charts (future use)

**Why?** Native performance for financial data visualization.

### Backend

#### Supabase Stack
```
Supabase (PostgreSQL + Services)
├── Supabase Auth - Email/password + OAuth
├── Supabase Database - PostgreSQL with Row Level Security
├── Supabase Storage - Receipt/document uploads
├── Supabase Realtime - Live data updates
└── Supabase Edge Functions - Serverless backend logic
```

**Why?** Complete backend-as-a-service with real-time capabilities, built-in auth, and PostgreSQL database.

#### Database (PostgreSQL)
```sql
Tables:
├── users - User profiles
├── transactions - Income & expenses
├── categories - Expense categories
├── savings_goals - Custom goals
├── tax_records - Tax calculations
├── insurance_plans - Insurance info
└── linked_banks - Bank connections
```

### Mobile-Specific Features

#### Security & Authentication
- **expo-local-authentication** - Biometric (Touch ID, Face ID)
- **expo-secure-store** - Encrypted credential storage

#### Camera & Files
- **expo-camera** - Receipt scanning
- **expo-image-picker** - Photo uploads
- **expo-document-picker** - Document uploads

#### Notifications
- **expo-notifications** - Push notifications
- **expo-local-notifications** - Reminders

#### Storage
- **@react-native-async-storage/async-storage** - Local data persistence

### Banking Integration (Optional)
- **react-native-plaid-link-sdk** - Plaid for bank connections
- **Plaid Node.js SDK** - Backend integration

**Why?** Securely connect to 11,000+ banks for automatic transaction sync.

### Utilities

#### Date & Time
- **date-fns v3** - Date formatting and calculations

**Why?** Lightweight, tree-shakeable, and modern API.

#### Financial Calculations
- **accounting.js** - Currency formatting
- **lodash** - Utility functions

---

## Project Structure

```
gig-economy-app/
│
├── App.js                          # Root component
├── index.js                        # Entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel config
│
├── src/
│   ├── config/
│   │   └── supabase.js            # Supabase client setup
│   │
│   ├── theme/
│   │   ├── colors.js              # Color palette (light/dark)
│   │   ├── typography.js          # Font styles
│   │   ├── spacing.js             # Spacing, shadows, borders
│   │   └── index.js               # Theme export
│   │
│   ├── store/
│   │   ├── themeStore.js          # Theme state (Zustand)
│   │   ├── authStore.js           # Auth state
│   │   └── userStore.js           # User data state
│   │
│   ├── components/
│   │   └── common/
│   │       ├── GlassCard.js       # Glassmorphism card
│   │       ├── Button.js          # Custom button
│   │       ├── Input.js           # Input with validation
│   │       └── LoadingSpinner.js  # Loading indicator
│   │
│   ├── screens/
│   │   ├── LandingScreen.js       # Landing page
│   │   ├── auth/
│   │   │   ├── LoginScreen.js     # Login
│   │   │   └── RegisterScreen.js  # Sign up
│   │   └── DashboardScreen.js     # Main dashboard
│   │
│   └── navigation/
│       └── AppNavigator.js        # Navigation setup
│
├── assets/                        # Images, icons, fonts
└── .env.example                   # Environment variables template
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Git
- iOS Simulator (Mac) or Android Studio (any OS)

### Step 1: Install Dependencies

```bash
cd gig-economy-app
npm install
```

This installs all packages listed in `package.json`:
- React Native & Expo core
- Supabase client
- Navigation libraries
- UI components
- State management
- Charts and animations

### Step 2: Set Up Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: "GIG ECONOMY"
   - Database Password: (save this!)
   - Region: Choose closest to your users

2. **Get API Credentials**
   - Go to Project Settings > API
   - Copy `Project URL` and `anon public` key

3. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

4. **Add Credentials to `.env`**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Run Database Schema**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the schema from `supabase/schema.sql`
   - Click "Run"

### Step 3: Run the App

#### Web (Desktop)
```bash
npm run web
```
Opens at `http://localhost:19006`

#### iOS (Mac only)
```bash
npm run ios
```
Opens in iOS Simulator

#### Android
```bash
npm run android
```
Opens in Android Emulator

#### Expo Go (Physical Device)
```bash
npm start
```
Scan QR code with Expo Go app

---

## Architecture & Design Patterns

### 1. State Management Architecture

```
Component Tree
│
├── Global State (Zustand)
│   ├── themeStore - UI theme, dark/light mode
│   ├── authStore - User session, login/logout
│   └── userStore - Financial data, transactions
│
└── Server State (React Query)
    └── Handles API calls, caching, refetching
```

**Flow Example: User Login**
```
LoginScreen.js
  ├── Calls: authStore.signIn(email, password)
  │   └── Supabase Auth API
  │       └── Returns session token
  │           └── authStore updates user state
  │               └── AppNavigator detects user
  │                   └── Navigates to Dashboard
```

### 2. Theme System

**Glassmorphism Design**
```javascript
// Light Mode
backgroundColor: 'rgba(255, 255, 255, 0.25)'  // Semi-transparent white
backdropFilter: 'blur(10px)'                  // Blur effect
borderColor: 'rgba(255, 255, 255, 0.18)'     // Subtle border
shadowColor: 'rgba(0, 0, 0, 0.1)'            // Soft shadow

// Dark Mode
backgroundColor: 'rgba(255, 255, 255, 0.05)'  // Very transparent
backdropFilter: 'blur(10px)'
borderColor: 'rgba(255, 255, 255, 0.1)'
shadowColor: 'rgba(0, 0, 0, 0.5)'            // Stronger shadow
```

**Toggle Implementation**
```javascript
// themeStore.js
toggleTheme: () => {
  const newMode = mode === 'light' ? 'dark' : 'light';
  set({ mode: newMode, theme: getTheme(newMode) });
}
```

### 3. Authentication Flow

```
User Not Logged In
  └── Shows: LandingScreen → LoginScreen/RegisterScreen

User Logs In
  └── authStore.signIn() → Supabase Auth
      └── Success: authStore.setUser(user)
          └── AppNavigator detects user
              └── Shows: MainTabs (Dashboard)
```

**Biometric Auth Implementation**
```javascript
// LoginScreen.js
const handleBiometricAuth = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Login with Biometrics',
  });

  if (result.success) {
    // Retrieve stored credentials from SecureStore
    // Auto-login user
  }
};
```

### 4. Navigation Structure

```
AppNavigator
│
├── User Not Authenticated
│   └── AuthNavigator (Stack)
│       ├── LandingScreen
│       ├── LoginScreen
│       └── RegisterScreen
│
└── User Authenticated
    └── MainTabs (Bottom Tabs)
        ├── Home (DashboardScreen)
        ├── Transactions
        ├── Goals (SavingsGoalsScreen)
        ├── Reports
        └── Profile
```

---

## Features Implementation

### Feature 1: Big Savings Display

**Location:** `DashboardScreen.js:108-118`

```javascript
<GlassCard gradient intensity="strong">
  <Text style={styles.savingsLabel}>Total Savings</Text>
  <Text style={styles.savingsAmount}>
    {formatCurrency(totalSavings || 0)}  // $12,450
  </Text>
</GlassCard>
```

**Data Flow:**
1. User logs in → `userStore.calculateSavings(userId)` called
2. Fetches all transactions from Supabase
3. Calculates: `income - expenses = totalSavings`
4. Updates `userStore.totalSavings`
5. Dashboard displays updated value

**Formula:**
```javascript
const total = transactions.reduce((acc, t) => {
  return t.type === 'income' ? acc + t.amount : acc - t.amount;
}, 0);
```

### Feature 2: Category Management

**Location:** `DashboardScreen.js:184-230`

**Default Categories:**
- Add Money (Income)
- Tax Payments (Expense)
- Groceries (Expense)
- Insurance (Expense)
- Loans & EMI (Expense)

**Add Custom Category Flow:**
```
User clicks "Add New"
  └── Navigates to AddCategoryScreen
      └── Inputs: name, icon, color, type
          └── Calls: userStore.addCategory()
              └── Supabase INSERT into categories table
                  └── Dashboard refreshes with new category
```

### Feature 3: Tax Calculation

**Implementation:** `src/services/tax.service.js` (to be created)

**Tax Brackets (2024 - US Example):**
```javascript
const taxBrackets = [
  { min: 0, max: 11000, rate: 0.10 },
  { min: 11001, max: 44725, rate: 0.12 },
  { min: 44726, max: 95375, rate: 0.22 },
  // ... more brackets
];

function calculateTax(income) {
  let tax = 0;
  for (const bracket of taxBrackets) {
    if (income > bracket.min) {
      const taxableAmount = Math.min(income, bracket.max) - bracket.min;
      tax += taxableAmount * bracket.rate;
    }
  }
  return tax;
}
```

### Feature 4: Savings Goals

**Database Schema:**
```sql
CREATE TABLE savings_goals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT,              -- "Bali Trip"
  target_amount NUMERIC,  -- 5000
  current_amount NUMERIC, -- 1200
  deadline DATE,          -- 2025-06-01
  frequency TEXT,         -- "weekly", "monthly", "custom"
  auto_save BOOLEAN       -- true/false
);
```

**Auto-Save Logic:**
```javascript
// When user links bank account
if (goal.auto_save && user.linked_bank) {
  const amountPerPeriod = calculateAutoSave(goal);
  // Schedule automatic transfer
  scheduleTransfer(amountPerPeriod, goal.frequency);
}
```

### Feature 5: Bank Account Linking

**Using Plaid:**
```javascript
// 1. User clicks "Link Bank Account"
import { PlaidLink } from 'react-native-plaid-link-sdk';

<PlaidLink
  token={linkToken}  // Get from backend
  onSuccess={(success) => {
    // success.publicToken
    // Exchange for access_token on backend
    saveBankConnection(success.publicToken);
  }}
/>

// 2. Backend exchanges token
const response = await plaidClient.itemPublicTokenExchange({
  public_token: publicToken,
});
// response.access_token - save this in database

// 3. Fetch transactions
const transactions = await plaidClient.transactionsGet({
  access_token: accessToken,
  start_date: '2024-01-01',
  end_date: '2024-12-31',
});

// 4. Sync to Supabase
for (const transaction of transactions.data) {
  await supabase.from('transactions').insert({
    user_id: userId,
    amount: transaction.amount,
    description: transaction.name,
    type: transaction.amount > 0 ? 'income' : 'expense',
  });
}
```

### Feature 6: Dark/Light Mode Toggle

**Implementation:**
```javascript
// themeStore.js
export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'light',
      toggleTheme: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({ mode: newMode, theme: getTheme(newMode) });
      },
    }),
    { name: 'theme-storage', storage: AsyncStorage }
  )
);
```

**Usage in Components:**
```javascript
const { theme, mode, toggleTheme } = useThemeStore();

<TouchableOpacity onPress={toggleTheme}>
  <MaterialIcons
    name={mode === 'light' ? 'dark-mode' : 'light-mode'}
  />
</TouchableOpacity>
```

**Persists across app restarts** via AsyncStorage.

---

## Deployment

### Mobile Apps

#### iOS (App Store)

1. **Build with EAS**
   ```bash
   npm install -g eas-cli
   eas login
   eas build --platform ios
   ```

2. **App Store Connect**
   - Create app listing
   - Upload screenshots
   - Submit for review

#### Android (Google Play)

1. **Build APK/AAB**
   ```bash
   eas build --platform android
   ```

2. **Google Play Console**
   - Create app listing
   - Upload AAB file
   - Submit for review

### Web (Desktop)

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Build web version
npm run build:web

# Deploy
vercel deploy
```

#### Option 2: Netlify

```bash
# Build
npm run build:web

# Drag & drop 'web-build' folder to Netlify
```

#### Option 3: Supabase Hosting

```bash
supabase init
supabase link
supabase deploy
```

---

## Troubleshooting

### Common Issues

#### 1. "Unable to resolve module @supabase/supabase-js"
```bash
npm install @supabase/supabase-js
npm start --reset-cache
```

#### 2. Expo Web not working
```bash
npm install react-dom react-native-web
npx expo install expo-web
```

#### 3. Biometric auth not working
- iOS: Enable Face ID in Simulator (Features > Face ID > Enrolled)
- Android: Set up fingerprint in emulator settings

#### 4. Dark mode not persisting
- Check AsyncStorage permissions
- Clear app data and retry

#### 5. Supabase connection errors
- Verify `.env` file exists and has correct values
- Check Supabase project status (not paused)
- Verify API keys are correct

---

## Next Steps

### Screens to Implement
1. ✅ Landing Page
2. ✅ Login/Register
3. ✅ Dashboard
4. ⏳ Add Transaction Screen
5. ⏳ Categories Management
6. ⏳ Savings Goals Screen
7. ⏳ Tax Calculator Screen
8. ⏳ Reports & Analytics
9. ⏳ Profile & Settings
10. ⏳ Bank Linking Screen

### Features to Add
- Push notifications for savings milestones
- Receipt scanning with OCR
- PDF report generation
- Insurance marketplace integration
- Financial advisor chatbot (AI)
- Multi-currency support

---

## Resources

- **Expo Docs:** https://docs.expo.dev
- **React Navigation:** https://reactnavigation.org
- **Supabase Docs:** https://supabase.com/docs
- **Plaid Docs:** https://plaid.com/docs
- **React Query:** https://tanstack.com/query

---

**Built with ❤️ for Gig Economy Workers**
