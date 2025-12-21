import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Determine current season based on date
const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();

  // Spring: March 20 - June 20
  if ((month === 2 && day >= 20) || (month > 2 && month < 5) || (month === 5 && day <= 20)) {
    return 'spring';
  }
  // Summer: June 21 - September 22
  if ((month === 5 && day >= 21) || (month > 5 && month < 8) || (month === 8 && day <= 22)) {
    return 'summer';
  }
  // Fall: September 23 - December 20
  if ((month === 8 && day >= 23) || (month > 8 && month < 11) || (month === 11 && day <= 20)) {
    return 'fall';
  }
  // Winter: December 21 - March 19
  return 'winter';
};

// Seasonal color palettes
const seasonalPalettes = {
  spring: {
    name: 'Spring',
    emoji: '🌸',
    description: 'Fresh cherry blossoms',
    colors: {
      background: '#FFF5F7',
      surface: '#FFE8ED',
      card: '#FFD6E0',
      border: '#FFB3C6',
      text: '#4A1942',
      textSecondary: '#8B4789',
      textTertiary: '#B86FB5',
      primary: '#FF69B4',
      primaryHover: '#E75A9F',
      success: '#66bb6a',
      error: '#f44336',
      warning: '#ff9800',
      info: '#FF69B4',
    }
  },
  summer: {
    name: 'Summer',
    emoji: '☀️',
    description: 'Bright sunny vibes',
    colors: {
      background: '#FFFBF0',
      surface: '#FFF4D6',
      card: '#FFEDB8',
      border: '#FFD97D',
      text: '#5C4A1F',
      textSecondary: '#8B7239',
      textTertiary: '#B89F5F',
      primary: '#FFB347',
      primaryHover: '#FF9F2E',
      success: '#66bb6a',
      error: '#f44336',
      warning: '#ff9800',
      info: '#FFB347',
    }
  },
  fall: {
    name: 'Fall',
    emoji: '🍁',
    description: 'Autumn leaves',
    colors: {
      background: '#FFF8F0',
      surface: '#FFE8D6',
      card: '#FFD4B0',
      border: '#FFAD70',
      text: '#5C2E1F',
      textSecondary: '#8B4A2F',
      textTertiary: '#B8724F',
      primary: '#D2691E',
      primaryHover: '#B85A1A',
      success: '#66bb6a',
      error: '#f44336',
      warning: '#ff9800',
      info: '#D2691E',
    }
  },
  winter: {
    name: 'Winter',
    emoji: '❄️',
    description: 'Snowy twilight',
    colors: {
      background: '#F5F5F7',
      surface: '#E8E8ED',
      card: '#D9D9E3',
      border: '#B8B8CC',
      text: '#2D2A4A',
      textSecondary: '#4A4668',
      textTertiary: '#6B6889',
      primary: '#8B7FB8',
      primaryHover: '#7A6EA5',
      success: '#66bb6a',
      error: '#f44336',
      warning: '#ff9800',
      info: '#8B7FB8',
    }
  }
};

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
      card: '#f0f0f0',
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
      card: '#151515',
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
      background: '#F7F3ED',
      surface: '#EFD8D6',
      card: '#E5C9C7',
      border: '#C2C6B9',
      text: '#422B23',
      textSecondary: '#6B4539',
      textTertiary: '#8B6B5F',
      primary: '#DBA1A2',
      primaryHover: '#C28B8C',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#DBA1A2',
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
      card: '#ffdcc9',
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
      card: '#e5d7ff',
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
      card: '#d7ffe9',
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
      background: '#F0F8FF',
      surface: '#E3F2FD',
      card: '#D4E9F7',
      border: '#B3D9F2',
      text: '#1A3A52',
      textSecondary: '#2B5F7C',
      textTertiary: '#4A7FA0',
      primary: '#4A90B8',
      primaryHover: '#2B5F7C',
      success: '#66bb6a',
      error: '#e53935',
      warning: '#ffa726',
      info: '#4A90B8',
    }
  },

  // Enhanced Dark Pinterest Themes
  midnightLatte: {
    id: 'midnightLatte',
    name: 'Midnight Latte',
    mode: 'dark',
    emoji: '☕',
    description: 'Sophisticated coffee tones',
    colors: {
      background: '#2C3839',
      surface: '#3F4E4F',
      card: '#364143',
      border: '#6B5A4D',
      text: '#DCD7C9',
      textSecondary: '#C4BFB1',
      textTertiary: '#A27B5B',
      primary: '#A27B5B',
      primaryHover: '#C9A079',
      success: '#66bb6a',
      error: '#f44336',
      warning: '#ff9800',
      info: '#A27B5B',
    }
  },

  seasonal: {
    id: 'seasonal',
    name: 'Seasonal',
    mode: 'light',
    emoji: '🌍',
    description: 'Changes with seasons',
    getSeason: getCurrentSeason,
    colors: seasonalPalettes[getCurrentSeason()].colors,
    get emoji() {
      return seasonalPalettes[getCurrentSeason()].emoji;
    },
    get name() {
      const season = getCurrentSeason();
      return `Seasonal (${seasonalPalettes[season].name})`;
    },
    get description() {
      return seasonalPalettes[getCurrentSeason()].description;
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
        const theme = themePresets[currentTheme] || customTheme || themePresets.pureWhite;

        // If seasonal theme, refresh colors based on current season
        if (currentTheme === 'seasonal') {
          const season = getCurrentSeason();
          return {
            ...theme,
            colors: seasonalPalettes[season].colors,
            emoji: seasonalPalettes[season].emoji,
            name: `Seasonal (${seasonalPalettes[season].name})`,
            description: seasonalPalettes[season].description
          };
        }

        return theme;
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
