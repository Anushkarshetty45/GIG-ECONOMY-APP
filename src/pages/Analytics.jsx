import { useMemo } from 'react'
import { useFinanceStore } from '../store/financeStore'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, CreditCard, Wallet, TrendingDown } from 'lucide-react'
import './DashboardPages.css'

export default function Analytics() {
  const { incomes, expenses, getTotalIncome, getTotalExpenses, getNetIncome } = useFinanceStore()

  // Get current month data
  const getCurrentMonthData = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthIncomes = incomes.filter(i => {
      const date = new Date(i.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const monthExpenses = expenses.filter(e => {
      const date = new Date(e.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const totalIncome = monthIncomes.reduce((sum, i) => sum + i.amount, 0)
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0)

    return { totalIncome, totalExpenses, net: totalIncome - totalExpenses }
  }

  // Income vs Expenses over last 6 months
  const last6MonthsData = useMemo(() => {
    const monthlyData = {}
    const now = new Date()

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const sortKey = date.getTime()
      monthlyData[key] = { month: key, income: 0, expenses: 0, net: 0, sortKey }
    }

    // Add income data
    incomes.forEach(income => {
      const date = new Date(income.date)
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (monthlyData[key]) {
        monthlyData[key].income += income.amount
      }
    })

    // Add expense data
    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (monthlyData[key]) {
        monthlyData[key].expenses += expense.amount
      }
    })

    // Calculate net for each month
    Object.values(monthlyData).forEach(month => {
      month.net = month.income - month.expenses
    })

    return Object.values(monthlyData).sort((a, b) => a.sortKey - b.sortKey)
  }, [incomes, expenses])

  // Income by platform (current month)
  const platformData = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthIncomes = incomes.filter(i => {
      const date = new Date(i.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const platformMap = {}
    monthIncomes.forEach(income => {
      const platform = income.platform || 'Other'
      platformMap[platform] = (platformMap[platform] || 0) + income.amount
    })

    return Object.entries(platformMap).map(([name, value]) => ({ name, value }))
  }, [incomes])

  // Expenses by category (current month)
  const categoryData = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthExpenses = expenses.filter(e => {
      const date = new Date(e.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const categoryMap = {}
    monthExpenses.forEach(expense => {
      const category = expense.category || 'Other'
      categoryMap[category] = (categoryMap[category] || 0) + expense.amount
    })

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  }, [expenses])

  // Income trend (last 6 months)
  const incomeTrend = useMemo(() => {
    return last6MonthsData.map(d => ({ month: d.month, value: d.income }))
  }, [last6MonthsData])

  // Expense trend (last 6 months)
  const expenseTrend = useMemo(() => {
    return last6MonthsData.map(d => ({ month: d.month, value: d.expenses }))
  }, [last6MonthsData])

  const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#10b981']

  const totalIncome = getTotalIncome()
  const totalExpenses = getTotalExpenses()
  const netIncome = getNetIncome()
  const currentMonthData = getCurrentMonthData()

  return (
    <div className="dashboard-page" style={{ background: 'var(--theme-background)', minHeight: '100vh' }}>
      {/* Header */}
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
          <TrendingUp size={36} strokeWidth={2.5} /> Analytics Dashboard
        </h1>
        <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '15px', marginLeft: '48px' }}>
          Comprehensive view of your financial performance
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, transparent 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'var(--theme-success)15',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={20} color="var(--theme-success)" strokeWidth={2.5} />
              </div>
              <span style={{
                color: 'var(--theme-text-tertiary)',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Total Income
              </span>
            </div>
            <div style={{ color: 'var(--theme-success)', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              ${totalIncome.toFixed(2)}
            </div>
            <div style={{ color: 'var(--theme-text-secondary)', fontSize: '13px', marginTop: '8px' }}>
              All-time earnings
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, transparent 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'var(--theme-error)15',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CreditCard size={20} color="var(--theme-error)" strokeWidth={2.5} />
              </div>
              <span style={{
                color: 'var(--theme-text-tertiary)',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Total Expenses
              </span>
            </div>
            <div style={{ color: 'var(--theme-error)', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              ${totalExpenses.toFixed(2)}
            </div>
            <div style={{ color: 'var(--theme-text-secondary)', fontSize: '13px', marginTop: '8px' }}>
              All-time spending
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, transparent 0%, transparent 70%)`,
            borderRadius: '50%',
            transform: 'translate(30%, -30%)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: netIncome >= 0 ? 'var(--theme-success)15' : 'var(--theme-error)15',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Wallet size={20} color={netIncome >= 0 ? 'var(--theme-success)' : 'var(--theme-error)'} strokeWidth={2.5} />
              </div>
              <span style={{
                color: 'var(--theme-text-tertiary)',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Net Income
              </span>
            </div>
            <div style={{ color: netIncome >= 0 ? 'var(--theme-success)' : 'var(--theme-error)', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              ${netIncome.toFixed(2)}
            </div>
            <div style={{ color: 'var(--theme-text-secondary)', fontSize: '13px', marginTop: '8px' }}>
              {netIncome >= 0 ? 'Positive balance' : 'Negative balance'}
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, transparent 0%, transparent 70%)`,
            borderRadius: '50%',
            transform: 'translate(30%, -30%)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: currentMonthData.net >= 0 ? 'var(--theme-success)15' : 'var(--theme-error)15',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingDown size={20} color={currentMonthData.net >= 0 ? 'var(--theme-success)' : 'var(--theme-error)'} strokeWidth={2.5} />
              </div>
              <span style={{
                color: 'var(--theme-text-tertiary)',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                This Month Net
              </span>
            </div>
            <div style={{ color: currentMonthData.net >= 0 ? 'var(--theme-success)' : 'var(--theme-error)', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              ${currentMonthData.net.toFixed(2)}
            </div>
            <div style={{ color: 'var(--theme-text-secondary)', fontSize: '13px', marginTop: '8px' }}>
              Current month performance
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart - Income vs Expenses */}
      <div style={{
        marginBottom: '40px',
        background: 'var(--theme-surface)',
        border: '1px solid var(--theme-border)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            color: 'var(--theme-text)',
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '4px',
            letterSpacing: '-0.01em'
          }}>
            Income vs Expenses (Last 6 Months)
          </h2>
          <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '14px' }}>
            Track your financial performance over time
          </p>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={last6MonthsData}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" opacity={0.5} />
            <XAxis
              dataKey="month"
              stroke="var(--theme-text-tertiary)"
              style={{ fontSize: '13px', fontWeight: '500' }}
              tickMargin={12}
            />
            <YAxis
              stroke="var(--theme-text-tertiary)"
              style={{ fontSize: '13px', fontWeight: '500' }}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--theme-surface)',
                border: '1px solid var(--theme-border)',
                borderRadius: '12px',
                color: 'var(--theme-text)',
                padding: '12px 16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: 'var(--theme-text-secondary)', marginBottom: '8px', fontWeight: '600' }}
              formatter={(value) => [`$${value.toFixed(2)}`, '']}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              name="Expenses"
              dot={{ fill: '#ef4444', r: 5, strokeWidth: 2, stroke: 'var(--theme-surface)' }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              name="Income"
              dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: 'var(--theme-surface)' }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#818cf8"
              strokeWidth={3}
              name="Net"
              dot={{ fill: '#818cf8', r: 5, strokeWidth: 2, stroke: 'var(--theme-surface)' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Income by Platform & Expenses by Category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        {/* Income by Platform */}
        {platformData.length > 0 && (
          <div style={{
            background: 'var(--theme-surface)',
            border: '1px solid var(--theme-border)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{
                color: 'var(--theme-text)',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '4px',
                letterSpacing: '-0.01em'
              }}>
                Income by Platform (This Month)
              </h2>
              <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '13px' }}>
                Breakdown of income sources
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={{
                    stroke: 'var(--theme-text-tertiary)',
                    strokeWidth: 1
                  }}
                  label={(props) => {
                    const { cx, cy, midAngle, outerRadius, name, value } = props
                    const RADIAN = Math.PI / 180
                    const radius = outerRadius + 30
                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                    const y = cy + radius * Math.sin(-midAngle * RADIAN)

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="var(--theme-text)"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        style={{ fontSize: '14px', fontWeight: 600 }}
                      >
                        {`${name}: $${value.toFixed(0)}`}
                      </text>
                    )
                  }}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="var(--theme-surface)"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--theme-surface)',
                    border: '1px solid var(--theme-border)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'var(--theme-text)', fontWeight: 600 }}
                  labelStyle={{ color: 'var(--theme-text-secondary)', marginBottom: '8px', fontWeight: 600 }}
                  formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expenses by Category */}
        {categoryData.length > 0 && (
          <div style={{
            background: 'var(--theme-surface)',
            border: '1px solid var(--theme-border)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{
                color: 'var(--theme-text)',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '4px',
                letterSpacing: '-0.01em'
              }}>
                Expenses by Category (This Month)
              </h2>
              <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '13px' }}>
                Top spending categories
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="var(--theme-text-tertiary)"
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  angle={-45}
                  textAnchor="end"
                  height={90}
                  tickMargin={8}
                />
                <YAxis
                  stroke="var(--theme-text-tertiary)"
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--theme-surface)',
                    border: '1px solid var(--theme-border)',
                    borderRadius: '12px',
                    color: 'var(--theme-text)',
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, '']}
                  cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}
                />
                <Bar
                  dataKey="value"
                  fill="#ef4444"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Income Trend & Expense Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        {/* Income Trend */}
        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{
              color: 'var(--theme-text)',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '4px',
              letterSpacing: '-0.01em'
            }}>
              Income Trend
            </h2>
            <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '13px' }}>
              Monthly income performance
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeTrend}>
              <defs>
                <linearGradient id="incomeBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" opacity={0.5} />
              <XAxis
                dataKey="month"
                stroke="var(--theme-text-tertiary)"
                style={{ fontSize: '12px', fontWeight: '500' }}
                tickMargin={10}
              />
              <YAxis
                stroke="var(--theme-text-tertiary)"
                style={{ fontSize: '12px', fontWeight: '500' }}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--theme-surface)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: '12px',
                  color: 'var(--theme-text)',
                  padding: '12px 16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`$${value.toFixed(2)}`, '']}
                cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              />
              <Bar
                dataKey="value"
                fill="url(#incomeBarGradient)"
                radius={[10, 10, 0, 0]}
                maxBarSize={70}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Trend */}
        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{
              color: 'var(--theme-text)',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '4px',
              letterSpacing: '-0.01em'
            }}>
              Expense Trend
            </h2>
            <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '13px' }}>
              Monthly spending pattern
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseTrend}>
              <defs>
                <linearGradient id="expenseBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" opacity={0.5} />
              <XAxis
                dataKey="month"
                stroke="var(--theme-text-tertiary)"
                style={{ fontSize: '12px', fontWeight: '500' }}
                tickMargin={10}
              />
              <YAxis
                stroke="var(--theme-text-tertiary)"
                style={{ fontSize: '12px', fontWeight: '500' }}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--theme-surface)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: '12px',
                  color: 'var(--theme-text)',
                  padding: '12px 16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`$${value.toFixed(2)}`, '']}
                cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}
              />
              <Bar
                dataKey="value"
                fill="url(#expenseBarGradient)"
                radius={[10, 10, 0, 0]}
                maxBarSize={70}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Empty State */}
      {incomes.length === 0 && expenses.length === 0 && (
        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '16px',
          padding: '60px 24px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--theme-border)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <TrendingUp size={40} color="var(--theme-text-tertiary)" strokeWidth={2} />
          </div>
          <h3 style={{
            color: 'var(--theme-text)',
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '-0.01em'
          }}>
            No Data Yet
          </h3>
          <p style={{
            color: 'var(--theme-text-tertiary)',
            fontSize: '15px',
            lineHeight: '1.6',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Start adding income and expenses to see detailed analytics and insights about your financial performance.
          </p>
        </div>
      )}
    </div>
  )
}
