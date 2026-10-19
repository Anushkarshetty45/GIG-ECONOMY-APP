import { isSupabaseConfigured, supabase } from '../config/supabase'
import { getInsurancePolicyStatus, normalizeInsuranceType } from '../utils/financialCalculations'

function toTransactionRow(record, type, userId) {
  return {
    user_id: userId,
    client_id: String(record.id),
    type,
    amount: Number(record.amount),
    date: record.date,
    updated_at: record.updatedAt || record.createdAt || new Date().toISOString(),
    description: record.notes || record.description || null,
    platform: type === 'income' ? record.platform || null : null,
    category_name: type === 'expense' ? record.category || null : null,
    payment_method: type === 'expense' ? record.paymentMethod || null : null,
  }
}

function fromTransactionRow(row) {
  const common = {
    id: row.client_id || row.id,
    amount: Number(row.amount),
    date: row.date,
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
  }

  if (row.type === 'income') {
    return {
      ...common,
      type: row.type,
      platform: row.platform || 'Other',
      notes: row.description || '',
    }
  }

  return {
    ...common,
    type: row.type,
    category: row.category_name || row.categories?.name || 'Other',
    description: row.description || '',
    paymentMethod: row.payment_method || '',
  }
}

export async function assertAuthenticatedOwner(userId, auth = supabase.auth) {
  if (!userId) throw new Error('An authenticated user is required to access financial records.')
  const { data, error } = await auth.getSession()
  if (error) throw error
  if (data?.session?.user?.id !== userId) {
    throw new Error('The requested records do not belong to the authenticated user.')
  }
}

export function toInsuranceRow(policy, userId) {
  const frequency = policy.paymentFrequency || policy.frequency || 'monthly'
  const frequencyMonths = { monthly: 1, quarterly: 3, yearly: 12 }[frequency] || 1
  const monthlyCost = Number(policy.monthlyCost)
  const premiumAmount = Number(policy.premiumAmount)

  return {
    user_id: userId,
    client_id: String(policy.id),
    plan_name: policy.type || 'other',
    provider: policy.provider || null,
    type: normalizeInsuranceType(policy.type),
    premium_amount: Number.isFinite(premiumAmount)
      ? premiumAmount
      : (Number.isFinite(monthlyCost) ? monthlyCost : 0) * frequencyMonths,
    monthly_cost: Number.isFinite(monthlyCost)
      ? monthlyCost
      : (Number.isFinite(premiumAmount) ? premiumAmount : 0) / frequencyMonths,
    coverage_amount: Number(policy.coverageAmount) || null,
    coverage_details: policy.coverageAmount || policy.coverage || null,
    policy_number: policy.policyNumber || null,
    frequency,
    renewal_date: policy.renewalDate || null,
    start_date: policy.startDate || null,
    end_date: null,
    status: getInsurancePolicyStatus(policy),
    updated_at: policy.updatedAt || policy.createdAt || new Date().toISOString(),
  }
}

export function fromInsuranceRow(row) {
  const paymentFrequency = ['monthly', 'quarterly', 'yearly'].includes(row.frequency)
    ? row.frequency
    : 'monthly'
  const frequencyMonths = { monthly: 1, quarterly: 3, yearly: 12 }[paymentFrequency]
  const intervalPremium = Number(row.premium_amount)
  const monthlyCost = row.monthly_cost == null
    ? (Number.isFinite(intervalPremium) ? intervalPremium / frequencyMonths : 0)
    : Number(row.monthly_cost)
  const legacyStatus = String(row.status || 'active').toLowerCase()

  return {
    id: row.client_id || row.id,
    type: normalizeInsuranceType(row.type || row.plan_name),
    provider: row.provider || '',
    policyNumber: row.policy_number || '',
    premiumAmount: Number.isFinite(intervalPremium)
      ? intervalPremium
      : monthlyCost * frequencyMonths,
    paymentFrequency,
    monthlyCost: Number.isFinite(monthlyCost) ? monthlyCost : 0,
    coverageAmount: row.coverage_details || row.coverage_amount || '',
    coverage: row.coverage_details || '',
    renewalDate: row.renewal_date || row.end_date || '',
    startDate: row.start_date || '',
    status: legacyStatus === 'inactive' ? 'cancelled' : legacyStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
  }
}

