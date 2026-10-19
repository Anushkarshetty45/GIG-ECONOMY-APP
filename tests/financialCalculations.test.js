import test from 'node:test'
import assert from 'node:assert/strict'
import { createTaxChecklistStore } from '../src/store/taxChecklistStore.js'
import {
  calculateMonthlyAverages,
  calculateQuarterlyTaxSummaries,
  calculateTaxSummary,
  estimateTax,
  getExpenseCategorySummary,
  getInsuranceAffordability,
  getInsurancePriority,
  getQuarterDateRange,
  hasEquipmentExpenses,
  hasVehicleRelatedExpenses,
  normalizeExpenseCategory,
  normalizeInsuranceType,
  SIMPLIFIED_TAX_RATE,
  SUPPORTED_TAX_YEARS,
} from '../src/utils/financialCalculations.js'

test('year summary excludes transactions outside the selected calendar year', () => {
  const summary = calculateTaxSummary({
    year: 2025,
    incomes: [
      { date: '2024-12-31', amount: 500 },
      { date: '2025-01-01', amount: 1000 },
      { date: '2025-12-31', amount: 200 },
      { date: '2026-01-01', amount: 900 },
    ],
    expenses: [
      { date: '2024-12-31', category: 'Gas', amount: 80 },
      { date: '2025-01-01', category: 'Gas & Fuel', amount: 100 },
      { date: '2026-01-01', category: 'Gas', amount: 70 },
    ],
  })

  assert.equal(summary.totalIncome, 1200)
  assert.equal(summary.totalExpenses, 100)
  assert.equal(summary.totalDeductions, 100)
  assert.equal(summary.taxableProfit, 1100)
  assert.equal(summary.taxableIncome, 1100)
  assert.equal(summary.totalEstimatedTax, 275)
})

test('year switching recalculates all figures within the supported years', () => {
  const incomes = [
    { date: '2022-05-01', amount: 200 },
    { date: '2025-05-01', amount: 800 },
  ]
  const expenses = [
    { date: '2022-05-02', category: 'Equipment', amount: 50 },
    { date: '2025-05-02', category: 'Equipment', amount: 100 },
  ]

  assert.deepEqual(SUPPORTED_TAX_YEARS, [2022, 2023, 2024, 2025])
  const year2022 = calculateTaxSummary({ incomes, expenses, year: 2022 })
  const year2025 = calculateTaxSummary({ incomes, expenses, year: 2025 })
  assert.equal(year2022.totalIncome, 200)
  assert.equal(year2022.taxableProfit, 150)
  assert.equal(year2022.totalEstimatedTax, 37.5)
  assert.equal(year2025.totalIncome, 800)
  assert.equal(year2025.taxableProfit, 700)
  assert.equal(year2025.totalEstimatedTax, 175)
})

test('quarter ranges include boundary days exactly once and handle year rollover', () => {
  assert.deepEqual(getQuarterDateRange(2025, 1), {
    start: '2025-01-01',
    endExclusive: '2025-04-01',
  })

  const quarters = calculateQuarterlyTaxSummaries({
    year: 2025,
    incomes: [
      { date: '2025-03-31', amount: 1 },
      { date: '2025-04-01', amount: 2 },
      { date: '2025-12-31', amount: 4 },
      { date: '2026-01-01', amount: 8 },
    ],
    expenses: [],
  })

  assert.deepEqual(quarters.map(({ income }) => income), [1, 2, 0, 4])
  assert.throws(() => getQuarterDateRange(2025, 5), RangeError)
})

test('expense category aliases map consistently to canonical deduction categories', () => {
  assert.equal(normalizeExpenseCategory('Gas'), 'Gas')
  assert.equal(normalizeExpenseCategory('Gas & Fuel'), 'Gas')
  assert.equal(normalizeExpenseCategory('Software & Subscriptions'), 'Software')
  assert.equal(normalizeExpenseCategory('Airfare'), 'Travel')
  assert.equal(normalizeExpenseCategory('Travel Meals'), null)
  assert.equal(normalizeExpenseCategory('Groceries'), null)
  assert.equal(normalizeInsuranceType('Auto'), 'auto')
  assert.equal(normalizeInsuranceType('professional'), 'professional')
  assert.equal(normalizeInsuranceType('legacy custom type'), 'other')
})

test('deduction tracker groups aliases and keeps review and ineligible expenses out of totals', () => {
  const categories = getExpenseCategorySummary([
    { category: 'Gas', amount: 10 },
    { category: 'Gas & Fuel', amount: 20 },
    { category: 'Equipment', amount: 30 },
    { category: 'Software & Subscriptions', amount: 40 },
    { category: 'Travel Meals', amount: 50 },
    { category: 'Groceries', amount: 60 },
  ])
  const byName = Object.fromEntries(categories.map((item) => [item.category, item]))
  assert.equal(byName.Gas.amount, 30)
  assert.equal(byName.Gas.eligible, true)
  assert.equal(byName.Equipment.status, 'potentially-deductible')
  assert.equal(byName.Software.amount, 40)
  assert.equal(byName['Travel Meals'].status, 'review')
  assert.equal(byName.Groceries.status, 'not-marked-eligible')
})

