
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


### Theme Features

- Animated backgrounds.
- Smooth transitions.
- LocalStorage persistence.
- Accessibility support for reduced motion preferences.

---

## Tech Stack


### Technologies Used

**Frontend**: React, Vite, React Router, Recharts, CSS.

**Backend**: Supabase, PostgreSQL, Supabase Auth.

**Security**: Content Security Policy, input validation, Row Level Security.

**Receipt Scanning**: Tesseract.js.

**Development Tools**: ESLint, Typescript and JSDoc.

**State Management**: Zustand.

**Deployment**: Vercel.

**Tools**: Git, npm, VS Code, ESLint.

---



### Known Limitations

- Tax calculations use a simplified flat 25% rate and the application's category eligibility rules. They are not tax advice or actual liabilities.
- Insurance priorities use explainable heuristics. Catalogue premiums are illustrative estimates rather than quotes or underwriting decisions.
- Apply the schema or existing-project migration before using remote persistence.
- Live database behavior and cross-user RLS have not been verified against a deployed Supabase project.
- Native mobile source is an incomplete, non-runnable scaffold. Only the responsive web application is currently supported.
- Receipt records remain in browser storage and are not synchronized or backed up in Supabase.
- Browser-side finance caches are not encrypted.

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


### Step 3: Start the Development Server

```bash
npm run dev
```

Open the local URL printed in the terminal. The configured Vite port may differ from the default.

### Step 4: Run Checks and Build

Run the scripts available in `package.json`.

```bash
npm test
npm run build
```

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
