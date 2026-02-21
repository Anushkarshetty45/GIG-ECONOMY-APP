import React, { useState } from 'react'
import { useFinanceStore } from '../store/financeStore'
import { DollarSign, Car, Package, Utensils, ShoppingBag, Briefcase, Code, Pencil, Video, Book, Truck, Home, FileText } from 'lucide-react'
import './DashboardPages.css'

export default function Income() {
  const { incomes, addIncome, deleteIncome, getTotalIncome } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    platform: 'Uber',
    customPlatform: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const platforms = [
    // Rideshare
    'Uber', 'Lyft', 'Via', 'Bolt',
    // Food Delivery
    'DoorDash', 'Uber Eats', 'Grubhub', 'Postmates', 'Deliveroo', 'Just Eat',
    // Grocery Delivery
    'Instacart', 'Shipt', 'Amazon Flex', 'Gopuff',
    // Package Delivery
    'FedEx', 'UPS', 'USPS', 'DHL',
    // Freelancing
    'Upwork', 'Fiverr', 'Freelancer', 'Toptal', 'PeoplePerHour',
    // Creative
    'Behance', 'Dribbble', '99designs',
    // Content Creation
    'YouTube', 'Twitch', 'Medium', 'Substack',
    // Task Services
    'TaskRabbit', 'Thumbtack', 'Handy',
    // Tutoring
    'VIPKid', 'Chegg', 'Tutor.com', 'Wyzant',
    // Other
    'Other'
  ]

  const getPlatformIcon = (platform) => {
    const platformLower = platform.toLowerCase()
    if (platformLower.includes('uber') || platformLower.includes('lyft') || platformLower.includes('via') || platformLower.includes('bolt')) {
      return <Car size={20} />
    } else if (platformLower.includes('door') || platformLower.includes('eats') || platformLower.includes('grub') || platformLower.includes('postmates') || platformLower.includes('deliveroo') || platformLower.includes('just eat')) {
      return <Utensils size={20} />
    } else if (platformLower.includes('instacart') || platformLower.includes('shipt') || platformLower.includes('gopuff')) {
      return <ShoppingBag size={20} />
    } else if (platformLower.includes('fedex') || platformLower.includes('ups') || platformLower.includes('usps') || platformLower.includes('dhl') || platformLower.includes('amazon')) {
      return <Package size={20} />
    } else if (platformLower.includes('upwork') || platformLower.includes('fiverr') || platformLower.includes('freelancer') || platformLower.includes('toptal') || platformLower.includes('peopleperhour')) {
      return <Briefcase size={20} />
    } else if (platformLower.includes('behance') || platformLower.includes('dribbble') || platformLower.includes('99designs')) {
      return <Pencil size={20} />
    } else if (platformLower.includes('youtube') || platformLower.includes('twitch')) {
      return <Video size={20} />
    } else if (platformLower.includes('medium') || platformLower.includes('substack')) {
      return <Book size={20} />
    } else if (platformLower.includes('task') || platformLower.includes('thumbtack') || platformLower.includes('handy')) {
      return <Home size={20} />
    } else if (platformLower.includes('tutor') || platformLower.includes('vipkid') || platformLower.includes('chegg') || platformLower.includes('wyzant')) {
      return <Book size={20} />
    } else {
      return <DollarSign size={20} />
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const platformName = formData.platform === 'Other' ? formData.customPlatform : formData.platform
    addIncome({
      amount: parseFloat(formData.amount),
      platform: platformName,
      date: formData.date,
      notes: formData.notes
    })
    setFormData({ amount: '', platform: 'Uber', customPlatform: '', date: new Date().toISOString().split('T')[0], notes: '' })
    setShowForm(false)
  }

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DollarSign size={32} /> Income
        </h1>
        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--theme-success)' }}>
          Total: ${getTotalIncome().toFixed(2)}
        </div>
      </div>

      <button className="action-button" onClick={() => setShowForm(!showForm)} style={{ marginBottom: '32px' }}>
        {showForm ? 'Cancel' : '+ Add Income'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-field">
              <label>Amount *</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-field">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: formData.platform === 'Other' ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-field">
              <label>Platform *</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value, customPlatform: '' })}
                required
              >
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {formData.platform === 'Other' && (
              <div className="form-field">
                <label>Custom Platform Name *</label>
                <input
                  type="text"
                  value={formData.customPlatform}
                  onChange={(e) => setFormData({ ...formData, customPlatform: e.target.value })}
                  placeholder="Enter platform name..."
                  required
                />
              </div>
            )}
          </div>
          <div className="form-field" style={{ marginBottom: '20px' }}>
            <label>Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details..."
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">Save Income</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="dashboard-section">
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} /> Income History
        </h2>
        {incomes.length > 0 ? (
          <div className="data-list">
            {incomes.map((income) => (
              <div key={income.id} className="data-item">
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--theme-success)',
                    flexShrink: 0
                  }}>
                    {getPlatformIcon(income.platform)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '4px' }}>
                          {income.platform}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--theme-text-tertiary)' }}>
                          {new Date(income.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <button className="btn-delete" onClick={() => deleteIncome(income.id)} style={{ flexShrink: 0 }}>
                        Delete
                      </button>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--theme-success)', marginBottom: income.notes ? '12px' : '0' }}>
                      ${income.amount.toFixed(2)}
                    </div>
                    {income.notes && (
                      <div style={{ padding: '12px', background: 'var(--theme-surface)', borderRadius: '6px', border: '1px solid var(--theme-border)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)', marginBottom: '4px', fontWeight: '500' }}>Notes</div>
                        <div style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.5' }}>{income.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No income entries yet. Click "Add Income" to track your earnings!</p>
        )}
      </div>
    </div>
  )
}
