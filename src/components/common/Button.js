import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../store/themeStore';

/**
 * Button Component with glassmorphism effect
 * @param {Object} props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler
 * @param {string} props.variant - 'primary', 'secondary', 'glass', 'outline'
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.disabled - Disable button
 * @param {string} props.size - 'small', 'medium', 'large'
 */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  size = 'medium',
  style,
  textStyle,
  ...props
}) => {
  const { theme, mode } = useThemeStore();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.sm,
    };

    const sizeStyles = {
      small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
      },
      medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
      },
      large: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      glass: {
        backgroundColor: theme.colors.glassMedium,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = () => {
    const sizeStyles = {
      small: {
        fontSize: theme.typography.fontSizes.sm,
      },
      medium: {
        fontSize: theme.typography.fontSizes.md,
      },
      large: {
        fontSize: theme.typography.fontSizes.lg,
      },
    };

    const variantTextStyles = {
      primary: {
        color: '#ffffff',
      },
      secondary: {
        color: '#ffffff',
      },
      glass: {
        color: theme.colors.text,
      },
      outline: {
        color: theme.colors.primary,
      },
    };

    return {
      ...theme.textStyles.button,
      ...sizeStyles[size],
      ...variantTextStyles[variant],
    };
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'glass' ? theme.colors.primary : '#ffffff'}
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </>
  );

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), disabled && styles.disabled, style]}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={theme.colors.gradient1}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: theme.borderRadius.lg }]}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), disabled && styles.disabled, style]}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
