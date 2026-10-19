import { isSupabaseConfigured, supabase } from '../config/supabase'
import { normalizeInsuranceType } from '../utils/financialCalculations'

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

function toInsuranceRow(policy, userId) {
  return {
    user_id: userId,
    client_id: String(policy.id),
    plan_name: policy.type || 'other',
    provider: policy.provider || null,
    type: normalizeInsuranceType(policy.type),
    premium_amount: Number(policy.monthlyCost) || 0,
    monthly_cost: Number(policy.monthlyCost) || 0,
    coverage_amount: Number(policy.coverageAmount) || null,
    coverage_details: policy.coverageAmount || policy.coverage || null,
    policy_number: policy.policyNumber || null,
    frequency: 'monthly',
    renewal_date: policy.renewalDate || null,
    start_date: policy.startDate || null,
    end_date: null,
    status: policy.status || 'active',
    updated_at: policy.updatedAt || policy.createdAt || new Date().toISOString(),
  }
}

function fromInsuranceRow(row) {
  const premium = Number(row.monthly_cost ?? row.premium_amount) || 0
  const frequencyDivisor = { monthly: 1, quarterly: 3, yearly: 12 }[row.frequency] || 1
  return {
    id: row.client_id || row.id,
    type: normalizeInsuranceType(row.type || row.plan_name),
    provider: row.provider || '',
    policyNumber: row.policy_number || '',
    monthlyCost: row.monthly_cost == null ? premium / frequencyDivisor : premium,
    coverageAmount: row.coverage_details || row.coverage_amount || '',
    coverage: row.coverage_details || '',
    renewalDate: row.renewal_date || row.end_date || '',
    startDate: row.start_date || '',
    status: row.status || 'active',
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
  }
}

async function getTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(name)')
    .eq('user_id', userId)

  if (error) throw error
  return (data || []).map(fromTransactionRow)
}

async function getInsurance(userId) {
  const { data, error } = await supabase
    .from('insurance_plans')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return (data || []).map(fromInsuranceRow)
}

export const financeRepository = {
  isConfigured() {
    return Boolean(isSupabaseConfigured())
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
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .eq('user_id', userId)

    if (error) throw error
    return (data || []).map((row) => ({ ...fromTransactionRow(row), type: row.type }))
  },

  async saveTransaction(record, type, userId) {
    const { error } = await supabase
      .from('transactions')
      .upsert(toTransactionRow(record, type, userId), {
        onConflict: 'user_id,client_id',
      })

    if (error) throw error
  },

  async deleteTransaction(id, userId) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', userId)
      .eq('client_id', String(id))

    if (error) throw error
  },

  async saveInsurance(policy, userId) {
    const { error } = await supabase
      .from('insurance_plans')
      .upsert(toInsuranceRow(policy, userId), {
        onConflict: 'user_id,client_id',
      })

    if (error) throw error
  },

  async deleteInsurance(id, userId) {
    const { error } = await supabase
      .from('insurance_plans')
      .delete()
      .eq('user_id', userId)
      .eq('client_id', String(id))

    if (error) throw error
  },

  async migrateLocalRecords(userId, { incomes, expenses, insurance }) {
    const [remoteTransactions, remotePolicies] = await Promise.all([
      financeRepository.loadRecords(userId),
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
        .map((record) => financeRepository.saveTransaction(record, 'income', userId)),
      ...expenses
        .filter((record) =>
          isNewerLocalRecord(record, remoteTransactionsById.get(String(record.id)))
        )
        .map((record) => financeRepository.saveTransaction(record, 'expense', userId)),
      ...insurance
        .filter((policy) =>
          isNewerLocalRecord(policy, remotePoliciesById.get(String(policy.id)))
        )
        .map((policy) => financeRepository.saveInsurance(policy, userId)),
    ])

    return financeRepository.load(userId)
  },
}
