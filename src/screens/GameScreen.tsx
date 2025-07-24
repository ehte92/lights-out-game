import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../stores/gameStore';
import { GameGrid } from '../components/game/GameGrid';
import { GameStats } from '../components/game/GameStats';
import { GameHaptics } from '../utils/haptics';
import { DevPanel } from '../components/development/DevPanel';

export const GameScreen: React.FC = () => {
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
  const buttonScale = useSharedValue(1);

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
  }, [showVictory]);

  const victoryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: victoryScale.value }],
    opacity: victoryOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPress = useCallback((action: () => void) => {
    buttonScale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    action();
  }, [buttonScale]);

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

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Game',
      'Are you sure you want to restart this puzzle?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => handleButtonPress(resetGame),
        },
      ]
    );
  }, [handleButtonPress, resetGame]);

  const renderButton = useCallback((title: string, onPress: () => void, style?: React.ComponentProps<typeof Animated.View>['style']) => (
    <Pressable onPress={() => handleButtonPress(onPress)}>
      <Animated.View style={[styles.button, style, buttonAnimatedStyle]}>
        <LinearGradient
          colors={['#4f46e5', '#3730a3']}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  ), [buttonAnimatedStyle, handleButtonPress]);

  if (!currentGame) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lights Out</Text>
          <Text style={styles.subtitle}>Turn off all the lights</Text>
        </View>

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
            <View style={styles.pauseOverlay}>
              <Text style={styles.pauseText}>Game Paused</Text>
            </View>
          )}
        </View>

        {/* Control Buttons */}
        <View style={styles.controls}>
          {renderButton(
            isPaused ? 'Resume' : 'Pause',
            handlePause,
            { backgroundColor: isPaused ? '#059669' : '#dc2626' }
          )}
          {renderButton('Reset', handleReset)}
          {renderButton('New Game', handleNewGame)}
        </View>

        {/* Victory Modal */}
        {showVictory && (
          <View style={styles.victoryOverlay}>
            <Animated.View style={[styles.victoryModal, victoryAnimatedStyle]}>
              <LinearGradient
                colors={['#fbbf24', '#f59e0b', '#d97706']}
                style={styles.victoryGradient}
              >
                <Text style={styles.victoryTitle}>🎉 Victory! 🎉</Text>
                <Text style={styles.victorySubtitle}>
                  Puzzle completed in {currentGame.moves} moves!
                </Text>
                
                {currentGame.endTime && (
                  <Text style={styles.victoryTime}>
                    Time: {Math.floor((currentGame.endTime - currentGame.startTime) / 1000)}s
                  </Text>
                )}

                <View style={styles.victoryButtons}>
                  {renderButton('New Game', handleNewGame, styles.victoryButton)}
                  {renderButton(
                    'Continue',
                    () => setShowVictory(false),
                    styles.victoryButton
                  )}
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        )}

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
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 4,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
  },
  victoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  victoryModal: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 300,
  },
  victoryGradient: {
    padding: 30,
    alignItems: 'center',
  },
  victoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  victorySubtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  victoryTime: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  victoryButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  victoryButton: {
    flex: 1,
  },
});