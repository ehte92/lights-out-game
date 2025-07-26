import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Svg, Rect } from 'react-native-svg';
import { PlayerProgression } from '../../types/game';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';
import { getXPRequiredForLevel } from '../../utils/playerProgression';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface PlayerLevelCardProps {
  progression: PlayerProgression;
}

export const PlayerLevelCard: React.FC<PlayerLevelCardProps> = ({ progression }) => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  
  const progressValue = useSharedValue(0);
  
  React.useEffect(() => {
    const xpForCurrentLevel = getXPRequiredForLevel(progression.currentLevel + 1);
    const progressPercent = xpForCurrentLevel > 0 ? (progression.currentXP / xpForCurrentLevel) * 100 : 0;
    
    progressValue.value = withSpring(progressPercent, {
      damping: 20,
      stiffness: 100,
    });
  }, [progression.currentXP, progression.currentLevel, progressValue]);

  const animatedProps = useAnimatedProps(() => {
    // Make progress bar responsive - use percentage of available width
    const maxWidth = 240; // Responsive width that fits in container
    const width = (progressValue.value / 100) * maxWidth;
    return {
      width: Math.max(0, Math.min(width, maxWidth)),
    };
  });

  const cardScale = useSharedValue(1);
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  React.useEffect(() => {
    cardScale.value = withSpring(1.02, { duration: 200 }, () => {
      cardScale.value = withSpring(1, { duration: 200 });
    });
  }, [progression.currentLevel, cardScale]);

  const isMaxLevel = progression.currentLevel >= 50; // Max level from playerProgression.ts

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.secondary, // Hot pink background
          borderWidth: borders.thick,
          borderColor: borders.color,
          // Neobrutalist shadow
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 6, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 0,
            },
            android: { elevation: 12 },
          }),
        },
        animatedCardStyle,
      ]}
    >
      {/* Top Row: Level Badge and Total XP Badge */}
      <View style={styles.topRow}>
        <View style={[
          styles.levelBadge,
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
              fontSize: 16,
            }
          ]}>
            LVL
          </Text>
          <Text style={[
            typography.headlineLarge,
            {
              color: colors.onBackground,
              fontWeight: '900',
              fontSize: 28,
              lineHeight: 32,
            }
          ]}>
            {progression.currentLevel}
          </Text>
        </View>

        <View style={[
          styles.totalXPBadge,
          {
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderWidth: borders.thin,
            borderColor: colors.background,
          }
        ]}>
          <Text style={[
            typography.bodySmall,
            {
              color: colors.onBackground,
              fontWeight: '900',
              fontSize: 10,
            }
          ]}>
            TOTAL XP
          </Text>
          <Text style={[
            typography.titleMedium,
            {
              color: colors.onBackground,
              fontWeight: '900',
            }
          ]}>
            {progression.totalXP.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Bottom Section: Level Info and Progress */}
      <View style={styles.progressSection}>
        <Text style={[
          typography.headlineMedium,
          {
            color: colors.background, // White text on hot pink
            fontWeight: '900',
            marginBottom: 8,
            textAlign: 'center',
          }
        ]}>
          {isMaxLevel ? 'MAX LEVEL!' : `Level ${progression.currentLevel}`}
        </Text>
        
        {!isMaxLevel && (
          <>
            <Text style={[
              typography.bodyLarge,
              {
                color: colors.background,
                fontWeight: '700',
                marginBottom: 12,
                textAlign: 'center',
              }
            ]}>
              {progression.currentXP} / {getXPRequiredForLevel(progression.currentLevel + 1)} XP
            </Text>

            {/* XP Progress Bar */}
            <View style={[
              styles.progressBarContainer,
              {
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderWidth: borders.thin,
                borderColor: colors.background,
              }
            ]}>
              <Svg height="12" width="240" style={styles.progressBarSvg}>
                <Rect
                  x="0"
                  y="0"
                  width="240"
                  height="12"
                  fill="rgba(255,255,255,0.2)"
                />
                <AnimatedRect
                  x="0"
                  y="0"
                  height="12"
                  fill={colors.background}
                  animatedProps={animatedProps}
                />
              </Svg>
            </View>
            
            <Text style={[
              typography.bodyMedium,
              {
                color: colors.background,
                fontWeight: '600',
                marginTop: 8,
                textAlign: 'center',
              }
            ]}>
              {progression.xpToNextLevel} XP to next level
            </Text>
          </>
        )}

        {isMaxLevel && (
          <Text style={[
            typography.bodyLarge,
            {
              color: colors.background,
              fontWeight: '700',
              textAlign: 'center',
            }
          ]}>
            🎉 You've reached the maximum level! 🎉
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'column', // Changed to column layout
    minHeight: 120,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  totalXPBadge: {
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  progressSection: {
    alignItems: 'center',
    width: '100%',
  },
  progressBarContainer: {
    borderRadius: 0, // Sharp corners
    overflow: 'hidden',
    width: 240, // Responsive width that fits properly
    height: 12,
    alignSelf: 'center',
  },
  progressBarSvg: {
    width: '100%',
    height: '100%',
  },
});