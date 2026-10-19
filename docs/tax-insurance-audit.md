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

- Added shared pure functions in [financialCalculations.js](../src/utils/financialCalculations.js) for year and quarter boundaries, category aliases, tax estimates, monthly cash-flow averages, premium frequency conversion, policy status, affordability, and insurance recommendations.
- Tax year choices are fixed to 2022–2025. Deduction aliases normalize `Gas`/`Gas & Fuel`, software/subscription labels, and travel categories. The tax page uses the 25% simplified estimate and labels it as an estimate rather than a statutory tax calculation.
- The web and mobile insurance screens use the same nine-type [insuranceCatalogue.js](../src/data/insuranceCatalogue.js), shared premium/status calculations, and explainable rules-based recommendations. Recommendations use recorded income, expenses, existing active coverage, and user-selected circumstances; they disclose the priority rules and distinguish illustrative planning benchmarks from insurer quotes.
- The web policy manager supports create/edit/view/delete and tracks provider, policy number, coverage details, payment amount/frequency, monthly equivalent, start/renewal dates, and active/expired/cancelled status (with legacy pending policies retained). Renewal dates update effective policy status, and inactive/expired/cancelled policies are excluded from active premium totals.
- `insurance_plans` is used by [financeRepository.js](../src/store/financeRepository.js) to load, upsert, migrate, and delete policies. The Supabase table is authoritative for authenticated users; Zustand keeps an in-memory cache, not a second persisted policy copy. Legacy locally persisted policies are offered to the existing migration-by-client-ID path.
- `tax_records` exists in the schema but is not read or written by the app. The tax page calculates estimates from finance transactions, and its checklist now persists to a dedicated account-scoped `tax_checklist_progress` table. Checklist state is not stored in localStorage.
- The finance repository checks the current Supabase session user before queries/writes. The migration also enables RLS and constrains select/insert/update/delete by `auth.uid() = user_id` for `insurance_plans` and `tax_checklist_progress`. Insert/update checks prevent changing ownership.
- Extended [schema.sql](../supabase/schema.sql) for fresh setup and the existing-project migration [finance_persistence_migration.sql](../supabase/finance_persistence_migration.sql) for expanded policy types/status values and checklist progress while preserving existing policy records.

### Remaining limitations

- Supabase persistence and RLS could not be exercised against a live project in this run. Apply the updated migration and run authenticated CRUD/two-user isolation checks against the configured Supabase project before release. Automated tests exercise repository behavior with mocked database clients and assert the migration's RLS predicates, but are not a substitute for live RLS verification.
- The repository still declares a Vite web package rather than Expo/React Native dependencies and scripts. Mobile source changes are present, but running the mobile app requires resolving that existing package setup.

## Prioritized plan and validation

1. **Complete before release:** Apply the Supabase migration and verify authenticated read/write/update/delete flows for transactions and policies, including migration of previously local records.
2. **Establish mobile run support:** Add or configure the Expo runtime/dependencies as a separate explicit platform task; this request preserved the existing app architecture and did not redesign the package setup.
3. **Automated tests:** Node tests cover tax-year filtering, quarter edges/year rollover, deduction mapping/calculations, premium frequency conversion, policy status, recommendation rules, remote checklist save/reload/failure/account isolation, insurance repository CRUD/error handling, and RLS ownership guards.
4. **Validation run:** `npm test` passed (23/23). `npm run build` passed. `npm run lint` could not run because the repository has no ESLint configuration. The production build emitted the existing large-chunk warning.
