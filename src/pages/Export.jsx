import { useState, useMemo } from 'react'
import { useFinanceStore } from '../store/financeStore'
import { Download, FileText, FileSpreadsheet, Calendar, DollarSign, Settings, Zap, Receipt, TrendingUp, BarChart3, PieChart } from 'lucide-react'
import './DashboardPages.css'

export default function Export() {
  const { incomes, expenses, goals, insurance, getTotalIncome, getTotalExpenses, receipts } = useFinanceStore()
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

  const getDateRangeText = () => {
    switch(dateRange) {
      case 'month': return 'Last 30 Days'
      case 'quarter': return 'Last Quarter (90 Days)'
      case 'year': return 'Last Year (12 Months)'
      default: return 'All Time'
    }
  }

  const calculateCategoryBreakdown = (items, field) => {
    const breakdown = {}
    items.forEach(item => {
      const category = item[field] || 'Uncategorized'
      if (!breakdown[category]) {
        breakdown[category] = { total: 0, count: 0, items: [] }
      }
      breakdown[category].total += item.amount
      breakdown[category].count += 1
      breakdown[category].items.push(item)
    })
    return breakdown
  }

  const calculateMonthlyBreakdown = (items) => {
    const monthly = {}
    items.forEach(item => {
      const date = new Date(item.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

      if (!monthly[monthKey]) {
        monthly[monthKey] = { month: monthName, total: 0, count: 0 }
      }
      monthly[monthKey].total += item.amount
      monthly[monthKey].count += 1
    })
    return Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month))
  }

  const generateDetailedCSV = () => {
    const filteredIncomes = filterByDateRange(incomes)
    const filteredExpenses = filterByDateRange(expenses)

    const totalIncome = filteredIncomes.reduce((sum, i) => sum + i.amount, 0)
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    const netIncome = totalIncome - totalExpenses

    let csv = ''
    const dateGenerated = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Header Section
    csv += '═══════════════════════════════════════════════════════════════\n'
    csv += '                    GIG ECONOMY FINANCIAL REPORT                \n'
    csv += '═══════════════════════════════════════════════════════════════\n'
    csv += `Report Generated: ${dateGenerated}\n`
    csv += `Report Period: ${getDateRangeText()}\n`
    csv += `Report Type: ${exportType === 'all' ? 'Complete Financial Report' : exportType === 'income' ? 'Income Report' : 'Expense Report'}\n`
    csv += '═══════════════════════════════════════════════════════════════\n\n'

    // Executive Summary
    csv += '═══ EXECUTIVE SUMMARY ═══\n\n'
    csv += `Total Income:,"$${totalIncome.toFixed(2)}"\n`
    csv += `Total Expenses:,"$${totalExpenses.toFixed(2)}"\n`
    csv += `Net Income:,"$${netIncome.toFixed(2)}"\n`
    csv += `Profit Margin:,"${totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(2) : 0}%"\n`
    csv += `Estimated Tax (25%):,"$${(netIncome * 0.25).toFixed(2)}"\n`
    csv += `Net After Tax:,"$${(netIncome * 0.75).toFixed(2)}"\n\n`

    csv += `Total Transactions:,${filteredIncomes.length + filteredExpenses.length}\n`
    csv += `Income Transactions:,${filteredIncomes.length}\n`
    csv += `Expense Transactions:,${filteredExpenses.length}\n`
    csv += `Average Income per Transaction:,"$${filteredIncomes.length > 0 ? (totalIncome / filteredIncomes.length).toFixed(2) : '0.00'}"\n`
    csv += `Average Expense per Transaction:,"$${filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toFixed(2) : '0.00'}"\n\n`

    // Income Section
    if (exportType === 'all' || exportType === 'income') {
      csv += '═══════════════════════════════════════════════════════════════\n'
      csv += '                         INCOME REPORT                         \n'
      csv += '═══════════════════════════════════════════════════════════════\n\n'

      // Income by Platform Breakdown
      const platformBreakdown = calculateCategoryBreakdown(filteredIncomes, 'platform')
      csv += '─── Income by Platform ───\n\n'
      csv += 'Platform,Total Amount,Number of Transactions,Average per Transaction,Percentage of Total\n'

      Object.entries(platformBreakdown)
        .sort((a, b) => b[1].total - a[1].total)
        .forEach(([platform, data]) => {
          const percentage = (data.total / totalIncome) * 100
          const average = data.total / data.count
          csv += `"${platform}","$${data.total.toFixed(2)}",${data.count},"$${average.toFixed(2)}","${percentage.toFixed(2)}%"\n`
        })

      csv += '\n─── Detailed Income Transactions ───\n\n'
      csv += 'Transaction #,Date,Day of Week,Platform,Amount,Notes,Month,Quarter\n'

      filteredIncomes.forEach((income, index) => {
        const date = new Date(income.date)
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' })
        const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const quarter = `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`

        csv += `${index + 1},${income.date},${dayOfWeek},"${income.platform}","$${income.amount.toFixed(2)}","${income.notes || 'N/A'}","${month}","${quarter}"\n`
      })

      // Monthly Income Breakdown
      const monthlyIncome = calculateMonthlyBreakdown(filteredIncomes)
      if (monthlyIncome.length > 1) {
        csv += '\n─── Monthly Income Analysis ───\n\n'
        csv += 'Month,Total Income,Number of Transactions,Average per Transaction,Growth Rate\n'

        monthlyIncome.forEach((month, index) => {
          const average = month.total / month.count
          let growthRate = 'N/A'
          if (index > 0) {
            const prevMonth = monthlyIncome[index - 1]
            growthRate = `${(((month.total - prevMonth.total) / prevMonth.total) * 100).toFixed(2)}%`
          }
          csv += `"${month.month}","$${month.total.toFixed(2)}",${month.count},"$${average.toFixed(2)}","${growthRate}"\n`
        })
      }

      csv += `\n\nTOTAL INCOME:,"$${totalIncome.toFixed(2)}"\n\n\n`
    }

    // Expense Section
    if (exportType === 'all' || exportType === 'expenses') {
      csv += '═══════════════════════════════════════════════════════════════\n'
      csv += '                        EXPENSE REPORT                         \n'
      csv += '═══════════════════════════════════════════════════════════════\n\n'

      // Expense by Category Breakdown
      const categoryBreakdown = calculateCategoryBreakdown(filteredExpenses, 'category')
      csv += '─── Expenses by Category ───\n\n'
      csv += 'Category,Total Amount,Number of Transactions,Average per Transaction,Percentage of Total,Tax Deductible (Est.)\n'

      Object.entries(categoryBreakdown)
        .sort((a, b) => b[1].total - a[1].total)
        .forEach(([category, data]) => {
          const percentage = (data.total / totalExpenses) * 100
          const average = data.total / data.count
          const taxDeductible = data.total * 0.8 // Estimate 80% as deductible
          csv += `"${category}","$${data.total.toFixed(2)}",${data.count},"$${average.toFixed(2)}","${percentage.toFixed(2)}%","$${taxDeductible.toFixed(2)}"\n`
        })

      csv += '\n─── Detailed Expense Transactions ───\n\n'
      csv += 'Transaction #,Date,Day of Week,Category,Amount,Payment Method,Month,Quarter,Tax Deductible (Est.)\n'

      filteredExpenses.forEach((expense, index) => {
        const date = new Date(expense.date)
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' })
        const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const quarter = `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`
        const taxDeductible = expense.amount * 0.8

        csv += `${index + 1},${expense.date},${dayOfWeek},"${expense.category}","$${expense.amount.toFixed(2)}","${expense.paymentMethod || 'N/A'}","${month}","${quarter}","$${taxDeductible.toFixed(2)}"\n`
      })

      // Monthly Expense Breakdown
      const monthlyExpenses = calculateMonthlyBreakdown(filteredExpenses)
      if (monthlyExpenses.length > 1) {
        csv += '\n─── Monthly Expense Analysis ───\n\n'
        csv += 'Month,Total Expenses,Number of Transactions,Average per Transaction,Change from Previous Month\n'

        monthlyExpenses.forEach((month, index) => {
          const average = month.total / month.count
          let change = 'N/A'
          if (index > 0) {
            const prevMonth = monthlyExpenses[index - 1]
            change = `${(((month.total - prevMonth.total) / prevMonth.total) * 100).toFixed(2)}%`
          }
          csv += `"${month.month}","$${month.total.toFixed(2)}",${month.count},"$${average.toFixed(2)}","${change}"\n`
        })
      }

      csv += `\n\nTOTAL EXPENSES:,"$${totalExpenses.toFixed(2)}"\n`
      csv += `ESTIMATED TAX DEDUCTIBLE:,"$${(totalExpenses * 0.8).toFixed(2)}"\n\n\n`
    }

    // Final Summary
    if (exportType === 'all') {
      csv += '═══════════════════════════════════════════════════════════════\n'
      csv += '                        FINAL SUMMARY                          \n'
      csv += '═══════════════════════════════════════════════════════════════\n\n'

      csv += 'Metric,Amount\n'
      csv += `Total Income,"$${totalIncome.toFixed(2)}"\n`
      csv += `Total Expenses,"$${totalExpenses.toFixed(2)}"\n`
      csv += `Net Income (Profit/Loss),"$${netIncome.toFixed(2)}"\n`
      csv += `Profit Margin,"${totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(2) : 0}%"\n\n`

      csv += `Estimated Tax Deductions,"$${(totalExpenses * 0.8).toFixed(2)}"\n`
      csv += `Taxable Income,"$${(netIncome - (totalExpenses * 0.8)).toFixed(2)}"\n`
      csv += `Estimated Tax Liability (25%),"$${(netIncome * 0.25).toFixed(2)}"\n`
      csv += `Net After Tax,"$${(netIncome * 0.75).toFixed(2)}"\n\n`

      csv += '─── Savings Goals Progress ───\n\n'
      if (goals.length > 0) {
        csv += 'Goal,Target Amount,Current Amount,Remaining,Progress %\n'
        goals.forEach(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          csv += `"${goal.name}","$${goal.targetAmount.toFixed(2)}","$${goal.currentAmount.toFixed(2)}","$${(goal.targetAmount - goal.currentAmount).toFixed(2)}","${progress.toFixed(2)}%"\n`
        })
      } else {
        csv += 'No savings goals set.\n'
      }

      csv += '\n═══════════════════════════════════════════════════════════════\n'
      csv += '                       END OF REPORT                           \n'
      csv += '═══════════════════════════════════════════════════════════════\n'
    }

    // Download
    const filename = `GigEconomy_${exportType === 'all' ? 'Complete' : exportType === 'income' ? 'Income' : 'Expense'}_Report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateProfessionalPDF = () => {
    const filteredIncomes = filterByDateRange(incomes)
    const filteredExpenses = filterByDateRange(expenses)

    const totalIncome = filteredIncomes.reduce((sum, i) => sum + i.amount, 0)
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    const netIncome = totalIncome - totalExpenses

    const platformBreakdown = calculateCategoryBreakdown(filteredIncomes, 'platform')
    const categoryBreakdown = calculateCategoryBreakdown(filteredExpenses, 'category')
    const monthlyIncome = calculateMonthlyBreakdown(filteredIncomes)
    const monthlyExpenses = calculateMonthlyBreakdown(filteredExpenses)

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>GIG ECONOMY Financial Report</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', 'Arial', sans-serif;
            line-height: 1.6;
            color: #1a1a2e;
            background: #ffffff;
            padding: 20px;
          }

          .header {
            background: linear-gradient(135deg, #52525b 0%, #71717a 100%);
            color: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .header h1 {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
          }

          .header .subtitle {
            font-size: 16px;
            opacity: 0.95;
            font-weight: 500;
          }

          .header .meta {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            justify-content: space-between;
            font-size: 14px;
          }

          .executive-summary {
            background: linear-gradient(135deg, #f5f7fa 0%, #e5e7eb 100%);
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 6px solid #71717a;
          }

          .executive-summary h2 {
            color: #52525b;
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 700;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 20px;
          }

          .summary-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border-left: 4px solid #71717a;
          }

          .summary-card.income {
            border-left-color: #10b981;
          }

          .summary-card.expense {
            border-left-color: #ef4444;
          }

          .summary-card.net {
            border-left-color: ${netIncome >= 0 ? '#10b981' : '#ef4444'};
          }

          .summary-card .label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 8px;
          }

          .summary-card .value {
            font-size: 32px;
            font-weight: 700;
            color: #1e293b;
          }

          .summary-card .subvalue {
            font-size: 13px;
            color: #64748b;
            margin-top: 6px;
          }

          .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }

          .section-header {
            background: linear-gradient(90deg, #52525b 0%, #71717a 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.3px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            overflow: hidden;
          }

          th {
            background: linear-gradient(135deg, #52525b 0%, #71717a 100%);
            color: white;
            padding: 14px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          td {
            padding: 12px 14px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }

          tr:last-child td {
            border-bottom: none;
          }

          tr:hover {
            background: #f8fafc;
          }

          .breakdown-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
            margin-top: 20px;
          }

          .breakdown-card {
            background: white;
            padding: 24px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border-top: 4px solid #71717a;
          }

          .breakdown-card h3 {
            color: #52525b;
            font-size: 18px;
            margin-bottom: 16px;
            font-weight: 700;
          }

          .breakdown-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
            align-items: center;
          }

          .breakdown-item:last-child {
            border-bottom: none;
          }

          .breakdown-item .name {
            font-weight: 600;
            color: #334155;
            font-size: 14px;
          }

          .breakdown-item .amount {
            font-weight: 700;
            color: #1e293b;
            font-size: 15px;
          }

          .breakdown-item .percentage {
            font-size: 12px;
            color: #64748b;
            margin-left: 8px;
          }

          .total-row {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            font-weight: 700;
            font-size: 16px;
            color: #1e293b;
          }

          .tax-section {
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            padding: 24px;
            border-radius: 10px;
            margin-top: 20px;
            border-left: 6px solid #f97316;
          }

          .tax-section h3 {
            color: #ea580c;
            font-size: 18px;
            margin-bottom: 16px;
            font-weight: 700;
          }

          .tax-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }

          .tax-row.highlight {
            font-weight: 700;
            font-size: 16px;
            padding-top: 12px;
            border-top: 2px solid #f97316;
            margin-top: 8px;
            color: #ea580c;
          }

          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 13px;
          }

          .page-break {
            page-break-after: always;
          }

          @media print {
            body {
              padding: 0;
            }
            .header {
              box-shadow: none;
            }
            table {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="header">
          <h1>Financial Performance Report</h1>
          <div class="subtitle">GIG ECONOMY - Professional Financial Analysis</div>
          <div class="meta">
            <div>
              <strong>Report Period:</strong> ${getDateRangeText()}
            </div>
            <div>
              <strong>Generated:</strong> ${new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div class="executive-summary">
          <h2>Executive Summary</h2>
          <div class="summary-grid">
            <div class="summary-card income">
              <div class="label">Total Income</div>
              <div class="value" style="color: #10b981;">$${totalIncome.toFixed(2)}</div>
              <div class="subvalue">${filteredIncomes.length} transactions</div>
            </div>
            <div class="summary-card expense">
              <div class="label">Total Expenses</div>
              <div class="value" style="color: #ef4444;">$${totalExpenses.toFixed(2)}</div>
              <div class="subvalue">${filteredExpenses.length} transactions</div>
            </div>
            <div class="summary-card net">
              <div class="label">Net Income</div>
              <div class="value" style="color: ${netIncome >= 0 ? '#10b981' : '#ef4444'};">$${netIncome.toFixed(2)}</div>
              <div class="subvalue">${totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0}% profit margin</div>
            </div>
          </div>
        </div>
    `

    // Income Section
    if (exportType === 'all' || exportType === 'income') {
      html += `
        <div class="section">
          <div class="section-header">Income Analysis</div>

          <div class="breakdown-grid">
            <div class="breakdown-card">
              <h3>Income by Platform</h3>
              ${Object.entries(platformBreakdown)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 10)
                .map(([platform, data]) => {
                  const percentage = ((data.total / totalIncome) * 100).toFixed(1)
                  return `
                    <div class="breakdown-item">
                      <div class="name">${platform}</div>
                      <div>
                        <span class="amount">$${data.total.toFixed(2)}</span>
                        <span class="percentage">(${percentage}%)</span>
                      </div>
                    </div>
                  `
                }).join('')}
            </div>

            <div class="breakdown-card">
              <h3>Monthly Income Trend</h3>
              ${monthlyIncome.slice(-6).map(month => `
                <div class="breakdown-item">
                  <div class="name">${month.month}</div>
                  <div>
                    <span class="amount">$${month.total.toFixed(2)}</span>
                    <span class="percentage">(${month.count} txns)</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <table style="margin-top: 25px;">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Platform</th>
                <th style="text-align: right;">Amount</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${filteredIncomes.slice(0, 50).map((income, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${new Date(income.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</td>
                  <td>${income.platform}</td>
                  <td style="text-align: right; font-weight: 600; color: #10b981;">$${income.amount.toFixed(2)}</td>
                  <td style="font-size: 12px; color: #64748b;">${income.notes || 'N/A'}</td>
                </tr>
              `).join('')}
              ${filteredIncomes.length > 50 ? `
                <tr>
                  <td colspan="5" style="text-align: center; color: #64748b; font-style: italic;">
                    ... and ${filteredIncomes.length - 50} more transactions
                  </td>
                </tr>
              ` : ''}
              <tr class="total-row">
                <td colspan="3"><strong>TOTAL INCOME</strong></td>
                <td style="text-align: right;"><strong>$${totalIncome.toFixed(2)}</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      `

      if (exportType !== 'all') {
        html += '<div class="page-break"></div>'
      }
    }

    // Expense Section
    if (exportType === 'all' || exportType === 'expenses') {
      html += `
        ${exportType === 'all' ? '<div class="page-break"></div>' : ''}

        <div class="section">
          <div class="section-header">Expense Analysis</div>

          <div class="breakdown-grid">
            <div class="breakdown-card" style="border-top-color: #ef4444;">
              <h3 style="color: #ef4444;">Expenses by Category</h3>
              ${Object.entries(categoryBreakdown)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 10)
                .map(([category, data]) => {
                  const percentage = ((data.total / totalExpenses) * 100).toFixed(1)
                  return `
                    <div class="breakdown-item">
                      <div class="name">${category}</div>
                      <div>
                        <span class="amount">$${data.total.toFixed(2)}</span>
                        <span class="percentage">(${percentage}%)</span>
                      </div>
                    </div>
                  `
                }).join('')}
            </div>

            <div class="breakdown-card" style="border-top-color: #ef4444;">
              <h3 style="color: #ef4444;">Monthly Expense Trend</h3>
              ${monthlyExpenses.slice(-6).map(month => `
                <div class="breakdown-item">
                  <div class="name">${month.month}</div>
                  <div>
                    <span class="amount">$${month.total.toFixed(2)}</span>
                    <span class="percentage">(${month.count} txns)</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <table style="margin-top: 25px;">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              ${filteredExpenses.slice(0, 50).map((expense, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${new Date(expense.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</td>
                  <td>${expense.category}</td>
                  <td style="text-align: right; font-weight: 600; color: #ef4444;">$${expense.amount.toFixed(2)}</td>
                  <td style="font-size: 12px; color: #64748b;">${expense.paymentMethod || 'N/A'}</td>
                </tr>
              `).join('')}
              ${filteredExpenses.length > 50 ? `
                <tr>
                  <td colspan="5" style="text-align: center; color: #64748b; font-style: italic;">
                    ... and ${filteredExpenses.length - 50} more transactions
                  </td>
                </tr>
              ` : ''}
              <tr class="total-row">
                <td colspan="3"><strong>TOTAL EXPENSES</strong></td>
                <td style="text-align: right;"><strong>$${totalExpenses.toFixed(2)}</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <!-- Tax Deduction Section -->
          <div class="tax-section">
            <h3>Estimated Tax Deductions</h3>
            <div class="tax-row">
              <span>Total Business Expenses</span>
              <span>$${totalExpenses.toFixed(2)}</span>
            </div>
            <div class="tax-row">
              <span>Estimated Deductible Amount (80%)</span>
              <span>$${(totalExpenses * 0.8).toFixed(2)}</span>
            </div>
            <div class="tax-row highlight">
              <span>Potential Tax Savings (25% tax rate)</span>
              <span>$${(totalExpenses * 0.8 * 0.25).toFixed(2)}</span>
            </div>
          </div>
        </div>
      `
    }

    // Final Summary for "all" type
    if (exportType === 'all') {
      html += `
        <div class="page-break"></div>

        <div class="section">
          <div class="section-header">Financial Summary & Tax Overview</div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Total Income</strong></td>
                <td style="text-align: right; color: #10b981; font-weight: 700;">$${totalIncome.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total Expenses</strong></td>
                <td style="text-align: right; color: #ef4444; font-weight: 700;">$${totalExpenses.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Net Income (Before Tax)</strong></td>
                <td style="text-align: right;"><strong>$${netIncome.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td style="padding-left: 20px;">Less: Estimated Tax Deductions</td>
                <td style="text-align: right;">-$${(totalExpenses * 0.8).toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Taxable Income</strong></td>
                <td style="text-align: right; font-weight: 700;">$${Math.max(0, netIncome - (totalExpenses * 0.2)).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding-left: 20px;">Estimated Tax (25%)</td>
                <td style="text-align: right; color: #f97316;">-$${(Math.max(0, netIncome - (totalExpenses * 0.2)) * 0.25).toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Net Income (After Tax)</strong></td>
                <td style="text-align: right; color: ${netIncome >= 0 ? '#10b981' : '#ef4444'};"><strong>$${(netIncome - (Math.max(0, netIncome - (totalExpenses * 0.2)) * 0.25)).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>

          ${goals.length > 0 ? `
            <div style="margin-top: 30px;">
              <h3 style="color: #52525b; font-size: 18px; margin-bottom: 16px; font-weight: 700;">Savings Goals Progress</h3>
              <table>
                <thead>
                  <tr>
                    <th>Goal</th>
                    <th style="text-align: right;">Target</th>
                    <th style="text-align: right;">Current</th>
                    <th style="text-align: right;">Remaining</th>
                    <th style="text-align: right;">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  ${goals.map(goal => {
                    const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
                    const remaining = goal.targetAmount - goal.currentAmount
                    return `
                      <tr>
                        <td>${goal.name}</td>
                        <td style="text-align: right;">$${goal.targetAmount.toFixed(2)}</td>
                        <td style="text-align: right; color: #10b981;">$${goal.currentAmount.toFixed(2)}</td>
                        <td style="text-align: right;">$${remaining.toFixed(2)}</td>
                        <td style="text-align: right; font-weight: 600;">${progress}%</td>
                      </tr>
                    `
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}
        </div>
      `
    }

    // Footer
    html += `
        <div class="footer">
          <p><strong>GIG ECONOMY</strong> | Professional Financial Management Platform</p>
          <p style="margin-top: 8px;">This report is generated automatically and should be reviewed by a qualified accountant.</p>
          <p style="margin-top: 4px;">Generated on ${new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </body>
      </html>
    `

    // Download
    const filename = `GigEconomy_${exportType === 'all' ? 'Complete' : exportType === 'income' ? 'Income' : 'Expense'}_Report_${dateRange}_${new Date().toISOString().split('T')[0]}.html`
    const blob = new Blob([html], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)

    alert('✅ Professional report downloaded! Open the HTML file in your browser and use Print > Save as PDF to create a PDF version.')
  }

  const handleExport = () => {
    if (format === 'csv') {
      generateDetailedCSV()
    } else {
      generateProfessionalPDF()
    }
  }

  const quickTemplate = (template) => {
    switch(template) {
      case 'tax':
        setExportType('all')
        setDateRange('year')
        setFormat('csv')
        setTimeout(handleExport, 100)
        break
      case 'monthly':
        setExportType('all')
        setDateRange('month')
        setFormat('pdf')
        setTimeout(handleExport, 100)
        break
      case 'quarterly':
        setExportType('all')
        setDateRange('quarter')
        setFormat('pdf')
        setTimeout(handleExport, 100)
        break
      case 'yearend':
        setExportType('all')
        setDateRange('year')
        setFormat('pdf')
        setTimeout(handleExport, 100)
        break
    }
  }

  return (
    <div className="dashboard-page">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          color: 'var(--theme-text)',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          letterSpacing: '-0.02em'
        }}>
          <Download size={36} strokeWidth={2.5} /> Export Financial Data
        </h1>
        <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '15px', marginLeft: '48px' }}>
          Generate professional reports and export your financial data
        </p>
      </div>

      <div className="form-container" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={20} />
          Export Configuration
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px', alignItems: 'start' }}>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--theme-text-secondary)'
            }}>
              <FileText size={16} />
              What to Export
            </label>
            <select value={exportType} onChange={(e) => setExportType(e.target.value)} style={{ width: '100%' }}>
              <option value="all">Complete Financial Report</option>
              <option value="income">Income Only</option>
              <option value="expenses">Expenses Only</option>
            </select>
          </div>

          <div className="form-field" style={{ marginBottom: 0 }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--theme-text-secondary)'
            }}>
              <Calendar size={16} />
              Date Range
            </label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ width: '100%' }}>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter (90 Days)</option>
              <option value="year">Last Year (12 Months)</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="form-field" style={{ marginBottom: 0 }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--theme-text-secondary)'
            }}>
              <FileSpreadsheet size={16} />
              Format
            </label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ width: '100%' }}>
              <option value="csv">CSV (Excel/Sheets)</option>
              <option value="pdf">PDF (Formatted Report)</option>
            </select>
          </div>
        </div>

        <button
          className="btn-submit"
          onClick={handleExport}
          style={{
            width: '100%',
            fontSize: '18px',
            padding: '18px',
            background: 'var(--theme-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <Download size={20} />
          Generate & Download Report
        </button>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={20} />
          Quick Export Templates
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <button
            className="action-button"
            onClick={() => quickTemplate('tax')}
            style={{
              padding: '24px',
              background: 'var(--theme-surface)',
              border: '1px solid var(--theme-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(239, 68, 68, 0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Receipt size={24} color="#ef4444" strokeWidth={2} />
            </div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>Tax Preparation</div>
            <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)' }}>Year · CSV</div>
          </button>

          <button
            className="action-button"
            onClick={() => quickTemplate('monthly')}
            style={{
              padding: '24px',
              background: 'var(--theme-surface)',
              border: '1px solid var(--theme-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(59, 130, 246, 0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={24} color="#3b82f6" strokeWidth={2} />
            </div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>Monthly Report</div>
            <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)' }}>Month · PDF</div>
          </button>

          <button
            className="action-button"
            onClick={() => quickTemplate('quarterly')}
            style={{
              padding: '24px',
              background: 'var(--theme-surface)',
              border: '1px solid var(--theme-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(168, 85, 247, 0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 size={24} color="#a855f7" strokeWidth={2} />
            </div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>Quarterly Report</div>
            <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)' }}>Quarter · PDF</div>
          </button>

          <button
            className="action-button"
            onClick={() => quickTemplate('yearend')}
            style={{
              padding: '24px',
              background: 'var(--theme-surface)',
              border: '1px solid var(--theme-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={24} color="#10b981" strokeWidth={2} />
            </div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>Year-End Report</div>
            <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)' }}>Year · PDF</div>
          </button>
        </div>
        <p style={{ color: 'var(--theme-text-tertiary)', marginTop: '16px', fontSize: '14px', textAlign: 'center' }}>
          Click a template to instantly generate and download that report
        </p>
      </div>

      <div className="dashboard-section" style={{ marginTop: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PieChart size={20} />
          Data Overview
        </h2>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-label">Income Entries</div>
            <div className="card-value" style={{ color: 'var(--theme-success)' }}>{incomes.length}</div>
            <div className="card-sublabel">${getTotalIncome().toFixed(2)} total</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Expense Entries</div>
            <div className="card-value" style={{ color: 'var(--theme-error)' }}>{expenses.length}</div>
            <div className="card-sublabel">${getTotalExpenses().toFixed(2)} total</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Savings Goals</div>
            <div className="card-value" style={{ color: 'var(--theme-info)' }}>{goals.length}</div>
            <div className="card-sublabel">Active goals</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Total Transactions</div>
            <div className="card-value" style={{ color: 'var(--theme-text-tertiary)' }}>{incomes.length + expenses.length}</div>
            <div className="card-sublabel">All time</div>
          </div>
        </div>
      </div>
    </div>
  )
}
