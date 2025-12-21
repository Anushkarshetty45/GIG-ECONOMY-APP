import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Enhanced Pinterest-Style Theme Presets
export const themePresets = {
  // Default Themes
  pureWhite: {
    id: 'pureWhite',
    name: 'Pure White',
    mode: 'light',
    emoji: '⚪',
    description: 'Clean white default',
    colors: {
      background: '#ffffff',
      surface: '#fafafa',
      border: '#e0e0e0',
      text: '#1a1a1a',
      textSecondary: '#4a4a4a',
      textTertiary: '#6a6a6a',
      primary: '#2196f3',
      primaryHover: '#1976d2',
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3',
    }
  },

  midnightBlack: {
    id: 'midnightBlack',
    name: 'Midnight Black',
    mode: 'dark',
    emoji: '⚫',
    description: 'Classic dark default',
    colors: {
      background: '#0a0a0a',
      surface: '#1a1a1a',
      border: '#2a2a2a',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      textTertiary: '#808080',
      primary: '#2196f3',
      primaryHover: '#1976d2',
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3',
    }
  },

  // Aesthetic Pinterest Themes
  softPastels: {
    id: 'softPastels',
    name: 'Soft Pastels',
    mode: 'light',
    emoji: '🌸',
    description: 'Dreamy pastel vibes',
    colors: {
      background: '#fff5f9',
      surface: '#ffe6f0',
      border: '#ffb8d6',
      text: '#4a2847',
      textSecondary: '#6b3d5e',
      textTertiary: '#8f5277',
      primary: '#e91e63',
      primaryHover: '#c2185b',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#ab47bc',
    }
  },
  
  coralSunset: {
    id: 'coralSunset',
    name: 'Coral Sunset',
    mode: 'light',
    emoji: '🌅',
    description: 'Warm coral & peach',
    colors: {
      background: '#fff8f3',
      surface: '#ffebe0',
      border: '#ffb894',
      text: '#5c3828',
      textSecondary: '#7a4d36',
      textTertiary: '#996244',
      primary: '#ff6f3c',
      primaryHover: '#ff5722',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#ff7043',
    }
  },

  lavenderDream: {
    id: 'lavenderDream',
    name: 'Lavender Dream',
    mode: 'light',
    emoji: '💜',
    description: 'Soft lavender fields',
    colors: {
      background: '#faf7ff',
      surface: '#f0e6ff',
      border: '#d1b3f5',
      text: '#3d2466',
      textSecondary: '#5a3d80',
      textTertiary: '#76569a',
      primary: '#9c27b0',
      primaryHover: '#7b1fa2',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#ab47bc',
    }
  },

  mintFresh: {
    id: 'mintFresh',
    name: 'Mint Fresh',
    mode: 'light',
    emoji: '🌿',
    description: 'Fresh mint & teal',
    colors: {
      background: '#f5fffb',
      surface: '#e6fff3',
      border: '#b3f0d6',
      text: '#1a4d3d',
      textSecondary: '#2d6654',
      textTertiary: '#40806b',
      primary: '#00bfa5',
      primaryHover: '#00897b',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#26a69a',
    }
  },

  oceanBreeze: {
    id: 'oceanBreeze',
    name: 'Ocean Breeze',
    mode: 'light',
    emoji: '🌊',
    description: 'Cool ocean blues',
    colors: {
      background: '#f5fbff',
      surface: '#e6f5ff',
      border: '#b3dbf5',
      text: '#1a3d52',
      textSecondary: '#2d5a73',
      textTertiary: '#407694',
      primary: '#0288d1',
      primaryHover: '#01579b',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#039be5',
    }
  },

  // Enhanced Dark Pinterest Themes
  moodyPurple: {
    id: 'moodyPurple',
    name: 'Moody Purple',
    mode: 'dark',
    emoji: '🌙',
    description: 'Mystical purple nights',
    colors: {
      background: '#1a0f2e',
      surface: '#2b1a47',
      border: '#4a2f70',
      text: '#f3e8ff',
      textSecondary: '#d1b3f5',
      textTertiary: '#b08acc',
      primary: '#ba68c8',
      primaryHover: '#9c27b0',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#ab47bc',
    }
  },

  forestGreen: {
    id: 'forestGreen',
    name: 'Forest Green',
    mode: 'dark',
    emoji: '🌲',
    description: 'Enchanted forest',
    colors: {
      background: '#0f1f1a',
      surface: '#1a2e26',
      border: '#2d4a3d',
      text: '#e8f5ed',
      textSecondary: '#c4e6d1',
      textTertiary: '#9fd4b5',
      primary: '#4db6ac',
      primaryHover: '#00897b',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#26a69a',
    }
  },

  sunsetGradient: {
    id: 'sunsetGradient',
    name: 'Sunset Vibes',
    mode: 'dark',
    emoji: '🌇',
    description: 'Romantic sunset',
    colors: {
      background: '#1f0f1a',
      surface: '#2e1a26',
      border: '#4d2f3d',
      text: '#ffe6f0',
      textSecondary: '#ffb8d6',
      textTertiary: '#ff8ab8',
      primary: '#ec407a',
      primaryHover: '#c2185b',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#f06292',
    }
  }
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      currentTheme: 'pureWhite',
      customTheme: null,
      hasSelectedTheme: false,
      showThemeSwitcher: false,

      // Get current active theme object
      getActiveTheme: () => {
        const { currentTheme, customTheme } = get();
        return themePresets[currentTheme] || customTheme || themePresets.pureWhite;
      },

      // Apply theme to CSS variables
      applyTheme: (theme) => {
        if (!theme || !theme.colors) return;

        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
          const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          root.style.setProperty(cssVar, value);
        });

        // Apply mode class to body
        if (theme.mode === 'dark') {
          document.body.classList.add('dark-mode');
          document.body.classList.remove('light-mode');
        } else {
          document.body.classList.add('light-mode');
          document.body.classList.remove('dark-mode');
        }
      },

      // Set theme by ID
      setTheme: (themeId, markAsSelected = false) => {
        const theme = themePresets[themeId];
        if (theme) {
          set({ currentTheme: themeId });
          if (markAsSelected) {
            set({ hasSelectedTheme: true });
          }
          get().applyTheme(theme);
        }
      },

      // Mark that user has selected a theme
      completeThemeSelection: () => {
        set({ hasSelectedTheme: true });
      },

      // Toggle theme switcher modal
      toggleThemeSwitcher: () => {
        set({ showThemeSwitcher: !get().showThemeSwitcher });
      },

      // Close theme switcher
      closeThemeSwitcher: () => {
        set({ showThemeSwitcher: false });
      },

      // Set custom theme
      setCustomTheme: (theme) => {
        set({ customTheme: theme, currentTheme: 'custom' });
        get().applyTheme(theme);
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration
        if (state) {
          const theme = state.getActiveTheme();
          state.applyTheme(theme);
        }
      }
    }
  )
);

// Initialize theme on first load
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  const theme = store.getActiveTheme();
  store.applyTheme(theme);
}
