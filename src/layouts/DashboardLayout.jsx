import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LayoutDashboard, DollarSign, CreditCard, Target, TrendingUp, Camera, Download, Calculator, Shield, LogOut } from 'lucide-react'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut, user } = useAuthStore()

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/income', icon: DollarSign, label: 'Income' },
    { path: '/dashboard/expenses', icon: CreditCard, label: 'Expenses' },
    { path: '/dashboard/goals', icon: Target, label: 'Goals' },
    { path: '/dashboard/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/dashboard/receipts', icon: Camera, label: 'Receipts' },
    { path: '/dashboard/export', icon: Download, label: 'Export' },
    { path: '/dashboard/tax-tools', icon: Calculator, label: 'Tax Tools' },
    { path: '/dashboard/insurance', icon: Shield, label: 'Insurance' }
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>GIG ECONOMY</h2>
          <p>{user?.email}</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon className="nav-icon" size={20} />
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <button className="signout-button" onClick={handleSignOut}>
          <LogOut size={18} style={{ marginRight: '8px' }} />
          Sign Out
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
