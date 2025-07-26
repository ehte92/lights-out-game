import { StyleSheet, ScrollView, StatusBar, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { ThemeSelector } from '@/src/components/themes/ThemeSelector';
import { ToggleSwitch } from '@/src/components/settings/ToggleSwitch';
import { GridSizeSelector } from '@/src/components/settings/GridSizeSelector';
import { DifficultySelector } from '@/src/components/settings/DifficultySelector';
import { SettingsSection } from '@/src/components/settings/SettingsSection';
import { useAppTheme, useAppTypography, useAppBorders } from '@/src/contexts/AppThemeContext';
import { GameThemeProvider } from '@/src/contexts/GameThemeContext';
import { useGameStore } from '@/src/stores/gameStore';

export default function SettingsScreen() {
  const { colors, paperTheme } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  
  const { settings, updateSettings } = useGameStore();
  
  const handleSoundToggle = (value: boolean) => {
    updateSettings({ soundEnabled: value });
  };
  
  const handleHapticsToggle = (value: boolean) => {
    updateSettings({ hapticsEnabled: value });
  };
  
  const handleGridSizeChange = (value: number) => {
    updateSettings({ gridSize: value });
  };
  
  const handleDifficultyChange = (value: 'easy' | 'medium' | 'hard') => {
    updateSettings({ difficulty: value });
  };
  
  return (
    <View style={[styles.container, styles.atmosphericBackground]}>
      <StatusBar 
        barStyle="light-content" 
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header for Tab */}
        <View style={styles.header}>
          <Text style={[
            typography.headlineLarge,
            {
              color: colors.background, // White text
              fontWeight: '900',
              textAlign: 'center',
            }
          ]}>
            SETTINGS
          </Text>
          <Text style={[
            typography.bodyLarge,
            {
              color: colors.background,
              fontWeight: '600',
              textAlign: 'center',
              marginTop: 4,
              opacity: 0.9,
            }
          ]}>
            Customize your gaming experience
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Audio Settings Section */}
          <SettingsSection
            title="AUDIO"
            description="Sound and feedback preferences"
          >
            <ToggleSwitch
              label="Sound Effects"
              description="Enable audio feedback for game actions"
              value={settings.soundEnabled}
              onValueChange={handleSoundToggle}
            />
            <ToggleSwitch
              label="Haptic Feedback"
              description="Enable vibration feedback for interactions"
              value={settings.hapticsEnabled}
              onValueChange={handleHapticsToggle}
            />
          </SettingsSection>

          {/* Game Settings Section */}
          <SettingsSection
            title="GAME"
            description="Puzzle difficulty and layout"
          >
            <GridSizeSelector
              value={settings.gridSize}
              onValueChange={handleGridSizeChange}
            />
            <DifficultySelector
              value={settings.difficulty}
              onValueChange={handleDifficultyChange}
            />
          </SettingsSection>

          {/* Theme Settings Section */}
          <SettingsSection
            title="VISUAL"
            description="Appearance and themes"
          >
            <GameThemeProvider>
              <View style={styles.themeContainer}>
                <ThemeSelector />
              </View>
            </GameThemeProvider>
          </SettingsSection>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  atmosphericBackground: {
    backgroundColor: '#1a1a2e', // Rich dark blue base matching game screen
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  themeContainer: {
    // Container for theme selector with proper spacing
  },
});