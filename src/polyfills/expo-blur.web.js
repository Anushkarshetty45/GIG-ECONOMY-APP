import React from 'react';
import { View } from 'react-native';

/**
 * Web polyfill for expo-blur
 * Uses CSS backdrop-filter instead of native blur
 */
export const BlurView = ({ intensity = 50, tint = 'default', style, children, ...props }) => {
  // Convert intensity to CSS blur value
  const getBlurAmount = () => {
    if (intensity <= 25) return '5px';
    if (intensity <= 50) return '10px';
    if (intensity <= 75) return '15px';
    return '20px';
  };

  // Get background color based on tint
  const getBackgroundColor = () => {
    switch (tint) {
      case 'light':
        return 'rgba(255, 255, 255, 0.5)';
      case 'dark':
        return 'rgba(0, 0, 0, 0.5)';
      case 'default':
      default:
        return 'rgba(255, 255, 255, 0.3)';
    }
  };

  return (
    <View
      style={[
        {
          backdropFilter: `blur(${getBlurAmount()})`,
          WebkitBackdropFilter: `blur(${getBlurAmount()})`, // Safari support
          backgroundColor: getBackgroundColor(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
