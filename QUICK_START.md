# 🚀 Quick Start Guide - GIG ECONOMY App

## ✅ What's Complete

### Dependencies
- ✅ **All npm packages installed** (1390 packages)
- ✅ React Native + Expo configured
- ✅ Supabase client ready
- ✅ Navigation, UI components, state management

### Screens Built
- ✅ **Landing Page** - Beautiful glassmorphism design with theme toggle
- ✅ **Login Screen** - Email/password + biometric auth support
- ✅ **Register Screen** - Full validation and email verification
- ✅ **Dashboard** - Main screen with:
  - Big bold savings display ($XX,XXX)
  - Quick action buttons
  - Category cards with icons
  - Recent transactions list
- ✅ **Add Transaction** - Add income or expense with categories
- ✅ **Savings Goals** - Create and track savings goals
  - Progress bars
  - Deadline tracking
  - Auto-save options

### Backend Ready
- ✅ Supabase configuration
- ✅ Complete database schema (7 tables)
- ✅ Row Level Security policies
- ✅ Auto-create user profile on signup

---

## 🏃‍♂️ Run Your App in 3 Steps

### Step 1: Set Up Database

1. Go to your Supabase dashboard:
   https://supabase.com/dashboard/project/motdfjvymyjvgmfpkrqo

2. Click **SQL Editor** (left sidebar)

3. Copy the entire contents of:
   `supabase/schema.sql`

4. Paste into SQL Editor

5. Click **RUN**

You should see: "Success. No rows returned"

### Step 2: Create .env file

```bash
cp .env.example .env
```

Your credentials are already in `.env.example` - they'll be copied over!

### Step 3: Start the App

Choose your platform:

```bash
# Web (easiest for testing)
npm run web
# Opens at http://localhost:19006

# iOS (Mac only, requires Xcode)
npm run ios

# Android (requires Android Studio)
npm run android

# Mobile device (install Expo Go app first)
npm start
# Scan QR code with Expo Go
```

---

## 🧪 Test the App

### 1. Test Flow on Web

```bash
npm run web
```

Then:

1. **Landing Page** loads
   - See glassmorphism design
   - Toggle dark/light mode (top right)

2. **Click "Get Started"** → Register page
   - Enter name, email, password
   - Password must be 6+ characters
   - Click "Create Account"

3. **Check your email**
   - Supabase sends verification email
   - (For testing, you can skip and login anyway)

4. **Sign In**
   - Use the email/password you just created
   - Click "Sign In"

5. **Dashboard loads**
   - See "Total Savings: $0.00" (big and bold!)
   - See category cards
   - Click "Add Income"

6. **Add Transaction**
   - Enter amount: 1000
   - Description: "Freelance project"
   - Click category (or skip)
   - Click "Add Income"

7. **Back to Dashboard**
   - Savings now shows $1,000.00!
   - Transaction appears in recent activity

8. **Try Savings Goal**
   - Click bottom tab "Goals"
   - Click + button
   - Name: "Bali Trip"
   - Target: $5000
   - Click "Create Goal"
   - See progress bar (20% complete)

---

## 📱 Features You Can Test Now

### ✅ Working Features

| Feature | How to Test |
|---------|-------------|
| Sign Up | Landing → Get Started → Fill form |
| Sign In | Landing → Sign In → Email/password |
| Dark/Light Mode | Click moon/sun icon (top right) |
| Add Income | Dashboard → Add Income → Fill form |
| Add Expense | Dashboard → Record Expense → Fill form |
| View Savings | Dashboard → See big number update |
| Categories | Dashboard → See category cards |
| Create Goal | Goals tab → + button → Fill form |
| View Goals | Goals tab → See progress bars |
| Theme Persistence | Toggle theme, refresh app, theme persists |

### ⏳ Coming Soon

- Reports & Analytics (charts)
- Tax Calculator
- Profile/Settings
- Bank Linking (Plaid)
- Receipt Scanning
- Export Reports

---

## 🎨 Customize Your App

### Change Color Scheme

Edit `src/theme/colors.js`:

```javascript
// Change primary color
primary: '#6366f1',  // Change to any hex color

// Change gradient
gradient1: ['#6366f1', '#8b5cf6'],  // Your colors here
```

### Change App Name

Edit `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Add More Categories

Dashboard → Click category card → Manage → Add New

Or manually in database:
```sql
INSERT INTO categories (user_id, name, icon, color, type)
VALUES ('your-user-id', 'Rent', 'home', '#ef4444', 'expense');
```

---

## 🐛 Troubleshooting

### App Won't Start

```bash
# Clear cache and restart
rm -rf node_modules
npm install
npm start --reset-cache
```

### "Supabase error" / Can't login

1. Check `.env` file exists
2. Verify credentials in `.env` match your Supabase project
3. Ensure database schema was run (Step 1 above)
4. Check Supabase project isn't paused (free tier)

### White screen on web

```bash
# Install web dependencies
npm install react-dom react-native-web
npm run web
```

### Changes not showing

```bash
# Clear Metro bundler cache
npm start --reset-cache
```

### TypeScript errors (if using TS)

We're using JavaScript, so ignore TS warnings. If you want TypeScript:
```bash
npm install --save-dev typescript @types/react @types/react-native
```

---

## 📖 Learn the Code

### Start Here

1. **App.js** - Entry point, sets up providers
2. **src/navigation/AppNavigator.js** - Navigation logic
3. **src/screens/DashboardScreen.js** - Main screen
4. **src/store/userStore.js** - Data management
5. **src/theme/colors.js** - Theme customization

### Key Patterns

**Adding a new screen:**
```javascript
// 1. Create screen file
src/screens/YourScreen.js

// 2. Import in AppNavigator.js
import { YourScreen } from '../screens/YourScreen';

// 3. Add to Stack
<Stack.Screen name="Your" component={YourScreen} />

// 4. Navigate to it
navigation.navigate('Your');
```

**Using theme:**
```javascript
const { theme } = useThemeStore();

<Text style={{ color: theme.colors.text }}>
```

**Calling Supabase:**
```javascript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', user.id);
```

---

## 📚 Documentation

- **SETUP_GUIDE.md** - Detailed feature implementation guide
- **BUILD_GUIDE.md** - Complete framework documentation
- **README.md** - Project overview
- **supabase/schema.sql** - Database structure

---

## 🎯 Next Steps

1. **Run the app** (Step 3 above)
2. **Test signup/login**
3. **Add income/expense**
4. **Create a savings goal**
5. **Toggle dark mode**
6. **Read the code** (start with DashboardScreen.js)

---

## 🆘 Need Help?

1. Check **troubleshooting** section above
2. Read **BUILD_GUIDE.md** for detailed explanations
3. Check **SETUP_GUIDE.md** for implementation details
4. Review code comments in screens

---

## 🎉 You're Ready!

Your app is complete and ready to run. All the hard work is done:
- ✅ Dependencies installed
- ✅ Configuration files ready
- ✅ Database schema created
- ✅ Core screens built
- ✅ Navigation working
- ✅ Theme system active
- ✅ State management configured

Just run `npm run web` and start testing!

---

**Built with React Native + Expo + Supabase**
