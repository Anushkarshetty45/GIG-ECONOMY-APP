import { useState, useMemo } from 'react'
import { useFinanceStore } from '../store/financeStore'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, PieChart as PieChartIcon, BarChart3, DollarSign, CreditCard } from 'lucide-react'
import './DashboardPages.css'

export default function Analytics() {
  const { incomes, expenses, getIncomeByPlatform, getExpensesByCategory, getTotalIncome, getTotalExpenses, getNetIncome } = useFinanceStore()
  const [timeRange, setTimeRange] = useState('all')

  // Filter data by time range
  const filterByTimeRange = (items) => {
    if (timeRange === 'all') return items

    const now = new Date()
    const cutoffDate = new Date()

    switch(timeRange) {
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

    return items.filter(item => new Date(item.date) >= cutoffDate)
  }

  // Income vs Expenses over time
  const timeSeriesData = useMemo(() => {
    const filteredIncomes = filterByTimeRange(incomes)
    const filteredExpenses = filterByTimeRange(expenses)

    const monthlyData = {}

    filteredIncomes.forEach(income => {
      const month = new Date(income.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expenses: 0 }
      monthlyData[month].income += income.amount
    })

    filteredExpenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expenses: 0 }
      monthlyData[month].expenses += expense.amount
    })

    return Object.values(monthlyData).sort((a, b) => new Date(a.month) - new Date(b.month))
  }, [incomes, expenses, timeRange])

  // Income by platform
  const platformData = useMemo(() => {
    const filtered = filterByTimeRange(incomes)
    const platformMap = {}

    filtered.forEach(income => {
      const platform = income.platform || 'Other'
      platformMap[platform] = (platformMap[platform] || 0) + income.amount
    })

    return Object.entries(platformMap).map(([name, value]) => ({ name, value }))
  }, [incomes, timeRange])

  // Expenses by category
  const categoryData = useMemo(() => {
    const filtered = filterByTimeRange(expenses)
    const categoryMap = {}

    filtered.forEach(expense => {
      const category = expense.category || 'Other'
      categoryMap[category] = (categoryMap[category] || 0) + expense.amount
    })

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [expenses, timeRange])

  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#10b981', '#fbbf24', '#ef4444', '#ec4899', '#f97316']

  const totalIncome = getTotalIncome()
  const totalExpenses = getTotalExpenses()
  const netIncome = getNetIncome()
  const avgDailyIncome = incomes.length > 0 ? totalIncome / incomes.length : 0
  const avgDailyExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

  return (
    <div className="dashboard-page" style={{ background: '#0a0a0a' }}>
      <h1 className="page-title" style={{ color: '#ffffff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <TrendingUp size={32} /> Analytics Dashboard
      </h1>

      <div style={{ marginBottom: '32px' }}>
        <label style={{ color: '#a1a1aa', marginRight: '12px', fontSize: '14px', fontWeight: '500' }}>Time Period:</label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '10px 16px',
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="summary-cards" style={{ marginBottom: '32px' }}>
        <div className="summary-card" style={{ background: '#18181b', border: '1px solid #27272a' }}>
          <div className="card-label" style={{ color: '#71717a' }}>Avg Daily Income</div>
          <div className="card-value" style={{ color: '#10b981', fontSize: '28px' }}>${avgDailyIncome.toFixed(2)}</div>
          <div className="card-sublabel" style={{ color: '#52525b' }}>Per transaction</div>
        </div>
        <div className="summary-card" style={{ background: '#18181b', border: '1px solid #27272a' }}>
          <div className="card-label" style={{ color: '#71717a' }}>Avg Daily Expense</div>
          <div className="card-value" style={{ color: '#ef4444', fontSize: '28px' }}>${avgDailyExpense.toFixed(2)}</div>
          <div className="card-sublabel" style={{ color: '#52525b' }}>Per transaction</div>
        </div>
        <div className="summary-card" style={{ background: '#18181b', border: '1px solid #27272a' }}>
          <div className="card-label" style={{ color: '#71717a' }}>Best Platform</div>
          <div className="card-value" style={{ color: '#8b5cf6', fontSize: '28px' }}>
            {platformData.length > 0 ? platformData.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
          </div>
          <div className="card-sublabel" style={{ color: '#52525b' }}>Highest earnings</div>
        </div>
        <div className="summary-card" style={{ background: '#18181b', border: '1px solid #27272a' }}>
          <div className="card-label" style={{ color: '#71717a' }}>Top Expense</div>
          <div className="card-value" style={{ color: '#fbbf24', fontSize: '28px' }}>
            {categoryData.length > 0 ? categoryData.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
          </div>
          <div className="card-sublabel" style={{ color: '#52525b' }}>Highest spending</div>
        </div>
      </div>

      {timeSeriesData.length > 0 && (
        <div className="dashboard-section" style={{ marginBottom: '32px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
          <h2 className="section-title" style={{ color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} /> Income vs Expenses Over Time
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" style={{ fontSize: '12px' }} />
              <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff' }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '8px' }}
              />
              <Legend wrapperStyle={{ color: '#a1a1aa' }} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Income" dot={{ fill: '#10b981', r: 4 }} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" dot={{ fill: '#ef4444', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="dashboard-grid" style={{ gap: '24px' }}>
        {platformData.length > 0 && (
          <div className="dashboard-section" style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign size={20} /> Income by Platform
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff' }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '20px' }}>
              {platformData.map((item, index) => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #27272a' }}>
                  <span style={{ color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                    {item.name}
                  </span>
                  <span style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>${item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {categoryData.length > 0 && (
          <div className="dashboard-section" style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
            <h2 className="section-title" style={{ color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} /> Expenses by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" style={{ fontSize: '12px' }} />
                <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff' }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '20px' }}>
              {categoryData.map((item) => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #27272a' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '14px' }}>{item.name}</span>
                  <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '14px' }}>${item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {incomes.length === 0 && expenses.length === 0 && (
        <div className="dashboard-section" style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
          <p className="empty-state" style={{ color: '#71717a', textAlign: 'center' }}>No data yet. Start adding income and expenses to see analytics!</p>
        </div>
      )}
    </div>
  )
}
