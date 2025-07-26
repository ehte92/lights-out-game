import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  Portal,
  Modal,
} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGameStore } from '../stores/gameStore';
import { GameGrid } from '../components/game/GameGrid';
import { GameStats } from '../components/game/GameStats';
import { DevPanel } from '../components/development/DevPanel';
import { useAppTheme, useAppTypography, useAppBorders, useAppShadows } from '../contexts/AppThemeContext';
import { PremiumButton } from '../components/ui/PremiumButton';
import { GameThemeProvider } from '../contexts/GameThemeContext';
import { AchievementNotification } from '../components/ui/AchievementNotification';

export const GameScreen: React.FC = () => {
  const { colors, paperTheme } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  const shadows = useAppShadows();
  const router = useRouter();
  const {
    currentGame,
    isPlaying,
    isPaused,
    showVictory,
    achievementNotification,
    makeMove,
    startNewGame,
    pauseGame,
    resumeGame,
    resetGame,
    setShowVictory,
    hideAchievementNotification,
    loadStats,
    loadSettings,
    loadAchievements,
    loadProgression,
  } = useGameStore();

  // Navigation-based auto-pause - only handle actual navigation events
  useFocusEffect(
    useCallback(() => {
      // Don't interfere with manual pause actions or modal interactions
      
      return () => {
        // Only pause if no modals are open and game is actively playing
        // Removed currentGame from dependencies to prevent re-runs on game state changes
        const { currentGame: latestGame } = useGameStore.getState();
        
        if (latestGame && 
            !latestGame.isComplete && 
            isPlaying && 
            !isPaused && 
            !showVictory && 
            !showResetConfirm &&
            !isCreatingGame) {
          pauseGame();
        }
      };
    }, [isPlaying, isPaused, showVictory, showResetConfirm, isCreatingGame, pauseGame])
  );

  const victoryScale = useSharedValue(0);
  const victoryOpacity = useSharedValue(0);

  // Initialize data on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadStats();
        await loadSettings();
        await loadAchievements();
        await loadProgression();
        
        // Start a new game if none exists
        if (!currentGame) {
          await startNewGame();
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to initialize app:', error);
        }
      }
    };
    
    initializeApp();
  }, []);

  // Victory animation
  useEffect(() => {
    if (showVictory) {
      victoryScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.2, { duration: 300 }),
          withSpring(1, { duration: 200 })
        )
      );
      victoryOpacity.value = withSpring(1, { duration: 300 });
    } else {
      victoryScale.value = 0;
      victoryOpacity.value = 0;
    }
  }, [showVictory, victoryScale, victoryOpacity]);

  const victoryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: victoryScale.value }],
    opacity: victoryOpacity.value,
  }));

  const handleNewGame = useCallback(async () => {
    setIsCreatingGame(true);
    setShowVictory(false);
    await startNewGame();
    // Brief delay to prevent navigation interference
    setTimeout(() => setIsCreatingGame(false), 100);
  }, [setShowVictory, startNewGame]);

  const handlePause = useCallback(() => {
    if (__DEV__) {
      console.log('🎮 Pause button pressed:', { 
        currentlyPaused: isPaused,
        action: isPaused ? 'resume' : 'pause',
        hasCurrentGame: !!currentGame,
        isPlaying
      });
    }
    
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }, [isPaused, resumeGame, pauseGame, currentGame, isPlaying]);

  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [isCreatingGame, setIsCreatingGame] = React.useState(false);

  const handleReset = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const confirmReset = useCallback(() => {
    setShowResetConfirm(false);
    resetGame();
  }, [resetGame]);

  if (!currentGame) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={[typography.headlineMedium, { color: colors.onBackground }]}>
              Loading...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.atmosphericBackground]}>
      <StatusBar 
        barStyle="light-content" 
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Minimal Header with Icon Back Button */}
        <View style={styles.headerMinimal}>
          <PremiumButton
            title=""
            onPress={() => router.back()}
            style={styles.backButtonMinimal}
            size="small"
            variant="secondary"
          >
            <MaterialIcons name="arrow-back" size={20} color="#000000" />
          </PremiumButton>
        </View>

        {/* Game Area - Wrapped with GameThemeProvider */}
        <GameThemeProvider>
          {/* Game Stats */}
          <GameStats gameState={currentGame} isPlaying={isPlaying && !isPaused} />

          {/* Game Grid */}
          <View style={styles.gameContainer}>
            <GameGrid
              gameState={currentGame}
              onCellPress={makeMove}
              disabled={isPaused}
            />
            
            {/* Neobrutalist Pause Overlay */}
            {isPaused && (
              <View style={[
                styles.pauseOverlay,
                {
                  backgroundColor: colors.background,
                  borderWidth: borders.extra,
                  borderColor: borders.color,
                }
              ]}>
                <Text style={[typography.headlineLarge, { color: colors.onBackground }]}>
                  Game Paused
                </Text>
              </View>
            )}
          </View>

          {/* Compact Control Buttons */}
          <View style={[
            styles.controls,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent for floating effect
              borderWidth: borders.medium, // Reduced border
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
            <PremiumButton
              title=""
              onPress={handlePause}
              style={styles.controlButtonCompact}
              size="medium"
              variant={isPaused ? 'continue' : 'secondary'}
              accessibilityLabel={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              <MaterialIcons 
                name={isPaused ? 'play-arrow' : 'pause'} 
                size={20} 
                color={isPaused ? '#FFFFFF' : '#000000'} 
              />
            </PremiumButton>
            <PremiumButton
              title=""
              onPress={handleReset}
              style={styles.controlButtonCompact}
              size="medium"
              variant="secondary"
              accessibilityLabel="Restart This Puzzle"
            >
              <MaterialIcons 
                name="refresh" 
                size={20} 
                color="#000000" 
              />
            </PremiumButton>
            <PremiumButton
              title=""
              onPress={handleNewGame}
              style={styles.controlButtonCompact}
              size="medium"
              variant="primary"
              accessibilityLabel="Start New Game"
            >
              <MaterialIcons 
                name="add" 
                size={20} 
                color="#FFFFFF" 
              />
            </PremiumButton>
          </View>
        </GameThemeProvider>

        {/* Victory Modal */}
        <Portal>
          <Modal
            visible={showVictory}
            onDismiss={() => setShowVictory(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Animated.View style={victoryAnimatedStyle}>
              <View style={[
                styles.victoryCard,
                {
                  backgroundColor: colors.secondary, // Hot pink background for victory
                  borderWidth: borders.extra,
                  borderColor: borders.color,
                  ...Platform.select({
                    ios: shadows.large,
                    android: { elevation: shadows.large.elevation },
                  }),
                }
              ]}>
                <View style={styles.victoryContent}>
                  <Text style={[typography.headlineLarge, styles.victoryTitle]}>
                    🎉 Victory! 🎉
                  </Text>
                  <View style={styles.victoryDivider} />
                  <Text style={[typography.bodyLarge, styles.victorySubtitle]}>
                    Puzzle completed in {currentGame.moves} moves!
                  </Text>
                  
                  <Text style={[typography.bodyMedium, styles.victoryTime]}>
                    Time: {Math.floor(currentGame.elapsedTime)}s
                  </Text>

                  <View style={styles.victoryButtons}>
                    <PremiumButton
                      title="New Game"
                      onPress={handleNewGame}
                      style={styles.victoryButton}
                      size="medium"
                    />
                    <PremiumButton
                      title="Continue"
                      onPress={() => setShowVictory(false)}
                      style={styles.victoryButton}
                      size="medium"
                      variant="secondary"
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          </Modal>
        </Portal>

        {/* Reset Confirmation Modal */}
        <Portal>
          <Modal
            visible={showResetConfirm}
            onDismiss={() => setShowResetConfirm(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={[
              styles.confirmCard,
              {
                backgroundColor: colors.background,
                borderWidth: borders.extra,
                borderColor: borders.color,
                ...Platform.select({
                  ios: shadows.large,
                  android: { elevation: shadows.large.elevation },
                }),
              }
            ]}>
              <View style={styles.confirmContent}>
                <Text style={[typography.headlineSmall, styles.confirmTitle]}>
                  Restart Puzzle
                </Text>
                <Text style={[typography.bodyMedium, styles.confirmMessage]}>
                  This will restart the same puzzle from the beginning. Your moves and time will be reset.
                </Text>
                <View style={styles.confirmButtons}>
                  <PremiumButton
                    title="Cancel"
                    onPress={() => setShowResetConfirm(false)}
                    style={styles.confirmButton}
                    size="medium"
                    variant="secondary"
                  />
                  <PremiumButton
                    title="Restart"
                    onPress={confirmReset}
                    style={styles.confirmButton}
                    size="medium"
                    variant="continue"
                  />
                </View>
              </View>
            </View>
          </Modal>
        </Portal>

        {/* Development Panel */}
        <DevPanel />

        {/* Achievement Notification */}
        {achievementNotification && (
          <AchievementNotification
            achievement={achievementNotification}
            visible={!!achievementNotification}
            onAnimationComplete={hideAchievementNotification}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  atmosphericBackground: {
    backgroundColor: '#1a1a2e', // Rich dark blue base
    // Add gradient effect through nested views if needed
  },
  safeArea: {
    flex: 1,
  },
  // Minimal header styles
  headerMinimal: {
    paddingVertical: 12, // Consistent with other elements
    paddingHorizontal: 20, // Match other horizontal padding
    marginBottom: 8, // Better visual separation
  },
  // Removed headerContent - no longer needed
  backButtonMinimal: {
    alignSelf: 'flex-start',
    minWidth: 44, // Better touch target
    minHeight: 44,
  },
  // Removed headerText - no longer needed
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // No padding needed for floating design - let cells breathe naturally
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0, // Sharp corners for neobrutalism
    margin: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Better distribution
    paddingHorizontal: 12, // Further reduced padding to accommodate wider buttons
    paddingVertical: 18, // Adjusted for new button height
    gap: 6, // Reduced gap for wider buttons
    marginHorizontal: 16,
    marginBottom: 20, // More bottom space
    borderRadius: 0, // Sharp corners for neobrutalism
  },
  controlButtonCompact: {
    flex: 1,
    height: 56, // Increased height to prevent text truncation
    minHeight: 56,
    minWidth: 95, // Slightly reduced from 100 to prevent overflow
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Modal styles
  modalContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  
  // Victory modal styles
  victoryCard: {
    borderRadius: 0, // Sharp corners for neobrutalism
    overflow: 'hidden',
  },
  victoryContent: {
    padding: 24,
    alignItems: 'center',
  },
  victoryTitle: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#FFFFFF', // White text on hot pink background
    fontWeight: '900',
  },
  victoryDivider: {
    backgroundColor: '#FFFFFF', // White divider on hot pink background
    height: 4, // Thick divider
    width: '100%',
    marginBottom: 16,
  },
  victorySubtitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#FFFFFF', // White text on hot pink background
    fontWeight: '700',
  },
  victoryTime: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#FFFFFF', // White text on hot pink background
    fontWeight: '600',
  },
  victoryButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  victoryButton: {
    flex: 1,
    minWidth: 100, // Prevent excessive shrinking that causes text wrap
  },
  
  // Confirmation modal styles
  confirmCard: {
    borderRadius: 0, // Sharp corners for neobrutalism
    overflow: 'hidden',
  },
  confirmContent: {
    padding: 24,
    alignItems: 'center',
  },
  confirmTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#000000', // Black text for neobrutalism
    fontWeight: '900',
  },
  confirmMessage: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#000000', // Black text for neobrutalism
    fontWeight: '600',
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    minWidth: 100, // Prevent excessive shrinking that causes text wrap
  },
});