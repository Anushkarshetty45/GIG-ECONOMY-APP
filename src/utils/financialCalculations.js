const POTENTIALLY_DEDUCTIBLE_CATEGORIES = new Set([
  'Gas',
  'Office Supplies',
  'Equipment',
  'Software',
  'Travel',
])

const CATEGORY_ALIASES = new Map([
  ['gas', 'Gas'],
  ['gas and fuel', 'Gas'],
  ['fuel', 'Gas'],
  ['office supplies', 'Office Supplies'],
  ['equipment', 'Equipment'],
  ['software', 'Software'],
  ['software and subscriptions', 'Software'],
  ['travel', 'Travel'],
  ['airfare', 'Travel'],
  ['hotels', 'Travel'],
])

const REVIEW_CATEGORIES = new Set([
  'car maintenance',
  'car insurance',
  'parking',
  'tolls',
  'internet and phone',
  'marketing and advertising',
  'professional services',
  'vehicle lease',
  'vehicle repairs',
  'car wash',
  'travel meals',
  'health insurance',
  'medical expenses',
  'rent',
  'electricity',
  'water',
  'taxes',
  'fees',
])
export const SIMPLIFIED_TAX_RATE = 0.25
export const SUPPORTED_TAX_YEARS = [2022, 2023, 2024, 2025]
const INSURANCE_TYPES = new Set([
  'health',
  'auto',
  'liability',
  'disability',
  'life',
  'equipment',
  'professional',
  'cyber',
  'umbrella',
])

function dateKey(value) {
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      const [, year, month, day] = match
      const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
      if (
        parsed.getUTCFullYear() === Number(year) &&
        parsed.getUTCMonth() === Number(month) - 1 &&
        parsed.getUTCDate() === Number(day)
      ) {
        return `${year}-${month}-${day}`
      }
      return null
    }
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10)
}

function amountOf(record) {
  const amount = Number(record?.amount)
  return Number.isFinite(amount) ? amount : 0
}

function isInDateRange(record, start, endExclusive) {
  const date = dateKey(record?.date)
  return date !== null && date >= start && date < endExclusive
}

export function getYearDateRange(year) {
  return {
    start: `${year}-01-01`,
    endExclusive: `${Number(year) + 1}-01-01`,
  }
}

export function getQuarterDateRange(year, quarter) {
  if (!Number.isInteger(quarter) || quarter < 1 || quarter > 4) {
    throw new RangeError('Quarter must be an integer from 1 to 4')
  }

  const firstMonth = (quarter - 1) * 3
  const endMonth = firstMonth + 3
  const start = new Date(Date.UTC(Number(year), firstMonth, 1))
  const end = new Date(Date.UTC(Number(year), endMonth, 1))

  return {
    start: start.toISOString().slice(0, 10),
    endExclusive: end.toISOString().slice(0, 10),
  }
}

export function filterRecordsByDateRange(records, { start, endExclusive }) {
  return records.filter((record) => isInDateRange(record, start, endExclusive))
}

