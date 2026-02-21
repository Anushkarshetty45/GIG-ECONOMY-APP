import { useFinanceStore } from '../store/financeStore'
import { useSettingsStore } from '../store/settingsStore'
import { LayoutDashboard, DollarSign, CreditCard, FileText, Target, Heart } from 'lucide-react'
import './DashboardPages.css'

export default function Dashboard() {
  const { incomes, expenses, goals, getTotalIncome, getTotalExpenses, getNetIncome } = useFinanceStore()
  const { formatCurrency } = useSettingsStore()

  const totalIncome = getTotalIncome()
  const totalExpenses = getTotalExpenses()
  const netIncome = getNetIncome()
  const taxEstimate = netIncome * 0.25

  const recentTransactions = [
    ...incomes.slice(0, 3).map(i => ({ ...i, type: 'income' })),
    ...expenses.slice(0, 3).map(e => ({ ...e, type: 'expense' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const financialHealthScore = netIncome > 0 ? Math.min((netIncome / (totalIncome || 1)) * 100, 100) : 0

  return (
    <div className="dashboard-page">
      <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <LayoutDashboard size={32} /> Dashboard Overview
      </h1>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-label">Total Income</div>
          <div className="card-value income">{formatCurrency(totalIncome)}</div>
          <div className="card-sublabel">All time</div>
        </div>

        <div className="summary-card">
          <div className="card-label">Total Expenses</div>
          <div className="card-value expense">{formatCurrency(totalExpenses)}</div>
          <div className="card-sublabel">All time</div>
        </div>

        <div className="summary-card">
          <div className="card-label">Net Income</div>
          <div className="card-value net">{formatCurrency(netIncome)}</div>
          <div className="card-sublabel">After expenses</div>
        </div>

        <div className="summary-card">
          <div className="card-label">Tax Estimate</div>
          <div className="card-value tax">{formatCurrency(taxEstimate)}</div>
          <div className="card-sublabel">25% rate</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} /> Recent Transactions
          </h2>
          <div className="transactions-list">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div key={index} className="transaction-item">
                  <div className="transaction-icon">
                    {transaction.type === 'income' ? <DollarSign size={20} /> : <CreditCard size={20} />}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-desc">
                      {transaction.platform || transaction.category || transaction.description}
                    </div>
                    <div className="transaction-date">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">No transactions yet</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={20} /> Savings Goals Progress
          </h2>
          <div className="goals-list">
            {goals.length > 0 ? (
              goals.slice(0, 3).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                return (
                  <div key={goal.id} className="goal-item">
                    <div className="goal-header">
                      <span className="goal-name">{goal.name}</span>
                      <span className="goal-percentage">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="goal-progress-bar">
                      <div
                        className="goal-progress-fill"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="goal-amounts">
                      ${Number(goal.currentAmount || 0).toFixed(2)} / ${Number(goal.targetAmount || 0).toFixed(2)}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="empty-state">No goals set yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="health-section">
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Heart size={20} /> Financial Health Score
        </h2>
        <div className="health-score-container">
          <div className="health-score-circle">
            <svg width="200" height="200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="var(--theme-border)"
                strokeWidth="12"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="var(--theme-primary)"
                strokeWidth="12"
                strokeDasharray={`${(financialHealthScore / 100) * 502.4} 502.4`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
              <text
                x="100"
                y="105"
                textAnchor="middle"
                fontSize="32"
                fontWeight="700"
                fill="var(--theme-text)"
              >
                {financialHealthScore.toFixed(0)}%
              </text>
            </svg>
          </div>
          <p className="health-description">
            {financialHealthScore >= 75 ? 'Excellent! Your finances are in great shape.' :
             financialHealthScore >= 50 ? 'Good progress! Keep tracking your expenses.' :
             financialHealthScore >= 25 ? 'Getting started. Focus on reducing expenses.' :
             'Start by tracking your income and expenses regularly.'}
          </p>
        </div>
      </div>
    </div>
  )
}
