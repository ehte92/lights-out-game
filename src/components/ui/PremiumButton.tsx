import React from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
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
import { useAppTheme, useAppBorders, useAppShadows } from '../../contexts/AppThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PremiumButtonProps {
  title?: string;
  onPress: () => void;
  size?: 'large' | 'medium' | 'small';
  variant?: 'primary' | 'secondary' | 'ghost' | 'continue';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  accessibilityLabel?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  title,
  onPress,
  size = 'large',
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  children,
  accessibilityLabel,
}) => {
  const { colors, paperTheme } = useAppTheme();
  const borders = useAppBorders();
  const shadows = useAppShadows();
  
  // Neobrutalist animations - sharp, abrupt, no smoothing
  const pressed = useSharedValue(false);
  
  const handlePressIn = () => {
    pressed.value = true;
  };
  
  const handlePressOut = () => {
    pressed.value = false;
  };
  
  // Sharp animation style - no smooth transitions
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: pressed.value ? 2 : 0 }, // Sharp offset when pressed
      { translateY: pressed.value ? 2 : 0 }, // Separate transform objects
    ],
  }));

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;      // Electric blue
      case 'continue':
        return colors.secondary;    // Hot pink
      case 'secondary':
        return colors.background;   // White with border
      default:
        return colors.background;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF';           // White text on blue
      case 'continue':
        return '#FFFFFF';           // White text on pink
      case 'secondary':
        return colors.onBackground; // Black text on white
      default:
        return colors.onBackground;
    }
  };

  const getBorderStyle = () => {
    const borderWidth = size === 'large' ? borders.thick : borders.medium;
    return {
      borderWidth,
      borderColor: borders.color,
      borderStyle: borders.style,
    };
  };


  const getSizeStyles = () => {
    switch (size) {
      case 'large':
        return {
          height: 64,
          paddingHorizontal: 48,
          borderRadius: 0, // No rounded corners in neobrutalism
        };
      case 'medium':
        return {
          height: 52,
          paddingHorizontal: 32,
          borderRadius: 0,
        };
      default:
        return {
          height: 44,
          paddingHorizontal: 24,
          borderRadius: 0,
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


  const shadowStyle = useAnimatedStyle(() => {
    if (pressed.value) {
      return Platform.OS === 'android' 
        ? { elevation: 0 } 
        : { shadowOpacity: 0 };
    }
    
    const shadowConfig = size === 'large' ? shadows.large : 
                        size === 'medium' ? shadows.medium : shadows.small;
    
    // Android uses elevation only, iOS uses shadow properties
    if (Platform.OS === 'android') {
      return {
        elevation: shadowConfig.elevation,
      };
    } else {
      return {
        shadowColor: shadowConfig.shadowColor,
        shadowOffset: shadowConfig.shadowOffset,
        shadowOpacity: shadowConfig.shadowOpacity,
        shadowRadius: shadowConfig.shadowRadius,
      };
    }
  });

  const sizeStyles = getSizeStyles();
  const borderStyles = getBorderStyle();
  const backgroundColor = getBackgroundColor();

  // Original neobrutalist design - iOS shadows, flat Android
  return (
    <AnimatedPressable
      style={[
        styles.container,
        sizeStyles,
        borderStyles,
        shadowStyle,
        animatedStyle,
        { backgroundColor },
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
    >
      {children ? (
        children
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
              fontWeight: '900',
            },
            textStyle,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          ellipsizeMode="tail"
          minimumFontScale={0.8}
        >
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // No overflow hidden - let sharp edges show
  },
  text: {
    textAlign: 'center',
    letterSpacing: 0, // No fancy letter spacing
  },
  disabled: {
    opacity: 0.5,
  },
});