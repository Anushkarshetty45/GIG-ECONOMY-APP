import { useState, useMemo } from 'react'
import { useFinanceStore } from '../store/financeStore'
import './DashboardPages.css'

export default function TaxTools() {
  const { incomes, expenses, getTotalIncome, getTotalExpenses } = useFinanceStore()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [checklist, setChecklist] = useState({
    gather1099: false,
    reviewExpenses: false,
    calculateMileage: false,
    organizeReceipts: false,
    consultTax: false,
    makePayment: false
  })

  const getQuarterDates = (quarter, year) => {
    const quarters = {
      1: { start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
      2: { start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
      3: { start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
      4: { start: new Date(year, 9, 1), end: new Date(year, 11, 31) }
    }
    return quarters[quarter]
  }

  const calculateQuarterly = () => {
    const quarterlyData = []

    for (let quarter = 1; quarter <= 4; quarter++) {
      const { start, end } = getQuarterDates(quarter, selectedYear)

      const quarterIncome = incomes
        .filter(i => {
          const date = new Date(i.date)
          return date >= start && date <= end
        })
        .reduce((sum, i) => sum + i.amount, 0)

      const quarterExpenses = expenses
        .filter(e => {
          const date = new Date(e.date)
          return date >= start && date <= end
        })
        .reduce((sum, e) => sum + e.amount, 0)

      const taxableIncome = quarterIncome - quarterExpenses
      const estimatedTax = taxableIncome * 0.25

      quarterlyData.push({
        quarter: `Q${quarter}`,
        income: quarterIncome,
        expenses: quarterExpenses,
        taxable: taxableIncome,
        tax: estimatedTax
      })
    }

    return quarterlyData
  }

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

  const quarterlyData = calculateQuarterly()
  const maxDeduction = Math.max(...deductionCategories.map(d => d.amount), 1)

  const toggleChecklistItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const taxTips = [
    { icon: '💡', title: 'Track Everything', desc: 'Keep detailed records of all income and expenses' },
    { icon: '📅', title: 'Quarterly Payments', desc: 'Make estimated tax payments quarterly to avoid penalties' },
    { icon: '🚗', title: 'Mileage Deduction', desc: 'Track business miles - standard rate $0.67/mi for 2024' },
    { icon: '🏠', title: 'Home Office', desc: 'If you work from home, you may qualify for deductions' }
  ]

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
            color: '#ffffff',
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
          <div className="card-value income">${totalIncome.toFixed(2)}</div>
          <div className="card-sublabel">{selectedYear} YTD</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Deductible Expenses</div>
          <div className="card-value expense">${totalDeductibleExpenses.toFixed(2)}</div>
          <div className="card-sublabel">Business</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Taxable Income</div>
          <div className="card-value net">${taxableIncome.toFixed(2)}</div>
          <div className="card-sublabel">After deductions</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Est. Tax Bill</div>
          <div className="card-value tax">${estimatedTax.toFixed(2)}</div>
          <div className="card-sublabel">25% rate</div>
        </div>
      </div>

      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title">📊 Quarterly Breakdown - {selectedYear}</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#e5e5e5' }}>Quarter</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#e5e5e5' }}>Income</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#e5e5e5' }}>Expenses</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#e5e5e5' }}>Taxable</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#e5e5e5' }}>Est. Tax</th>
              </tr>
            </thead>
            <tbody>
              {quarterlyData.map((q, index) => (
                <tr key={q.quarter} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', color: '#ffffff', fontWeight: '600' }}>{q.quarter}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#34d399' }}>${q.income.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#f87171' }}>${q.expenses.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#818cf8' }}>${q.taxable.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#fbbf24', fontWeight: '600' }}>${q.tax.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                    <span style={{ color: '#34d399', fontWeight: '600' }}>${cat.amount.toFixed(2)}</span>
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

      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title">✅ Tax Preparation Checklist</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checklist.gather1099}
              onChange={() => toggleChecklistItem('gather1099')}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: '#e5e5e5' }}>Gather all 1099 forms</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checklist.reviewExpenses}
              onChange={() => toggleChecklistItem('reviewExpenses')}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: '#e5e5e5' }}>Review deductible expenses</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checklist.calculateMileage}
              onChange={() => toggleChecklistItem('calculateMileage')}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: '#e5e5e5' }}>Calculate mileage deduction</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checklist.organizeReceipts}
              onChange={() => toggleChecklistItem('organizeReceipts')}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: '#e5e5e5' }}>Organize receipts</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checklist.consultTax}
              onChange={() => toggleChecklistItem('consultTax')}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: '#e5e5e5' }}>Consult tax professional</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checklist.makePayment}
              onChange={() => toggleChecklistItem('makePayment')}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: '#e5e5e5' }}>Make estimated payment</span>
          </label>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">💡 Tax Tips for Gig Workers</h2>
        <div className="dashboard-grid">
          {taxTips.map((tip, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tip.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>{tip.title}</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '22px' }}>{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
