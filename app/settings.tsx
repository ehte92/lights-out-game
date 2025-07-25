import { StyleSheet, ScrollView, StatusBar, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemeSelector } from '@/src/components/themes/ThemeSelector';
import { ToggleSwitch } from '@/src/components/settings/ToggleSwitch';
import { GridSizeSelector } from '@/src/components/settings/GridSizeSelector';
import { DifficultySelector } from '@/src/components/settings/DifficultySelector';
import { SettingsSection } from '@/src/components/settings/SettingsSection';
import { PremiumButton } from '@/src/components/ui/PremiumButton';
import { useAppTheme, useAppTypography, useAppBorders } from '@/src/contexts/AppThemeContext';
import { GameThemeProvider } from '@/src/contexts/GameThemeContext';
import { useGameStore } from '@/src/stores/gameStore';

export default function SettingsScreen() {
  const { colors, paperTheme } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  const router = useRouter();
  
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
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button in Top Left */}
        <View style={styles.topBar}>
          <PremiumButton
            title=""
            onPress={() => router.back()}
            style={styles.backButton}
            size="small"
            variant="secondary"
          >
            <MaterialIcons name="arrow-back" size={20} color="#000000" />
          </PremiumButton>
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

          {/* Info Section */}
          <View
            style={[
              styles.infoPanel,
              {
                backgroundColor: colors.onBackground,
                borderWidth: borders.thick,
                borderColor: borders.color,
                // Neobrutalist shadow
                ...Platform.select({
                  ios: {
                    shadowColor: '#000000',
                    shadowOffset: { width: 4, height: 4 },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                  },
                  android: { elevation: 8 },
                }),
              },
            ]}
          >
            <Text
              style={[
                typography.headlineSmall,
                {
                  color: colors.background, // White text on black background
                  fontWeight: '900',
                  textAlign: 'center',
                  marginBottom: 12,
                },
              ]}
            >
              LIGHTS OUT
            </Text>
            <Text
              style={[
                typography.bodyMedium,
                {
                  color: colors.background, // White text on black background
                  fontWeight: '600',
                  textAlign: 'center',
                  lineHeight: 22,
                },
              ]}
            >
              A classic puzzle game where you need to turn off all the lights. 
              Tap a cell to toggle it and its neighbors. Master the patterns 
              and unlock new themes as you progress!
            </Text>
          </View>
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
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 8, // Small top padding after back button
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
  },
  themeContainer: {
    // Container for theme selector with proper spacing
  },
  infoPanel: {
    padding: 24,
    borderRadius: 0, // Sharp corners for neobrutalism
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
});