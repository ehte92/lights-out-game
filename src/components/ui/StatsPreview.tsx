import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useGameStore } from '../../stores/gameStore';
import { useAppTheme } from '../../contexts/AppThemeContext';

export const StatsPreview: React.FC = () => {
  const { colors, paperTheme } = useAppTheme();
  const { stats } = useGameStore();
  
  if (!stats) return null;

  const winRate = stats.totalGames > 0 ? Math.round((stats.gamesWon / stats.totalGames) * 100) : 0;
  
  return (
    <Surface 
      style={[styles.container, { backgroundColor: colors.panelBackground }]} 
      elevation={1}
    >
      <View style={styles.content}>
        <View style={styles.statItem}>
          <Text variant="labelSmall" style={[styles.label, { color: paperTheme.colors.onSurfaceVariant }]}>
            Games Won
          </Text>
          <Text variant="titleMedium" style={[styles.value, { color: paperTheme.colors.onSurface }]}>
            {stats.gamesWon}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text variant="labelSmall" style={[styles.label, { color: paperTheme.colors.onSurfaceVariant }]}>
            Win Rate
          </Text>
          <Text variant="titleMedium" style={[styles.value, { color: paperTheme.colors.onSurface }]}>
            {winRate}%
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text variant="labelSmall" style={[styles.label, { color: paperTheme.colors.onSurfaceVariant }]}>
            Streak
          </Text>
          <View style={styles.streakContainer}>
            <Text variant="titleMedium" style={[styles.value, { color: paperTheme.colors.onSurface }]}>
              {stats.currentStreak}
            </Text>
            {stats.currentStreak > 0 && (
              <Text style={[styles.fireEmoji, { color: paperTheme.colors.secondary }]}>
                🔥
              </Text>
            )}
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    marginBottom: 4,
    textAlign: 'center',
    fontSize: 11,
    opacity: 0.8,
  },
  value: {
    fontWeight: '700',
    textAlign: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireEmoji: {
    marginLeft: 4,
    fontSize: 14,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 8,
  },
});