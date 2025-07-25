import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Polygon, Rect } from 'react-native-svg';
import { useAppTheme, useAppBorders } from '../../contexts/AppThemeContext';

interface PremiumLogoProps {
  size?: number;
  animated?: boolean;
}

export const PremiumLogo: React.FC<PremiumLogoProps> = ({ 
  size = 120, 
  animated = true 
}) => {
  const { colors } = useAppTheme();
  const borders = useAppBorders();
  
  // Neobrutalist animation - sharp and minimal
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    if (animated) {
      // Simple scale animation - abrupt and geometric
      scale.value = withSequence(
        withSpring(1.05, { duration: 300 }),
        withSpring(1, { duration: 200 })
      );
    }
  }, [animated, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Bold Geometric Lightbulb Logo */}
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100">
          {/* Lightbulb Glass - Triangular Top Section */}
          <Polygon
            points="30,30 70,30 60,65 40,65"
            fill={colors.primary}
            stroke={borders.color}
            strokeWidth={borders.thick}
            strokeLinejoin="miter"
          />
          
          {/* Lightbulb Base - Rectangular Screw Section */}
          <Rect
            x="40"
            y="65"
            width="20"
            height="15"
            fill={colors.secondary}
            stroke={borders.color}
            strokeWidth={borders.thick}
          />
          
          {/* Base Cap - Small Rectangle */}
          <Rect
            x="42"
            y="80"
            width="16"
            height="5"
            fill={borders.color}
            stroke="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});