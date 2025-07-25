import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useGameTheme } from '../../contexts/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AppLogoProps {
  size?: number;
  animated?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 80, animated = true }) => {
  const { colors, paperTheme } = useGameTheme();
  
  // Animation values
  const glowOpacity = useSharedValue(0.6);
  const pulseScale = useSharedValue(1);
  
  React.useEffect(() => {
    if (animated) {
      // Glow animation
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 2000 }),
          withTiming(0.8, { duration: 2000 })
        ),
        -1,
        true
      );
      
      // Subtle pulse animation
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(0.95, { duration: 3000 }),
          withTiming(1, { duration: 3000 })
        ),
        -1,
        true
      );
    }
  }, [animated, glowOpacity, pulseScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowAnimatedProps = useAnimatedProps(() => ({
    opacity: glowOpacity.value,
  }));

  const lightColor = colors.cellOn || paperTheme.colors.primary;
  const darkColor = colors.cellOff || paperTheme.colors.surfaceVariant;
  const glowColor = colors.accent || paperTheme.colors.secondary;

  return (
    <Surface style={[styles.container, { width: size, height: size }]} elevation={0}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="lightGradient" cx="50%" cy="30%" r="70%">
              <Stop offset="0%" stopColor={lightColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={lightColor} stopOpacity="0.7" />
            </RadialGradient>
            
            <RadialGradient id="darkGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={darkColor} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={darkColor} stopOpacity="1" />
            </RadialGradient>
            
            <RadialGradient id="glowGradient" cx="50%" cy="50%" r="80%">
              <Stop offset="0%" stopColor={glowColor} stopOpacity="0" />
              <Stop offset="70%" stopColor={glowColor} stopOpacity="0.1" />
              <Stop offset="100%" stopColor={glowColor} stopOpacity="0.3" />
            </RadialGradient>
          </Defs>
          
          {/* Glow effect background */}
          <AnimatedCircle
            cx="50"
            cy="50"
            r="45"
            fill="url(#glowGradient)"
            animatedProps={glowAnimatedProps}
          />
          
          {/* Main bulb shape */}
          <Path
            d="M50 15 C35 15 25 25 25 40 C25 50 30 58 35 65 L35 75 C35 78 37 80 40 80 L60 80 C63 80 65 78 65 75 L65 65 C70 58 75 50 75 40 C75 25 65 15 50 15 Z"
            fill="url(#lightGradient)"
            stroke={paperTheme.colors.outline}
            strokeWidth="1"
          />
          
          {/* Filament lines */}
          <Path
            d="M40 35 L60 35 M42 42 L58 42 M45 49 L55 49"
            stroke={darkColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          
          {/* Base/screw threads */}
          <Path
            d="M38 75 L62 75 M38 78 L62 78"
            stroke={paperTheme.colors.outline}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Light rays (subtle) */}
          <Path
            d="M50 8 L50 2 M70 20 L75 15 M30 20 L25 15 M85 40 L91 40 M15 40 L9 40"
            stroke={glowColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
        </Svg>
      </Animated.View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});