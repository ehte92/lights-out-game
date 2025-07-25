import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { PremiumButton } from './PremiumButton';
import { useGameTheme } from '../../contexts/ThemeContext';
import { GameState } from '../../types/game';

interface SmartPlayButtonProps {
  gameState: GameState | null;
  onContinue: () => void;
  onNewGame: () => void;
  style?: ViewStyle;
}

export const SmartPlayButton: React.FC<SmartPlayButtonProps> = ({
  gameState,
  onContinue,
  onNewGame,
  style,
}) => {
  const { paperTheme } = useGameTheme();
  
  // Determine if there's an active game to continue
  const hasActiveGame = gameState && !gameState.isComplete;
  
  // Animation for continue button (subtle pulse)
  const pulseScale = useSharedValue(1);
  
  React.useEffect(() => {
    if (hasActiveGame) {
      // Gentle pulse animation for continue button
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [hasActiveGame, pulseScale]);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));


  if (hasActiveGame) {
    // Continue Game Layout
    return (
      <View style={[styles.container, style]}>
        <Animated.View style={[styles.buttonContainer, pulseAnimatedStyle]}>
          <PremiumButton
            title="CONTINUE"
            onPress={onContinue}
            size="large"
            variant="continue"
            style={styles.continueButton}
            textStyle={styles.continueButtonText}
          />
        </Animated.View>
        
        {/* Secondary New Game Button */}
        <View style={styles.secondaryContainer}>
          <PremiumButton
            title="New Game"
            onPress={onNewGame}
            size="medium"
            variant="secondary"
            style={styles.newGameButton}
            textStyle={styles.newGameButtonText}
          />
        </View>
      </View>
    );
  }

  // New Game Layout (single button)
  return (
    <View style={[styles.container, style]}>
      <PremiumButton
        title="PLAY"
        onPress={onNewGame}
        size="large"
        variant="primary"
        style={styles.playButton}
        textStyle={styles.playButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  continueButton: {
    width: '100%',
    height: 72,
    borderRadius: 36,
    // Continue button gets warmer gradient colors
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },
  continueButtonText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secondaryContainer: {
    width: '70%',
  },
  newGameButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  newGameButtonText: {
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.9,
  },
  playButton: {
    width: '100%',
    height: 72,
    borderRadius: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
  },
  playButtonText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
});