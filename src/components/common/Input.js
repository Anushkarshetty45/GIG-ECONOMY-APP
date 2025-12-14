import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { GlassCard } from './GlassCard';

/**
 * Input Component with glassmorphism effect
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Change handler
 * @param {boolean} props.secureTextEntry - Hide text (for passwords)
 * @param {string} props.error - Error message
 * @param {string} props.icon - Icon name from MaterialIcons
 * @param {string} props.keyboardType - Keyboard type
 */
export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  icon,
  keyboardType = 'default',
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  ...props
}) => {
  const { theme } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      )}

      <GlassCard
        intensity="light"
        style={[
          styles.inputContainer,
          isFocused && {
            borderColor: theme.colors.primary,
            borderWidth: 2,
          },
          error && {
            borderColor: theme.colors.error,
            borderWidth: 2,
          },
        ]}
      >
        <View style={styles.inputWrapper}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={20}
              color={theme.colors.textSecondary}
              style={styles.icon}
            />
          )}

          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textTertiary}
            secureTextEntry={isPassword && !showPassword}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[
              styles.input,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSizes.md,
              },
              inputStyle,
              multiline && { height: numberOfLines * 24, textAlignVertical: 'top' },
            ]}
            {...props}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </GlassCard>

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 8,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  passwordToggle: {
    padding: 4,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
