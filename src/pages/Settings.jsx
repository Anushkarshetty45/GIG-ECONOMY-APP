import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore, themePresets } from '../store/themeStore'
import { Settings as SettingsIcon, User, Bell, Lock, Database, Info, Palette, Mail, Shield, Download, Trash2, LogOut } from 'lucide-react'
import './Settings.css'

export default function Settings() {
  const { user, signOut } = useAuthStore()
  const { currentTheme, toggleThemeSwitcher } = useThemeStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    goalReminders: true,
    weeklyReports: true,
    expenseAlerts: true
  })
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true
  })

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
                  <select className="settings-select">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div className="setting-item">
                  <div className="setting-label">
                    <span>Date Format</span>
                  </div>
                  <select className="settings-select">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
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
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
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
                      checked={notifications.weeklyReports}
                      onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
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
                      checked={notifications.goalReminders}
                      onChange={(e) => setNotifications({...notifications, goalReminders: e.target.checked})}
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
                      checked={notifications.expenseAlerts}
                      onChange={(e) => setNotifications({...notifications, expenseAlerts: e.target.checked})}
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
                      checked={privacy.analytics}
                      onChange={(e) => setPrivacy({...privacy, analytics: e.target.checked})}
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
                      checked={privacy.dataSharing}
                      onChange={(e) => setPrivacy({...privacy, dataSharing: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h3 className="settings-card-title">Account Security</h3>
                <div className="setting-item">
                  <span>Password</span>
                  <button className="btn-secondary">Change Password</button>
                </div>
                <div className="setting-item">
                  <span>Two-Factor Authentication</span>
                  <button className="btn-secondary">Enable 2FA</button>
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
    </div>
  )
}
