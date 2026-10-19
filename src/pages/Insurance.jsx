import React, { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Briefcase,
  Car,
  CheckCircle,
  FileText,
  Heart,
  Info,
  Laptop,
  Lock,
  Plus,
  Shield,
  TrendingUp,
  Umbrella,
  Users,
} from 'lucide-react'
import { INSURANCE_CATALOGUE, INSURANCE_PAYMENT_FREQUENCIES, INSURANCE_POLICY_STATUSES } from '../data/insuranceCatalogue'
import { useFinanceStore } from '../store/financeStore'
import {
  calculateInsuranceBudget,
  calculateMonthlyAverages,
  calculateMonthlyPremium,
  generateInsuranceRecommendations,
  getInsuranceAffordability,
  getInsurancePolicyStatus,
} from '../utils/financialCalculations'
import './DashboardPages.css'

const ICONS = {
  Heart,
  Car,
  Shield,
  Briefcase,
  Users,
  Laptop,
  FileText,
  Lock,
  Umbrella,
}
const PRIORITIES = ['high', 'medium', 'low']
const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#71717a',
}
const AFFORDABILITY_LABELS = {
  affordable: 'Within budget',
  stretch: 'Stretch budget',
  difficult: 'Over budget',
  unknown: 'Budget unknown',
}
const FREQUENCY_MONTHS = { monthly: 1, quarterly: 3, yearly: 12 }

function emptyPolicy(type = 'health', premiumAmount = '') {
  return {
    type,
    provider: '',
    policyNumber: '',
    premiumAmount: String(premiumAmount),
    paymentFrequency: 'monthly',
    coverageAmount: '',
    startDate: '',
    renewalDate: '',
    status: 'active',
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount) || 0)
}

