import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import EmailConfirmed from './pages/EmailConfirmed'
import ThemeSelector from './pages/ThemeSelector'
import HelpCenter from './pages/HelpCenter'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Income from './pages/Income'
import Expenses from './pages/Expenses'
import Goals from './pages/Goals'
import Analytics from './pages/Analytics'
import Receipts from './pages/Receipts'
import Export from './pages/Export'
import TaxTools from './pages/TaxTools'
import Insurance from './pages/Insurance'
import Settings from './pages/Settings'

function App() {
  const { initialize, user, loading } = useAuthStore()
  const { hasSelectedTheme } = useThemeStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        color: '#fff'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!user ? <HomePage /> : <Navigate to={hasSelectedTheme ? "/dashboard" : "/theme-selection"} />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to={hasSelectedTheme ? "/dashboard" : "/theme-selection"} />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={hasSelectedTheme ? "/dashboard" : "/theme-selection"} />} />
        <Route path="/email-confirmed" element={<EmailConfirmed />} />

        {/* Public Pages */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route path="/theme-selection" element={user ? <ThemeSelector /> : <Navigate to="/" />} />

        <Route path="/dashboard" element={user ? (hasSelectedTheme ? <DashboardLayout /> : <Navigate to="/theme-selection" />) : <Navigate to="/" />}>
          <Route index element={<Dashboard />} />
          <Route path="income" element={<Income />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="goals" element={<Goals />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="export" element={<Export />} />
          <Route path="tax-tools" element={<TaxTools />} />
          <Route path="insurance" element={<Insurance />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
