import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  Button,
  Surface,
  Portal,
  Modal,
  Card,
  Divider,
  IconButton,
} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useGameStore } from '../stores/gameStore';
import { GameGrid } from '../components/game/GameGrid';
import { GameStats } from '../components/game/GameStats';
import { DevPanel } from '../components/development/DevPanel';
import { useGameTheme } from '../contexts/ThemeContext';

export const GameScreen: React.FC = () => {
  const { colors, paperTheme } = useGameTheme();
  const router = useRouter();
  const {
    currentGame,
    isPlaying,
    isPaused,
    showVictory,
    makeMove,
    startNewGame,
    pauseGame,
    resumeGame,
    resetGame,
    setShowVictory,
    loadStats,
    loadSettings,
    loadAchievements,
  } = useGameStore();

  const victoryScale = useSharedValue(0);
  const victoryOpacity = useSharedValue(0);

  // Initialize data on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadStats();
        await loadSettings();
        await loadAchievements();
        
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

  const handleButtonPress = useCallback((action: () => void) => {
    action();
  }, []);

  const handleNewGame = useCallback(() => {
    handleButtonPress(async () => {
      setShowVictory(false);
      await startNewGame();
    });
  }, [handleButtonPress, setShowVictory, startNewGame]);

  const handlePause = useCallback(() => {
    handleButtonPress(() => {
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
    });
  }, [handleButtonPress, isPaused, resumeGame, pauseGame]);

  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const handleReset = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const confirmReset = useCallback(() => {
    setShowResetConfirm(false);
    handleButtonPress(resetGame);
  }, [handleButtonPress, resetGame]);

  if (!currentGame) {
    return (
      <Surface style={[styles.container, { backgroundColor: colors.gameBackground }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text variant="headlineMedium" style={{ color: paperTheme.colors.onSurface }}>
              Loading...
            </Text>
          </View>
        </SafeAreaView>
      </Surface>
    );
  }

  return (
    <LinearGradient
      colors={[colors.gameBackground, colors.panelBackground]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Surface style={[styles.header, { backgroundColor: colors.panelBackground }]} elevation={1}>
          <View style={styles.headerContent}>
            <IconButton 
              icon="arrow-left" 
              size={24}
              iconColor={paperTheme.colors.onSurface}
              onPress={() => router.back()}
              style={styles.backButton}
            />
            <View style={styles.headerText}>
              <Text variant="displayMedium" style={{ color: paperTheme.colors.onSurface }}>
                Lights Out
              </Text>
              <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Turn off all the lights
              </Text>
            </View>
          </View>
        </Surface>

        {/* Game Stats */}
        <GameStats gameState={currentGame} isPlaying={isPlaying && !isPaused} />

        {/* Game Grid */}
        <View style={styles.gameContainer}>
          <GameGrid
            gameState={currentGame}
            onCellPress={makeMove}
            disabled={isPaused}
          />
          
          {/* Pause Overlay */}
          {isPaused && (
            <Surface style={styles.pauseOverlay} elevation={5}>
              <Text variant="headlineLarge" style={{ color: paperTheme.colors.onSurface }}>
                Game Paused
              </Text>
            </Surface>
          )}
        </View>

        {/* Control Buttons */}
        <Surface style={[styles.controls, { backgroundColor: colors.panelBackground }]} elevation={2}>
          <Button
            mode="contained"
            onPress={handlePause}
            style={styles.controlButton}
            buttonColor={isPaused ? paperTheme.colors.tertiary : paperTheme.colors.error}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleReset}
            style={styles.controlButton}
          >
            Reset
          </Button>
          <Button
            mode="contained"
            onPress={handleNewGame}
            style={styles.controlButton}
            buttonColor={paperTheme.colors.primary}
          >
            New Game
          </Button>
        </Surface>

        {/* Victory Modal */}
        <Portal>
          <Modal
            visible={showVictory}
            onDismiss={() => setShowVictory(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Animated.View style={victoryAnimatedStyle}>
              <Card style={[styles.victoryCard, { backgroundColor: colors.accent }]}>
                <Card.Content style={styles.victoryContent}>
                  <Text variant="headlineLarge" style={styles.victoryTitle}>
                    🎉 Victory! 🎉
                  </Text>
                  <Divider style={styles.victoryDivider} />
                  <Text variant="bodyLarge" style={styles.victorySubtitle}>
                    Puzzle completed in {currentGame.moves} moves!
                  </Text>
                  
                  {currentGame.endTime && (
                    <Text variant="bodyMedium" style={styles.victoryTime}>
                      Time: {Math.floor((currentGame.endTime - currentGame.startTime) / 1000)}s
                    </Text>
                  )}

                  <View style={styles.victoryButtons}>
                    <Button
                      mode="contained"
                      onPress={handleNewGame}
                      style={styles.victoryButton}
                      buttonColor={paperTheme.colors.primary}
                    >
                      New Game
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => setShowVictory(false)}
                      style={styles.victoryButton}
                    >
                      Continue
                    </Button>
                  </View>
                </Card.Content>
              </Card>
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
            <Card>
              <Card.Content>
                <Text variant="headlineSmall" style={styles.confirmTitle}>
                  Reset Game
                </Text>
                <Text variant="bodyMedium" style={styles.confirmMessage}>
                  Are you sure you want to restart this puzzle?
                </Text>
                <View style={styles.confirmButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowResetConfirm(false)}
                    style={styles.confirmButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={confirmReset}
                    style={styles.confirmButton}
                    buttonColor={paperTheme.colors.error}
                  >
                    Reset
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>

        {/* Development Panel */}
        <DevPanel />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    margin: 0,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    margin: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  controlButton: {
    flex: 1,
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
    borderRadius: 20,
    overflow: 'hidden',
  },
  victoryContent: {
    padding: 24,
    alignItems: 'center',
  },
  victoryTitle: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  victoryDivider: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  victorySubtitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#ffffff',
  },
  victoryTime: {
    textAlign: 'center',
    marginBottom: 24,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  victoryButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  victoryButton: {
    flex: 1,
  },
  
  // Confirmation modal styles
  confirmTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
  },
});