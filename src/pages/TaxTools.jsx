import { useState, useMemo } from 'react'
import { useFinanceStore } from '../store/financeStore'
import { useSettingsStore } from '../store/settingsStore'
import './DashboardPages.css'

export default function TaxTools() {
  const { incomes, expenses, getTotalIncome, getTotalExpenses } = useFinanceStore()
  const { formatCurrency } = useSettingsStore()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())


  const deductionCategories = useMemo(() => {
    const categories = {}
    const deductibleCategories = ['Gas', 'Office Supplies', 'Equipment', 'Software', 'Travel']

    expenses
      .filter(e => new Date(e.date).getFullYear() === selectedYear)
      .filter(e => deductibleCategories.includes(e.category))
      .forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount
      })

    return Object.entries(categories).map(([name, amount]) => ({ name, amount }))
  }, [expenses, selectedYear])

  const totalIncome = getTotalIncome()
  const totalDeductibleExpenses = deductionCategories.reduce((sum, cat) => sum + cat.amount, 0)
  const taxableIncome = totalIncome - totalDeductibleExpenses
  const estimatedTax = taxableIncome * 0.25

  const maxDeduction = Math.max(...deductionCategories.map(d => d.amount), 1)

  return (
    <div className="dashboard-page">
      <h1 className="page-title">📋 Tax Tools</h1>

      <div style={{ marginBottom: '32px' }}>
        <label style={{ color: '#e5e5e5', marginRight: '12px' }}>Tax Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'var(--theme-text)',
            fontSize: '14px'
          }}
        >
          {[2025, 2024, 2023, 2022].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-label">Total Income</div>
          <div className="card-value income">{formatCurrency(totalIncome)}</div>
          <div className="card-sublabel">{selectedYear} YTD</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Deductible Expenses</div>
          <div className="card-value expense">{formatCurrency(totalDeductibleExpenses)}</div>
          <div className="card-sublabel">Business</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Taxable Income</div>
          <div className="card-value net">{formatCurrency(taxableIncome)}</div>
          <div className="card-sublabel">After deductions</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Est. Tax Bill</div>
          <div className="card-value tax">{formatCurrency(estimatedTax)}</div>
          <div className="card-sublabel">25% rate</div>
        </div>
      </div>

      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title">🏷️ Deduction Categories</h2>
        {deductionCategories.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {deductionCategories.map((cat) => {
              const percentage = (cat.amount / maxDeduction) * 100
              return (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#e5e5e5', fontWeight: '500' }}>{cat.name}</span>
                    <span style={{ color: '#34d399', fontWeight: '600' }}>{formatCurrency(cat.amount)}</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, #52525b 0%, #71717a 100%)',
                        transition: 'width 0.3s'
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="empty-state">No deductible expenses for {selectedYear}</p>
        )}
      </div>

    </div>
  )
}
