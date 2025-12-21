import { useState } from 'react'
import { useThemeStore, themePresets } from '../store/themeStore'
import { Palette, X } from 'lucide-react'
import './ThemeSwitcherModal.css'

export default function ThemeSwitcherModal() {
  const { currentTheme, showThemeSwitcher, setTheme, toggleThemeSwitcher, closeThemeSwitcher } = useThemeStore()
  const [previewTheme, setPreviewTheme] = useState(null)

  const handleThemeClick = (themeId) => {
    setTheme(themeId, true)
    closeThemeSwitcher()
  }

  const handlePreview = (themeId) => {
    setPreviewTheme(themeId)
    const theme = themePresets[themeId]
    if (theme) {
      useThemeStore.getState().applyTheme(theme)
    }
  }

  const handleStopPreview = () => {
    setPreviewTheme(null)
    const theme = themePresets[currentTheme]
    if (theme) {
      useThemeStore.getState().applyTheme(theme)
    }
  }

  return (
    <>
      {/* Floating Theme Button */}
      <button
        className="theme-switcher-fab"
        onClick={toggleThemeSwitcher}
        style={{
          background: themePresets[currentTheme]?.colors.primary,
          color: themePresets[currentTheme]?.colors.text,
        }}
        title="Change Theme"
      >
        <Palette size={24} />
      </button>

      {/* Theme Switcher Modal */}
      {showThemeSwitcher && (
        <>
          <div className="theme-switcher-overlay" onClick={closeThemeSwitcher} />
          <div className="theme-switcher-modal">
            <div className="theme-switcher-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Palette size={28} style={{ color: 'var(--theme-primary)' }} />
                <h2 style={{ color: 'var(--theme-text)', margin: 0 }}>Change Theme</h2>
              </div>
              <button
                className="theme-close-btn"
                onClick={closeThemeSwitcher}
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                <X size={24} />
              </button>
            </div>

            <div className="theme-switcher-grid">
              {Object.entries(themePresets).map(([id, theme]) => (
                <div
                  key={id}
                  className={`theme-mini-card ${currentTheme === id ? 'active' : ''}`}
                  onClick={() => handleThemeClick(id)}
                  onMouseEnter={() => handlePreview(id)}
                  onMouseLeave={handleStopPreview}
                  style={{
                    background: theme.colors.surface,
                    borderColor: currentTheme === id ? theme.colors.primary : theme.colors.border,
                  }}
                >
                  {currentTheme === id && (
                    <div 
                      className="active-indicator"
                      style={{ background: theme.colors.primary }}
                    >
                      ✓
                    </div>
                  )}
                  
                  <div className="theme-mini-emoji">{theme.emoji}</div>
                  
                  <h4 
                    className="theme-mini-name"
                    style={{ color: theme.colors.text }}
                  >
                    {theme.name}
                  </h4>

                  <div className="theme-mini-colors">
                    <div style={{ background: theme.colors.primary }} />
                    <div style={{ background: theme.colors.success }} />
                    <div style={{ background: theme.colors.warning }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="theme-switcher-footer">
              <p style={{ color: 'var(--theme-text-secondary)' }}>
                Hover to preview • Click to apply
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