export default function Insurance() {
  const {
    insurance,
    addInsurance,
    updateInsurance,
    deleteInsurance,
    incomes,
    expenses,
    financeSyncError,
  } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyPolicy())
  const [formError, setFormError] = useState('')
  const [circumstances, setCircumstances] = useState({
    ownsVehicle: false,
    hasDependents: false,
    doesClientWork: false,
    handlesSensitiveData: false,
  })

  const { monthlyIncome, monthlyExpenses } = useMemo(
    () => calculateMonthlyAverages(incomes, expenses),
    [incomes, expenses]
  )
  const budget = useMemo(
    () => calculateInsuranceBudget({ monthlyIncome, monthlyExpenses, policies: insurance }),
    [monthlyIncome, monthlyExpenses, insurance]
  )
  const recommendations = useMemo(
    () => generateInsuranceRecommendations({
      monthlyIncome,
      monthlyExpenses,
      expenses,
      policies: insurance,
      circumstances,
    }),
    [monthlyIncome, monthlyExpenses, expenses, insurance, circumstances]
  )
  const recommendationByType = useMemo(
    () => new Map(recommendations.map((recommendation) => [recommendation.type, recommendation])),
    [recommendations]
  )
  const activePolicies = insurance.filter(
    (policy) => getInsurancePolicyStatus(policy) === 'active'
  )
  const monthlyPremiums = activePolicies.map((policy) => Number(policy.monthlyCost) || 0)
  const totalMonthlyCost = monthlyPremiums.reduce((total, premium) => total + premium, 0)
  const totalAnnualCost = totalMonthlyCost * 12
  const highPriorityUncovered = recommendations.filter(
    ({ priority, covered }) => priority === 'high' && !covered
  ).length
  const savingsRate = monthlyIncome > 0
    ? ((monthlyIncome - monthlyExpenses - totalMonthlyCost) / monthlyIncome) * 100
    : 0

  const openAddForm = (type = 'health') => {
    const entry = INSURANCE_CATALOGUE.find((item) => item.value === type)
    setFormData(emptyPolicy(type, entry?.estimatedMonthlyPremium ?? ''))
    setEditingId(null)
    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (policy) => {
    const frequency = FREQUENCY_MONTHS[policy.paymentFrequency] ? policy.paymentFrequency : 'monthly'
    const defaultPremium = Number.isFinite(Number(policy.premiumAmount))
      ? Number(policy.premiumAmount)
      : (Number(policy.monthlyCost) || 0) * FREQUENCY_MONTHS[frequency]
    setFormData({
      ...emptyPolicy(policy.type),
      ...policy,
      premiumAmount: String(defaultPremium),
      paymentFrequency: frequency,
      coverageAmount: policy.coverageAmount || policy.coverage || '',
      status: getInsurancePolicyStatus(policy),
    })
    setEditingId(policy.id)
    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormError('')
    setFormData(emptyPolicy())
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const premiumAmount = Number(formData.premiumAmount)
    if (!formData.provider.trim()) {
      setFormError('Enter the insurance provider.')
      return
    }
    if (!Number.isFinite(premiumAmount) || premiumAmount <= 0) {
      setFormError('Enter a positive premium amount.')
      return
    }
    if (!FREQUENCY_MONTHS[formData.paymentFrequency]) {
      setFormError('Choose a valid payment frequency.')
      return
    }

    const policyData = {
      type: formData.type,
      provider: formData.provider.trim(),
      policyNumber: formData.policyNumber.trim(),
      premiumAmount,
      paymentFrequency: formData.paymentFrequency,
      monthlyCost: calculateMonthlyPremium(premiumAmount, formData.paymentFrequency),
      coverageAmount: formData.coverageAmount.trim(),
      startDate: formData.startDate,
      renewalDate: formData.renewalDate,
      status: formData.status,
    }
    if (editingId) updateInsurance(editingId, policyData)
    else addInsurance(policyData)
    closeForm()
  }

  const handleDelete = (policy) => {
    const confirmed = typeof window === 'undefined'
      || window.confirm(`Delete the ${policy.provider} ${policy.type} policy? This cannot be undone.`)
    if (!confirmed) return
    deleteInsurance(policy.id)
  }

  const setCircumstance = (key, checked) => {
    setCircumstances((current) => ({ ...current, [key]: checked }))
  }

  const renderRecommendationCard = (priority) => {
    const items = recommendations.filter((recommendation) => recommendation.priority === priority)
    if (!items.length) return null
    const Icon = priority === 'high' ? AlertTriangle : priority === 'medium' ? Info : Activity

    return (
      <section className="dashboard-section" key={priority} style={{ marginBottom: '28px' }}>
        <h2 className="section-title" style={{ color: PRIORITY_COLORS[priority], display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Icon size={20} /> {priority[0].toUpperCase() + priority.slice(1)} priority
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {items.map((recommendation) => {
            const type = INSURANCE_CATALOGUE.find((entry) => entry.value === recommendation.type)
            const TypeIcon = ICONS[type.iconName] || Shield
            const estimate = type.estimatedMonthlyPremium
            const affordability = getInsuranceAffordability(estimate, budget.remainingMonthlyBudget)

            return (
              <article
                className="summary-card"
                key={type.value}
                style={{
                  border: `1px solid ${recommendation.covered ? 'rgba(16,185,129,.4)' : 'var(--theme-border)'}`,
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <TypeIcon size={25} color={type.iconColor} />
                  <h3 style={{ color: 'var(--theme-text)', margin: 0, flex: 1 }}>{type.label}</h3>
                  {recommendation.covered && <CheckCircle size={20} color="#10b981" aria-label="Active coverage recorded" />}
                </div>
                <p style={{ color: 'var(--theme-text-secondary)', margin: '0 0 12px' }}>{type.description}</p>
                <p style={{ color: 'var(--theme-text-secondary)', fontSize: '13px', margin: '0 0 8px' }}>
                  <strong style={{ color: PRIORITY_COLORS[priority] }}>Why this priority:</strong> {recommendation.reasons[0]}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '14px' }}>
                  <span style={{ color: 'var(--theme-text)', fontWeight: 700 }}>
                    {recommendation.covered
                      ? 'Active policy recorded'
                      : `Planning estimate: ${formatCurrency(estimate)}/mo`}
                  </span>
                  {!recommendation.covered && (
                    <span style={{ color: PRIORITY_COLORS[affordability], fontSize: '12px', fontWeight: 600 }}>
                      {AFFORDABILITY_LABELS[affordability]}
                    </span>
                  )}
                </div>
                {!recommendation.covered && (
                  <button
                    type="button"
                    className="action-button"
                    style={{ marginTop: '16px', width: '100%' }}
                    onClick={() => openAddForm(type.value)}
                  >
                    <Plus size={16} /> Add policy
                  </button>
                )}
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <div className="dashboard-page">
      <header style={{ marginBottom: '28px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={34} /> Insurance Advisor
        </h1>
        <p style={{ color: 'var(--theme-text-secondary)', margin: '8px 0 0 46px' }}>
          Rules-based coverage suggestions from your recorded finances, policies, and selected circumstances.
        </p>
      </header>

      {financeSyncError && (
        <p role="alert" className="empty-state" style={{ color: 'var(--theme-error)', marginBottom: '20px' }}>
          Insurance policy changes may not have reached your account: {financeSyncError}. Check your connection and reload before relying on recent changes.
        </p>
      )}

      <section className="dashboard-section" style={{ marginBottom: '24px' }}>
        <h2 className="section-title"><TrendingUp size={20} /> Financial snapshot</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-label">Average monthly income</div>
            <div className="card-value">{formatCurrency(monthlyIncome)}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Average monthly expenses</div>
            <div className="card-value">{formatCurrency(monthlyExpenses)}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Surplus before insurance</div>
            <div className="card-value">{formatCurrency(budget.monthlySurplusBeforeInsurance)}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">After active premiums</div>
            <div className="card-value">{formatCurrency(budget.remainingMonthlyBudget)}</div>
          </div>
        </div>
        <p style={{ color: 'var(--theme-text-secondary)', fontSize: '13px', marginBottom: 0 }}>
          Averages use the span of months with recorded income or expenses. A positive surplus is not a guarantee of affordability.
        </p>
      </section>

      <div className="summary-cards" style={{ marginBottom: '24px' }}>
        <div className="summary-card">
          <div className="card-label">Active policies</div>
          <div className="card-value" style={{ color: 'var(--theme-success)' }}>{activePolicies.length}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Current monthly premiums</div>
          <div className="card-value">{formatCurrency(totalMonthlyCost)}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Current annual premiums</div>
          <div className="card-value">{formatCurrency(totalAnnualCost)}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Uncovered high priority types</div>
          <div className="card-value" style={{ color: 'var(--theme-error)' }}>{highPriorityUncovered}</div>
        </div>
      </div>

      <section className="dashboard-section" style={{ marginBottom: '24px' }}>
        <h2 className="section-title">Circumstances for recommendations</h2>
        <p style={{ color: 'var(--theme-text-secondary)', marginTop: 0 }}>
          These optional selections refine rules-based priorities. Expense records also supply vehicle, equipment, professional-service, and online-business signals.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {[
            ['ownsVehicle', 'I own or use a vehicle for work'],
            ['hasDependents', 'Someone depends on my income'],
            ['doesClientWork', 'I provide services directly to clients'],
            ['handlesSensitiveData', 'I handle sensitive client/customer data'],
          ].map(([key, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '9px', color: 'var(--theme-text)' }}>
              <input
                type="checkbox"
                checked={circumstances[key]}
                onChange={(event) => setCircumstance(key, event.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <div style={{ marginBottom: '24px' }}>
        <button type="button" className="action-button" onClick={() => (showForm ? closeForm() : openAddForm())}>
          {showForm ? 'Cancel' : '+ Add insurance policy'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container" style={{ marginBottom: '28px' }}>
          <h2 className="section-title">{editingId ? 'Edit policy' : 'Add policy'}</h2>
          {formError && <p role="alert" style={{ color: 'var(--theme-error)' }}>{formError}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
            <div className="form-field">
              <label htmlFor="insurance-type">Insurance type *</label>
              <select id="insurance-type" value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value })} required>
                {INSURANCE_CATALOGUE.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="insurance-provider">Provider *</label>
              <input id="insurance-provider" value={formData.provider} onChange={(event) => setFormData({ ...formData, provider: event.target.value })} required />
            </div>
            <div className="form-field">
              <label htmlFor="insurance-policy-number">Policy number</label>
              <input id="insurance-policy-number" value={formData.policyNumber} onChange={(event) => setFormData({ ...formData, policyNumber: event.target.value })} />
            </div>
            <div className="form-field">
              <label htmlFor="insurance-premium">Premium amount per payment *</label>
              <input id="insurance-premium" type="number" min="0.01" step="0.01" value={formData.premiumAmount} onChange={(event) => setFormData({ ...formData, premiumAmount: event.target.value })} required />
            </div>
            <div className="form-field">
              <label htmlFor="insurance-frequency">Payment frequency *</label>
              <select id="insurance-frequency" value={formData.paymentFrequency} onChange={(event) => setFormData({ ...formData, paymentFrequency: event.target.value })}>
                {INSURANCE_PAYMENT_FREQUENCIES.map((frequency) => (
                  <option key={frequency} value={frequency}>{frequency[0].toUpperCase() + frequency.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="insurance-coverage">Coverage amount or details</label>
              <input id="insurance-coverage" value={formData.coverageAmount} onChange={(event) => setFormData({ ...formData, coverageAmount: event.target.value })} />
            </div>
            <div className="form-field">
              <label htmlFor="insurance-start-date">Start date</label>
              <input id="insurance-start-date" type="date" value={formData.startDate} onChange={(event) => setFormData({ ...formData, startDate: event.target.value })} />
            </div>
            <div className="form-field">
              <label htmlFor="insurance-renewal-date">Renewal date</label>
              <input id="insurance-renewal-date" type="date" value={formData.renewalDate} onChange={(event) => setFormData({ ...formData, renewalDate: event.target.value })} />
            </div>
            <div className="form-field">
              <label htmlFor="insurance-status">Status *</label>
              <select id="insurance-status" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                {INSURANCE_POLICY_STATUSES.map((status) => (
                  <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <p style={{ color: 'var(--theme-text-secondary)', fontSize: '13px' }}>
            Monthly equivalent: <strong>{formatCurrency(
              Number(formData.premiumAmount) > 0 && FREQUENCY_MONTHS[formData.paymentFrequency]
                ? Number(formData.premiumAmount) / FREQUENCY_MONTHS[formData.paymentFrequency]
                : 0
            )}</strong>. Premium estimates are illustrative planning benchmarks, not quotes.
          </p>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">{editingId ? 'Save changes' : 'Add policy'}</button>
            <button type="button" className="btn-cancel" onClick={closeForm}>Cancel</button>
          </div>
        </form>
      )}

      <section className="dashboard-section" style={{ marginBottom: '28px' }}>
        <h2 className="section-title"><Shield size={20} /> My policies</h2>
        {insurance.length ? (
          <div className="data-list">
            {insurance.map((policy) => {
              const type = INSURANCE_CATALOGUE.find((entry) => entry.value === policy.type)
              const Icon = type ? ICONS[type.iconName] : Shield
              const status = getInsurancePolicyStatus(policy)
              const cost = Number(policy.monthlyCost) || 0
              const affordability = getInsuranceAffordability(cost, budget.monthlySurplusBeforeInsurance)
              const recommendation = recommendationByType.get(policy.type)
              return (
                <article className="data-item" key={policy.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={26} color={type?.iconColor || '#71717a'} />
                      <div>
                        <h3 className="item-title" style={{ margin: 0 }}>{type?.label || policy.type || 'Other policy'}</h3>
                        <div style={{ color: 'var(--theme-text-secondary)' }}>{policy.provider}</div>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button type="button" className="btn-edit" onClick={() => openEditForm(policy)}>Edit</button>
                      <button type="button" className="btn-delete" onClick={() => handleDelete(policy)}>Delete</button>
                    </div>
                  </div>
                  <div className="item-details" style={{ marginTop: '14px' }}>
                    {policy.policyNumber && <div className="item-detail"><strong>Policy number:</strong> {policy.policyNumber}</div>}
                    {policy.coverageAmount && <div className="item-detail"><strong>Coverage:</strong> {policy.coverageAmount}</div>}
                    <div className="item-detail">
                      <strong>Premium:</strong> {formatCurrency(policy.premiumAmount ?? cost * FREQUENCY_MONTHS[policy.paymentFrequency || 'monthly'])} / {policy.paymentFrequency || 'monthly'}
                    </div>
                    <div className="item-detail"><strong>Monthly equivalent:</strong> {formatCurrency(cost)}</div>
                    <div className="item-detail">
                      <strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{status}</span>
                      {policy.status === 'active' && status === 'expired' ? ' (renewal date passed)' : ''}
                    </div>
                    {policy.startDate && <div className="item-detail"><strong>Start date:</strong> {policy.startDate}</div>}
                    {policy.renewalDate && <div className="item-detail"><strong>Renewal date:</strong> {policy.renewalDate}</div>}
                    <div className="item-detail">
                      <strong>Affordability vs. pre-insurance surplus:</strong> {AFFORDABILITY_LABELS[affordability]}
                    </div>
                    {recommendation && (
                      <div className="item-detail">
                        <strong>Rules-based priority:</strong>{' '}
                        <span style={{ color: PRIORITY_COLORS[recommendation.priority], textTransform: 'capitalize' }}>
                          {recommendation.priority}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="empty-state">No policies recorded yet. Add a policy to track its provider, premium, coverage, and renewal.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">Coverage suggestions</h2>
        <p style={{ color: 'var(--theme-text-secondary)', marginTop: 0 }}>
          Priority rules (transparent heuristics): health is always high; auto is high when vehicle use or vehicle expenses are indicated, otherwise medium; liability is high for client work, medium at monthly income of at least $2,000, otherwise low; disability is high at income of at least $1,500 with positive income after expenses, medium with any other recorded income, otherwise low; life is high when you indicate dependents, medium at income of at least $3,000, otherwise low; equipment is high when equipment expenses exist and income is at least $1,500, medium when equipment expenses exist below that threshold, otherwise low; professional liability is high when client-work/professional-expense signals exist and income is at least $1,500, medium for other income at that threshold or relevant work below it, otherwise low; cyber is high for sensitive-data handling, medium for online-business expenses or income of at least $3,000, otherwise low; umbrella is medium at income of at least $5,000, otherwise low. An active policy suppresses a gap suggestion. Estimates are affordable at up to 5% of remaining monthly budget, a stretch above 5% through 10%, and over budget above 10% or when no positive budget remains.
        </p>
        <p style={{ color: 'var(--theme-text-secondary)', fontSize: '13px' }}>
          Planning estimates use fixed illustrative catalogue benchmarks from the app, not insurer quotes or personalized pricing. Real premiums and coverage depend on the provider, location, policy, and applicant. Suggestions are informational, not insurance or financial advice.
        </p>
        {PRIORITIES.map(renderRecommendationCard)}
      </section>
    </div>
  )
}
