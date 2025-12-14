import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../store/themeStore';

/**
 * GlassCard Component - Glassmorphism card with blur effect
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.style - Additional styles
 * @param {boolean} props.gradient - Use gradient background
 * @param {string} props.intensity - Blur intensity: 'light', 'medium', 'strong'
 */
export const GlassCard = ({
  children,
  style,
  gradient = false,
  intensity = 'medium',
  ...props
}) => {
  const { theme, mode } = useThemeStore();

  // Get glass opacity based on intensity
  const getGlassOpacity = () => {
    switch (intensity) {
      case 'light':
        return mode === 'light' ? 0.25 : 0.05;
      case 'medium':
        return mode === 'light' ? 0.45 : 0.1;
      case 'strong':
        return mode === 'light' ? 0.65 : 0.15;
      default:
        return mode === 'light' ? 0.45 : 0.1;
    }
  };

  const glassStyle = {
    backgroundColor: `rgba(255, 255, 255, ${getGlassOpacity()})`,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  };

  // For web, use CSS backdrop-filter
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.card,
          glassStyle,
          {
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)', // Safari support
          },
          style,
        ]}
        {...props}
      >
        {gradient ? (
          <LinearGradient
            colors={theme.colors.gradient1}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientOverlay}
          />
        ) : null}
        {children}
      </View>
    );
  }

  // For native, use BlurView
  return (
    <View style={[styles.card, style]} {...props}>
      <BlurView
        intensity={intensity === 'light' ? 50 : intensity === 'medium' ? 75 : 100}
        tint={mode === 'light' ? 'light' : 'dark'}
        style={[StyleSheet.absoluteFill, styles.blurView, { borderRadius: theme.borderRadius.lg }]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          glassStyle,
          { borderRadius: theme.borderRadius.lg },
        ]}
      />
      {gradient ? (
        <LinearGradient
          colors={theme.colors.gradient1}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradientOverlay, { borderRadius: theme.borderRadius.lg }]}
        />
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  blurView: {
    overflow: 'hidden',
  },
  gradientOverlay: {
    opacity: 0.1,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
