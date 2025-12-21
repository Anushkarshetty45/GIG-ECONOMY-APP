import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore, themePresets } from '../store/themeStore'
import { Sparkles, ArrowRight } from 'lucide-react'
import './ThemeSelector.css'

export default function ThemeSelector() {
  const navigate = useNavigate()
  const { currentTheme, setTheme, completeThemeSelection } = useThemeStore()
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [hoveredTheme, setHoveredTheme] = useState(null)

  const handleThemeClick = (themeId) => {
    setSelectedTheme(themeId)
    setTheme(themeId)
  }

  const handleContinue = () => {
    setTheme(selectedTheme, true)
    completeThemeSelection()
    navigate('/dashboard')
  }

  const handlePreview = (themeId) => {
    setHoveredTheme(themeId)
    const theme = themePresets[themeId]
    if (theme) {
      useThemeStore.getState().applyTheme(theme)
    }
  }

  const handleStopPreview = () => {
    setHoveredTheme(null)
    const theme = themePresets[selectedTheme]
    if (theme) {
      useThemeStore.getState().applyTheme(theme)
    }
  }

  return (
    <div className="theme-selector-page">
      <div className="theme-selector-container">
        <div className="theme-selector-header">
          <div className="header-icon">
            <Sparkles size={40} />
          </div>
          <h1 className="header-title">Choose Your Vibe</h1>
          <p className="header-subtitle">
            Pick a theme that speaks to your aesthetic. You can always change it later!
          </p>
        </div>

        <div className="themes-grid">
          {Object.entries(themePresets).map(([id, theme]) => (
            <div
              key={id}
              className={`theme-card ${selectedTheme === id ? 'selected' : ''}`}
              onClick={() => handleThemeClick(id)}
              onMouseEnter={() => handlePreview(id)}
              onMouseLeave={handleStopPreview}
              style={{
                background: theme.colors.surface,
                borderColor: selectedTheme === id ? theme.colors.primary : theme.colors.border,
              }}
            >
              {selectedTheme === id && (
                <div 
                  className="selected-badge"
                  style={{ background: theme.colors.primary }}
                >
                  ✓
                </div>
              )}
              
              <div className="theme-card-emoji">{theme.emoji}</div>
              
              <div className="theme-card-content">
                <h3 
                  className="theme-card-title"
                  style={{ color: theme.colors.text }}
                >
                  {theme.name}
                </h3>
                <p 
                  className="theme-card-description"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {theme.description}
                </p>
              </div>

              <div className="theme-card-colors">
                <div 
                  className="color-dot"
                  style={{ background: theme.colors.primary }}
                  title="Primary"
                />
                <div 
                  className="color-dot"
                  style={{ background: theme.colors.success }}
                  title="Success"
                />
                <div 
                  className="color-dot"
                  style={{ background: theme.colors.warning }}
                  title="Warning"
                />
                <div 
                  className="color-dot"
                  style={{ background: theme.colors.info }}
                  title="Info"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="theme-selector-footer">
          <button 
            className="continue-button"
            onClick={handleContinue}
            style={{
              background: themePresets[selectedTheme]?.colors.primary,
              color: themePresets[selectedTheme]?.colors.text,
            }}
          >
            Continue to Dashboard
            <ArrowRight size={20} style={{ marginLeft: '8px' }} />
          </button>
          <p className="footer-hint" style={{ color: themePresets[selectedTheme]?.colors.textSecondary }}>
            Hover to preview • Click to select
          </p>
        </div>
      </div>
    </div>
  )
}
