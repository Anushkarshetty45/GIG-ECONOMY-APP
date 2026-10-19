# Tax and Insurance Audit and Remediation

**Scope:** baseline audit of the web and mobile tax/insurance flows, shared finance store, Supabase schema/configuration, and package setup, followed by a focused remediation.

## Baseline audit findings

### What existed

- The web app routes to separate Tax Tools and Insurance pages in [App.jsx](../src/App.jsx).
- The shared [financeStore.js](../src/store/financeStore.js) holds income, expense, and insurance arrays and persists a local browser cache.
- Supabase was configured for authentication, and its schema defined user-scoped transaction and insurance tables, but financial records were not previously read from or written to Supabase.

### Issues found before remediation

- Web income ignored the selected tax year, year options became stale, and expense category labels did not match the tax allow-list.
- Mobile and web calculated taxes from different expense bases and used inconsistent rates; quarterly estimates duplicated the formulas and boundaries were untested.
- Web policy CRUD was browser-local, mobile policy CRUD was component-local, policy type casing differed, and affordability ignored expenses and existing premiums.
- Supabase finance tables and local client records had different field shapes, preventing direct persistence without an adapter/schema extension.

## Implementation status

- Added shared pure functions in [financialCalculations.js](../src/utils/financialCalculations.js) for year and quarter boundaries, category aliases, tax estimates, monthly cash-flow averages, affordability, and recommendation priority. Both tax screens now use the same annual and quarterly calculation paths.
- Web year choices now include the current year and transaction years. Deduction aliases normalize `Gas`/`Gas & Fuel`, software/subscription labels, and travel categories. The shared estimate uses a 12% simplified income-tax assumption plus self-employment tax at 15.3% of 92.35% of net income, floors the taxable base at zero, and is displayed as an estimate rather than a statutory tax calculation.
- Web and mobile insurance screens now use canonical lowercase policy types, the same shared policy store, shared affordability based on estimated disposable monthly income after expenses and existing active premiums, and the same recommendation-priority calculation. Mobile recommendation selection now retains the selected policy type.
- Added [financeRepository.js](../src/store/financeRepository.js) to load and persist user-owned transactions and insurance policies through Supabase. Existing local records are migrated by stable client ID; local snapshots are retained per account when switching users. Zustand remains the app-facing cache.
- Extended [schema.sql](../supabase/schema.sql) for fresh setup and added the existing-project migration [finance_persistence_migration.sql](../supabase/finance_persistence_migration.sql). Apply the migration in the Supabase project before using remote finance persistence; it adds/backfills columns without replacing existing records.

### Remaining limitations

- Supabase persistence could not be exercised against a live project in this run. The schema changes need to be applied, and valid project configuration/network access is needed to verify the remote path.
- The repository still declares a Vite web package rather than Expo/React Native dependencies and scripts. Mobile source changes are present, but running the mobile app requires resolving that existing package setup.

## Prioritized plan and validation

1. **Complete before release:** Apply the Supabase migration and verify authenticated read/write/update/delete flows for transactions and policies, including migration of previously local records.
2. **Establish mobile run support:** Add or configure the Expo runtime/dependencies as a separate explicit platform task; this request preserved the existing app architecture and did not redesign the package setup.
3. **Automated tests:** Added five Node tests covering selected-year filtering, quarter edges/year rollover, expense and policy type mapping, annual/quarter tax accuracy, negative net income, monthly averages, recommendation priority, and affordability.
4. **Validation run:** `npm test` passed (5/5). `npm run build` passed. `npm run lint` could not run because the repository has no ESLint configuration. The production build emitted the existing large-chunk warning.
