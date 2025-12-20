import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from '../theme';

// Theme store using Zustand
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      mode: 'dark', // 'light' or 'dark'
      theme: getTheme('dark'),

      // Actions
      toggleTheme: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({
          mode: newMode,
          theme: getTheme(newMode),
        });
      },

      setTheme: (mode) => {
        set({
          mode,
          theme: getTheme(mode),
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
