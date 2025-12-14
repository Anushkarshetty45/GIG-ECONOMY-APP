import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

/**
 * Loading Spinner Component
 * @param {Object} props
 * @param {string} props.size - 'small' or 'large'
 * @param {string} props.message - Optional loading message
 */
export const LoadingSpinner = ({ size = 'large', message, style }) => {
  const { theme } = useThemeStore();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
});
