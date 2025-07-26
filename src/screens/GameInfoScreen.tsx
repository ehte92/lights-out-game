import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme, useAppTypography, useAppBorders } from '../contexts/AppThemeContext';

export const GameInfoScreen: React.FC = () => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  const router = useRouter();

  return (
    <View style={[styles.container, styles.atmosphericBackground]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Minimal Header */}
        {Platform.OS === 'android' && (
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.backButton,
                {
                  backgroundColor: colors.background,
                  borderWidth: borders.medium,
                  borderColor: borders.color,
                }
              ]}
              accessibilityLabel="Go Back"
            >
              <MaterialIcons name="arrow-back" size={16} color="#000000" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Main Content */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Game Info Panel */}
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

          {/* Additional Game Details */}
          <View
            style={[
              styles.detailsPanel,
              {
                backgroundColor: colors.background,
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
                  color: colors.onBackground,
                  fontWeight: '900',
                  textAlign: 'center',
                  marginBottom: 16,
                },
              ]}
            >
              HOW TO PLAY
            </Text>
            
            <View style={styles.instructionItem}>
              <Text style={[typography.bodyLarge, { color: colors.onBackground, fontWeight: '800' }]}>
                🎯 OBJECTIVE
              </Text>
              <Text style={[typography.bodyMedium, { color: colors.onBackground, marginTop: 4, lineHeight: 20 }]}>
                Turn off all the lights on the grid to complete each puzzle.
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <Text style={[typography.bodyLarge, { color: colors.onBackground, fontWeight: '800' }]}>
                🕹️ CONTROLS
              </Text>
              <Text style={[typography.bodyMedium, { color: colors.onBackground, marginTop: 4, lineHeight: 20 }]}>
                Tap any cell to toggle it and its direct neighbors (up, down, left, right).
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <Text style={[typography.bodyLarge, { color: colors.onBackground, fontWeight: '800' }]}>
                🧩 STRATEGY
              </Text>
              <Text style={[typography.bodyMedium, { color: colors.onBackground, marginTop: 4, lineHeight: 20 }]}>
                Think ahead! Random tapping rarely works. Look for patterns and plan your moves.
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <Text style={[typography.bodyLarge, { color: colors.onBackground, fontWeight: '800' }]}>
                🏆 PROGRESSION
              </Text>
              <Text style={[typography.bodyMedium, { color: colors.onBackground, marginTop: 4, lineHeight: 20 }]}>
                Complete puzzles to unlock achievements, track your stats, and earn new themes!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  atmosphericBackground: {
    backgroundColor: '#1a1a2e', // Rich dark blue base matching other screens
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    marginBottom: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 0, // Sharp corners for neobrutalism
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  infoPanel: {
    padding: 24,
    borderRadius: 0, // Sharp corners for neobrutalism
    marginBottom: 16,
  },
  detailsPanel: {
    padding: 24,
    borderRadius: 0, // Sharp corners for neobrutalism
  },
  instructionItem: {
    marginBottom: 16,
  },
});