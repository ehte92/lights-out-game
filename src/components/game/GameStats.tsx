import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GameState } from '../../types/game';
import { useGameTheme } from '../../contexts/GameThemeContext';
import { useAppTheme, useAppTypography, useAppBorders, useAppShadows } from '../../contexts/AppThemeContext';

interface GameStatsProps {
  gameState: GameState | null;
  isPlaying: boolean;
}

export const GameStats: React.FC<GameStatsProps> = React.memo(({
  gameState,
  isPlaying,
}) => {
  const { gameColors } = useGameTheme();
  const { colors: appColors, paperTheme } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  const shadows = useAppShadows();
  const [elapsedTime, setElapsedTime] = useState(0);
  const moveScale = useSharedValue(1);

  // Reset elapsed time when new game starts
  useEffect(() => {
    if (gameState && gameState.moves === 0 && gameState.elapsedTime === 0) {
      setElapsedTime(0);
    }
  }, [gameState?.moves, gameState?.elapsedTime]);

  // Timer effect
  useEffect(() => {
    if (!gameState || !isPlaying || gameState.isComplete || !gameState.lastResumeTime) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const sessionTime = (now - gameState.lastResumeTime!) / 1000;
      const totalElapsed = Math.floor(gameState.elapsedTime + sessionTime);
      setElapsedTime(totalElapsed);
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
    return gameState.isComplete
      ? Math.floor(gameState.elapsedTime)
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
    <View style={[
      styles.container,
      {
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white for floating effect
        borderWidth: borders.medium, // Reduced border for floating design
        borderColor: borders.color,
        borderRadius: 8, // Subtle rounding for floating panel
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 0,
          },
          android: { elevation: 8 },
        }),
      }
    ]}>
      <View style={styles.statItem}>
        <Text style={[typography.labelSmall, styles.statLabel, { color: appColors.onBackground }]}>
          MOVES
        </Text>
        <Animated.View style={moveAnimatedStyle}>
          <Text style={[typography.titleLarge, styles.statValue, { color: appColors.onBackground }]}>
            {gameState.moves}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.statItem}>
        <Text style={[typography.labelSmall, styles.statLabel, { color: appColors.onBackground }]}>
          TIME
        </Text>
        <Text style={[typography.titleLarge, styles.statValue, { color: appColors.onBackground }]}>
          {formatTime(displayTime)}
        </Text>
      </View>

      <View style={styles.statItem}>
        <Text style={[typography.labelSmall, styles.statLabel, { color: appColors.onBackground }]}>
          DIFFICULTY
        </Text>
        <Text style={[typography.titleMedium, styles.statValue, styles.difficultyText, { color: appColors.secondary, fontWeight: '900' }]}>
          {formattedDifficulty}
        </Text>
      </View>
    </View>
  );
});

GameStats.displayName = 'GameStats';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 0, // Sharp corners for neobrutalism
    paddingVertical: 14, // Optimized padding
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginVertical: 6, // Minimal margin for better game focus
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 6, // Reduced padding for more compact design
  },
  statLabel: {
    marginBottom: 2, // Tighter spacing
    fontWeight: '900', // Bold for neobrutalism
    textTransform: 'uppercase',
    letterSpacing: 0.8, // Better letter spacing for readability
  },
  statValue: {
    fontWeight: '900', // Extra bold for neobrutalism
    lineHeight: 22, // Better line height for large numbers
  },
  difficultyText: {
    // Additional styles for difficulty text
  },
  // Separator removed - using spacing instead
});