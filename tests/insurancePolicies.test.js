import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { INSURANCE_CATALOGUE } from '../src/data/insuranceCatalogue.js'
import {
  calculateMonthlyPremium,
  generateInsuranceRecommendations,
  getInsuranceAffordability,
  getInsurancePolicyStatus,
} from '../src/utils/financialCalculations.js'

test('the shared insurance catalogue defines exactly the nine supported types', () => {
  assert.deepEqual(INSURANCE_CATALOGUE.map(({ value }) => value), [
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
  assert.ok(INSURANCE_CATALOGUE.every(({ estimatedMonthlyPremium }) => estimatedMonthlyPremium > 0))
})

test('recommendation priorities respond to cash flow, records, circumstances, and coverage', () => {
  const policyInputs = {
    monthlyIncome: 1200,
    monthlyExpenses: 1300,
    expenses: [{ category: 'Gas & Fuel', amount: 60 }],
    policies: [],
    circumstances: {},
  }
  const noBudget = generateInsuranceRecommendations(policyInputs)
  const health = noBudget.find(({ type }) => type === 'health')
  const auto = noBudget.find(({ type }) => type === 'auto')
  const life = noBudget.find(({ type }) => type === 'life')

  assert.equal(getInsuranceAffordability(40, -100), 'difficult')
  assert.equal(getInsurancePolicyStatus({ status: 'active', renewalDate: '2020-01-01' }, '2026-10-19'), 'expired')
  assert.equal(health.priority, 'high')
  assert.equal(auto.priority, 'high')
  assert.equal(life.priority, 'low')
  assert.match(auto.reasons[0], /[Vv]ehicle-related expenses/)
  assert.ok(calculateMonthlyPremium(1200, 'yearly') === 100)

  const dependentLife = generateInsuranceRecommendations({
    ...policyInputs,
    circumstances: { hasDependents: true },
    policies: [{ id: 'life-1', type: 'life', status: 'active' }],
  }).find(({ type }) => type === 'life')
  assert.equal(dependentLife.priority, 'high')
  assert.equal(dependentLife.covered, true)
  assert.match(dependentLife.reasons[0], /active policy/)
})

test('insurance policy metadata maps to Supabase without persisting a disconnected local copy', async () => {
  process.env.VITE_DEV_MODE = 'true'
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
  const values = new Map()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    },
  })
  const originalNow = Date.now
  let nextId = 0
  Date.now = () => ++nextId

  const startServer = () => createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  let server = await startServer()
  try {
    const { useFinanceStore } = await server.ssrLoadModule('/src/store/financeStore.js')
    const { toInsuranceRow, fromInsuranceRow } = await server.ssrLoadModule('/src/store/financeRepository.js')
    useFinanceStore.setState({ insurance: [] })

    const created = useFinanceStore.getState().addInsurance({
      type: 'auto',
      provider: 'Test insurer',
      policyNumber: 'AUTO-42',
      premiumAmount: 300,
      paymentFrequency: 'quarterly',
      monthlyCost: 100,
      coverageAmount: '$500,000 liability',
      startDate: '2026-01-01',
      renewalDate: '2027-01-01',
      status: 'active',
    })
    assert.equal(created.monthlyCost, 100)
    assert.equal(created.paymentFrequency, 'quarterly')
    assert.equal(useFinanceStore.getState().getTotalInsuranceCost(), 100)

    useFinanceStore.getState().updateInsurance(created.id, {
      provider: 'Updated insurer',
      policyNumber: 'AUTO-43',
      status: 'cancelled',
    })
    assert.equal(useFinanceStore.getState().getTotalInsuranceCost(), 0)
    assert.equal(useFinanceStore.getState().insurance[0].provider, 'Updated insurer')

    const second = useFinanceStore.getState().addInsurance({
      type: 'health',
      provider: 'Health insurer',
      premiumAmount: 1200,
      paymentFrequency: 'yearly',
      monthlyCost: 100,
      status: 'active',
    })
    useFinanceStore.getState().deleteInsurance(created.id)
    assert.deepEqual(useFinanceStore.getState().insurance.map(({ id }) => id), [second.id])
    assert.equal(useFinanceStore.getState().getTotalInsuranceCost(), 100)

    const dbRow = toInsuranceRow({
      ...second,
      coverageAmount: 'Medical coverage details',
    }, 'user-1')
    assert.equal(dbRow.premium_amount, 1200)
    assert.equal(dbRow.monthly_cost, 100)
    assert.equal(dbRow.frequency, 'yearly')
    assert.equal(dbRow.status, 'active')
    const decoded = fromInsuranceRow(dbRow)
    assert.equal(decoded.premiumAmount, 1200)
    assert.equal(decoded.monthlyCost, 100)
    assert.equal(decoded.paymentFrequency, 'yearly')
    assert.equal(decoded.coverageAmount, 'Medical coverage details')

    const stored = JSON.parse(values.get('finance-storage'))
    assert.equal(Object.hasOwn(stored.state, 'insurance'), false)
  } finally {
    await server.close()
  }

  server = await startServer()
  try {
    const { useFinanceStore } = await server.ssrLoadModule('/src/store/financeStore.js')
    assert.equal(useFinanceStore.getState().insurance.length, 0)
  } finally {
    await server.close()
    Date.now = originalNow
  }
})
