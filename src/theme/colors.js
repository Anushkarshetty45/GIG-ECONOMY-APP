// Color palette for GIG ECONOMY app with Glassmorphism design
// Inspired by professional, modern aesthetic with earthy tones

export const colors = {
  // Light Mode
  light: {
    // Primary colors
    primary: '#6366f1',        // Indigo - main brand color
    primaryLight: '#818cf8',   // Light indigo
    primaryDark: '#4f46e5',    // Dark indigo

    // Secondary colors (earthy tones from reference)
    secondary: '#8b7355',      // Warm brown
    secondaryLight: '#a38968', // Light brown
    secondaryDark: '#6d5a43',  // Dark brown

    // Background colors (cream/off-white from reference)
    background: '#f8f8f4',     // Off-white background
    backgroundAlt: '#ffffff',  // Pure white
    surface: 'rgba(255, 255, 255, 0.7)',  // Glassmorphism surface

    // Glassmorphism overlays
    glassLight: 'rgba(255, 255, 255, 0.25)',
    glassMedium: 'rgba(255, 255, 255, 0.45)',
    glassStrong: 'rgba(255, 255, 255, 0.65)',

    // Text colors (from reference)
    text: '#181818',           // Deep charcoal
    textSecondary: '#3E3D35',  // Dark brown
    textTertiary: '#6b7280',   // Gray
    textInverse: '#ffffff',    // White text

    // Status colors
    success: '#10b981',        // Green
    warning: '#f59e0b',        // Amber
    error: '#ef4444',          // Red
    info: '#3b82f6',           // Blue

    // Financial colors
    income: '#10b981',         // Green
    expense: '#ef4444',        // Red
    savings: '#6366f1',        // Indigo
    tax: '#f59e0b',           // Amber

    // UI Elements
    border: 'rgba(0, 0, 0, 0.1)',
    borderLight: 'rgba(0, 0, 0, 0.05)',
    shadow: 'rgba(0, 0, 0, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Gradients
    gradient1: ['#6366f1', '#8b5cf6'],  // Indigo to purple
    gradient2: ['#f59e0b', '#f97316'],  // Amber to orange
    gradient3: ['#10b981', '#14b8a6'],  // Green to teal
  },

  // Dark Mode
  dark: {
    // Primary colors
    primary: '#818cf8',        // Light indigo for dark mode
    primaryLight: '#a5b4fc',   // Very light indigo
    primaryDark: '#6366f1',    // Medium indigo

    // Secondary colors
    secondary: '#a38968',      // Light brown
    secondaryLight: '#b89d7f', // Very light brown
    secondaryDark: '#8b7355',  // Medium brown

    // Background colors
    background: '#0f0f1a',     // Very dark blue-black
    backgroundAlt: '#1a1a2e',  // Dark blue
    surface: 'rgba(30, 30, 46, 0.7)',  // Glassmorphism surface

    // Glassmorphism overlays
    glassLight: 'rgba(255, 255, 255, 0.05)',
    glassMedium: 'rgba(255, 255, 255, 0.1)',
    glassStrong: 'rgba(255, 255, 255, 0.15)',

    // Text colors
    text: '#f8f8f4',           // Off-white
    textSecondary: '#e5e5e5',  // Light gray
    textTertiary: '#9ca3af',   // Medium gray
    textInverse: '#181818',    // Dark text

    // Status colors (slightly brighter for dark mode)
    success: '#34d399',        // Lighter green
    warning: '#fbbf24',        // Lighter amber
    error: '#f87171',          // Lighter red
    info: '#60a5fa',           // Lighter blue

    // Financial colors
    income: '#34d399',         // Lighter green
    expense: '#f87171',        // Lighter red
    savings: '#818cf8',        // Light indigo
    tax: '#fbbf24',           // Lighter amber

    // UI Elements
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Gradients
    gradient1: ['#818cf8', '#a78bfa'],  // Light indigo to light purple
    gradient2: ['#fbbf24', '#fb923c'],  // Light amber to light orange
    gradient3: ['#34d399', '#2dd4bf'],  // Light green to light teal
  },
};

// Glassmorphism effect styles
export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    backdropFilter: 'blur(10px)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    backdropFilter: 'blur(10px)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
};