test('annual and quarterly estimates apply the same 25% rate and reconcile after quarterly losses', () => {
  const incomes = [
    { date: '2025-03-15', amount: 100 },
    { date: '2025-06-15', amount: 500 },
  ]
  const expenses = [
    { date: '2025-03-20', category: 'Gas & Fuel', amount: 150 },
    { date: '2025-06-20', category: 'Equipment', amount: 100 },
    { date: '2025-06-25', category: 'Groceries', amount: 900 },
  ]
  const annual = calculateTaxSummary({ incomes, expenses, year: 2025 })
  const quarters = calculateQuarterlyTaxSummaries({ incomes, expenses, year: 2025 })

  assert.equal(SIMPLIFIED_TAX_RATE, 0.25)
  assert.equal(annual.totalIncome, 600)
  assert.equal(annual.totalExpenses, 1150)
  assert.equal(annual.totalDeductions, 250)
  assert.equal(annual.taxableProfit, 350)
  assert.equal(annual.totalEstimatedTax, 87.5)
  assert.deepEqual(quarters.map((quarter) => quarter.taxableProfit), [-50, 400, 0, 0])
  assert.equal(quarters[0].estimatedTax, 0)
  assert.equal(quarters[1].estimatedTax, 87.5)
  assert.equal(quarters.reduce((sum, quarter) => sum + quarter.income, 0), annual.totalIncome)
  assert.equal(quarters.reduce((sum, quarter) => sum + quarter.expenses, 0), annual.totalExpenses)
  assert.equal(quarters.reduce((sum, quarter) => sum + quarter.deductions, 0), annual.totalDeductions)
  assert.equal(quarters.reduce((sum, quarter) => sum + quarter.taxableProfit, 0), annual.taxableProfit)
  assert.equal(quarters.reduce((sum, quarter) => sum + quarter.estimatedTax, 0), annual.totalEstimatedTax)
  assert.equal(estimateTax(-10).totalEstimatedTax, 0)
})

test('empty tax years return zero totals and no category rows', () => {
  const summary = calculateTaxSummary({ incomes: [], expenses: [], year: 2024 })
  const quarters = calculateQuarterlyTaxSummaries({ incomes: [], expenses: [], year: 2024 })
  assert.equal(summary.totalIncome, 0)
  assert.equal(summary.totalExpenses, 0)
  assert.equal(summary.taxableProfit, 0)
  assert.equal(summary.totalEstimatedTax, 0)
  assert.deepEqual(summary.expenseCategories, [])
  assert.ok(quarters.every((quarter) =>
    quarter.income === 0 && quarter.deductions === 0 && quarter.estimatedTax === 0
  ))
})

test('tax checklist progress persists across store re-creation', () => {
  const values = new Map()
  const storage = {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
  const firstSession = createTaxChecklistStore(storage)
  firstSession.getState().toggleTask('receipts')
  assert.equal(firstSession.getState().checkedItems.receipts, true)

  const nextSession = createTaxChecklistStore(storage)
  assert.equal(nextSession.getState().checkedItems.receipts, true)
  nextSession.getState().toggleTask('receipts')
  assert.equal(nextSession.getState().checkedItems.receipts, false)
})

test('monthly averages and premium affordability use consistent net cash flow', () => {
  const averages = calculateMonthlyAverages(
    [{ date: '2025-01-15', amount: 3000 }, { date: '2025-02-01', amount: 1000 }],
    [{ date: '2025-02-28', amount: 1000 }],
  )

  assert.deepEqual(averages, {
    monthlyIncome: 2000,
    monthlyExpenses: 500,
    dataMonths: 2,
  })
  assert.equal(getInsuranceAffordability(50, 1000), 'affordable')
  assert.equal(getInsuranceAffordability(100, 1000), 'stretch')
  assert.equal(getInsuranceAffordability(101, 1000), 'difficult')
  assert.equal(getInsuranceAffordability(50, 0), 'unknown')
  assert.equal(
    getInsurancePriority({ type: 'auto', monthlyIncome: 1000, hasVehicleExpenses: true }),
    'high'
  )
  assert.equal(
    getInsurancePriority({ type: 'professional', monthlyIncome: 2000 }),
    'medium'
  )
  assert.equal(hasVehicleRelatedExpenses([{ category: 'Gas & Fuel' }]), true)
  assert.equal(hasEquipmentExpenses([{ category: 'Laptop' }]), true)
})
