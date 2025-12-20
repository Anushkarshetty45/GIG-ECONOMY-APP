import { useState } from 'react'
import { useFinanceStore } from '../store/financeStore'
import './DashboardPages.css'

export default function Insurance() {
  const { insurance, addInsurance, updateInsurance, deleteInsurance, getTotalInsuranceCost } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    type: 'Health',
    provider: '',
    policyNumber: '',
    monthlyCost: '',
    coverageAmount: '',
    renewalDate: ''
  })

  const insuranceTypes = [
    { value: 'Health', label: 'Health Insurance', icon: '🏥', priority: 'Critical', avgCost: 450 },
    { value: 'Auto', label: 'Auto Insurance', icon: '🚗', priority: 'Critical', avgCost: 200 },
    { value: 'Liability', label: 'Liability Insurance', icon: '🛡️', priority: 'Recommended', avgCost: 50 },
    { value: 'Disability', label: 'Disability Insurance', icon: '🏥', priority: 'Recommended', avgCost: 100 },
    { value: 'Life', label: 'Life Insurance', icon: '❤️', priority: 'Optional', avgCost: 75 },
    { value: 'Equipment', label: 'Equipment Insurance', icon: '💻', priority: 'Optional', avgCost: 30 }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    const policyData = {
      type: formData.type,
      provider: formData.provider,
      policyNumber: formData.policyNumber,
      monthlyCost: parseFloat(formData.monthlyCost),
      coverageAmount: formData.coverageAmount,
      renewalDate: formData.renewalDate
    }

    if (editingId) {
      updateInsurance(editingId, policyData)
      setEditingId(null)
    } else {
      addInsurance(policyData)
    }

    setFormData({
      type: 'Health',
      provider: '',
      policyNumber: '',
      monthlyCost: '',
      coverageAmount: '',
      renewalDate: ''
    })
    setShowForm(false)
  }

  const handleEdit = (policy) => {
    setFormData({
      type: policy.type,
      provider: policy.provider,
      policyNumber: policy.policyNumber || '',
      monthlyCost: policy.monthlyCost.toString(),
      coverageAmount: policy.coverageAmount || '',
      renewalDate: policy.renewalDate || ''
    })
    setEditingId(policy.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      type: 'Health',
      provider: '',
      policyNumber: '',
      monthlyCost: '',
      coverageAmount: '',
      renewalDate: ''
    })
  }

  const totalMonthlyCost = getTotalInsuranceCost()
  const totalAnnualCost = totalMonthlyCost * 12
  const activePolicies = insurance.length

  const getTypeInfo = (type) => {
    return insuranceTypes.find(t => t.value === type) || insuranceTypes[0]
  }

  const insuranceTips = [
    { title: '🔍 Shop Around', desc: 'Compare at least 3-5 providers to find best rates' },
    { title: '💰 Bundle & Save', desc: 'Many insurers offer discounts for multiple policies' },
    { title: '📊 Increase Deductibles', desc: 'Higher deductibles = lower premiums (if affordable)' },
    { title: '📅 Annual Payments', desc: 'Pay annually instead of monthly to save 5-10%' }
  ]

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title">🛡️ Insurance</h1>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#71717a' }}>
          Total: ${totalMonthlyCost.toFixed(2)}/mo
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-label">Total Monthly Cost</div>
          <div className="card-value" style={{ color: '#71717a' }}>${totalMonthlyCost.toFixed(2)}</div>
          <div className="card-sublabel">Per month</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Annual Cost</div>
          <div className="card-value" style={{ color: '#818cf8' }}>${totalAnnualCost.toFixed(2)}</div>
          <div className="card-sublabel">Per year</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Active Policies</div>
          <div className="card-value">{activePolicies}</div>
          <div className="card-sublabel">Coverage types</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Recommended</div>
          <div className="card-value">{6 - activePolicies > 0 ? 6 - activePolicies : 0}</div>
          <div className="card-sublabel">To consider</div>
        </div>
      </div>

      <button className="action-button" onClick={() => setShowForm(!showForm)} style={{ marginBottom: '32px' }}>
        {showForm ? 'Cancel' : '+ Add Policy'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2 className="section-title">{editingId ? 'Edit Policy' : 'Add Insurance Policy'}</h2>

          <div className="form-row">
            <div className="form-field">
              <label>Insurance Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                {insuranceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label} - ${type.avgCost}/mo avg
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Provider *</label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., Blue Cross Blue Shield"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Policy Number (Optional)</label>
              <input
                type="text"
                value={formData.policyNumber}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                placeholder="e.g., POL-123456"
              />
            </div>

            <div className="form-field">
              <label>Monthly Cost *</label>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyCost}
                onChange={(e) => setFormData({ ...formData, monthlyCost: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Coverage Amount/Details (Optional)</label>
              <input
                type="text"
                value={formData.coverageAmount}
                onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                placeholder="e.g., $500k coverage"
              />
            </div>

            <div className="form-field">
              <label>Renewal Date (Optional)</label>
              <input
                type="date"
                value={formData.renewalDate}
                onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">{editingId ? 'Update Policy' : 'Add Policy'}</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}

      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title">📋 My Policies</h2>
        {insurance.length > 0 ? (
          <div className="data-list">
            {insurance.map((policy) => {
              const typeInfo = getTypeInfo(policy.type)
              return (
                <div key={policy.id} className="data-item">
                  <div className="item-header">
                    <div>
                      <div className="item-title">
                        {typeInfo.icon} {typeInfo.label}
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#71717a', marginTop: '8px' }}>
                        ${policy.monthlyCost.toFixed(2)}/mo
                      </div>
                      <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
                        ${(policy.monthlyCost * 12).toFixed(2)}/year
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit" onClick={() => handleEdit(policy)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteInsurance(policy.id)}>Delete</button>
                    </div>
                  </div>
                  <div className="item-details">
                    <div className="item-detail"><strong>Provider:</strong> {policy.provider}</div>
                    {policy.policyNumber && (
                      <div className="item-detail"><strong>Policy:</strong> {policy.policyNumber}</div>
                    )}
                    {policy.coverageAmount && (
                      <div className="item-detail"><strong>Coverage:</strong> {policy.coverageAmount}</div>
                    )}
                    {policy.renewalDate && (
                      <div className="item-detail">
                        <strong>Renewal:</strong> {new Date(policy.renewalDate).toLocaleDateString()}
                      </div>
                    )}
                    <div className="item-detail">
                      <strong>Priority:</strong>{' '}
                      <span style={{
                        color: typeInfo.priority === 'Critical' ? '#f87171' :
                               typeInfo.priority === 'Recommended' ? '#fbbf24' : '#9ca3af',
                        fontWeight: '600'
                      }}>
                        {typeInfo.priority}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="empty-state">No insurance policies added yet. Add a policy to track your coverage.</p>
        )}
      </div>

      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title">🎯 Recommended Coverage</h2>
        <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '14px' }}>
          Gig workers should consider these insurance types to protect their income and assets:
        </p>
        <div className="dashboard-grid">
          {insuranceTypes.map((type) => {
            const hasThis = insurance.some(p => p.type === type.value)
            return (
              <div
                key={type.value}
                style={{
                  background: hasThis ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${hasThis ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ fontSize: '32px' }}>{type.icon}</div>
                  {hasThis && <div style={{ fontSize: '20px' }}>✅</div>}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                  {type.label}
                </h3>
                <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '12px' }}>
                  <span style={{
                    color: type.priority === 'Critical' ? '#f87171' :
                           type.priority === 'Recommended' ? '#fbbf24' : '#9ca3af',
                    fontWeight: '600'
                  }}>
                    {type.priority}
                  </span>
                  {' '}- ~${type.avgCost}/month
                </div>
                {!hasThis && (
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setFormData({ ...formData, type: type.value })
                      setShowForm(true)
                    }}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    Add This Policy
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">💡 Insurance Tips</h2>
        <div className="dashboard-grid">
          {insuranceTips.map((tip, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>{tip.title}</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '22px' }}>{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
