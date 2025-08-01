import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useAppTheme, useAppTypography, useAppBorders, useAppShadows } from '../contexts/AppThemeContext';
import { useGameStore } from '../stores/gameStore';
import { PremiumLogo } from '../components/ui/PremiumLogo';
import { SmartPlayButton } from '../components/ui/SmartPlayButton';
import { AppAtmosphericBackground } from '../components/ui/AppAtmosphericBackground';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const MainMenuScreen: React.FC = () => {
  const { colors, paperTheme } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  const shadows = useAppShadows();
  const { currentGame, startNewGame } = useGameStore();
  const router = useRouter();

  // Premium animation values with physics-based springs
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(40);
  const buttonScale = useSharedValue(0.9);
  const buttonOpacity = useSharedValue(0);

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


  const handleContinue = () => {
    router.push('/game');
  };

  const handleNewGame = async () => {
    await startNewGame();
    router.push('/game');
  };


  return (
    <AppAtmosphericBackground>
      <StatusBar 
        barStyle={paperTheme.dark ? 'light-content' : 'dark-content'} 
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Info Button */}
        <View style={styles.infoButtonContainer}>
          <TouchableOpacity
            onPress={() => router.push('/gameinfo')}
            style={[
              styles.infoButton,
              {
                backgroundColor: colors.background,
                borderWidth: borders.medium,
                borderColor: borders.color,
              }
            ]}
            accessibilityLabel="Game Information"
          >
            <MaterialIcons name="info" size={18} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Hero Brand Section */}
        <View style={styles.heroContainer}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <PremiumLogo size={140} animated={true} />
          </Animated.View>
          
          <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
            <Text style={[styles.appTitle, typography.displayLarge, { color: colors.onBackground }]}>
              Lights Out
            </Text>
            <Text style={[styles.tagline, typography.titleLarge, { color: colors.onBackground }]}>
              The Classic Puzzle Challenge
            </Text>
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
    textAlign: 'center',
    marginBottom: 12,
    // Typography and color applied inline from AppTypography.displayLarge
  },
  tagline: {
    textAlign: 'center',
    // Typography and color applied inline from AppTypography.titleLarge
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
  infoButtonContainer: {
    position: 'absolute',
    top: 60, // Moved down to be below status bar (typically 44-50px on most devices)
    left: 16,
    zIndex: 10,
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 0, // Sharp corners for neobrutalism
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
});