import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  IconButton,
} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../contexts/AppThemeContext';
import { useGameStore } from '../stores/gameStore';
import { PremiumLogo } from '../components/ui/PremiumLogo';
import { SmartPlayButton } from '../components/ui/SmartPlayButton';
import { GradientText } from '../components/ui/GradientText';
import { AppAtmosphericBackground } from '../components/ui/AppAtmosphericBackground';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const MainMenuScreen: React.FC = () => {
  const { colors, paperTheme } = useAppTheme();
  const { currentGame, startNewGame } = useGameStore();
  const router = useRouter();

  // Premium animation values with physics-based springs
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(40);
  const buttonScale = useSharedValue(0.9);
  const buttonOpacity = useSharedValue(0);
  const settingsOpacity = useSharedValue(0);

  useEffect(() => {
    // Sophisticated entrance sequence
    const springConfig = { damping: 20, stiffness: 300 };
    
    // Logo entrance with scale and fade
    logoScale.value = withDelay(200, withSpring(1, springConfig));
    logoOpacity.value = withDelay(200, withSpring(1, { damping: 15 }));
    
    // Title dramatic entrance
    titleOpacity.value = withDelay(600, withSpring(1, { damping: 18 }));
    titleTranslateY.value = withDelay(600, withSpring(0, springConfig));
    
    // Button hero entrance
    buttonScale.value = withDelay(1000, withSpring(1, springConfig));
    buttonOpacity.value = withDelay(1000, withSpring(1, { damping: 15 }));
    
    // Settings subtle appearance
    settingsOpacity.value = withDelay(1200, withSpring(1, { damping: 12 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const settingsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: settingsOpacity.value,
  }));

  const handleContinue = () => {
    router.push('/game');
  };

  const handleNewGame = async () => {
    await startNewGame();
    router.push('/game');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <AppAtmosphericBackground>
      <StatusBar 
        barStyle={paperTheme.dark ? 'light-content' : 'dark-content'} 
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Minimalist Settings Button */}
        <Animated.View style={[styles.settingsContainer, settingsAnimatedStyle]}>
          <IconButton 
            icon="cog" 
            size={24}
            iconColor={paperTheme.colors.onSurface}
            onPress={handleSettings}
            style={styles.settingsButton}
          />
        </Animated.View>

        {/* Hero Brand Section */}
        <View style={styles.heroContainer}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <PremiumLogo size={140} animated={true} />
          </Animated.View>
          
          <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
            <GradientText style={styles.appTitle}>
              Lights Out
            </GradientText>
            <GradientText 
              style={styles.tagline}
              colors={[
                `${paperTheme.colors.onSurface}80`,
                `${paperTheme.colors.onSurface}60`,
              ]}
            >
              The Classic Puzzle Challenge
            </GradientText>
          </Animated.View>
        </View>

        {/* Smart Play Button */}
        <View style={styles.actionContainer}>
          <Animated.View style={buttonAnimatedStyle}>
            <SmartPlayButton
              gameState={currentGame}
              onContinue={handleContinue}
              onNewGame={handleNewGame}
              style={styles.smartButton}
            />
          </Animated.View>
        </View>

      </SafeAreaView>
    </AppAtmosphericBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  settingsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  logoContainer: {
    marginBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appTitle: {
    fontSize: 56,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -2,
    marginBottom: 12,
    lineHeight: 64,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.5,
    opacity: 0.8,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 48,
  },
  smartButton: {
    width: '100%',
  },
});