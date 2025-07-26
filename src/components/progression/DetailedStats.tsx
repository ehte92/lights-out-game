import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { GameStats, Difficulty } from '../../types/game';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';

interface DetailedStatsProps {
  stats: GameStats;
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({ stats }) => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();

  const formatTime = (seconds: number | null | undefined): string => {
    if (seconds === null || seconds === undefined || seconds === Infinity || isNaN(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMoves = (moves: number | null | undefined): string => {
    if (moves === null || moves === undefined || moves === Infinity || isNaN(moves)) return '--';
    return moves.toString();
  };

  // Add safety checks for stats properties
  const totalGames = stats?.totalGames || 0;
  const gamesWon = stats?.gamesWon || 0;
  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;
  const bestTimes = stats?.bestTimes || {};
  const bestMoves = stats?.bestMoves || {};
  
  const winRate = totalGames > 0 ? Math.round((gamesWon / totalGames) * 100) : 0;

  const difficultyData: Array<{
    difficulty: Difficulty;
    label: string;
    color: string;
  }> = [
    { difficulty: 'easy', label: 'Easy', color: '#22c55e' },
    { difficulty: 'medium', label: 'Medium', color: '#f59e0b' },
    { difficulty: 'hard', label: 'Hard', color: '#ef4444' },
  ];

  return (
    <View style={styles.container}>
      {/* Overall Stats */}
      <View style={[
        styles.section,
        {
          backgroundColor: colors.background,
          borderWidth: borders.thick,
          borderColor: borders.color,
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            },
            android: { elevation: 8 },
          }),
        }
      ]}>
        <Text style={[
          typography.headlineSmall,
          {
            color: colors.onBackground,
            fontWeight: '900',
            textAlign: 'center',
            marginBottom: 16,
          }
        ]}>
          OVERALL STATISTICS
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[
              typography.titleLarge,
              {
                color: colors.secondary,
                fontWeight: '900',
                textAlign: 'center',
              }
            ]}>
              {totalGames}
            </Text>
            <Text style={[
              typography.bodyMedium,
              {
                color: colors.onBackground,
                fontWeight: '700',
                textAlign: 'center',
                marginTop: 4,
              }
            ]}>
              Total Games
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[
              typography.titleLarge,
              {
                color: colors.secondary,
                fontWeight: '900',
                textAlign: 'center',
              }
            ]}>
              {gamesWon}
            </Text>
            <Text style={[
              typography.bodyMedium,
              {
                color: colors.onBackground,
                fontWeight: '700',
                textAlign: 'center',
                marginTop: 4,
              }
            ]}>
              Games Won
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[
              typography.titleLarge,
              {
                color: colors.secondary,
                fontWeight: '900',
                textAlign: 'center',
              }
            ]}>
              {winRate}%
            </Text>
            <Text style={[
              typography.bodyMedium,
              {
                color: colors.onBackground,
                fontWeight: '700',
                textAlign: 'center',
                marginTop: 4,
              }
            ]}>
              Win Rate
            </Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.streakContainer}>
              <Text style={[
                typography.titleLarge,
                {
                  color: colors.secondary,
                  fontWeight: '900',
                  textAlign: 'center',
                }
              ]}>
                {currentStreak}
              </Text>
              {currentStreak > 0 && (
                <Text style={styles.fireEmoji}>🔥</Text>
              )}
            </View>
            <Text style={[
              typography.bodyMedium,
              {
                color: colors.onBackground,
                fontWeight: '700',
                textAlign: 'center',
                marginTop: 4,
              }
            ]}>
              Current Streak
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[
              typography.titleLarge,
              {
                color: colors.secondary,
                fontWeight: '900',
                textAlign: 'center',
              }
            ]}>
              {longestStreak}
            </Text>
            <Text style={[
              typography.bodyMedium,
              {
                color: colors.onBackground,
                fontWeight: '700',
                textAlign: 'center',
                marginTop: 4,
              }
            ]}>
              Best Streak
            </Text>
          </View>
        </View>
      </View>

      {/* Difficulty Breakdown */}
      <View style={[
        styles.section,
        {
          backgroundColor: colors.background,
          borderWidth: borders.thick,
          borderColor: borders.color,
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            },
            android: { elevation: 8 },
          }),
        }
      ]}>
        <Text style={[
          typography.headlineSmall,
          {
            color: colors.onBackground,
            fontWeight: '900',
            textAlign: 'center',
            marginBottom: 16,
          }
        ]}>
          BEST PERFORMANCE
        </Text>

        {difficultyData.map((item) => (
          <View key={item.difficulty} style={[
            styles.difficultyRow,
            {
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderWidth: borders.thin,
              borderColor: borders.color,
            }
          ]}>
            <View style={[
              styles.difficultyBadge,
              {
                backgroundColor: item.color,
                borderWidth: borders.thin,
                borderColor: borders.color,
              }
            ]}>
              <Text style={[
                typography.bodyMedium,
                {
                  color: '#ffffff',
                  fontWeight: '900',
                }
              ]}>
                {item.label.toUpperCase()}
              </Text>
            </View>

            <View style={styles.difficultyStats}>
              <View style={styles.difficultyStatItem}>
                <Text style={[
                  typography.bodySmall,
                  {
                    color: colors.onBackground,
                    fontWeight: '600',
                    opacity: 0.7,
                  }
                ]}>
                  Best Time
                </Text>
                <Text style={[
                  typography.titleMedium,
                  {
                    color: colors.onBackground,
                    fontWeight: '900',
                  }
                ]}>
                  {formatTime(bestTimes[item.difficulty])}
                </Text>
              </View>

              <View style={styles.difficultyStatItem}>
                <Text style={[
                  typography.bodySmall,
                  {
                    color: colors.onBackground,
                    fontWeight: '600',
                    opacity: 0.7,
                  }
                ]}>
                  Best Moves
                </Text>
                <Text style={[
                  typography.titleMedium,
                  {
                    color: colors.onBackground,
                    fontWeight: '900',
                  }
                ]}>
                  {formatMoves(bestMoves[item.difficulty])}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  section: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 20,
    marginVertical: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    minWidth: 80,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireEmoji: {
    fontSize: 20,
    marginLeft: 4,
  },
  difficultyRow: {
    borderRadius: 0, // Sharp corners
    padding: 12,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  difficultyStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  difficultyStatItem: {
    alignItems: 'center',
    flex: 1,
  },
});