import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Surface,
  Text,
  Button,
  Card,
  Chip,
} from 'react-native-paper';
import { useGameTheme } from '../../contexts/GameThemeContext';
import { useAppTheme } from '../../contexts/AppThemeContext';
import { ALL_THEMES } from '../../themes/gameThemes';

export const ThemeSelector: React.FC = () => {
  const { 
    currentTheme, 
    setTheme, 
    isThemeUnlocked, 
    unlockedThemes,
    isTransitioning 
  } = useGameTheme();
  
  const { paperTheme } = useAppTheme();

  const handleThemeSelect = (themeId: string) => {
    if (isThemeUnlocked(themeId) && !isTransitioning) {
      setTheme(themeId);
    }
  };

  return (
    <Surface style={[styles.container, { backgroundColor: paperTheme.colors.surface }]} elevation={1}>
      <Text variant="headlineSmall" style={[styles.title, { color: paperTheme.colors.onSurface }]}>
        Game Themes
      </Text>
      <Text variant="bodyMedium" style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
        Customize your game experience
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.themeGrid}>
          {ALL_THEMES.map((theme) => {
            const isUnlocked = isThemeUnlocked(theme.id);
            const isSelected = currentTheme.id === theme.id;
            
            return (
              <Card 
                key={theme.id} 
                style={[
                  styles.themeCard,
                  isSelected && { borderColor: paperTheme.colors.primary, borderWidth: 2 }
                ]}
                onPress={() => handleThemeSelect(theme.id)}
                disabled={!isUnlocked || isTransitioning}
              >
                <Card.Content style={styles.cardContent}>
                  {/* Theme Preview */}
                  <View style={styles.previewContainer}>
                    <View style={styles.previewGrid}>
                      <View 
                        style={[
                          styles.previewCell,
                          { backgroundColor: theme.gameColors.cellOn }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.previewCell,
                          { backgroundColor: theme.gameColors.cellOff }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.previewCell,
                          { backgroundColor: theme.gameColors.cellOff }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.previewCell,
                          { backgroundColor: theme.gameColors.cellOn }
                        ]} 
                      />
                    </View>
                  </View>
                  
                  {/* Theme Info */}
                  <Text variant="titleSmall" style={styles.themeName}>
                    {theme.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.themeDescription} numberOfLines={2}>
                    {theme.description}
                  </Text>
                  
                  {/* Status Chip */}
                  <View style={styles.statusContainer}>
                    {isSelected && (
                      <Chip mode="flat" compact textStyle={styles.chipText}>
                        Active
                      </Chip>
                    )}
                    {!isUnlocked && (
                      <Chip mode="outlined" compact textStyle={styles.chipText}>
                        Level {theme.unlockLevel}
                      </Chip>
                    )}
                  </View>
                  
                  {/* Action Button */}
                  {isUnlocked && !isSelected && (
                    <Button
                      mode="contained"
                      onPress={() => handleThemeSelect(theme.id)}
                      style={styles.selectButton}
                      disabled={isTransitioning}
                    >
                      {isTransitioning ? 'Switching...' : 'Select'}
                    </Button>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </View>
      </ScrollView>
      
      {/* Debug Info */}
      <Surface style={styles.debugInfo} elevation={0}>
        <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
          Unlocked: {unlockedThemes.length}/{ALL_THEMES.length} themes
        </Text>
      </Surface>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    margin: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollView: {
    marginBottom: 16,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  themeCard: {
    width: 160,
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    padding: 12,
  },
  previewContainer: {
    marginBottom: 12,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 40,
    height: 40,
  },
  previewCell: {
    width: 18,
    height: 18,
    margin: 1,
    borderRadius: 3,
  },
  themeName: {
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  themeDescription: {
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 32,
  },
  statusContainer: {
    marginBottom: 8,
    minHeight: 24,
  },
  chipText: {
    fontSize: 10,
  },
  selectButton: {
    width: '100%',
  },
  debugInfo: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});