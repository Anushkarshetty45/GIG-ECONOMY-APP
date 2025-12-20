// Color palette for GIG ECONOMY app - Black, Grey, and White theme

export const colors = {
  // Light Mode - White and Grey
  light: {
    // Primary colors - Grey tones
    primary: '#404040',        // Dark grey
    primaryLight: '#6b6b6b',   // Medium grey
    primaryDark: '#1a1a1a',    // Almost black

    // Secondary colors
    secondary: '#808080',      // Medium grey
    secondaryLight: '#999999', // Light grey
    secondaryDark: '#595959',  // Dark grey

    // Background colors
    background: '#ffffff',     // Pure white
    backgroundAlt: '#f5f5f5',  // Light grey
    surface: 'rgba(255, 255, 255, 0.7)',

    // Glassmorphism overlays
    glassLight: 'rgba(255, 255, 255, 0.25)',
    glassMedium: 'rgba(255, 255, 255, 0.45)',
    glassStrong: 'rgba(255, 255, 255, 0.65)',

    // Text colors
    text: '#000000',           // Pure black
    textSecondary: '#404040',  // Dark grey
    textTertiary: '#808080',   // Medium grey
    textInverse: '#ffffff',    // White

    // Status colors - Grey scale
    success: '#404040',        // Dark grey
    warning: '#6b6b6b',        // Medium grey
    error: '#1a1a1a',          // Almost black
    info: '#595959',           // Dark grey

    // Financial colors
    income: '#2a2a2a',         // Dark grey
    expense: '#404040',        // Dark grey
    savings: '#595959',        // Dark grey
    tax: '#6b6b6b',            // Medium grey

    // UI Elements
    border: 'rgba(0, 0, 0, 0.1)',
    borderLight: 'rgba(0, 0, 0, 0.05)',
    shadow: 'rgba(0, 0, 0, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Gradients - Black to Grey
    gradient1: ['#1a1a1a', '#404040'],
    gradient2: ['#2a2a2a', '#6b6b6b'],
    gradient3: ['#404040', '#808080'],
  },

  // Dark Mode - Black and Grey
  dark: {
    // Primary colors - Light grey for dark mode
    primary: '#cccccc',        // Light grey
    primaryLight: '#e5e5e5',   // Very light grey
    primaryDark: '#a0a0a0',    // Medium grey

    // Secondary colors
    secondary: '#999999',      // Medium grey
    secondaryLight: '#b3b3b3', // Light grey
    secondaryDark: '#808080',  // Dark grey

    // Background colors
    background: '#0a0a0a',     // Almost pure black
    backgroundAlt: '#1a1a1a',  // Very dark grey
    surface: 'rgba(26, 26, 26, 0.7)',

    // Glassmorphism overlays
    glassLight: 'rgba(255, 255, 255, 0.05)',
    glassMedium: 'rgba(255, 255, 255, 0.1)',
    glassStrong: 'rgba(255, 255, 255, 0.15)',

    // Text colors
    text: '#ffffff',           // Pure white
    textSecondary: '#cccccc',  // Light grey
    textTertiary: '#808080',   // Medium grey
    textInverse: '#000000',    // Black

    // Status colors - Grey scale
    success: '#d4d4d4',        // Light grey
    warning: '#d9d9d9',        // Very light grey
    error: '#b8b8b8',          // Medium light grey
    info: '#d4d4d4',           // Light grey

    // Financial colors
    income: '#e0e0e0',         // Very light grey
    expense: '#c0c0c0',        // Light grey
    savings: '#d4d4d4',        // Light grey
    tax: '#cccccc',            // Light grey

    // UI Elements
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Gradients - Black to Grey to White
    gradient1: ['#1a1a1a', '#404040'],
    gradient2: ['#2a2a2a', '#595959'],
    gradient3: ['#404040', '#6b6b6b'],
  },
};

// Glassmorphism effect styles
export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(0, 0, 0, 0.18)',
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
