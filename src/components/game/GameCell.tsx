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
import { LinearGradient } from 'expo-linear-gradient';
import { useGameTheme } from '../../contexts/ThemeContext';

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
  const { colors, animations, effects } = useGameTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handlePress = useCallback(() => {
    if (disabled) return;

    // Use theme-based animation settings
    const pressScale = animations.cellHoverScale * 0.9; // Slightly smaller for press
    const duration = animations.cellToggleDuration / 2; // Half duration for press
    
    // Trigger press animation
    scale.value = withSequence(
      withSpring(pressScale, { duration }),
      withSpring(1, { duration: duration * 1.5 })
    );

    if (animations.pressEffect) {
      rotation.value = withSequence(
        withSpring(3, { duration }),
        withSpring(0, { duration: duration * 1.5 })
      );
    }

    // Trigger the callback
    runOnJS(onPress)(row, col);
  }, [disabled, scale, rotation, onPress, row, col, animations]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      opacity.value,
      [0, 1],
      isOn ? [colors.cellOff, colors.cellOn] : [colors.cellOn, colors.cellOff]
    );

    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      backgroundColor,
    };
  });

  // Create gradient colors based on theme
  const gradientColors = isOn 
    ? [colors.cellOn, colors.cellOn + 'CC', colors.cellOn + '99'] // On state with transparency
    : [colors.cellOff, colors.cellOff + 'CC', colors.cellOff + '99']; // Off state with transparency

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
      disabled={disabled}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[
          styles.innerCell,
          {
            backgroundColor: isOn ? colors.cellOn : colors.cellOff,
            borderColor: colors.cellBorder,
            shadowColor: colors.cellShadow,
            shadowOpacity: isOn ? (effects?.glowEffect ? 0.8 : 0.4) : 0.2,
            shadowOffset: { width: 0, height: isOn ? 4 : 2 },
            shadowRadius: isOn ? (effects?.glowEffect ? 12 : 6) : 3,
            elevation: isOn ? 8 : 3,
          }
        ]} />
      </LinearGradient>
    </AnimatedPressable>
  );
});

GameCell.displayName = 'GameCell';

const styles = StyleSheet.create({
  cell: {
    borderRadius: 12,
    margin: 4,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 12,
    padding: 2,
  },
  innerCell: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
  },
});