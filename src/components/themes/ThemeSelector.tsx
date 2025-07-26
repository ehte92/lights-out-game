import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useGameTheme } from '../../contexts/GameThemeContext';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';
import { ALL_THEMES } from '../../themes/gameThemes';

export const ThemeSelector: React.FC = () => {
  const { 
    currentTheme, 
    setTheme, 
    isThemeUnlocked, 
    unlockedThemes,
    isTransitioning 
  } = useGameTheme();
  
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();

  const handleThemeSelect = (themeId: string) => {
    if (isThemeUnlocked(themeId) && !isTransitioning) {
      setTheme(themeId);
    }
  };

  const renderThemeOption = (theme: typeof ALL_THEMES[0]) => {
    const isUnlocked = isThemeUnlocked(theme.id);
    const isSelected = currentTheme.id === theme.id;
    
    const handlePress = () => {
      if (isUnlocked && !isTransitioning) {
        handleThemeSelect(theme.id);
      }
    };
    
    const backgroundColor = isSelected ? colors.secondary : colors.background;
    const textColor = isSelected ? colors.background : colors.onBackground;
    const borderColor = borders.color;
    
    return (
      <Pressable
        key={theme.id}
        style={[
          styles.themeOption,
          {
            backgroundColor,
            borderWidth: borders.thick,
            borderColor,
            // Neobrutalist shadow
            ...Platform.select({
              ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: isSelected ? 0 : 1,
                shadowRadius: 0,
              },
              android: { elevation: isSelected ? 0 : 8 },
            }),
          },
          !isUnlocked && styles.disabled,
        ]}
        onPress={handlePress}
        disabled={!isUnlocked || isTransitioning}
      >
        {/* Theme Preview Grid */}
        <View style={styles.previewContainer}>
          <View style={styles.previewGrid}>
            {/* 2x2 grid showing theme colors */}
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
        
        {/* Theme Name */}
        <Text
          style={[
            typography.titleMedium,
            {
              color: textColor,
              fontWeight: '900',
              textAlign: 'center',
              marginBottom: 4,
            },
          ]}
        >
          {theme.name}
        </Text>
        
        {/* Status Indicator */}
        <View style={styles.statusIndicator}>
          {isSelected && (
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: colors.background,
                borderWidth: borders.thin,
                borderColor: colors.onBackground,
              }
            ]}>
              <Text style={[
                typography.bodySmall,
                {
                  color: colors.onBackground,
                  fontWeight: '900',
                  fontSize: 10,
                }
              ]}>
                ACTIVE
              </Text>
            </View>
          )}
          {!isUnlocked && (
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderWidth: borders.thin,
                borderColor: colors.onBackground,
              }
            ]}>
              <Text style={[
                typography.bodySmall,
                {
                  color: colors.background,
                  fontWeight: '900',
                  fontSize: 10,
                }
              ]}>
                LVL {theme.unlockLevel}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };
  
  return (
    <View
      style={[
        styles.container,
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
            marginBottom: 8,
          },
        ]}
      >
        Visual Style
      </Text>
      <Text
        style={[
          typography.bodyMedium,
          {
            color: colors.onSurfaceVariant,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 20,
          },
        ]}
      >
        Choose your game theme
      </Text>
      
      <View style={styles.themesGrid}>
        {ALL_THEMES.map(renderThemeOption)}
      </View>
      
      {/* Progress Info */}
      <View style={[
        styles.progressInfo,
        {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderWidth: borders.thin,
          borderColor: borders.color,
        }
      ]}>
        <Text style={[
          typography.bodySmall,
          {
            color: colors.onBackground,
            fontWeight: '700',
            textAlign: 'center',
          }
        ]}>
          UNLOCKED: {unlockedThemes.length}/{ALL_THEMES.length} THEMES
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  themeOption: {
    width: '47%', // Two columns with gap
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  previewContainer: {
    marginBottom: 12,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 32,
    height: 32,
  },
  previewCell: {
    width: 14,
    height: 14,
    margin: 1,
    borderRadius: 0, // Sharp corners for neobrutalism
    borderWidth: 1,
    borderColor: '#000000',
  },
  statusIndicator: {
    marginTop: 8,
    alignItems: 'center',
    minHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 0, // Sharp corners for neobrutalism
  },
  progressInfo: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 0, // Sharp corners for neobrutalism
  },
  disabled: {
    opacity: 0.5,
  },
});