// Typography system inspired by the reference design
// Using system fonts similar to Avenir and Helvetica

export const typography = {
  fonts: {
    heading: {
      ios: 'Avenir-Heavy',
      android: 'sans-serif-medium',
      web: '"Avenir", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    subheading: {
      ios: 'Avenir-Medium',
      android: 'sans-serif',
      web: '"Avenir", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    body: {
      ios: 'Helvetica',
      android: 'Roboto',
      web: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    mono: {
      ios: 'Courier',
      android: 'monospace',
      web: '"SF Mono", Monaco, "Courier New", monospace',
    },
  },

  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Text style presets
export const textStyles = {
  h1: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 1.2,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 1.3,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 1.4,
    letterSpacing: 0,
  },
  h5: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 1.4,
    letterSpacing: 0,
  },
  h6: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 1.4,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 1.4,
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 1.2,
    letterSpacing: 0.5,
  },
};
