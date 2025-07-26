import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme, useAppTypography, useAppBorders } from '../contexts/AppThemeContext';
import { useGameStore } from '../stores/gameStore';
import { AchievementsList } from '../components/achievements/AchievementsList';

export const AchievementsScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  const router = useRouter();
  const { achievements, loadAchievements } = useGameStore();

  // Load achievements when screen mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadAchievements();
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to load achievements:', error);
        }
      }
    };

    loadData();
  }, [loadAchievements]);

  if (!achievements) {
    return (
      <View style={[styles.container, styles.atmosphericBackground]}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="transparent"
        />
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={[typography.headlineMedium, { color: colors.background }]}>
              Loading Achievements...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <View style={[styles.container, styles.atmosphericBackground]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Minimal Header */}
        {Platform.OS === 'android' && (
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.backButton,
                {
                  backgroundColor: colors.background,
                  borderWidth: borders.medium,
                  borderColor: borders.color,
                }
              ]}
              accessibilityLabel="Go Back"
            >
              <MaterialIcons name="arrow-back" size={16} color="#000000" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Main Content */}
        <View style={[styles.content, { marginTop: Platform.OS === 'android' ? 0 : 8 }]}>
          <AchievementsList achievements={achievements} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  atmosphericBackground: {
    backgroundColor: '#1a1a2e', // Rich dark blue base matching other screens
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
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    marginBottom: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 0, // Sharp corners for neobrutalism
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)', // Subtle overlay
    marginTop: 8,
    borderTopWidth: 4,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16,
  },
});