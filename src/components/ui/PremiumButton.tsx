import React from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useGameTheme } from '../../contexts/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  size?: 'large' | 'medium' | 'small';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  title,
  onPress,
  size = 'large',
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors, paperTheme } = useGameTheme();
  
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.4);
  const glowIntensity = useSharedValue(0.6);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    shadowOpacity.value = withTiming(0.2, { duration: 150 });
    glowIntensity.value = withTiming(0.9, { duration: 150 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    shadowOpacity.value = withTiming(0.4, { duration: 300 });
    glowIntensity.value = withTiming(0.6, { duration: 300 });
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    const shadowRadius = interpolate(scale.value, [0.96, 1], [20, 32]);
    const elevation = interpolate(scale.value, [0.96, 1], [8, 16]);
    
    return {
      transform: [{ scale: scale.value }],
      shadowOpacity: shadowOpacity.value,
      shadowRadius,
      elevation,
    };
  });
  
  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowIntensity.value,
  }));

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [
          colors.accent || paperTheme.colors.primary,
          colors.cellOn || paperTheme.colors.secondary,
          paperTheme.colors.tertiary,
        ];
      case 'secondary':
        return [
          colors.panelBackground,
          colors.gameBackground,
        ];
      default:
        return ['transparent', 'transparent'];
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return paperTheme.colors.onSurface;
      default:
        return paperTheme.colors.primary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'large':
        return {
          height: 64,
          paddingHorizontal: 48,
          borderRadius: 32,
        };
      case 'medium':
        return {
          height: 52,
          paddingHorizontal: 32,
          borderRadius: 26,
        };
      default:
        return {
          height: 44,
          paddingHorizontal: 24,
          borderRadius: 22,
        };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'large':
        return 20;
      case 'medium':
        return 18;
      default:
        return 16;
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <AnimatedPressable
      style={[
        styles.container,
        sizeStyles,
        animatedStyle,
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      {/* Glow Effect Background */}
      {variant === 'primary' && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.glowContainer,
            glowAnimatedStyle,
          ]}
        >
          <LinearGradient
            colors={[
              `${colors.accent || paperTheme.colors.primary}40`,
              `${colors.accent || paperTheme.colors.primary}20`,
              'transparent',
            ]}
            style={[StyleSheet.absoluteFillObject, { borderRadius: sizeStyles.borderRadius + 8 }]}
          />
        </Animated.View>
      )}
      
      {/* Main Button Background */}
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Glass Effect Overlay */}
      {variant === 'primary' && (
        <BlurView
          intensity={20}
          style={[StyleSheet.absoluteFillObject, { borderRadius: sizeStyles.borderRadius }]}
          tint={paperTheme.dark ? 'dark' : 'light'}
        />
      )}
      
      {/* Border Gradient */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.2)',
          'rgba(255, 255, 255, 0.1)',
          'rgba(255, 255, 255, 0.05)',
        ]}
        style={[StyleSheet.absoluteFillObject, styles.border]}
      />
      
      {/* Button Text */}
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: getFontSize(),
            fontWeight: size === 'large' ? '800' : '700',
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 16,
    overflow: 'hidden',
  },
  glowContainer: {
    transform: [{ scale: 1.2 }],
  },
  border: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: {
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});