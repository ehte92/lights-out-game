import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Achievement } from '../../types/game';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';

interface AchievementCardProps {
  achievement: Achievement;
  categoryColor?: string;
}

// Category-based icons for achievements (using actual achievement IDs from achievements.ts)
const getCategoryIcon = (achievementId: string): keyof typeof MaterialIcons.glyphMap => {
  // Progression achievements
  if (['first_win', 'committed', 'dedicated', 'expert', 'master', 'legend'].includes(achievementId)) {
    return 'star';
  }
  // Streak achievements
  if (['streak_3', 'streak_5', 'streak_10', 'streak_20'].includes(achievementId)) {
    return 'local-fire-department';
  }
  // Speed achievements
  if (['speed_easy', 'speed_medium', 'speed_hard', 'speed_any_10s'].includes(achievementId)) {
    return 'flash-on';
  }
  // Skill achievements
  if (['perfectionist_easy', 'perfectionist_medium', 'perfectionist_hard', 'no_mistakes'].includes(achievementId)) {
    return 'precision-manufacturing';
  }
  // Grid size achievements
  if (['small_grid_master', 'large_grid_master'].includes(achievementId)) {
    return 'grid-view';
  }
  // Special achievements
  if (['night_owl', 'early_bird', 'comeback_kid', 'marathon_session', 'daily_grind'].includes(achievementId)) {
    return 'star-border';
  }
  // Default
  return 'emoji-events';
};

// Get category color based on achievement type (using actual achievement IDs from achievements.ts)
const getCategoryColor = (achievementId: string): string => {
  if (['first_win', 'committed', 'dedicated', 'expert', 'master', 'legend'].includes(achievementId)) {
    return '#3b82f6'; // Blue for progression
  }
  if (['streak_3', 'streak_5', 'streak_10', 'streak_20'].includes(achievementId)) {
    return '#ef4444'; // Red for streaks
  }
  if (['speed_easy', 'speed_medium', 'speed_hard', 'speed_any_10s'].includes(achievementId)) {
    return '#eab308'; // Yellow for speed
  }
  if (['perfectionist_easy', 'perfectionist_medium', 'perfectionist_hard', 'no_mistakes'].includes(achievementId)) {
    return '#10b981'; // Green for skill
  }
  if (['small_grid_master', 'large_grid_master'].includes(achievementId)) {
    return '#8b5cf6'; // Purple for grid size
  }
  if (['night_owl', 'early_bird', 'comeback_kid', 'marathon_session', 'daily_grind'].includes(achievementId)) {
    return '#f59e0b'; // Orange for special
  }
  return '#6b7280'; // Gray default
};

export const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement,
  categoryColor 
}) => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  
  const isUnlocked = achievement.unlocked;
  const cardColor = categoryColor || getCategoryColor(achievement.id);
  const iconName = getCategoryIcon(achievement.id);
  
  // Format unlock date
  const formatUnlockDate = (timestamp?: number): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isUnlocked ? colors.background : 'rgba(255,255,255,0.5)',
        borderWidth: borders.medium,
        borderColor: isUnlocked ? cardColor : '#cccccc',
        opacity: isUnlocked ? 1 : 0.6,
        // Neobrutalist shadow
        ...Platform.select({
          ios: {
            shadowColor: isUnlocked ? cardColor : '#cccccc',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: isUnlocked ? 1 : 0.3,
            shadowRadius: 0,
          },
          android: { 
            elevation: isUnlocked ? 6 : 2,
          },
        }),
      }
    ]}>
      {/* Achievement Icon */}
      <View style={[
        styles.iconContainer,
        {
          backgroundColor: isUnlocked ? cardColor : '#cccccc',
        }
      ]}>
        <MaterialIcons 
          name={iconName}
          size={24} 
          color={colors.background} 
        />
      </View>
      
      {/* Achievement Content */}
      <View style={styles.content}>
        <Text style={[
          typography.bodyLarge,
          {
            color: isUnlocked ? colors.onBackground : colors.onSurfaceVariant,
            fontWeight: '900',
            marginBottom: 4,
          }
        ]} numberOfLines={2}>
          {achievement.title}
        </Text>
        
        <Text style={[
          typography.bodySmall,
          {
            color: isUnlocked ? colors.onBackground : colors.onSurfaceVariant,
            fontWeight: '600',
            marginBottom: 8,
            lineHeight: 16,
          }
        ]} numberOfLines={3}>
          {achievement.description}
        </Text>
        
        {/* Unlock Date */}
        {isUnlocked && achievement.unlockedAt && (
          <Text style={[
            typography.labelSmall,
            {
              color: cardColor,
              fontWeight: '700',
              fontSize: 10,
            }
          ]}>
            🏆 {formatUnlockDate(achievement.unlockedAt)}
          </Text>
        )}
        
        {/* Locked Status */}
        {!isUnlocked && (
          <Text style={[
            typography.labelSmall,
            {
              color: colors.onSurfaceVariant,
              fontWeight: '700',
              fontSize: 10,
            }
          ]}>
            🔒 LOCKED
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 16,
    minHeight: 120,
    flex: 1,
    margin: 6,
    maxWidth: '48%', // Two columns in grid
  },
  iconContainer: {
    borderRadius: 0, // Sharp corners
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  content: {
    flex: 1,
  },
});