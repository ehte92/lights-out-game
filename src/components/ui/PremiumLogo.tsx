import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '../../contexts/AppThemeContext';

interface PremiumLogoProps {
  size?: number;
  animated?: boolean;
}

export const PremiumLogo: React.FC<PremiumLogoProps> = ({ 
  size = 120, 
  animated = true 
}) => {
  const { colors, paperTheme } = useAppTheme();
  
  // Animation values
  const pulse = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0.7);
  
  React.useEffect(() => {
    if (animated) {
      // Subtle pulse animation
      pulse.value = withRepeat(
        withSequence(
          withTiming(0.95, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
      
      // Very slow rotation
      rotation.value = withRepeat(
        withTiming(360, { duration: 30000 }),
        -1,
        false
      );
      
      // Breathing glow
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 3000 }),
          withTiming(0.9, { duration: 3000 })
        ),
        -1,
        true
      );
    }
  }, [animated, pulse, rotation, glowOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulse.value },
      { rotateZ: `${rotation.value}deg` }
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const primaryColor = colors.primary;
  const secondaryColor = colors.secondary;
  const glowColor = colors.accent;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Glow Effect Background */}
      <Animated.View style={[StyleSheet.absoluteFillObject, glowAnimatedStyle]}>
        <LinearGradient
          colors={[
            `${glowColor}30`,
            `${glowColor}15`,
            'transparent',
          ]}
          style={[StyleSheet.absoluteFillObject, { borderRadius: size / 2 }]}
        />
      </Animated.View>
      
      {/* Main Logo */}
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="bulbGradient" cx="50%" cy="30%" r="60%">
              <Stop offset="0%" stopColor={secondaryColor} stopOpacity="1" />
              <Stop offset="50%" stopColor={primaryColor} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity="0.7" />
            </RadialGradient>
            
            <RadialGradient id="glowGradient" cx="50%" cy="50%" r="80%">
              <Stop offset="0%" stopColor={glowColor} stopOpacity="0" />
              <Stop offset="60%" stopColor={glowColor} stopOpacity="0.1" />
              <Stop offset="100%" stopColor={glowColor} stopOpacity="0.3" />
            </RadialGradient>
          </Defs>
          
          {/* Outer Glow */}
          <Circle
            cx="50"
            cy="45"
            r="40"
            fill="url(#glowGradient)"
          />
          
          {/* Main Bulb Shape - More refined geometry */}
          <Path
            d="M50 15 C32 15 20 27 20 42 C20 52 25 60 32 67 L32 75 C32 78 34 80 37 80 L63 80 C66 80 68 78 68 75 L68 67 C75 60 80 52 80 42 C80 27 68 15 50 15 Z"
            fill="url(#bulbGradient)"
            stroke={paperTheme.colors.outline}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          
          {/* Refined Filament - More geometric */}
          <Path
            d="M35 38 L65 38 M38 45 L62 45 M42 52 L58 52"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
          
          {/* Base Threads - Cleaner design */}
          <Path
            d="M35 75 L65 75 M35 78 L65 78"
            stroke={paperTheme.colors.outline}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
          
          {/* Minimalist Light Rays */}
          <Path
            d="M50 8 L50 3 M75 25 L79 21 M25 25 L21 21 M85 42 L90 42 M15 42 L10 42"
            stroke={glowColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
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