export function createFinanceRepository(client = supabase) {
  async function getTransactions(userId) {
    await assertAuthenticatedOwner(userId, client.auth)
    const { data, error } = await client
      .from('transactions')
      .select('*, categories(name)')
      .eq('user_id', userId)

    if (error) throw error
    return (data || []).map(fromTransactionRow)
  }

  async function getInsurance(userId) {
    await assertAuthenticatedOwner(userId, client.auth)
    const { data, error } = await client
      .from('insurance_plans')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return (data || []).map(fromInsuranceRow)
  }

  const repository = {
    isConfigured() {
      return client === supabase ? Boolean(isSupabaseConfigured()) : true
    },

    async load(userId) {
      const [transactionRows, policies] = await Promise.all([
        getTransactions(userId),
        getInsurance(userId),
      ])
      return {
        incomes: transactionRows.filter((record) => record.type === 'income'),
        expenses: transactionRows.filter((record) => record.type === 'expense'),
        insurance: policies,
      }
    },

    async loadRecords(userId) {
      await assertAuthenticatedOwner(userId, client.auth)
      const { data, error } = await client
        .from('transactions')
        .select('*, categories(name)')
        .eq('user_id', userId)

      if (error) throw error
      return (data || []).map((row) => ({ ...fromTransactionRow(row), type: row.type }))
    },

    async saveTransaction(record, type, userId) {
      await assertAuthenticatedOwner(userId, client.auth)
      const { error } = await client
        .from('transactions')
        .upsert(toTransactionRow(record, type, userId), {
          onConflict: 'user_id,client_id',
        })

      if (error) throw error
    },

    async deleteTransaction(id, userId) {
      await assertAuthenticatedOwner(userId, client.auth)
      const { error } = await client
        .from('transactions')
        .delete()
        .eq('user_id', userId)
        .eq('client_id', String(id))

      if (error) throw error
    },

    async saveInsurance(policy, userId) {
      await assertAuthenticatedOwner(userId, client.auth)
      const { error } = await client
        .from('insurance_plans')
        .upsert(toInsuranceRow(policy, userId), {
          onConflict: 'user_id,client_id',
        })

      if (error) throw error
    },

    async deleteInsurance(id, userId) {
      await assertAuthenticatedOwner(userId, client.auth)
      const { error } = await client
        .from('insurance_plans')
        .delete()
        .eq('user_id', userId)
        .eq('client_id', String(id))

      if (error) throw error
    },

    async migrateLocalRecords(userId, { incomes, expenses, insurance }) {
      const [remoteTransactions, remotePolicies] = await Promise.all([
        repository.loadRecords(userId),
        getInsurance(userId),
      ])
      const remoteTransactionsById = new Map(
        remoteTransactions.map((record) => [String(record.id), record])
      )
      const remotePoliciesById = new Map(
        remotePolicies.map((policy) => [String(policy.id), policy])
      )
      const isNewerLocalRecord = (localRecord, remoteRecord) => {
        if (!remoteRecord) return true
        const localDate = Date.parse(localRecord.updatedAt || localRecord.createdAt || '')
        const remoteDate = Date.parse(remoteRecord.updatedAt || remoteRecord.createdAt || '')
        return Number.isFinite(localDate) && (!Number.isFinite(remoteDate) || localDate > remoteDate)
      }

      await Promise.all([
        ...incomes
          .filter((record) =>
            isNewerLocalRecord(record, remoteTransactionsById.get(String(record.id)))
          )
          .map((record) => repository.saveTransaction(record, 'income', userId)),
        ...expenses
          .filter((record) =>
            isNewerLocalRecord(record, remoteTransactionsById.get(String(record.id)))
          )
          .map((record) => repository.saveTransaction(record, 'expense', userId)),
        ...insurance
          .filter((policy) =>
            isNewerLocalRecord(policy, remotePoliciesById.get(String(policy.id)))
          )
          .map((policy) => repository.saveInsurance(policy, userId)),
      ])

      return repository.load(userId)
    },
  }
  return repository
}

export const financeRepository = createFinanceRepository()
