import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { useAppBorders } from '../../contexts/AppThemeContext';
import { useGameColors } from '../../contexts/GameThemeContext';

interface GameCellProps {
  isOn: boolean;
  row: number;
  col: number;
  size: number;
  onPress: (row: number, col: number) => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GameCell: React.FC<GameCellProps> = React.memo(({
  isOn,
  row,
  col,
  size,
  onPress,
  disabled = false,
}) => {
  const gameColors = useGameColors();
  const borders = useAppBorders();
  const scale = useSharedValue(1);
  const pressed = useSharedValue(false);
  
  // Pre-calculate platform-specific shadow configuration on JS thread
  const shadowConfig = Platform.OS === 'ios' ? {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 0, // Sharp neobrutalist shadow
  } : {
    // Android uses elevation only
  };

  const handlePress = useCallback(() => {
    if (disabled) return;

    // Neobrutalist press animation - sharp and abrupt
    scale.value = withSequence(
      withSpring(0.9, { duration: 100 }), // Quick press down
      withSpring(1, { duration: 100 })    // Quick release
    );

    // Trigger the callback
    runOnJS(onPress)(row, col);
  }, [disabled, scale, onPress, row, col]);

  const handlePressIn = useCallback(() => {
    pressed.value = true;
  }, [pressed]);

  const handlePressOut = useCallback(() => {
    pressed.value = false;
  }, [pressed]);

  const animatedStyle = useAnimatedStyle(() => {
    // Use game theme colors for cells (not app theme colors)
    const backgroundColor = isOn ? gameColors.cellOn : gameColors.cellOff;
    
    // Build style object with pre-calculated platform shadows
    const style = {
      transform: [
        { scale: scale.value },
        // Floating press effect
        { translateX: pressed.value ? 2 : 0 },
        { translateY: pressed.value ? 2 : 0 },
      ],
      backgroundColor,
      borderWidth: borders.medium, // Strong borders for definition
      borderColor: borders.color,
      ...shadowConfig, // Apply pre-calculated static shadow properties
    };
    
    // Add animated shadow properties based on platform
    if (Platform.OS === 'ios') {
      style.shadowOpacity = pressed.value ? 0.3 : 0.7; // Animated shadow opacity
    } else {
      style.elevation = pressed.value ? 2 : 6; // Android elevation animation
    }
    
    return style;
  });

  return (
    <AnimatedPressable
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    />
  );
});

GameCell.displayName = 'GameCell';

const styles = StyleSheet.create({
  cell: {
    borderRadius: 0, // Sharp corners for neobrutalism
    // No margin - spacing handled by grid gap
    // Individual floating cell styling
  },
});