export function normalizeExpenseCategory(category) {
  const key = String(category || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

  return CATEGORY_ALIASES.get(key) || null
}

export function getExpenseEligibility(expense) {
  const rawCategory = String(expense?.category || '').trim()
  const canonicalCategory = normalizeExpenseCategory(rawCategory)
  if (canonicalCategory && POTENTIALLY_DEDUCTIBLE_CATEGORIES.has(canonicalCategory)) {
    return {
      category: canonicalCategory,
      status: 'potentially-deductible',
      eligible: true,
    }
  }

  const normalized = rawCategory
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

  return {
    category: rawCategory || 'Uncategorized',
    status: REVIEW_CATEGORIES.has(normalized) ? 'review' : 'not-marked-eligible',
    eligible: false,
  }
}

export function normalizeInsuranceType(type) {
  const normalized = String(type || 'other').toLowerCase()
  return INSURANCE_TYPES.has(normalized) ? normalized : 'other'
}

export function isDeductibleExpense(expense) {
  return getExpenseEligibility(expense).eligible
}

export function getDeductionCategories(expenses) {
  return getExpenseCategorySummary(expenses).filter(({ eligible }) => eligible)
}

export function getExpenseCategorySummary(expenses) {
  const totals = new Map()
  expenses.forEach((expense) => {
    const eligibility = getExpenseEligibility(expense)
    const key = `${eligibility.category}\u0000${eligibility.status}`
    const current = totals.get(key) || { ...eligibility, amount: 0 }
    current.amount += amountOf(expense)
    totals.set(key, current)
  })

  return [...totals.values()].sort((a, b) => a.category.localeCompare(b.category))
}

export function estimateTax(taxableProfit, taxRate = SIMPLIFIED_TAX_RATE) {
  const taxableNetIncome = Math.max(0, Number(taxableProfit) || 0)
  const estimatedTax = taxableNetIncome * taxRate
  return {
    taxRate,
    estimatedTax,
    totalEstimatedTax: estimatedTax,
  }
}

export function calculateTaxSummary({
  incomes,
  expenses,
  year,
  taxRate = SIMPLIFIED_TAX_RATE,
}) {
  const range = getYearDateRange(year)
  const yearIncomes = filterRecordsByDateRange(incomes, range)
  const yearExpenses = filterRecordsByDateRange(expenses, range)
  const expenseCategories = getExpenseCategorySummary(yearExpenses)
  const deductionCategories = expenseCategories.filter(({ eligible }) => eligible)
  const totalIncome = yearIncomes.reduce((sum, record) => sum + amountOf(record), 0)
  const totalExpenses = yearExpenses.reduce((sum, record) => sum + amountOf(record), 0)
  const totalDeductions = deductionCategories.reduce((sum, item) => sum + item.amount, 0)
  const taxableProfit = totalIncome - totalDeductions
  const taxableIncome = Math.max(0, taxableProfit)

  return {
    year,
    totalIncome,
    totalExpenses,
    expenseCategories,
    deductionCategories,
    totalDeductions,
    taxableProfit,
    taxableIncome,
    ...estimateTax(taxableIncome, taxRate),
  }
}

export function calculateQuarterlyTaxSummaries({
  incomes,
  expenses,
  year,
  taxRate = SIMPLIFIED_TAX_RATE,
}) {
  let cumulativeTaxableProfit = 0
  let previousCumulativeEstimate = 0
  return [1, 2, 3, 4].map((quarter) => {
    const range = getQuarterDateRange(year, quarter)
    const summary = calculateTaxSummary({
      incomes: filterRecordsByDateRange(incomes, range),
      expenses: filterRecordsByDateRange(expenses, range),
      year,
      taxRate,
    })
    cumulativeTaxableProfit += summary.taxableProfit
    const cumulativeEstimate = estimateTax(cumulativeTaxableProfit, taxRate).estimatedTax
    const estimatedTax = cumulativeEstimate - previousCumulativeEstimate
    previousCumulativeEstimate = cumulativeEstimate

    return {
      quarter,
      ...range,
      income: summary.totalIncome,
      expenses: summary.totalExpenses,
      deductions: summary.totalDeductions,
      expenseCategories: summary.expenseCategories,
      taxableProfit: summary.taxableProfit,
      netIncome: summary.taxableProfit,
      estimatedTax,
    }
  })
}

export function calculateMonthlyAverages(incomes, expenses) {
  const datedIncomes = incomes.filter((record) => dateKey(record.date))
  const datedExpenses = expenses.filter((record) => dateKey(record.date))
  const dates = [...datedIncomes, ...datedExpenses]
    .map((record) => dateKey(record.date))
    .sort()

  if (dates.length === 0) {
    return { monthlyIncome: 0, monthlyExpenses: 0, dataMonths: 0 }
  }

  const first = dates[0].slice(0, 7).split('-').map(Number)
  const last = dates[dates.length - 1].slice(0, 7).split('-').map(Number)
  const dataMonths = (last[0] - first[0]) * 12 + last[1] - first[1] + 1
  const totalIncome = datedIncomes.reduce((sum, record) => sum + amountOf(record), 0)
  const totalExpenses = datedExpenses.reduce((sum, record) => sum + amountOf(record), 0)

  return {
    monthlyIncome: totalIncome / dataMonths,
    monthlyExpenses: totalExpenses / dataMonths,
    dataMonths,
  }
}

export function getInsuranceAffordability(monthlyCost, monthlyDisposableIncome) {
  if (!Number.isFinite(monthlyDisposableIncome) || monthlyDisposableIncome <= 0) {
    return 'unknown'
  }

  const percentage = (Math.max(0, Number(monthlyCost) || 0) / monthlyDisposableIncome) * 100
  if (percentage <= 5) return 'affordable'
  if (percentage <= 10) return 'stretch'
  return 'difficult'
}

export function getInsurancePriority({
  type,
  monthlyIncome,
  hasVehicleExpenses = false,
  hasEquipmentExpenses = false,
  hasDependents = false,
}) {
  const income = Number(monthlyIncome) || 0
  switch (normalizeInsuranceType(type)) {
    case 'health':
      return 'high'
    case 'auto':
      return hasVehicleExpenses ? 'high' : 'medium'
    case 'liability':
      return income >= 2000 ? 'high' : 'medium'
    case 'disability':
      return income >= 3000 ? 'high' : income >= 1500 ? 'medium' : 'low'
    case 'life':
      return hasDependents ? 'high' : income >= 3000 ? 'medium' : 'low'
    case 'equipment':
      return hasEquipmentExpenses && income >= 1500 ? 'medium' : 'low'
    case 'professional':
      return income >= 2500 ? 'high' : income >= 1500 ? 'medium' : 'low'
    case 'cyber':
      return income >= 3000 ? 'medium' : 'low'
    case 'umbrella':
      return income >= 5000 ? 'medium' : 'low'
    default:
      return 'low'
  }
}

export function hasVehicleRelatedExpenses(expenses) {
  return expenses.some(({ category = '' }) =>
    /gas|fuel|car|vehicle|auto|parking|toll/i.test(category)
  )
}

export function hasEquipmentExpenses(expenses) {
  return expenses.some(({ category = '' }) =>
    /equipment|laptop|computer/i.test(category)
  )
}
