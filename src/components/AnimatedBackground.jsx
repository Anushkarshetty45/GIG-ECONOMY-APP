import { useEffect, useState } from 'react'
import { useThemeStore } from '../store/themeStore'
import './AnimatedBackground.css'

export default function AnimatedBackground() {
  const { currentTheme, getActiveTheme } = useThemeStore()
  const [particles, setParticles] = useState([])

  console.log('AnimatedBackground rendering with theme:', currentTheme)

  useEffect(() => {
    // Generate particles based on theme
    const generateParticles = () => {
      const particleCount = 30
      const newParticles = []

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 8,
          animationDuration: 8 + Math.random() * 12,
          size: 15 + Math.random() * 20
        })
      }

      setParticles(newParticles)
    }

    generateParticles()
  }, [currentTheme])

  const getParticleSymbol = () => {
    const theme = getActiveTheme()
    const themeId = currentTheme

    // Seasonal themes
    if (themeId === 'seasonal') {
      const season = theme.name?.toLowerCase()
      if (season?.includes('spring')) return '🌸'
      if (season?.includes('summer')) return '☀️'
      if (season?.includes('fall')) return '🍁'
      if (season?.includes('winter')) return '❄️'
    }

    // Static themes
    switch (themeId) {
      case 'softPastels': return '🌸'
      case 'coralSunset': return '🌅'
      case 'lavenderDream': return '✨'
      case 'mintFresh': return '🍃'
      case 'oceanBreeze': return '💧'
      case 'midnightLatte': return '☕'
      case 'midnightBlack': return '⭐'
      default: return '✨'
    }
  }

  const particleSymbol = getParticleSymbol()

  return (
    <div className="animated-background" style={{ display: currentTheme === 'pureWhite' ? 'none' : 'block' }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            fontSize: `${particle.size}px`,
            opacity: 0.6
          }}
        >
          {particleSymbol}
        </div>
      ))}

      {/* Gradient overlay for some themes */}
      {(currentTheme === 'coralSunset' || currentTheme === 'lavenderDream') && (
        <div className="gradient-overlay"></div>
      )}

      {/* Wave effect for Ocean Breeze */}
      {currentTheme === 'oceanBreeze' && (
        <div className="wave-container">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
      )}
    </div>
  )
}
