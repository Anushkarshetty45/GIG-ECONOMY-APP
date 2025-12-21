import { useState } from 'react'
import { useFinanceStore } from '../store/financeStore'
import { Target, PiggyBank, Home, Car, GraduationCap, Plane, Heart, Laptop, TrendingUp, Shield, Gift, Trophy, Wallet, FileText } from 'lucide-react'
import './DashboardPages.css'

export default function Goals() {
  const { goals, addGoal, deleteGoal, addToGoal } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [showAddMoney, setShowAddMoney] = useState(null)
  const [addMoneyAmount, setAddMoneyAmount] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    category: 'Emergency Fund',
    customCategory: '',
    targetAmount: '',
    deadline: '',
    notes: ''
  })

  const goalCategories = [
    // Financial Security
    'Emergency Fund', 'Retirement Savings', 'Insurance Premium', 'Debt Payoff',
    // Major Purchases
    'New Car', 'Car Down Payment', 'Home Down Payment', 'Home Renovation',
    // Education & Career
    'Education Fund', 'Professional Development', 'Certification Course',
    // Travel & Experiences
    'Vacation', 'Travel Fund', 'Wedding',
    // Business & Investment
    'Business Investment', 'Equipment Purchase', 'Stock Market Investment',
    // Health & Wellness
    'Medical Expenses', 'Fitness Equipment', 'Health Insurance',
    // Personal Goals
    'Gift Fund', 'Holiday Shopping', 'Hobby Equipment',
    // Other
    'Other'
  ]

  const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes('emergency') || categoryLower.includes('insurance')) {
      return <Shield size={20} />
    } else if (categoryLower.includes('retirement') || categoryLower.includes('savings')) {
      return <PiggyBank size={20} />
    } else if (categoryLower.includes('car') || categoryLower.includes('vehicle')) {
      return <Car size={20} />
    } else if (categoryLower.includes('home') || categoryLower.includes('house') || categoryLower.includes('renovation')) {
      return <Home size={20} />
    } else if (categoryLower.includes('education') || categoryLower.includes('course') || categoryLower.includes('certification')) {
      return <GraduationCap size={20} />
    } else if (categoryLower.includes('travel') || categoryLower.includes('vacation')) {
      return <Plane size={20} />
    } else if (categoryLower.includes('medical') || categoryLower.includes('health') || categoryLower.includes('fitness')) {
      return <Heart size={20} />
    } else if (categoryLower.includes('equipment') || categoryLower.includes('laptop') || categoryLower.includes('business')) {
      return <Laptop size={20} />
    } else if (categoryLower.includes('investment') || categoryLower.includes('stock')) {
      return <TrendingUp size={20} />
    } else if (categoryLower.includes('gift') || categoryLower.includes('holiday') || categoryLower.includes('shopping')) {
      return <Gift size={20} />
    } else if (categoryLower.includes('debt') || categoryLower.includes('payoff')) {
      return <Wallet size={20} />
    } else if (categoryLower.includes('wedding')) {
      return <Trophy size={20} />
    } else {
      return <Target size={20} />
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const categoryName = formData.category === 'Other' ? formData.customCategory : formData.category
    addGoal({
      name: formData.name,
      category: categoryName,
      targetAmount: parseFloat(formData.targetAmount),
      deadline: formData.deadline || null,
      notes: formData.notes
    })
    setFormData({
      name: '',
      category: 'Emergency Fund',
      customCategory: '',
      targetAmount: '',
      deadline: '',
      notes: ''
    })
    setShowForm(false)
  }

  const handleAddMoney = (goalId) => {
    if (addMoneyAmount && !isNaN(addMoneyAmount)) {
      addToGoal(goalId, parseFloat(addMoneyAmount))
      setAddMoneyAmount('')
      setShowAddMoney(null)
    }
  }

  const getTotalSaved = () => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  }

  const getTotalTarget = () => {
    return goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  }

  const getOverallProgress = () => {
    if (getTotalTarget() === 0) return 0
    return (getTotalSaved() / getTotalTarget()) * 100
  }

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Target size={32} /> Savings Goals
        </h1>
        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--theme-text-tertiary)' }}>
          {goals.length} {goals.length === 1 ? 'Goal' : 'Goals'}
        </div>
      </div>

      {goals.length > 0 && (
        <div className="summary-cards" style={{ marginBottom: '32px' }}>
          <div className="summary-card">
            <div className="card-label">Total Saved</div>
            <div className="card-value" style={{ color: 'var(--theme-success)' }}>${getTotalSaved().toFixed(2)}</div>
            <div className="card-sublabel">Across all goals</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Total Target</div>
            <div className="card-value" style={{ color: 'var(--theme-text-tertiary)' }}>${getTotalTarget().toFixed(2)}</div>
            <div className="card-sublabel">Combined goals</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Overall Progress</div>
            <div className="card-value" style={{ color: 'var(--theme-info)' }}>{getOverallProgress().toFixed(1)}%</div>
            <div className="card-sublabel">Total completion</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Remaining</div>
            <div className="card-value" style={{ color: 'var(--theme-error)' }}>${(getTotalTarget() - getTotalSaved()).toFixed(2)}</div>
            <div className="card-sublabel">To reach all goals</div>
          </div>
        </div>
      )}

      <button className="action-button" onClick={() => setShowForm(!showForm)} style={{ marginBottom: '32px' }}>
        {showForm ? 'Cancel' : '+ Create New Goal'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-field">
              <label>Goal Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>
            <div className="form-field">
              <label>Target Amount *</label>
              <input
                type="number"
                step="0.01"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: formData.category === 'Other' ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-field">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: '' })}
                required
              >
                {goalCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {formData.category === 'Other' && (
              <div className="form-field">
                <label>Custom Category Name *</label>
                <input
                  type="text"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  placeholder="Enter category name..."
                  required
                />
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-field">
              <label>Deadline (Optional)</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Notes (Optional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional details..."
              />
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">Create Goal</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="dashboard-section">
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} /> Your Goals
        </h2>
        {goals.length > 0 ? (
          <div className="data-list">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const remaining = goal.targetAmount - goal.currentAmount
              const isCompleted = progress >= 100

              return (
                <div key={goal.id} className="data-item">
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: isCompleted ? 'var(--theme-success)15' : 'var(--theme-border)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCompleted ? 'var(--theme-success)' : 'var(--theme-text-tertiary)',
                      flexShrink: 0
                    }}>
                      {getCategoryIcon(goal.category || goal.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '4px' }}>
                            {goal.name}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--theme-text-tertiary)' }}>
                            {goal.category || 'Savings Goal'}
                          </div>
                        </div>
                        <div className="item-actions" style={{ flexShrink: 0 }}>
                          <button
                            className="btn-edit"
                            onClick={() => setShowAddMoney(showAddMoney === goal.id ? null : goal.id)}
                          >
                            {showAddMoney === goal.id ? 'Cancel' : 'Add Money'}
                          </button>
                          <button className="btn-delete" onClick={() => deleteGoal(goal.id)}>
                            Delete
                          </button>
                        </div>
                      </div>

                      {showAddMoney === goal.id && (
                        <div style={{
                          marginBottom: '16px',
                          padding: '16px',
                          background: 'var(--theme-surface)',
                          borderRadius: '8px',
                          border: '1px solid var(--theme-border)'
                        }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                            <div className="form-field" style={{ flex: 1, marginBottom: 0 }}>
                              <label style={{ fontSize: '13px' }}>Amount to Add</label>
                              <input
                                type="number"
                                step="0.01"
                                value={addMoneyAmount}
                                onChange={(e) => setAddMoneyAmount(e.target.value)}
                                placeholder="0.00"
                                autoFocus
                                style={{ marginTop: '4px' }}
                              />
                            </div>
                            <button
                              className="btn-submit"
                              onClick={() => handleAddMoney(goal.id)}
                              style={{ marginBottom: 0, padding: '10px 20px' }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}

                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', color: 'var(--theme-text-secondary)' }}>
                            ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: isCompleted ? 'var(--theme-success)' : 'var(--theme-text-tertiary)' }}>
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                        <div style={{
                          height: '10px',
                          background: 'var(--theme-border)',
                          borderRadius: '5px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${Math.min(progress, 100)}%`,
                            background: isCompleted ?
                              'var(--theme-success)' :
                              'var(--theme-text-tertiary)',
                            transition: 'width 0.3s ease',
                            borderRadius: '5px'
                          }}></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '20px', fontSize: '14px', flexWrap: 'wrap' }}>
                        {!isCompleted && (
                          <div style={{ color: 'var(--theme-text-secondary)' }}>
                            <span style={{ color: 'var(--theme-text-tertiary)', fontWeight: '500' }}>Remaining: </span>
                            ${remaining.toFixed(2)}
                          </div>
                        )}
                        {isCompleted && (
                          <div style={{ color: 'var(--theme-success)', fontWeight: '600' }}>
                            ✓ Goal Completed!
                          </div>
                        )}
                        {goal.deadline && (
                          <div style={{ color: 'var(--theme-text-secondary)' }}>
                            <span style={{ color: 'var(--theme-text-tertiary)', fontWeight: '500' }}>Deadline: </span>
                            {new Date(goal.deadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>

                      {goal.notes && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: 'var(--theme-surface)',
                          borderRadius: '6px',
                          border: '1px solid var(--theme-border)'
                        }}>
                          <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)', marginBottom: '4px', fontWeight: '500' }}>
                            Notes
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.5' }}>
                            {goal.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="empty-state">No goals set yet. Create a goal to start saving!</p>
        )}
      </div>
    </div>
  )
}
