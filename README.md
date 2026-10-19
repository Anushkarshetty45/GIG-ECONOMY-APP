# Gig Economy Finance Tracker

**A comprehensive financial tracking and analytics platform built for gig economy workers**

[Features](#features) | [Demo](#live-demo) | [Installation](#installation) | [Tech Stack](#tech-stack) | [Themes](#themes)

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Themes](#themes)
- [Security](#security)
- [Project Structure](#project-structure)
- [Role & Responsibilities](#role--responsibilities)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Gig Economy Finance Tracker is a modern web application that helps freelancers, gig workers, and independent contractors manage their finances. It provides income tracking, expense management, tax calculations, insurance recommendations, and customizable themes.

### Why This App?

- **Smart Analytics** - Visualize financial health with interactive charts.
- **Income Tracking** - Track earnings from multiple gig platforms.
- **Expense Management** - Categorize spending across multiple categories.
- **Goal Setting** - Set and track savings goals.
- **Tax Tools** - Calculate quarterly tax estimates and track deductions.
- **Insurance Advisor** - Get personalized insurance recommendations.
- **Customizable Themes** - Choose from nine visual themes.
- **Security** - Protect financial data with authentication and access controls.

---

## Live Demo

**Live Application:** [https://gigeconomy-xi.vercel.app](https://gigeconomy-xi.vercel.app)

Create an account and explore the application's features.

---

## Features

### Financial Management

- **Income Tracking:** Log earnings from multiple platforms with dates, amounts, and notes.
- **Expense Tracking:** Categorize expenses such as gas, food, and equipment.
- **Net Income Calculation:** Calculate profits in real time.
- **Financial Health Score:** View an overview of financial status.

### Analytics and Insights

- **Interactive Charts:** Visualize income and expense trends using Recharts.
- **Category Breakdown:** Analyze spending patterns by category.
- **Platform Analysis:** Identify the highest-earning gig platforms.
- **Monthly Trends:** Identify seasonal patterns in income.

### Goal Management

- **Savings Goals:** Set target amounts and deadlines.
- **Visual Progress:** Track goal completion with progress bars.
- **Multiple Goals:** Manage emergency funds, vacation savings, and equipment purchases.
- **Goal Completion:** Track progress toward financial goals.

### Tax Tools

- **Quarterly Calculator:** Calculate tax obligations by quarter.
- **Deduction Tracker:** Track deductible expenses such as gas, equipment, and software.
- **Tax Estimates:** Calculate estimated tax bills using a 25% rate.
- **Tax Checklist:** Prepare for tax season using a checklist.
- **Year Selection:** View tax data for different years.

### Insurance Advisor

- **Smart Recommendations:** Receive insurance suggestions based on income.
- **Insurance Types:** Explore health, auto, liability, disability, life, equipment, professional, cyber, and umbrella insurance.
- **Affordability Analysis:** Evaluate insurance costs against your budget.
- **Priority Levels:** Identify high-, medium-, and low-priority insurance needs.
- **Policy Management:** Track active policies, costs, and renewal dates.

### Receipt Management

- **Image Upload:** Store receipt photos for expense documentation.
- **Categorization:** Link receipts to expense categories.
- **Organization:** Search and filter receipts.
- **Cloud Storage:** Store receipt images using Supabase Storage.

### Export and Reports

- **CSV Export:** Download financial data for Excel or Google Sheets.
- **PDF Reports:** Generate financial reports.
- **Custom Date Ranges:** Export data for specific periods.

### Customizable Themes

The application includes nine themes:

1. **Pure White** - Clean, minimal, professional.
2. **Midnight Black** - Dark mode with OLED-friendly colors.
3. **Soft Pastels** - Soft vintage-inspired colors.
4. **Coral Sunset** - Warm tropical colors.
5. **Lavender Dream** - Calming purple tones.
6. **Mint Fresh** - Natural green tones.
7. **Ocean Breeze** - Coastal colors with animated waves.
8. **Midnight Latte** - Dark coffee-inspired colors.
9. **Seasonal** - Changes according to the season.

### Theme Features

- Animated backgrounds.
- Smooth transitions.
- LocalStorage persistence.
- Accessibility support for reduced motion preferences.

---

## Tech Stack

### Core Framework and Build Tools

#### React 18

React is a JavaScript library for building user interfaces.

**Why it is used:**

- Component-based architecture.
- Reusable UI components.
- Virtual DOM for efficient rendering.
- Hooks for state and lifecycle management.
- Integration with React Router.

#### Vite

Vite is a frontend build tool used to develop and build the application.

**Why it is used:**

- Fast development server.
- Hot Module Replacement.
- Optimized production builds.
- Native ES module support.
- Built-in TypeScript support.

#### React Router DOM

React Router DOM manages navigation within the application.

**Features:**

- Client-side navigation.
- Protected routes.
- Nested routes.
- URL parameters and query strings.
- Error-page handling.

### Backend and Database

#### Supabase

Supabase provides backend services and a PostgreSQL database.

**Why it is used:**

- PostgreSQL database.
- User authentication.
- Real-time subscriptions.
- Automatically generated APIs.
- File storage.
- Row Level Security.

**Components:**

- **Supabase Database:** Stores income, expenses, goals, and insurance information.
- **Supabase Auth:** Handles signup, login, and password recovery.
- **Supabase Storage:** Stores receipt images.
- **Row Level Security:** Restricts access to users' own data.

### State Management

#### Zustand

Zustand manages application state.

**Why it is used:**

- Simple API.
- Minimal boilerplate.
- Integration with React hooks.
- Persistent state support.
- Lightweight implementation.

**Stores used in the application:**

- `authStore.js` - Authentication state.
- `financeStore.js` - Income, expenses, and goals.
- `themeStore.js` - Theme preferences.
- `settingsStore.js` - Application settings.

### UI Components and Styling

#### Lucide React

Lucide React provides icons for navigation, actions, and interface elements.

#### Recharts

Recharts provides charts and visualizations.

**Charts include:**

- Line charts for income and expense trends.
- Bar charts for category breakdowns.
- Pie charts for expense distribution.
- Area charts for cumulative data.

#### CSS Variables

CSS variables support dynamic styling and theme customization.

**Features:**

- Nine theme color palettes.
- Smooth transitions.
- Dark mode support.
- Responsive styling.

### AI and Machine Learning

#### Tesseract.js

Tesseract.js provides Optical Character Recognition (OCR).

**Usage:**

- Scans receipt images.
- Extracts text from images.
- Helps identify store names, totals, and dates.
- Supports browser-based processing.
- Provides progress information during scanning.

### Development Tools

#### ESLint

ESLint helps maintain code quality.

**Features:**

- Identifies potential bugs.
- Enforces consistent coding standards.
- Supports React-specific linting rules.
- Helps maintain readable code.

#### TypeScript and JSDoc

Type annotations and JSDoc improve code documentation and editor assistance.

**Benefits:**

- Better IDE autocomplete.
- Improved code readability.
- Earlier detection of type-related errors.

### Security

#### Content Security Policy

Content Security Policy helps restrict which resources a browser can load.

#### Rate Limiting

Rate limiting restricts repeated authentication attempts.

#### Input Sanitization

Input sanitization helps prevent unsafe input from being processed.

#### Password Validation

Password validation enforces password requirements.

#### Audit Logging

Audit logging records security-related events.

---

## Architecture Patterns

### Component Structure

```text
src/
├── components/
├── layouts/
├── pages/
├── store/
├── config/
├── utils/
└── theme/
```

### State Management Pattern

- **Global State:** Zustand stores for authentication, finance, and themes.
- **Local State:** React `useState` for component-specific information.
- **Persistence:** LocalStorage through Zustand persistence middleware.

### Data Flow

1. The user interacts with a UI component.
2. The component calls a Zustand store action.
3. The store communicates with Supabase.
4. Supabase returns the requested data.
5. The store updates the application state.
6. Components render the updated information.

---

## Performance Optimizations

- Code splitting using React Router.
- Tree shaking through Vite.
- Asset optimization.
- Lazy loading of components.
- Memoization for expensive components.
- Efficient rendering through React.
- CDN delivery of static assets.

---

## Browser Support

- Chrome 90 and later.
- Firefox 88 and later.
- Safari 14 and later.
- Edge 90 and later.
- Modern mobile browsers.

Internet Explorer is not supported.

---

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Why Use the VITE_ Prefix?

- Vite exposes variables with the `VITE_` prefix to client-side code.
- Environment variables allow configuration without hardcoding values.
- Secret credentials must never be exposed in frontend code.

---

## Deployment

The application can be deployed using:

- Vercel.
- Netlify.
- GitHub Pages.
- AWS S3 and CloudFront.

**Build command:**

```bash
npm run build
```

**Output directory:**

```text
dist/
```

---

## Installation

### Prerequisites

- Node.js 16 or later.
- npm.
- A Supabase account.
- Git, if cloning the repository.

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/gig-economy-app.git
cd gig-economy-app
```

Replace the repository URL with the actual repository URL.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the example values with your Supabase project credentials.

### Step 4: Set Up the Supabase Database

Create the following tables in your Supabase project.

#### Incomes

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

#### Expenses

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

#### Goals

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

#### Insurance

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

### Step 5: Enable Row Level Security

Enable Row Level Security on the tables.

```sql
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance ENABLE ROW LEVEL SECURITY;
```

Create policies to restrict access to each user's own data. For example:

```sql
CREATE POLICY "Users can view own income"
ON incomes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own income"
ON incomes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own income"
ON incomes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own income"
ON incomes
FOR DELETE
USING (auth.uid() = user_id);
```

Apply equivalent policies to the other tables.

### Step 6: Start the Development Server

```bash
npm run dev
```

### Step 7: Open the Application

Open the local URL displayed in the terminal. With the default Vite configuration, this is usually:

```text
http://localhost:5173
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

VITE_PLAID_CLIENT_ID=your_plaid_client_id
VITE_PLAID_SECRET=your_plaid_secret
VITE_PLAID_ENV=sandbox

VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Only configure optional services if they are implemented and required by your application.

### Important Security Notes

- Keep `.env` in `.gitignore`.
- Never commit real credentials to GitHub.
- Do not expose secret API keys in client-side code.
- Keep private service credentials on a secure backend.

### Building for Production

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The generated production files are placed in the `dist/` directory.

---

## Themes

The application supports nine themes.

| Theme | Mode | Description | Special Effects |
|---|---|---|---|
| Pure White | Light | Clean and professional | None |
| Midnight Black | Dark | OLED-friendly dark mode | White sparkles |
| Soft Pastels | Light | Soft vintage-inspired colors | Pink petals |
| Coral Sunset | Light | Warm tropical colors | Gradient orbs |
| Lavender Dream | Light | Calming purple tones | Purple petals |
| Mint Fresh | Light | Natural green tones | Green leaves |
| Ocean Breeze | Light | Coastal colors | Animated waves |
| Midnight Latte | Dark | Coffee-inspired dark mode | Steam effects |
| Seasonal | Dynamic | Changes with seasons | Seasonal effects |

### Seasonal Theme Changes

- **Spring:** Pink cherry blossoms.
- **Summer:** Golden sunshine.
- **Fall:** Autumn leaves.
- **Winter:** Snowy twilight.

---

## Security

### Authentication

- JWT token-based sessions through Supabase Auth.
- Password hashing handled by the authentication provider.
- Email verification support.
- Password reset functionality.

### Data Protection

- Row Level Security in Supabase.
- User-specific data access.
- Environment variables for configuration.
- No hardcoded credentials.

### Frontend Security

- Content Security Policy.
- Input validation and sanitization.
- HTTPS support through deployment configuration.
- Secure handling of application data.

### Code Security

- Keep sensitive credentials out of Git history.
- Add `.env` to `.gitignore`.
- Audit dependencies for vulnerabilities.
- Update dependencies regularly.

### Security Utilities

The application includes security helper functions in `src/utils/security.js`.

```javascript
import {
  sanitizeString,
  validateAmount,
  validateEmail,
  validateFile,
  secureStorage,
  maskSensitiveData,
} from "./utils/security";
```

Ensure these functions exist in the project before documenting them as implemented features.

---

## Project Structure

```text
gig-economy-app/
├── public/
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.jsx
│   │   └── ThemeSwitcherModal.jsx
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── pages/
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
│   ├── store/
│   │   ├── authStore.js
│   │   ├── financeStore.js
│   │   └── themeStore.js
│   ├── config/
│   │   └── supabase.js
│   ├── utils/
│   │   └── security.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Role and Responsibilities

### Project Development

**Full-Stack Developer | Team of 2**

### Key Responsibilities

#### Frontend Development

- Designed and implemented responsive UI using React and CSS.
- Built interactive pages for the dashboard, income, expenses, goals, analytics, and other features.
- Created reusable UI components.
- Implemented customizable themes.
- Integrated Recharts for data visualization.
- Developed responsive layouts for mobile, tablet, and desktop.

#### Backend and Database

- Configured the Supabase backend and PostgreSQL database.
- Designed database tables for financial data.
- Implemented Row Level Security policies.
- Integrated Supabase APIs.
- Configured authentication.
- Set up receipt image storage.

#### Security Implementation

- Configured Content Security Policy where supported.
- Implemented input validation and sanitization.
- Added password validation.
- Managed environment variables.
- Worked on security-related logging and protections.

#### State Management

- Implemented global state management using Zustand.
- Organized authentication, finance, and theme state.
- Configured state persistence where required.
- Structured data flow between components and stores.

#### DevOps and Deployment

- Configured the Vite build system.
- Set up deployment through Vercel.
- Managed environment configuration.
- Optimized production builds.
- Configured deployment settings.

#### Testing and Quality Assurance

- Tested application features.
- Reviewed security and dependency issues.
- Checked responsive behavior.
- Tested the application across supported browsers and devices.

### Technical Achievements

- Developed a financial tracking application using React and Supabase.
- Implemented authentication and data access controls.
- Created customizable themes.
- Worked on financial data visualization.
- Integrated receipt scanning where supported by the application.
- Built responsive interfaces.
- Deployed the application.
- Maintained project documentation.

### Technologies Used

**Frontend:** React, Vite, React Router, Zustand, Recharts, CSS.

**Backend:** Supabase, PostgreSQL, Supabase Auth, Supabase Storage.

**Security:** Content Security Policy, input validation, Row Level Security.

**Deployment:** Vercel.

**Tools:** Git, npm, VS Code, ESLint.

---

## Contributing

Contributions are welcome.

### How to Contribute

1. Fork the repository.
2. Create a feature branch.

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. Commit your changes.

   ```bash
   git commit -m "Add some AmazingFeature"
   ```

4. Push your branch.

   ```bash
   git push origin feature/AmazingFeature
   ```

5. Open a pull request.

### Development Guidelines

- Follow the existing coding style.
- Write clear commit messages.
- Add comments for complex logic.
- Test changes before submitting.
- Update documentation when necessary.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- **Supabase:** Backend and database services.
- **Vite:** Frontend build tooling.
- **Zustand:** State management.
- **Lucide:** Icon library.
- **Recharts:** Data visualization.
- **React Community:** Documentation and ecosystem.

---

[Back to Top](#gig-economy-finance-tracker)