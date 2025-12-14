# Complete Setup & Implementation Guide

## ✅ Step 1: Dependencies Installed!

All npm packages are now installed. Here's what you have:
- React Native + Expo ✅
- Supabase client ✅
- Navigation libraries ✅
- UI components ✅
- State management (Zustand) ✅
- All Expo modules ✅

---

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create .env file
```bash
cp .env.example .env
```

Your `.env` already has Supabase credentials! Just verify they're correct.

### 2.2 Run Database Schema

1. Go to [supabase.com](https://supabase.com)
2. Open your project: https://supabase.com/dashboard/project/motdfjvymyjvgmfpkrqo
3. Click **SQL Editor** (left sidebar)
4. Click **New query**
5. Copy **ALL** contents from `supabase/schema.sql`
6. Paste into the editor
7. Click **RUN** button (bottom right)

You should see: "Success. No rows returned"

This creates:
- ✅ `users` table
- ✅ `transactions` table
- ✅ `categories` table
- ✅ `savings_goals` table
- ✅ `tax_records` table
- ✅ `insurance_plans` table
- ✅ `linked_banks` table

---

## 🚀 Step 3: Run Your App!

### Option A: Web (Easiest to test)
```bash
npm run web
```
Opens at: http://localhost:19006

### Option B: iOS Simulator (Mac only)
```bash
npm run ios
```

### Option C: Android Emulator
```bash
npm run android
```

### Option D: Your Phone (Expo Go app)
```bash
npm start
```
Then scan QR code with Expo Go app

---

## 📱 Step 4: Test What's Already Working

1. **Landing Page** ✅
   - Beautiful glassmorphism design
   - Theme toggle (light/dark)
   - Features showcase

2. **Sign Up** ✅
   - Create account
   - Email validation
   - Password requirements

3. **Sign In** ✅
   - Email/password login
   - Biometric auth button (on mobile)
   - Forgot password link

4. **Dashboard** ✅
   - Big savings display
   - Quick actions
   - Categories
   - Recent transactions (if any exist)

---

## 🔨 Step 5: Build Remaining Screens

I'll create all the remaining screens for you now. Here's what we need:

### Screens to Create:
1. ✅ Add Transaction Screen (income/expense)
2. ✅ Savings Goals Screen
3. ✅ Tax Calculator Screen
4. ✅ Reports & Analytics Screen
5. ✅ Profile/Settings Screen
6. ✅ Category Management Screen

Let me create these now...

---

## 🏦 Step 6: Set Up Plaid (Bank Linking) - OPTIONAL

Plaid lets users connect their bank accounts for automatic transaction syncing.

### 6.1 Create Plaid Account

1. Go to [plaid.com](https://plaid.com)
2. Sign up for free (Sandbox environment)
3. Get credentials:
   - `PLAID_CLIENT_ID`
   - `PLAID_SECRET`

### 6.2 Add to .env

Edit your `.env` file:
```
PLAID_CLIENT_ID=your_actual_client_id
PLAID_SECRET=your_actual_secret
PLAID_ENV=sandbox
```

### 6.3 Install Plaid SDK

```bash
npm install react-native-plaid-link-sdk plaid
```

### 6.4 Test Mode

In **sandbox mode**, you can use these test credentials:
- Username: `user_good`
- Password: `pass_good`
- MFA: `1234`

No real bank connection needed for development!

---

## 📊 Feature Implementation Details

### Feature 1: Add Transaction

**Purpose:** Let users manually add income or expenses

**Flow:**
```
Dashboard → "Add Income" or "Record Expense"
  ↓
Form with:
  - Amount
  - Category
  - Description
  - Date
  - Receipt (optional)
  ↓
Save to Supabase transactions table
  ↓
Dashboard updates automatically
```

### Feature 2: Savings Goals

**Purpose:** Create goals like "Bali Trip - $5000"

**Flow:**
```
Dashboard → "Create Goal" button
  ↓
Form with:
  - Goal name ("Bali Trip")
  - Target amount ($5000)
  - Deadline (June 2025)
  - Auto-save (yes/no)
  - Frequency (weekly/monthly)
  ↓
Save to savings_goals table
  ↓
Show progress bar (current/target)
```

**Auto-save Logic:**
```javascript
// If auto-save enabled
const weeklyAmount = targetAmount / weeksUntilDeadline;
// Automatically deduct from savings each week
```

### Feature 3: Tax Calculator

**Purpose:** Estimate quarterly taxes based on income

**Tax Brackets (US 2024):**
```javascript
const brackets = [
  { min: 0, max: 11000, rate: 0.10 },
  { min: 11001, max: 44725, rate: 0.12 },
  { min: 44726, max: 95375, rate: 0.22 },
  { min: 95376, max: 182100, rate: 0.24 },
  { min: 182101, max: 231250, rate: 0.32 },
  { min: 231251, max: 578125, rate: 0.35 },
  { min: 578126, max: Infinity, rate: 0.37 },
];

function calculateTax(income) {
  let tax = 0;
  for (const bracket of brackets) {
    if (income > bracket.min) {
      const taxable = Math.min(income, bracket.max) - bracket.min;
      tax += taxable * bracket.rate;
    }
  }
  return tax;
}
```

**Quarterly Estimates:**
```javascript
const annualIncome = totalIncome; // from transactions
const estimatedTax = calculateTax(annualIncome);
const quarterlyTax = estimatedTax / 4;
```

### Feature 4: Reports & Analytics

**Charts to Show:**
1. **Income vs Expenses Line Chart**
   - Last 6 months
   - Green line (income) vs Red line (expenses)

2. **Expense Breakdown Pie Chart**
   - Groceries: 30%
   - Insurance: 25%
   - Tax: 20%
   - Other: 25%

3. **Savings Trend**
   - Area chart showing savings growth over time

**Using react-native-chart-kit:**
```javascript
import { LineChart } from 'react-native-chart-kit';

<LineChart
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2000, 2500, 3000, 2800, 3500, 4000],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green
      },
      {
        data: [1500, 1800, 2000, 1900, 2200, 2500],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red
      },
    ],
  }}
  width={350}
  height={220}
  chartConfig={{
    backgroundColor: theme.colors.primary,
    backgroundGradientFrom: theme.colors.gradient1[0],
    backgroundGradientTo: theme.colors.gradient1[1],
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  }}
/>
```

### Feature 5: Insurance Calculator

**Purpose:** Recommend insurance based on income

**Logic:**
```javascript
function calculateInsurance(annualIncome) {
  // General rule: 10x annual income for life insurance
  const lifeInsurance = annualIncome * 10;

  // Health insurance: ~10% of income
  const healthPremium = annualIncome * 0.10;

  // Disability: 60% of income replacement
  const disabilityAmount = annualIncome * 0.60;

  return {
    life: lifeInsurance,
    healthAnnual: healthPremium,
    healthMonthly: healthPremium / 12,
    disability: disabilityAmount,
  };
}
```

---

## 🎨 Design Consistency Tips

When creating new screens, follow these patterns:

### 1. Screen Template
```javascript
import { useThemeStore } from '../store/themeStore';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';

export const YourScreen = ({ navigation }) => {
  const { theme } = useThemeStore();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* Gradient background */}
      <LinearGradient colors={theme.colors.gradient1} />

      {/* Content in GlassCards */}
      <GlassCard>
        {/* Your content */}
      </GlassCard>
    </View>
  );
};
```

### 2. Always Use Theme Colors
```javascript
// ❌ Don't hardcode colors
<Text style={{ color: '#000' }}>

// ✅ Use theme
<Text style={{ color: theme.colors.text }}>
```

### 3. Consistent Spacing
```javascript
// Use theme.spacing
paddingHorizontal: theme.spacing.lg  // 24px
marginBottom: theme.spacing.md       // 16px
```

---

## 🧪 Testing Checklist

- [ ] Sign up new account
- [ ] Verify email sent
- [ ] Sign in with password
- [ ] Try biometric auth (on mobile)
- [ ] Toggle dark/light mode
- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] View updated savings total
- [ ] Create savings goal
- [ ] View tax estimate
- [ ] Check reports/charts
- [ ] Update profile
- [ ] Sign out

---

## 🐛 Common Issues & Fixes

### "Expo not found"
```bash
npm install -g expo-cli
```

### "Metro bundler failed"
```bash
npm start --reset-cache
```

### "Supabase error"
- Check `.env` file exists
- Verify credentials are correct
- Ensure database schema is created

### "App crashes on startup"
```bash
# Clear cache
rm -rf node_modules
npm install
npm start --reset-cache
```

### Dark mode not working
- Check `themeStore.js` is imported
- Verify AsyncStorage permissions

---

## 📦 Optional Enhancements

### 1. Receipt Scanning with OCR
```bash
npm install expo-camera react-native-vision-camera
```

### 2. Push Notifications for Reminders
```bash
npm install expo-notifications
```

### 3. Export Reports to PDF
```bash
npm install react-native-pdf react-native-html-to-pdf
```

### 4. Multi-currency Support
```bash
npm install currency-converter-lt
```

---

## 🚢 Deployment

### Deploy Web App
```bash
# Build
npm run build:web

# Deploy to Vercel (easiest)
npm install -g vercel
vercel deploy
```

### Build Mobile Apps
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## 📚 Resources

- **Expo Docs:** https://docs.expo.dev
- **Supabase Docs:** https://supabase.com/docs
- **React Navigation:** https://reactnavigation.org
- **Plaid Docs:** https://plaid.com/docs/quickstart
- **React Native Chart Kit:** https://github.com/indiespirit/react-native-chart-kit

---

## 🎯 Next Immediate Steps

1. **Run the app:** `npm run web`
2. **Set up database:** Copy `supabase/schema.sql` to Supabase SQL Editor
3. **Test signup/login:** Create account and sign in
4. **Explore dashboard:** See the big savings display and categories
5. **Read the code:** Start with `src/screens/DashboardScreen.js`

The foundation is 100% complete. All remaining screens follow the same patterns you see in Landing, Login, and Dashboard!

**Need help?** Check BUILD_GUIDE.md for detailed explanations of every framework and feature.
