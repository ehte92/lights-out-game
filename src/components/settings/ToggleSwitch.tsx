import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ToggleSwitchProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}) => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  
  const switchAnimation = useSharedValue(value ? 1 : 0);
  const pressed = useSharedValue(false);
  
  React.useEffect(() => {
    switchAnimation.value = withSpring(value ? 1 : 0, { duration: 200 });
  }, [value, switchAnimation]);
  
  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };
  
  const handlePressIn = () => {
    pressed.value = true;
  };
  
  const handlePressOut = () => {
    pressed.value = false;
  };
  
  const switchAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(switchAnimation.value, [0, 1], [2, 30]);
    
    return {
      transform: [
        { translateX },
        { translateY: pressed.value ? 1 : 0 }, // Slight press effect
      ],
    };
  });
  
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: pressed.value ? 1 : 0 },
      { translateY: pressed.value ? 1 : 0 },
    ],
  }));
  
  const switchTrackColor = value ? colors.primary : colors.background;
  const switchThumbColor = value ? colors.background : colors.onBackground;
  
  return (
    <AnimatedPressable
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderWidth: borders.thick,
          borderColor: borders.color,
          // Neobrutalist shadow
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            },
            android: { elevation: 8 },
          }),
        },
        containerAnimatedStyle,
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text
            style={[
              typography.titleMedium,
              {
                color: colors.onBackground,
                fontWeight: '900', // Bold for neobrutalism
              },
            ]}
          >
            {label}
          </Text>
          {description && (
            <Text
              style={[
                typography.bodyMedium,
                {
                  color: colors.onSurfaceVariant,
                  fontWeight: '600',
                  marginTop: 2,
                },
              ]}
            >
              {description}
            </Text>
          )}
        </View>
        
        {/* Neobrutalist Toggle Switch */}
        <View
          style={[
            styles.switchTrack,
            {
              backgroundColor: switchTrackColor,
              borderWidth: borders.medium,
              borderColor: borders.color,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.switchThumb,
              {
                backgroundColor: switchThumbColor,
                borderWidth: borders.medium,
                borderColor: borders.color,
              },
              switchAnimatedStyle,
            ]}
          />
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchTrack: {
    width: 56,
    height: 28,
    borderRadius: 0, // Sharp corners for neobrutalism
    position: 'relative',
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 0, // Sharp corners for neobrutalism
    position: 'absolute',
  },
  disabled: {
    opacity: 0.5,
  },
});