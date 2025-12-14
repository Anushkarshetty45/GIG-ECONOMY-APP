import { colors, glassmorphism } from './colors';
import { typography, textStyles } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

// Main theme export
export const theme = {
  colors,
  glassmorphism,
  typography,
  textStyles,
  spacing,
  borderRadius,
  shadows,
};

// Helper function to get theme based on mode
export const getTheme = (mode = 'light') => ({
  colors: colors[mode],
  glassmorphism: glassmorphism[mode],
  typography,
  textStyles,
  spacing,
  borderRadius,
  shadows,
  mode,
});

export { colors, glassmorphism, typography, textStyles, spacing, borderRadius, shadows };
