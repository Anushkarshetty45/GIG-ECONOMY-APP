import React, { useMemo, useState } from 'react'
import { Check, Circle } from 'lucide-react'
import { useFinanceStore } from '../store/financeStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTaxChecklistStore, TAX_CHECKLIST_ITEMS } from '../store/taxChecklistStore'
import {
  calculateQuarterlyTaxSummaries,
  calculateTaxSummary,
  SIMPLIFIED_TAX_RATE,
  SUPPORTED_TAX_YEARS,
} from '../utils/financialCalculations'
import './DashboardPages.css'

const TAX_YEARS = [...SUPPORTED_TAX_YEARS].sort((a, b) => b - a)
const QUARTER_NAMES = ['Jan - Mar', 'Apr - Jun', 'Jul - Sep', 'Oct - Dec']

const ELIGIBILITY_LABELS = {
  'potentially-deductible': 'Potentially eligible*',
  review: 'Review required',
  'not-marked-eligible': 'Not included',
}

const ELIGIBILITY_COLORS = {
  'potentially-deductible': '#34d399',
  review: '#fbbf24',
  'not-marked-eligible': 'var(--theme-text-secondary)',
}

export default function TaxTools() {
  const { incomes, expenses } = useFinanceStore()
  const { formatCurrency } = useSettingsStore()
  const [selectedYear, setSelectedYear] = useState(
    TAX_YEARS.includes(new Date().getFullYear()) ? new Date().getFullYear() : TAX_YEARS[0]
  )
  const checkedItems = useTaxChecklistStore((state) => state.checkedItems)
  const toggleTask = useTaxChecklistStore((state) => state.toggleTask)

  const taxSummary = useMemo(
    () => calculateTaxSummary({ incomes, expenses, year: selectedYear }),
    [incomes, expenses, selectedYear]
  )
  const quarterlySummaries = useMemo(
    () => calculateQuarterlyTaxSummaries({ incomes, expenses, year: selectedYear }),
    [incomes, expenses, selectedYear]
  )
  const hasYearTransactions = taxSummary.totalIncome > 0 || taxSummary.totalExpenses > 0
  const completedTasks = TAX_CHECKLIST_ITEMS.filter((task) => checkedItems[task.id]).length

  return (
    <div className="dashboard-page">
      <h1 className="page-title">📋 Tax Tools</h1>

      <div style={{ marginBottom: '32px' }}>
        <label htmlFor="tax-year" style={{ color: '#e5e5e5', marginRight: '12px' }}>
          Tax Year:
        </label>
        <select
          id="tax-year"
          value={selectedYear}
          onChange={(event) => setSelectedYear(Number(event.target.value))}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'var(--theme-text)',
            fontSize: '14px',
          }}
        >
          {TAX_YEARS.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-label">Total Income</div>
          <div className="card-value income">{formatCurrency(taxSummary.totalIncome)}</div>
          <div className="card-sublabel">{selectedYear} tax year</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Eligible Expenses</div>
          <div className="card-value expense">{formatCurrency(taxSummary.totalDeductions)}</div>
          <div className="card-sublabel">Potentially deductible only*</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Taxable Profit</div>
          <div className="card-value net">{formatCurrency(taxSummary.taxableProfit)}</div>
          <div className="card-sublabel">Income less eligible expenses</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Simplified Tax Estimate</div>
          <div className="card-value tax">{formatCurrency(taxSummary.totalEstimatedTax)}</div>
          <div className="card-sublabel">{SIMPLIFIED_TAX_RATE * 100}% of non-negative profit</div>
        </div>
      </div>

      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Quarterly Calculator</h2>
        <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '16px' }}>
          Quarterly tax amounts are changes to the year-to-date estimate. A negative amount is an
          adjustment that offsets an earlier quarter; all four amounts add up to the annual estimate.
        </p>
        {quarterlySummaries.map((quarter, index) => (
          <div
            key={quarter.quarter}
            className="summary-card"
            style={{ marginBottom: '12px', padding: '20px' }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div>
                <h3 style={{ color: 'var(--theme-text)', margin: 0 }}>
                  Q{quarter.quarter} · {QUARTER_NAMES[index]}
                </h3>
                <span style={{ color: 'var(--theme-text-secondary)', fontSize: '13px' }}>
                  {selectedYear}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="card-label">Tax estimate adjustment</div>
                <strong style={{ color: 'var(--theme-text)', fontSize: '18px' }}>
                  {formatCurrency(quarter.estimatedTax)}
                </strong>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
              gap: '12px',
            }}>
              <div>
                <div className="card-label">Income</div>
                <strong>{formatCurrency(quarter.income)}</strong>
              </div>
              <div>
                <div className="card-label">Eligible expenses</div>
                <strong>{formatCurrency(quarter.deductions)}</strong>
              </div>
              <div>
                <div className="card-label">Taxable profit</div>
                <strong>{formatCurrency(quarter.taxableProfit)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title">Deduction Tracker</h2>
        <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '16px' }}>
          Expense categories are not automatically deductible. Only categories marked potentially
          eligible are included in the simplified estimate; review your records and business use.
        </p>
        {taxSummary.expenseCategories.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {taxSummary.expenseCategories.map((category) => (
              <div
                key={`${category.category}-${category.status}`}
                className="summary-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 1fr) minmax(100px, auto) minmax(140px, auto)',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                }}
              >
                <span style={{ color: 'var(--theme-text)', fontWeight: 500 }}>
                  {category.category}
                </span>
                <span style={{ textAlign: 'right', color: 'var(--theme-text)' }}>
                  {formatCurrency(category.amount)}
                </span>
                <span style={{
                  color: ELIGIBILITY_COLORS[category.status],
                  textAlign: 'right',
                  fontSize: '13px',
                  fontWeight: 600,
                }}>
                  {ELIGIBILITY_LABELS[category.status]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No expenses recorded for {selectedYear}.</p>
        )}
      </div>

      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <h2 className="section-title">Tax Preparation Checklist</h2>
          <span style={{ color: 'var(--theme-text-secondary)', fontSize: '13px' }}>
            {completedTasks} of {TAX_CHECKLIST_ITEMS.length} complete · saved on this device
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {TAX_CHECKLIST_ITEMS.map((task) => {
            const checked = Boolean(checkedItems[task.id])
            return (
              <button
                key={task.id}
                type="button"
                aria-pressed={checked}
                onClick={() => toggleTask(task.id)}
                className="summary-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  color: 'var(--theme-text)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {checked
                  ? <Check size={18} aria-hidden="true" />
                  : <Circle size={18} aria-hidden="true" />}
                <span style={{ textDecoration: checked ? 'line-through' : 'none' }}>
                  {task.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {!hasYearTransactions && (
        <p className="empty-state">No income or expenses recorded for {selectedYear}.</p>
      )}
      <p style={{ color: 'var(--theme-text-secondary)', fontSize: '13px', marginTop: '24px' }}>
        * Simplified estimates only—not actual tax liabilities or tax advice. Expense eligibility
        depends on business purpose, documentation, and applicable tax rules. Consult a qualified
        tax professional.
      </p>
    </div>
  )
}
