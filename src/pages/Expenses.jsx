import { useState } from 'react'
import { useFinanceStore } from '../store/financeStore'
import { CreditCard, Fuel, Utensils, ShoppingCart, Wrench, Laptop, Plane, Home, Phone, Heart, Car, Zap, Coffee, FileText, DollarSign } from 'lucide-react'
import './DashboardPages.css'

export default function Expenses() {
  const { expenses, addExpense, deleteExpense, getTotalExpenses } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Gas & Fuel',
    customCategory: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card'
  })

  const categories = [
    // Transportation
    'Gas & Fuel', 'Car Maintenance', 'Car Insurance', 'Parking', 'Tolls',
    // Food & Dining
    'Groceries', 'Restaurants', 'Coffee & Snacks',
    // Business Expenses
    'Office Supplies', 'Equipment', 'Software & Subscriptions', 'Internet & Phone',
    'Marketing & Advertising', 'Professional Services',
    // Vehicle
    'Vehicle Lease', 'Vehicle Repairs', 'Car Wash',
    // Travel
    'Airfare', 'Hotels', 'Travel Meals',
    // Utilities
    'Electricity', 'Water', 'Rent',
    // Health
    'Health Insurance', 'Medical Expenses',
    // Other
    'Taxes', 'Fees', 'Miscellaneous', 'Other'
  ]

  const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Digital Wallet', 'Other']

  const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes('gas') || categoryLower.includes('fuel')) {
      return <Fuel size={20} />
    } else if (categoryLower.includes('car') || categoryLower.includes('vehicle') || categoryLower.includes('parking') || categoryLower.includes('toll')) {
      return <Car size={20} />
    } else if (categoryLower.includes('food') || categoryLower.includes('restaurant') || categoryLower.includes('groceries') || categoryLower.includes('meal')) {
      return <Utensils size={20} />
    } else if (categoryLower.includes('coffee') || categoryLower.includes('snack')) {
      return <Coffee size={20} />
    } else if (categoryLower.includes('office') || categoryLower.includes('supplies')) {
      return <ShoppingCart size={20} />
    } else if (categoryLower.includes('equipment') || categoryLower.includes('repair') || categoryLower.includes('maintenance') || categoryLower.includes('wash')) {
      return <Wrench size={20} />
    } else if (categoryLower.includes('software') || categoryLower.includes('subscription') || categoryLower.includes('internet') || categoryLower.includes('phone')) {
      return <Laptop size={20} />
    } else if (categoryLower.includes('travel') || categoryLower.includes('airfare') || categoryLower.includes('hotel')) {
      return <Plane size={20} />
    } else if (categoryLower.includes('rent') || categoryLower.includes('utilities') || categoryLower.includes('electricity') || categoryLower.includes('water')) {
      return <Home size={20} />
    } else if (categoryLower.includes('health') || categoryLower.includes('medical') || categoryLower.includes('insurance')) {
      return <Heart size={20} />
    } else if (categoryLower.includes('marketing') || categoryLower.includes('advertising') || categoryLower.includes('professional')) {
      return <FileText size={20} />
    } else if (categoryLower.includes('tax') || categoryLower.includes('fee')) {
      return <DollarSign size={20} />
    } else {
      return <CreditCard size={20} />
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const categoryName = formData.category === 'Other' ? formData.customCategory : formData.category
    addExpense({
      amount: parseFloat(formData.amount),
      category: categoryName,
      date: formData.date,
      paymentMethod: formData.paymentMethod
    })
    setFormData({ amount: '', category: 'Gas & Fuel', customCategory: '', date: new Date().toISOString().split('T')[0], paymentMethod: 'Credit Card' })
    setShowForm(false)
  }

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CreditCard size={32} /> Expenses
        </h1>
        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--theme-error)' }}>
          Total: ${getTotalExpenses().toFixed(2)}
        </div>
      </div>

      <button className="action-button" onClick={() => setShowForm(!showForm)} style={{ marginBottom: '32px' }}>
        {showForm ? 'Cancel' : '+ Add Expense'}
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
          <div style={{ display: 'grid', gridTemplateColumns: formData.category === 'Other' ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="form-field">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: '' })}
                required
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
          <div className="form-field" style={{ marginBottom: '20px' }}>
            <label>Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">Save Expense</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="dashboard-section">
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} /> Expense History
        </h2>
        {expenses.length > 0 ? (
          <div className="data-list">
            {expenses.map((expense) => (
              <div key={expense.id} className="data-item">
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--theme-error)',
                    flexShrink: 0
                  }}>
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '4px' }}>
                          {expense.category}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--theme-text-tertiary)' }}>
                          {new Date(expense.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <button className="btn-delete" onClick={() => deleteExpense(expense.id)} style={{ flexShrink: 0 }}>
                        Delete
                      </button>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--theme-error)', marginBottom: '8px' }}>
                      ${expense.amount.toFixed(2)}
                    </div>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: 'var(--theme-text-secondary)' }}>
                      <div>
                        <span style={{ color: 'var(--theme-text-tertiary)', fontWeight: '500' }}>Payment: </span>
                        {expense.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No expenses yet. Start tracking your business expenses!</p>
        )}
      </div>
    </div>
  )
}
