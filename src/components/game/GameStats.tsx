import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { GameState } from '../../types/game';

interface GameStatsProps {
  gameState: GameState | null;
  isPlaying: boolean;
}

export const GameStats: React.FC<GameStatsProps> = ({
  gameState,
  isPlaying,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const moveScale = useSharedValue(1);

  // Timer effect
  useEffect(() => {
    if (!gameState || !isPlaying || gameState.isComplete) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - gameState.startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isPlaying]);

  // Animate moves counter when it changes
  useEffect(() => {
    if (gameState) {
      moveScale.value = withSpring(1.2, { duration: 150 }, () => {
        moveScale.value = withSpring(1, { duration: 100 });
      });
    }
  }, [gameState?.moves]);

  const moveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: moveScale.value }],
  }));

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameState) {
    return null;
  }

  const displayTime = gameState.isComplete && gameState.endTime
    ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
    : elapsedTime;

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Moves</Text>
        <Animated.View style={moveAnimatedStyle}>
          <Text style={styles.statValue}>{gameState.moves}</Text>
        </Animated.View>
      </View>

      <View style={styles.separator} />

      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Time</Text>
        <Text style={styles.statValue}>{formatTime(displayTime)}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Difficulty</Text>
        <Text style={[styles.statValue, styles.difficultyText]}>
          {gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  difficultyText: {
    fontSize: 14,
    color: '#fbbf24',
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
});