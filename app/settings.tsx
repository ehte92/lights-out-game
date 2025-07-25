import { StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ThemeSelector } from '@/src/components/themes/ThemeSelector';
import { useGameTheme } from '@/src/contexts/ThemeContext';

export default function SettingsScreen() {
  const { colors, paperTheme } = useGameTheme();
  const router = useRouter();
  
  return (
    <Surface style={[styles.container, { backgroundColor: colors.gameBackground }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header with back button */}
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
                <Text variant="displaySmall" style={[styles.title, { color: paperTheme.colors.onSurface }]}>
                  Settings
                </Text>
                <Text variant="bodyLarge" style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
                  Customize your experience
                </Text>
              </View>
            </View>
          </Surface>
          
          <ThemeSelector />
          
          <Surface style={[styles.infoPanel, { backgroundColor: colors.panelBackground }]} elevation={1}>
            <Text variant="titleMedium" style={[styles.infoTitle, { color: paperTheme.colors.onSurface }]}>
              About Lights Out
            </Text>
            <Text variant="bodyMedium" style={[styles.infoText, { color: paperTheme.colors.onSurfaceVariant }]}>
              A classic puzzle game where you need to turn off all the lights. 
              Tap a cell to toggle it and its neighbors. Choose from multiple themes 
              that unlock as you progress through the game.
            </Text>
          </Surface>
        </ScrollView>
      </SafeAreaView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
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
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
  },
  infoPanel: {
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
  },
  infoTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    textAlign: 'center',
    lineHeight: 22,
  },
});