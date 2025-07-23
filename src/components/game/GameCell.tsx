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
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handlePress = useCallback(() => {
    if (disabled) return;

    // Trigger press animation
    scale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 150 })
    );

    rotation.value = withSequence(
      withSpring(5, { duration: 100 }),
      withSpring(0, { duration: 150 })
    );

    // Trigger the callback
    runOnJS(onPress)(row, col);
  }, [disabled, scale, rotation, onPress, row, col]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      opacity.value,
      [0, 1],
      isOn ? ['#1a1a1a', '#fbbf24'] : ['#fbbf24', '#1a1a1a']
    );

    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      backgroundColor,
    };
  });

  const gradientColors = isOn 
    ? ['#fbbf24', '#f59e0b', '#d97706'] // Bright yellow/orange when on
    : ['#374151', '#4b5563', '#6b7280']; // Dark gray when off

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
            backgroundColor: isOn ? '#fbbf24' : '#374151',
            shadowColor: isOn ? '#fbbf24' : '#000',
            shadowOpacity: isOn ? 0.8 : 0.3,
            shadowOffset: { width: 0, height: isOn ? 4 : 2 },
            shadowRadius: isOn ? 8 : 4,
            elevation: isOn ? 8 : 4,
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});