import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  Text,
  Button,
  Surface,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useGameTheme } from '../contexts/ThemeContext';

export const MainMenuScreen: React.FC = () => {
  const { colors, paperTheme } = useGameTheme();
  const router = useRouter();

  const handlePlay = () => {
    router.push('/game');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <LinearGradient
      colors={[colors.gameBackground, colors.panelBackground]}
      style={styles.container}
    >
      <StatusBar barStyle={paperTheme.dark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Settings Button */}
        <View style={styles.topBar}>
          <IconButton 
            icon="cog" 
            size={24}
            iconColor={paperTheme.colors.onSurface}
            onPress={handleSettings}
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Surface style={[styles.titleContainer, { backgroundColor: colors.panelBackground }]} elevation={2}>
            <Text variant="displayLarge" style={[styles.title, { color: paperTheme.colors.onSurface }]}>
              Lights Out
            </Text>
            <Text variant="bodyLarge" style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
              The Classic Puzzle Challenge
            </Text>
          </Surface>

          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={handlePlay}
              style={styles.playButton}
              buttonColor={paperTheme.colors.primary}
              contentStyle={styles.playButtonContent}
            >
              <Text variant="headlineSmall" style={styles.playButtonText}>
                Play
              </Text>
            </Button>
          </View>
        </View>

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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 64,
    minWidth: '100%',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  playButton: {
    borderRadius: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playButtonContent: {
    paddingVertical: 12,
    paddingHorizontal: 48,
  },
  playButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});