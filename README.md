
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
- [Role and Responsibilities](#role-and-responsibilities)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Gig Economy Finance Tracker is a modern web application that helps freelancers, gig workers, and independent contractors manage their finances. It provides income tracking, expense management, tax calculations, insurance recommendations, and customizable themes.

### Why This App?

- **Smart Analytics**: Visualize your financial health with interactive charts.
- **Income Tracking**: Track earnings from 30+ gig platforms, including Uber, DoorDash, and Fiverr.
- **Expense Management**: Categorize spending across 25+ categories.
- **Goal Setting**: Set and track savings goals with visual progress.
- **Tax Tools**: Review year-selectable 2022 to 2025 simplified 25% estimates, quarterly totals, deduction eligibility, and an account-level preparation checklist.
- **Insurance Advisor**: Review rules-based suggestions, budget comparisons, and saved policy records.
- **9 Beautiful Themes**: Customize your experience with nine visual themes.
- **Account-scoped data**: Supabase Row Level Security protects remote records when correctly configured. Browser-side finance caches are not encrypted.

---

## Live Demo

**Live Application:** [https://gigeconomy-xi.vercel.app](https://gigeconomy-xi.vercel.app)

Create an account and explore the application's features.

---

## Features

### Financial Management

- **Income Tracking**: Log earnings from multiple platforms with dates, amounts, and notes.
- **Expense Tracking**: Categorize expenses such as gas, food, and equipment.
- **Net Income Calculation**: Calculate profits in real time.
- **Financial Health Score**: View an overview of financial status.

### Analytics and Insights

- **Interactive Charts**: Visualize income and expense trends using Recharts.
- **Category Breakdown**: Analyze spending patterns by category.
- **Platform Analysis**: Identify the highest-earning gig platforms.
- **Monthly Trends**: Identify seasonal patterns in income.

### Goal Management

- **Savings Goals**: Set target amounts and deadlines.
- **Visual Progress**: Track goal completion with progress bars.
- **Multiple Goals**: Manage emergency funds, vacation savings, and equipment purchases.
- **Goal Completion**: Track progress toward financial goals.

### Tax Tools

- **Quarterly Calculator**: Break down estimated tax obligations by quarter.
- **Deduction Tracker**: Group expenses by category and show potentially eligible, review-required, or not-included status.
- **Tax Estimates**: Apply a simplified 25% rate to non-negative taxable profit. These are not actual tax liabilities.
- **Tax Checklist**: Toggle preparation tasks and save progress to the signed-in account.
- **Year Selection**: View tax data for multiple years from 2022 to 2025.

### Insurance Advisor

- **Rules-Based Recommendations**: Explain priorities using available income, expenses, existing coverage, and optional user circumstances. This feature does not use AI.
- **Insurance Types**: Explore health, auto, liability, disability, life, equipment, professional, cyber, and umbrella insurance.
- **Affordability Analysis**: Compare active policy costs and illustrative premium estimates with recorded monthly cash flow.
- **Priority Levels**: Review high, medium, and low priorities based on heuristics, not underwriting.
- **Policy Management**: Create, view, edit, and delete policies with provider, policy number, coverage, premium frequency, and renewal or status details.

### Receipt Management

- **Browser OCR**: Extract receipt text with Tesseract.js and review the results before saving.
- **Expense Entry**: Save reviewed receipt details as an expense.
- **Categorization**: Link receipts to expense categories.
- **Organization**: Search and filter receipt records.
- **Browser Storage**: Receipt records are stored in browser-side finance storage. They are not uploaded to Supabase Storage or backed up across devices.

### Export and Reports

- **CSV Export**: Download financial data for Excel or Google Sheets.
- **PDF Reports**: Generate financial reports.
- **Custom Date Ranges**: Export data for specific periods.

### Customizable Themes

The application includes nine themes:

1. **Pure White**: Clean, minimal, professional.
2. **Midnight Black**: Dark mode with OLED-friendly colors.
3. **Soft Pastels**: Soft vintage-inspired colors.
4. **Coral Sunset**: Warm tropical colors.
5. **Lavender Dream**: Calming purple tones.
6. **Mint Fresh**: Natural green tones.
7. **Ocean Breeze**: Coastal colors with animated waves.
8. **Midnight Latte**: Dark coffee-inspired colors.
9. **Seasonal**: Changes according to the season.

### Theme Features

- Animated backgrounds.
- Smooth transitions.
- LocalStorage persistence.
- Accessibility support for reduced motion preferences.

---

## Tech Stack

### Frontend

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
- Protected routes where configured.
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
- File storage capabilities.
- Row Level Security.

**Components:**

- **Supabase Database**: Stores supported financial records.
- **Supabase Auth**: Handles signup, login, and password recovery.
- **Row Level Security**: Restricts access to users' own remote records when correctly configured.

The application uses `transactions` for income and expense records, `insurance_plans` for insurance policies, and `tax_checklist_progress` for tax checklist progress.

Receipt records are not uploaded to Supabase Storage.

### State Management

#### Zustand

Zustand manages application state.

**Why it is used:**

- Simple API.
- Minimal boilerplate.
- Integration with React hooks.
- Persistent state support where configured.
- Lightweight implementation.

**Stores used in the application:**

- `authStore.js`: Authentication state.
- `financeStore.js`: Income, expenses, receipts, and insurance policies.
- `userStore.js`: Savings goals, if present in the project.
- `taxChecklistStore.js`: Tax checklist progress, if present in the project.
- `themeStore.js`: Theme preferences.
- `settingsStore.js`: Application settings, currency, and date format.

The actual stores and their responsibilities should be verified against the repository.

### UI Components and Styling

#### Lucide React

Lucide React provides interface icons for navigation and actions.

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

### Receipt Scanning

#### Tesseract.js

Tesseract.js provides Optical Character Recognition.

**Usage:**

- Scans receipt images.
- Extracts text from images.
- Helps identify store names, totals, and dates.
- Supports browser-based processing.
- Provides progress information during scanning.

Extracted values require user review and may be inaccurate.

Receipt records remain in browser storage and are not synchronized or backed up in Supabase.

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

- **Global state**: Zustand stores for authentication, finance, and themes.
- **Local state**: React `useState` for component-specific information.
- **Persistence**: Browser storage keeps local preferences and a finance cache. Signed-in insurance policies and tax checklist progress can persist in Supabase.

### Data Flow

The finance store synchronizes income and expense transactions with Supabase and maintains a browser-side cache.

Signed-in insurance policies and tax checklist progress can load from and save to their Supabase tables.

Other application state may remain local. Browser storage is not a cross-device backup.

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

**Supported target**: The responsive Vite web application in current desktop and mobile browsers.

**Native mobile app**: Expo and React Native source and configuration files are present, but the package manifest and lockfile do not include the required native runtime dependencies or run scripts. The native app is not currently runnable or supported. Its tax screen also lacks the web year selector and interactive, persisted checklist. Mobile feature parity is incomplete and unverified.

**Not supported**: Internet Explorer.

---

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Client-Side Security

Vite embeds variables prefixed with `VITE_` in the browser bundle.

The Supabase URL and anon or publishable key are intended for client use and must be protected by correctly configured Supabase RLS policies.

Never put a service-role key, database password, or other private credential in a `VITE_` variable.

`VITE_DEV_MODE=true` enables a development-only authentication bypass if implemented in the application. The Supabase client still needs valid configuration to initialize. Do not enable this flag in production.

### Known Limitations

- Tax calculations use a simplified flat 25% rate and the application's category eligibility rules. They are not tax advice or actual liabilities.
- Insurance priorities use explainable heuristics. Catalogue premiums are illustrative estimates rather than quotes or underwriting decisions.
- Apply the schema or existing-project migration before using remote persistence.
- Live database behavior and cross-user RLS have not been verified against a deployed Supabase project.
- Native mobile source is an incomplete, non-runnable scaffold. Only the responsive web application is currently supported.
- Receipt records remain in browser storage and are not synchronized or backed up in Supabase.
- Browser-side finance caches are not encrypted.

---

## Deployment

The application can be deployed using:

- Vercel.
- Netlify.
- GitHub Pages.
- AWS S3 and CloudFront.

### Build Command

```bash
npm run build
```

### Output Directory

```text
dist/
```

---

## Installation

### Prerequisites

- Node.js 18 or later.
- npm.
- A Supabase project.
- Git, if cloning the repository.

### Step 1: Clone the Repository

Use the repository URL for your copy of the project.

```bash
git clone <repository-url>
cd <repository-directory>
```

Replace the placeholders with the actual repository URL and directory name.

### Step 2: Install Dependencies

If the repository includes a `package-lock.json`, run:

```bash
npm ci
```

Otherwise, run:

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root and add your Supabase project URL and anon or publishable key.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace the example values with your own project credentials.

Do not place service-role keys, database passwords, or other private credentials in `VITE_` variables because Vite exposes them to browser code.

### Step 4: Configure the Supabase Database

For a new project, run `supabase/schema.sql` in the Supabase SQL Editor.

For an existing project that already has the base schema, run `supabase/finance_persistence_migration.sql` if required by the repository's current schema.

Review the SQL before applying it to a database containing existing data.

The application uses:

- `transactions` for income and expense records.
- `insurance_plans` for insurance policy records.
- `tax_checklist_progress` for tax checklist progress.

The `tax_records` table is present in the schema but is not used by the application.

Receipt records remain in browser storage.

Verify the deployed database and RLS policies in your own Supabase project.

### Step 5: Start the Development Server

```bash
npm run dev
```

Open the local URL printed in the terminal. The configured Vite port may differ from the default.

### Step 6: Run Checks and Build

Run the scripts available in `package.json`.

```bash
npm test
npm run build
```

If the project does not define a `test` script, omit `npm test`.

---

## Configuration

### Environment Variables

Create a `.env` file in the project root. The application requires Supabase configuration.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Only configure optional services if they are implemented and required by your application.

### Important Security Notes

- `.env` must be included in `.gitignore`. Never commit it.
- `VITE_` variables are exposed in the browser bundle. Use only the Supabase anon or publishable key there, with RLS enabled.
- Never expose service-role keys, database passwords, or other private credentials in client-side code.
- Keep private service credentials on a secure backend.
- The Plaid and Stripe values shown in `.env.example` are placeholders if those integrations are not wired into the current application.

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

- **Spring**: Pink cherry blossoms.
- **Summer**: Golden sunshine.
- **Fall**: Autumn leaves.
- **Winter**: Snowy twilight.

---

## Security

### Authentication

- JWT token-based sessions through Supabase Auth.
- Password hashing handled by the authentication provider.
- Email verification support where configured.
- Password reset functionality where configured.

### Data Protection

- Row Level Security in Supabase.
- User-specific data access when database policies are correctly configured.
- Environment variables for configuration.
- No hardcoded credentials.
- Browser-side cached finance data is not encrypted.
- `VITE_` variables are public client configuration, not a place for secrets.

Supabase RLS policies must be applied and verified against your project before relying on them to isolate financial records between users.

### Frontend Security

- Content Security Policy where configured.
- Input validation and sanitization where implemented.
- HTTPS support through deployment configuration.
- Review the deployed configuration before treating these protections as verified.

### Code Security

- Keep sensitive credentials out of Git history.
- Add `.env` to `.gitignore`.
- Audit dependencies for vulnerabilities.
- Update dependencies regularly.

### Security Utilities

The application includes security helper functions in `src/utils/security.js` if these functions are present in the project.

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

The `secureStorage` helper is an error-handling wrapper for localStorage, not encryption.

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
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

This structure is illustrative. Verify the actual file names and directories in the repository.

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
- Designed database structures for financial data.
- Implemented or configured Row Level Security policies.
- Integrated Supabase APIs.
- Configured authentication.
- Implemented browser-based receipt scanning and receipt record handling.

#### Security Implementation

- Configured Content Security Policy where supported.
- Implemented input validation and sanitization where available.
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
- Worked on authentication and data access controls.
- Created customizable themes.
- Implemented financial data visualization.
- Integrated receipt scanning where supported by the application.
- Built responsive interfaces.
- Deployed the application.
- Maintained project documentation.

### Technologies Used

**Frontend**: React, Vite, React Router, Zustand, Recharts, CSS.

**Backend**: Supabase, PostgreSQL, Supabase Auth.

**Security**: Content Security Policy, input validation, Row Level Security.

**Deployment**: Vercel.

**Tools**: Git, npm, VS Code, ESLint.

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

- **Supabase**: Backend and database services.
- **Vite**: Frontend build tooling.
- **Zustand**: State management.
- **Lucide**: Interface icon library.
- **Recharts**: Data visualization.
- **React Community**: Documentation and ecosystem.

---

[Back to Top](#gig-economy-finance-tracker)
