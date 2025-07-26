import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme, useAppTypography } from '../contexts/AppThemeContext';
import { useGameStore } from '../stores/gameStore';
import { PlayerLevelCard } from '../components/progression/PlayerLevelCard';
import { DetailedStats } from '../components/progression/DetailedStats';

export const StatsScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const router = useRouter();
  const {
    stats,
    progression,
    achievements,
    loadStats,
    loadProgression,
    loadAchievements,
  } = useGameStore();

  // Load data when screen mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadStats(),
          loadProgression(),
          loadAchievements(),
        ]);
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to load stats screen data:', error);
        }
      }
    };

    loadData();
  }, [loadStats, loadProgression, loadAchievements]);

  if (!progression || !stats || !achievements) {
    return (
      <View style={[styles.container, styles.atmosphericBackground]}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="transparent"
        />
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={[typography.headlineMedium, { color: colors.background }]}>
              Loading Stats...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const unlockedAchievements = (achievements || []).filter(a => a.unlocked);

  return (
    <View style={[styles.container, styles.atmosphericBackground]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[
            typography.headlineLarge,
            {
              color: colors.background, // White text
              fontWeight: '900',
              textAlign: 'center',
            }
          ]}>
            PLAYER STATS
          </Text>
          <Text style={[
            typography.bodyLarge,
            {
              color: colors.background,
              fontWeight: '600',
              textAlign: 'center',
              marginTop: 4,
              opacity: 0.9,
            }
          ]}>
            Your gaming journey and achievements
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Player Level Card */}
          <PlayerLevelCard progression={progression} />

          {/* Achievement Summary */}
          <View style={[
            styles.achievementSummary,
            {
              backgroundColor: colors.background,
              borderWidth: 4,
              borderColor: '#000000',
            }
          ]}>
            <Text style={[
              typography.headlineSmall,
              {
                color: colors.onBackground,
                fontWeight: '900',
                textAlign: 'center',
                marginBottom: 8,
              }
            ]}>
              ACHIEVEMENTS
            </Text>
            <View style={styles.achievementStats}>
              <View style={styles.achievementItem}>
                <Text style={[
                  typography.titleLarge,
                  {
                    color: colors.secondary,
                    fontWeight: '900',
                    textAlign: 'center',
                  }
                ]}>
                  {unlockedAchievements.length}
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
                  Unlocked
                </Text>
              </View>
              <View style={styles.achievementItem}>
                <Text style={[
                  typography.titleLarge,
                  {
                    color: colors.onSurfaceVariant,
                    fontWeight: '900',
                    textAlign: 'center',
                  }
                ]}>
                  {achievements.length - unlockedAchievements.length}
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
                  Remaining
                </Text>
              </View>
            </View>
            
            {unlockedAchievements.length > 0 && (
              <View style={styles.recentAchievements}>
                <Text style={[
                  typography.bodyMedium,
                  {
                    color: colors.onSurfaceVariant,
                    fontWeight: '600',
                    textAlign: 'center',
                    marginBottom: 8,
                  }
                ]}>
                  Recent Achievements:
                </Text>
                {unlockedAchievements.slice(-3).map((achievement) => (
                  <Text key={achievement.id} style={[
                    typography.bodySmall,
                    {
                      color: colors.onBackground,
                      fontWeight: '700',
                      textAlign: 'center',
                      marginVertical: 2,
                    }
                  ]}>
                    🏆 {achievement.title}
                  </Text>
                ))}
              </View>
            )}
            
            {/* View All Achievements Button */}
            <TouchableOpacity
              style={[
                styles.viewAllButton,
                {
                  backgroundColor: colors.secondary, // Hot pink
                  borderWidth: 3,
                  borderColor: '#000000',
                }
              ]}
              onPress={() => router.push('/achievements')}
            >
              <Text style={[
                typography.bodyLarge,
                {
                  color: colors.background,
                  fontWeight: '900',
                  textAlign: 'center',
                }
              ]}>
                🏆 View All Achievements
              </Text>
              <MaterialIcons 
                name="arrow-forward" 
                size={20} 
                color={colors.background}
                style={styles.viewAllIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Detailed Statistics */}
          <DetailedStats stats={stats} />

          {/* Fun Facts */}
          <View style={[
            styles.funFacts,
            {
              backgroundColor: colors.background,
              borderWidth: 4,
              borderColor: '#000000',
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
              FUN FACTS
            </Text>
            
            <View style={styles.factItem}>
              <Text style={[
                typography.bodyLarge,
                {
                  color: colors.onBackground,
                  fontWeight: '700',
                  textAlign: 'center',
                }
              ]}>
                💡 You've made{' '}
                <Text style={{ color: colors.secondary, fontWeight: '900' }}>
                  {(stats.totalGames * 10).toLocaleString()}
                </Text>
                {' '}total moves!
              </Text>
            </View>
            
            {stats.currentStreak >= 3 && (
              <View style={styles.factItem}>
                <Text style={[
                  typography.bodyLarge,
                  {
                    color: colors.onBackground,
                    fontWeight: '700',
                    textAlign: 'center',
                  }
                ]}>
                  🔥 You're on fire with a{' '}
                  <Text style={{ color: colors.secondary, fontWeight: '900' }}>
                    {stats.currentStreak}
                  </Text>
                  {' '}game streak!
                </Text>
              </View>
            )}
            
            {progression.currentLevel >= 10 && (
              <View style={styles.factItem}>
                <Text style={[
                  typography.bodyLarge,
                  {
                    color: colors.onBackground,
                    fontWeight: '700',
                    textAlign: 'center',
                  }
                ]}>
                  ⭐ You've earned{' '}
                  <Text style={{ color: colors.secondary, fontWeight: '900' }}>
                    {progression.totalXP.toLocaleString()}
                  </Text>
                  {' '}total XP!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  atmosphericBackground: {
    backgroundColor: '#1a1a2e', // Rich dark blue base matching game screen
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  achievementSummary: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  achievementStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  achievementItem: {
    alignItems: 'center',
    flex: 1,
  },
  recentAchievements: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  funFacts: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  factItem: {
    marginVertical: 8,
    paddingVertical: 8,
  },
  viewAllButton: {
    borderRadius: 0, // Sharp corners for neobrutalism
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  viewAllIcon: {
    marginLeft: 8,
  },
});