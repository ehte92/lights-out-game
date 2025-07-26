import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { Achievement } from '../../types/game';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';
import { AchievementCard } from './AchievementCard';

interface AchievementsListProps {
  achievements: Achievement[];
}

type CategoryFilter = 'all' | 'progression' | 'streak' | 'speed' | 'skill' | 'grid' | 'special';

interface CategoryInfo {
  key: CategoryFilter;
  label: string;
  color: string;
}

const CATEGORIES: CategoryInfo[] = [
  { key: 'all', label: 'All', color: '#6b7280' },
  { key: 'progression', label: 'Progress', color: '#3b82f6' },
  { key: 'streak', label: 'Streaks', color: '#ef4444' },
  { key: 'speed', label: 'Speed', color: '#eab308' },
  { key: 'skill', label: 'Skill', color: '#10b981' },
  { key: 'grid', label: 'Grids', color: '#8b5cf6' },
  { key: 'special', label: 'Special', color: '#f59e0b' },
];

// Helper function to categorize achievements (using actual achievement IDs from achievements.ts)
const getAchievementCategory = (achievementId: string): CategoryFilter => {
  if (['first_win', 'committed', 'dedicated', 'expert', 'master', 'legend'].includes(achievementId)) {
    return 'progression';
  }
  if (['streak_3', 'streak_5', 'streak_10', 'streak_20'].includes(achievementId)) {
    return 'streak';
  }
  if (['speed_easy', 'speed_medium', 'speed_hard', 'speed_any_10s'].includes(achievementId)) {
    return 'speed';
  }
  if (['perfectionist_easy', 'perfectionist_medium', 'perfectionist_hard', 'no_mistakes'].includes(achievementId)) {
    return 'skill';
  }
  if (['small_grid_master', 'large_grid_master'].includes(achievementId)) {
    return 'grid';
  }
  if (['night_owl', 'early_bird', 'comeback_kid', 'marathon_session', 'daily_grind'].includes(achievementId)) {
    return 'special';
  }
  return 'all';
};

export const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  
  // Filter achievements based on selected category
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') {
      return achievements;
    }
    return achievements.filter(achievement => 
      getAchievementCategory(achievement.id) === selectedCategory
    );
  }, [achievements, selectedCategory]);
  
  // Calculate stats for current filter
  const stats = useMemo(() => {
    const total = filteredAchievements.length;
    const unlocked = filteredAchievements.filter(a => a.unlocked).length;
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    return { total, unlocked, percentage };
  }, [filteredAchievements]);
  
  const renderCategoryFilter = ({ item }: { item: CategoryInfo }) => {
    const isSelected = item.key === selectedCategory;
    const categoryAchievements = item.key === 'all' 
      ? achievements 
      : achievements.filter(a => getAchievementCategory(a.id) === item.key);
    const unlockedCount = categoryAchievements.filter(a => a.unlocked).length;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          {
            backgroundColor: isSelected ? item.color : colors.background,
            borderWidth: borders.medium,
            borderColor: item.color,
            // Enhanced shadow for selected state
            ...Platform.select({
              ios: {
                shadowColor: item.color,
                shadowOffset: { width: isSelected ? 3 : 1, height: isSelected ? 3 : 1 },
                shadowOpacity: isSelected ? 0.6 : 0.2,
                shadowRadius: 0,
              },
              android: { 
                elevation: isSelected ? 4 : 1,
              },
            }),
          }
        ]}
        onPress={() => setSelectedCategory(item.key)}
      >
        <Text style={[
          typography.labelMedium,
          {
            color: isSelected ? colors.background : item.color,
            fontWeight: '800',
            textAlign: 'center',
            fontSize: 13,
          }
        ]}>
          {item.label}
        </Text>
        <Text style={[
          typography.labelSmall,
          {
            color: isSelected ? colors.background : item.color,
            fontWeight: '600',
            textAlign: 'center',
            fontSize: 10,
            marginTop: 2,
            opacity: 0.8,
          }
        ]}>
          {unlockedCount}/{categoryAchievements.length}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderAchievement = ({ item }: { item: Achievement }) => {
    const category = CATEGORIES.find(cat => cat.key === getAchievementCategory(item.id));
    return (
      <AchievementCard 
        achievement={item} 
        categoryColor={category?.color}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Progress Stats */}
      <View style={[
        styles.statsContainer,
        {
          backgroundColor: colors.background,
          borderWidth: borders.medium,
          borderColor: borders.color,
        }
      ]}>
        <Text style={[
          typography.headlineSmall,
          {
            color: colors.onBackground,
            fontWeight: '900',
            textAlign: 'center',
          }
        ]}>
          {stats.unlocked} of {stats.total} Unlocked ({stats.percentage}%)
        </Text>
      </View>
      
      {/* Category Filters */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryFilter}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesList}
      />
      
      {/* Achievements Grid */}
      {filteredAchievements.length > 0 ? (
        <FlatList
          data={filteredAchievements}
          renderItem={renderAchievement}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.achievementsContainer}
          columnWrapperStyle={styles.achievementRow}
          style={styles.achievementsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[
            typography.bodyLarge,
            {
              color: colors.background,
              fontWeight: '600',
              textAlign: 'center',
              opacity: 0.7,
            }
          ]}>
            No achievements in this category yet
          </Text>
          <Text style={[
            typography.bodyMedium,
            {
              color: colors.background,
              fontWeight: '500',
              textAlign: 'center',
              opacity: 0.5,
              marginTop: 8,
            }
          ]}>
            Keep playing to unlock more!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  categoriesList: {
    marginBottom: 16,
    height: 70, // Fixed height to prevent expansion
    flexGrow: 0, // Prevent expansion
    flexShrink: 0, // Prevent shrinking
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10, // Reduced vertical padding
    gap: 8, // Reduced gap for cleaner spacing
  },
  categoryButton: {
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 12, // Reduced horizontal padding
    paddingVertical: 10, // Reduced vertical padding
    marginRight: 8, // Less space between buttons
    minWidth: 60, // Reduced minimum width
    minHeight: 44, // Standard touch target height
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow handled in component with dynamic colors
  },
  achievementsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  achievementRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  achievementsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
});