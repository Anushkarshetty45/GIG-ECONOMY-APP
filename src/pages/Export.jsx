import { useState } from 'react'
import { useFinanceStore } from '../store/financeStore'
import './DashboardPages.css'

export default function Export() {
  const { incomes, expenses, goals, insurance, getTotalIncome, getTotalExpenses } = useFinanceStore()
  const [exportType, setExportType] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [format, setFormat] = useState('csv')

  const filterByDateRange = (items) => {
    if (dateRange === 'all') return items

    const now = new Date()
    const cutoffDate = new Date()

    switch(dateRange) {
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return items
    }

    return items.filter(item => new Date(item.date || item.createdAt) >= cutoffDate)
  }

  const generateCSV = () => {
    let csv = ''
    let filename = ''

    if (exportType === 'all' || exportType === 'income') {
      const filteredIncomes = filterByDateRange(incomes)
      csv += 'INCOME REPORT\n'
      csv += 'Date,Platform,Amount,Notes\n'
      filteredIncomes.forEach(income => {
        csv += `${income.date},"${income.platform}",${income.amount},"${income.notes || ''}"\n`
      })
      csv += `\nTotal Income:,,$${getTotalIncome()}\n\n`
    }

    if (exportType === 'all' || exportType === 'expenses') {
      const filteredExpenses = filterByDateRange(expenses)
      csv += 'EXPENSE REPORT\n'
      csv += 'Date,Category,Description,Amount,Payment Method\n'
      filteredExpenses.forEach(expense => {
        csv += `${expense.date},"${expense.category}","${expense.description}",${expense.amount},"${expense.paymentMethod}"\n`
      })
      csv += `\nTotal Expenses:,,$${getTotalExpenses()}\n\n`
    }

    if (exportType === 'all') {
      csv += `NET INCOME:,,$${getTotalIncome() - getTotalExpenses()}\n`
      filename = `financial-report-${dateRange}-${Date.now()}.csv`
    } else {
      filename = `${exportType}-report-${dateRange}-${Date.now()}.csv`
    }

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generatePDF = () => {
    const filteredIncomes = filterByDateRange(incomes)
    const filteredExpenses = filterByDateRange(expenses)

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #71717a; }
          h2 { color: #1a1a2e; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #71717a; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e5e5; }
          .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          .summary { background: #f9f9f9; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>GIG ECONOMY - Financial Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <p>Period: ${dateRange === 'all' ? 'All Time' : dateRange === 'month' ? 'Last Month' : dateRange === 'quarter' ? 'Last Quarter' : 'Last Year'}</p>
    `

    if (exportType === 'all' || exportType === 'income') {
      html += `
        <h2>Income Report</h2>
        <table>
          <tr>
            <th>Date</th>
            <th>Platform</th>
            <th>Amount</th>
            <th>Notes</th>
          </tr>
      `
      filteredIncomes.forEach(income => {
        html += `
          <tr>
            <td>${new Date(income.date).toLocaleDateString()}</td>
            <td>${income.platform}</td>
            <td>$${income.amount.toFixed(2)}</td>
            <td>${income.notes || ''}</td>
          </tr>
        `
      })
      html += `</table>`
      html += `<p class="total">Total Income: $${getTotalIncome().toFixed(2)}</p>`
    }

    if (exportType === 'all' || exportType === 'expenses') {
      html += `
        <h2>Expense Report</h2>
        <table>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
      `
      filteredExpenses.forEach(expense => {
        html += `
          <tr>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
          </tr>
        `
      })
      html += `</table>`
      html += `<p class="total">Total Expenses: $${getTotalExpenses().toFixed(2)}</p>`
    }

    if (exportType === 'all') {
      const netIncome = getTotalIncome() - getTotalExpenses()
      html += `
        <div class="summary">
          <h2>Summary</h2>
          <p>Total Income: $${getTotalIncome().toFixed(2)}</p>
          <p>Total Expenses: $${getTotalExpenses().toFixed(2)}</p>
          <p class="total">Net Income: $${netIncome.toFixed(2)}</p>
          <p>Tax Estimate (25%): $${(netIncome * 0.25).toFixed(2)}</p>
        </div>
      `
    }

    html += `
      </body>
      </html>
    `

    const blob = new Blob([html], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-report-${dateRange}-${Date.now()}.html`
    a.click()
    window.URL.revokeObjectURL(url)

    alert('PDF/HTML report downloaded! Open the file in your browser and print to PDF.')
  }

  const handleExport = () => {
    if (format === 'csv') {
      generateCSV()
    } else {
      generatePDF()
    }
  }

  const quickTemplate = (template) => {
    switch(template) {
      case 'tax':
        setExportType('all')
        setDateRange('year')
        setFormat('csv')
        break
      case 'monthly':
        setExportType('all')
        setDateRange('month')
        setFormat('csv')
        break
      case 'quarterly':
        setExportType('all')
        setDateRange('quarter')
        setFormat('pdf')
        break
      case 'yearend':
        setExportType('all')
        setDateRange('year')
        setFormat('pdf')
        break
    }
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title">📥 Export Data</h1>

      <div className="form-container" style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Export Options</h2>

        <div className="form-row">
          <div className="form-field">
            <label>What to Export</label>
            <select value={exportType} onChange={(e) => setExportType(e.target.value)}>
              <option value="all">All Data</option>
              <option value="income">Income Only</option>
              <option value="expenses">Expenses Only</option>
            </select>
          </div>

          <div className="form-field">
            <label>Date Range</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Format</label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value)}
                />
                <span>CSV (Excel/Sheets)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={(e) => setFormat(e.target.value)}
                />
                <span>PDF (Formatted Report)</span>
              </label>
            </div>
          </div>
        </div>

        <button
          className="btn-submit"
          onClick={handleExport}
          style={{ width: '100%', marginTop: '24px', fontSize: '18px', padding: '16px' }}
        >
          📥 Export Data
        </button>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">⚡ Quick Templates</h2>
        <div className="action-buttons">
          <button className="action-button" onClick={() => { quickTemplate('tax'); handleExport() }}>
            Tax Preparation
          </button>
          <button className="action-button" onClick={() => { quickTemplate('monthly'); handleExport() }}>
            Monthly Summary
          </button>
          <button className="action-button" onClick={() => { quickTemplate('quarterly'); handleExport() }}>
            Quarterly Report
          </button>
          <button className="action-button" onClick={() => { quickTemplate('yearend'); handleExport() }}>
            Year-End Report
          </button>
        </div>
        <p style={{ color: '#9ca3af', marginTop: '16px', fontSize: '14px', textAlign: 'center' }}>
          Click a template to instantly download that report
        </p>
      </div>

      <div className="dashboard-section" style={{ marginTop: '32px' }}>
        <h2 className="section-title">📊 Data Summary</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-label">Income Entries</div>
            <div className="card-value">{incomes.length}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Expense Entries</div>
            <div className="card-value">{expenses.length}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Savings Goals</div>
            <div className="card-value">{goals.length}</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Insurance Policies</div>
            <div className="card-value">{insurance.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
