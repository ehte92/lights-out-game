import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, Divider } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GameState } from '../../types/game';
import { useGameTheme } from '../../contexts/ThemeContext';

interface GameStatsProps {
  gameState: GameState | null;
  isPlaying: boolean;
}

export const GameStats: React.FC<GameStatsProps> = React.memo(({
  gameState,
  isPlaying,
}) => {
  const { colors, paperTheme } = useGameTheme();
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
  }, [gameState?.moves, moveScale]);

  const moveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: moveScale.value }],
  }));

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const displayTime = useMemo(() => {
    if (!gameState) return 0;
    return gameState.isComplete && gameState.endTime
      ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
      : elapsedTime;
  }, [gameState, elapsedTime]);

  const formattedDifficulty = useMemo(() => {
    if (!gameState) return '';
    return gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
  }, [gameState]);

  if (!gameState) {
    return null;
  }

  return (
    <Surface style={[styles.container, { backgroundColor: colors.panelBackground }]} elevation={2}>
      <View style={styles.statItem}>
        <Text variant="labelSmall" style={[styles.statLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
          Moves
        </Text>
        <Animated.View style={moveAnimatedStyle}>
          <Text variant="titleLarge" style={[styles.statValue, { color: paperTheme.colors.onSurface }]}>
            {gameState.moves}
          </Text>
        </Animated.View>
      </View>

      <Divider style={styles.separator} />

      <View style={styles.statItem}>
        <Text variant="labelSmall" style={[styles.statLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
          Time
        </Text>
        <Text variant="titleLarge" style={[styles.statValue, { color: paperTheme.colors.onSurface }]}>
          {formatTime(displayTime)}
        </Text>
      </View>

      <Divider style={styles.separator} />

      <View style={styles.statItem}>
        <Text variant="labelSmall" style={[styles.statLabel, { color: paperTheme.colors.onSurfaceVariant }]}>
          Difficulty
        </Text>
        <Text variant="titleMedium" style={[styles.statValue, styles.difficultyText, { color: colors.accent }]}>
          {formattedDifficulty}
        </Text>
      </View>
    </Surface>
  );
});

GameStats.displayName = 'GameStats';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontWeight: 'bold',
  },
  difficultyText: {
    // Additional styles for difficulty text
  },
  separator: {
    height: 32,
    marginHorizontal: 12,
  },
});