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
    const width = (progressValue.value / 100) * 280; // 280 = progress bar width
    return {
      width: Math.max(0, Math.min(width, 280)),
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
      {/* Level Badge */}
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

      {/* Level Info */}
      <View style={styles.levelInfo}>
        <Text style={[
          typography.headlineMedium,
          {
            color: colors.background, // White text on hot pink
            fontWeight: '900',
            marginBottom: 4,
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
              <Svg height="12" width="280" style={styles.progressBarSvg}>
                <Rect
                  x="0"
                  y="0"
                  width="280"
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

      {/* Total XP Badge */}
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 120,
  },
  levelBadge: {
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    minWidth: 80,
  },
  levelInfo: {
    flex: 1,
    alignItems: 'center',
  },
  progressBarContainer: {
    borderRadius: 0, // Sharp corners
    overflow: 'hidden',
    width: 280,
    height: 12,
  },
  progressBarSvg: {
    width: '100%',
    height: '100%',
  },
  totalXPBadge: {
    borderRadius: 0, // Sharp corners
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 16,
    minWidth: 80,
  },
});