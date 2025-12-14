# GIG ECONOMY - Financial Wellness for Gig Workers

A cross-platform mobile and desktop application built with React Native + Expo, designed to help gig economy workers manage their finances, calculate taxes, track savings, and plan for insurance.

## ✨ Features

- 💰 **Smart Savings Tracking** - Big, bold display of total savings
- 🧮 **Tax Calculator** - Automated quarterly tax estimations
- 🏥 **Insurance Planning** - Income-based insurance recommendations
- 🎯 **Savings Goals** - Custom goals (Bali trip, emergency fund, etc.)
- 🏦 **Bank Integration** - Optional automatic syncing with Plaid
- 📊 **Financial Reports** - Visualize income, expenses, and trends
- 🔐 **Biometric Auth** - Fingerprint/Face ID login
- 🌓 **Dark/Light Mode** - Glassmorphism design with theme toggle
- 📱 **Cross-Platform** - iOS, Android, and Web from one codebase

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gig-economy-app

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Add your Supabase credentials to .env
# REQUIRED: Get these from https://supabase.com/dashboard
# SUPABASE_URL=https://your-project-id.supabase.co
# SUPABASE_ANON_KEY=your-anon-key-here

# Run the app
npm start
```

### Run on Different Platforms

```bash
# Web (Desktop)
npm run web

# iOS (Mac only)
npm run ios

# Android
npm run android
```

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in Supabase Dashboard
3. Copy and paste contents of `supabase/schema.sql`
4. Click "Run" to create all tables and policies

## 📖 Documentation

- **[BUILD_GUIDE.md](./BUILD_GUIDE.md)** - Complete tech stack and architecture
- **[SECURITY.md](./SECURITY.md)** - Security features and best practices
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference guide

## 🛠️ Tech Stack

### Core
- **React Native** (v0.74) + **Expo** (v51)
- **Supabase** - Backend, Database, Auth
- **React Navigation** (v6) - Navigation
- **Zustand** (v4) - State management
- **React Query** (v5) - Server state

### UI/UX
- **NativeBase** - UI components
- **Expo Linear Gradient** - Gradients
- **Expo Blur** - Glassmorphism effects
- **React Native Chart Kit** - Charts

### Mobile Features
- **expo-local-authentication** - Biometric auth
- **expo-secure-store** - Encrypted storage
- **expo-camera** - Receipt scanning
- **expo-notifications** - Push notifications

### Banking (Optional)
- **Plaid** - Bank account linking

## 📁 Project Structure

```
gig-economy-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens
│   ├── navigation/      # Navigation setup
│   ├── store/          # State management (Zustand)
│   ├── theme/          # Colors, typography, spacing
│   └── config/         # App configuration
├── assets/             # Images, icons, fonts
├── supabase/          # Database schema
└── BUILD_GUIDE.md     # Detailed documentation
```

## 🎨 Design

- **Glassmorphism** - Modern blur effects and transparency
- **Inspired by** - Professional, minimalist aesthetic from reference design
- **Color Palette** - Earthy tones with vibrant accents
- **Typography** - Avenir (headings) + Helvetica (body)
- **Responsive** - Adapts to mobile, tablet, and desktop screens

## 🔐 Security

### Authentication
- **Strong Password Requirements**: 8+ characters with uppercase, lowercase, numbers, and special characters
- **Rate Limiting**: 5 login attempts per 5 minutes to prevent brute force attacks
- **Biometric Authentication**: Face ID/Touch ID/Fingerprint support
- **Secure Storage**: Encrypted credential storage via Expo SecureStore

### Data Protection
- **Row Level Security (RLS)**: All Supabase tables protected at database level
- **Input Sanitization**: All user inputs sanitized to prevent XSS/SQL injection
- **HTTPS Enforcement**: Production mode requires secure connections
- **Generic Error Messages**: Auth failures don't reveal system information

### Banking
- **Plaid Integration**: OAuth 2.0 secured bank connections
- **Token Security**: Bank tokens should be encrypted (see SECURITY.md)

📖 **Full Security Documentation**: See [SECURITY.md](./SECURITY.md) for complete details

## 🚢 Deployment

### Mobile
```bash
# Build for iOS/Android
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

### Web
```bash
# Deploy to Vercel
npm run build:web
vercel deploy
```

## 🐛 Troubleshooting

### "Unable to resolve module"
```bash
npm install
npm start --reset-cache
```

### Supabase connection error
- Check `.env` file has correct credentials
- Verify Supabase project is active (not paused)

### Biometric auth not working
- iOS: Enable Face ID in Simulator settings
- Android: Set up fingerprint in emulator

## 📝 License

MIT

## 👨‍💻 Author

Built for the gig economy community

---

**Need help?** Check [BUILD_GUIDE.md](./BUILD_GUIDE.md) for detailed documentation.
