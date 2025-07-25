import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { useAppTheme, useAppBorders } from '../../contexts/AppThemeContext';

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
  const { colors } = useAppTheme();
  const borders = useAppBorders();
  const scale = useSharedValue(1);
  const pressed = useSharedValue(false);

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
    // Neobrutalist cell colors - neon green when on, white when off
    const backgroundColor = isOn ? colors.cellOn : colors.cellOff;
    
    return {
      transform: [
        { scale: scale.value },
        // Add slight press translation for neobrutalist effect
        { translateX: pressed.value ? 1 : 0 },
        { translateY: pressed.value ? 1 : 0 },
      ],
      backgroundColor,
      borderWidth: borders.medium, // Thick black border
      borderColor: borders.color,   // Pure black
    };
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
    margin: 4,
    // No overflow hidden - let sharp edges show
  },
});