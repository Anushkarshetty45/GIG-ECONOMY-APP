import React from 'react';
import { View } from 'react-native';

/**
 * Web polyfill for expo-linear-gradient
 * Uses CSS linear-gradient instead of native implementation
 */
export const LinearGradient = ({ colors = [], start, end, style, children, ...props }) => {
  // Convert colors array to CSS gradient string
  const getGradientCSS = () => {
    if (!colors || colors.length === 0) return 'transparent';

    // Calculate angle from start/end points (default to 180deg for top-to-bottom)
    let angle = 180;
    if (start && end) {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    }

    // Create color stops
    const colorStops = colors.join(', ');

    return `linear-gradient(${angle}deg, ${colorStops})`;
  };

  return (
    <View
      style={[
        {
          backgroundImage: getGradientCSS(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
