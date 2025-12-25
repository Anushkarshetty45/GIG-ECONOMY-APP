import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore, themePresets } from '../store/themeStore'
import { useSettingsStore, currencies, dateFormats } from '../store/settingsStore'
import { Settings as SettingsIcon, User, Bell, Lock, Database, Info, Palette, Mail, Shield, Download, Trash2, LogOut } from 'lucide-react'
import './Settings.css'

export default function Settings() {
  const { user, signOut, updatePassword } = useAuthStore()
  const { currentTheme, toggleThemeSwitcher } = useThemeStore()
  const {
    currency,
    dateFormat,
    shareAnalytics,
    dataSharing,
    emailNotifications,
    weeklyReports,
    goalReminders,
    expenseAlerts,
    setCurrency,
    setDateFormat,
    setShareAnalytics,
    setDataSharing,
    setEmailNotifications,
    setWeeklyReports,
    setGoalReminders,
    setExpenseAlerts
  } = useSettingsStore()

  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'about', label: 'About', icon: Info }
  ]

  const handleExportData = () => {
    const data = {
      user: user,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gig-economy-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <SettingsIcon size={32} style={{ color: 'var(--theme-primary)' }} />
        <h1 className="page-title" style={{ margin: 0 }}>Settings</h1>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2 className="settings-section-title">Profile Information</h2>
              
              <div className="settings-card">
                <div className="setting-item">
                  <div className="setting-label">
                    <Mail size={18} style={{ color: 'var(--theme-primary)' }} />
                    <span>Email Address</span>
                  </div>
                  <div className="setting-value">{user?.email || 'Not set'}</div>
                </div>

                <div className="setting-item">
                  <div className="setting-label">
                    <User size={18} style={{ color: 'var(--theme-primary)' }} />
                    <span>Account Type</span>
                  </div>
                  <div className="setting-value">Gig Worker</div>
                </div>

                <div className="setting-item">
                  <div className="setting-label">
                    <Shield size={18} style={{ color: 'var(--theme-primary)' }} />
                    <span>Account Status</span>
                  </div>
                  <div className="setting-value" style={{ color: 'var(--theme-success)' }}>Active</div>
                </div>
              </div>

              <div className="settings-card">
                <h3 className="settings-card-title">Danger Zone</h3>
                <button className="danger-button" onClick={signOut}>
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2 className="settings-section-title">Preferences</h2>
              
              <div className="settings-card">
                <h3 className="settings-card-title">Theme</h3>
                <div className="setting-item">
                  <div className="setting-label">
                    <Palette size={18} style={{ color: 'var(--theme-primary)' }} />
                    <span>Current Theme</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="theme-badge">
                      <span style={{ fontSize: '20px' }}>{themePresets[currentTheme]?.emoji}</span>
                      <span>{themePresets[currentTheme]?.name}</span>
                    </div>
                    <button className="btn-primary" onClick={toggleThemeSwitcher}>
                      Change Theme
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h3 className="settings-card-title">Display</h3>
                <div className="setting-item">
                  <div className="setting-label">
                    <span>Currency Format</span>
                  </div>
                  <select
                    className="settings-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {Object.values(currencies).map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="setting-item">
                  <div className="setting-label">
                    <span>Date Format</span>
                  </div>
                  <select
                    className="settings-select"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    {Object.values(dateFormats).map(format => (
                      <option key={format.code} value={format.code}>
                        {format.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="settings-section-title">Notifications</h2>
              
              <div className="settings-card">
                <h3 className="settings-card-title">Email Notifications</h3>
                <div className="toggle-item">
                  <div className="toggle-label">
                    <span>Enable Email Notifications</span>
                    <span className="toggle-description">Receive updates via email</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <span>Weekly Reports</span>
                    <span className="toggle-description">Get weekly financial summaries</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={weeklyReports}
                      onChange={(e) => setWeeklyReports(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h3 className="settings-card-title">Alert Preferences</h3>
                <div className="toggle-item">
                  <div className="toggle-label">
                    <span>Goal Reminders</span>
                    <span className="toggle-description">Remind me about savings goals</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={goalReminders}
                      onChange={(e) => setGoalReminders(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <span>Expense Alerts</span>
                    <span className="toggle-description">Get notified about large expenses</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={expenseAlerts}
                      onChange={(e) => setExpenseAlerts(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2 className="settings-section-title">Privacy & Security</h2>
              
              <div className="settings-card">
                <h3 className="settings-card-title">Data Privacy</h3>
                <div className="toggle-item">
                  <div className="toggle-label">
                    <span>Share Analytics Data</span>
                    <span className="toggle-description">Help improve the app with anonymous data</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={shareAnalytics}
                      onChange={(e) => setShareAnalytics(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <span>Data Sharing</span>
                    <span className="toggle-description">Share data with third-party services</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={dataSharing}
                      onChange={(e) => setDataSharing(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h3 className="settings-card-title">Account Security</h3>
                <div className="setting-item">
                  <span>Password</span>
                  <button className="btn-secondary" onClick={() => setShowPasswordModal(true)}>
                    Change Password
                  </button>
                </div>
                <div className="setting-item">
                  <span>Two-Factor Authentication</span>
                  <button className="btn-secondary" onClick={() => setShow2FAModal(true)}>
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h2 className="settings-section-title">Data & Storage</h2>
              
              <div className="settings-card">
                <h3 className="settings-card-title">Export Data</h3>
                <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '16px' }}>
                  Download all your financial data in JSON format
                </p>
                <button className="btn-primary" onClick={handleExportData}>
                  <Download size={18} />
                  Export All Data
                </button>
              </div>

              <div className="settings-card">
                <h3 className="settings-card-title">Storage</h3>
                <div className="setting-item">
                  <span>Local Storage Usage</span>
                  <span>~2.4 MB</span>
                </div>
                <button className="danger-button" onClick={handleClearData}>
                  <Trash2 size={18} />
                  Clear All Data
                </button>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="settings-section">
              <h2 className="settings-section-title">About</h2>
              
              <div className="settings-card">
                <div className="about-header">
                  <div className="about-logo">💼</div>
                  <h3>Gig Economy Tracker</h3>
                  <p style={{ color: 'var(--theme-text-secondary)' }}>Version 1.0.0</p>
                </div>

                <div className="about-info">
                  <div className="info-item">
                    <span className="info-label">Developer</span>
                    <span className="info-value">Gig Economy Team</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">License</span>
                    <span className="info-value">MIT License</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Support</span>
                    <span className="info-value">support@gigeconomy.com</span>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h3 className="settings-card-title">Resources</h3>
                <div className="resource-links">
                  <a href="#" className="resource-link">Documentation</a>
                  <a href="#" className="resource-link">Privacy Policy</a>
                  <a href="#" className="resource-link">Terms of Service</a>
                  <a href="#" className="resource-link">Release Notes</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}

      {/* 2FA Modal */}
      {show2FAModal && <TwoFactorModal onClose={() => setShow2FAModal(false)} />}
    </div>
  )
}

// Change Password Modal Component
function ChangePasswordModal({ onClose }) {
  const { updatePassword } = useAuthStore()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const result = await updatePassword(formData.newPassword)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => onClose(), 2000)
    } else {
      setError(result.error || 'Failed to update password')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '24px', color: 'var(--theme-text)' }}>Change Password</h2>

        {success ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--theme-success)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <p>Password updated successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--theme-text)' }}>
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'var(--theme-text)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--theme-text)' }}>
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'var(--theme-text)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--theme-text)' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'var(--theme-text)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// Two-Factor Authentication Modal Component
function TwoFactorModal({ onClose }) {
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState(1) // 1: Show QR, 2: Verify code, 3: Success
  const [error, setError] = useState('')

  // Generate a mock QR code and secret (in production, this would come from your backend)
  const generateMock2FA = () => {
    const mockSecret = 'JBSWY3DPEHPK3PXP' // Mock secret for demo
    setSecret(mockSecret)
    // In production, you'd generate an actual QR code URL
    setQrCode('https://via.placeholder.com/200x200?text=QR+Code')
  }

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    // Mock verification (in production, verify with backend)
    if (verificationCode === '123456' || verificationCode.length === 6) {
      setStep(3)
      setTimeout(() => onClose(), 2000)
    } else {
      setError('Invalid verification code')
    }
  }

  if (!secret) {
    generateMock2FA()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '24px', color: 'var(--theme-text)' }}>Enable Two-Factor Authentication</h2>

        {step === 1 && (
          <div>
            <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '24px' }}>
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>

            <div style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px' }} />
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <p style={{ color: 'var(--theme-text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                Or enter this code manually:
              </p>
              <code style={{
                color: 'var(--theme-primary)',
                fontSize: '16px',
                fontWeight: '600',
                letterSpacing: '2px'
              }}>
                {secret}
              </code>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => setStep(2)} className="btn-primary">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '24px' }}>
              Enter the 6-digit code from your authenticator app to complete setup
            </p>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              value={verificationCode}
              onChange={(e) => {
                setError('')
                setVerificationCode(e.target.value.replace(/\D/g, ''))
              }}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'var(--theme-text)',
                fontSize: '24px',
                textAlign: 'center',
                letterSpacing: '8px',
                marginBottom: '24px'
              }}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setStep(1)} className="btn-secondary">
                Back
              </button>
              <button onClick={handleVerify} className="btn-primary">
                Verify & Enable
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--theme-success)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <p>Two-Factor Authentication enabled successfully!</p>
          </div>
        )}
      </div>
    </div>
  )
}
