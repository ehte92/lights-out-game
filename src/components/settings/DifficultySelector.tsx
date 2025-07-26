import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';
import { Difficulty } from '../../types/game';

interface DifficultySelectorProps {
  value: Difficulty;
  onValueChange: (value: Difficulty) => void;
  disabled?: boolean;
}

const DIFFICULTY_OPTIONS = [
  { 
    value: 'easy' as Difficulty, 
    label: 'Easy', 
    icon: '●',
    color: '#22c55e',
    textColor: '#ffffff'
  },
  { 
    value: 'medium' as Difficulty, 
    label: 'Medium', 
    icon: '◆',
    color: '#f59e0b',
    textColor: '#000000'
  },
  { 
    value: 'hard' as Difficulty, 
    label: 'Hard', 
    icon: '▲',
    color: '#ef4444',
    textColor: '#ffffff'
  },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  
  const renderDifficultyOption = (option: typeof DIFFICULTY_OPTIONS[0]) => {
    const isSelected = value === option.value;
    
    const handlePress = () => {
      if (!disabled) {
        onValueChange(option.value);
      }
    };
    
    // Use difficulty-specific colors when selected, theme colors when not
    const backgroundColor = isSelected ? option.color : colors.background;
    const textColor = isSelected ? option.textColor : colors.onBackground;
    const borderColor = borders.color;
    
    return (
      <Pressable
        key={option.value}
        style={[
          styles.difficultyOption,
          {
            backgroundColor,
            borderWidth: borders.thick,
            borderColor,
            // Neobrutalist shadow
            ...Platform.select({
              ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: isSelected ? 0 : 1, // No shadow when selected
                shadowRadius: 0,
              },
              android: { elevation: isSelected ? 0 : 8 },
            }),
          },
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
      >
        <Text
          style={[
            typography.headlineSmall,
            {
              color: textColor,
              fontWeight: '900',
              textAlign: 'center',
              marginBottom: 4,
              fontSize: 16,
            },
          ]}
        >
          {option.icon}
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            {
              color: textColor,
              fontWeight: '900', // Bold for neobrutalism
              textAlign: 'center',
              fontSize: 12,
            },
          ]}
        >
          {option.label}
        </Text>
        
        {/* Difficulty indicator bars */}
        <View style={styles.difficultyBars}>
          {[1, 2, 3].map((bar) => {
            const isActive = bar <= (option.value === 'easy' ? 1 : option.value === 'medium' ? 2 : 3);
            return (
              <View
                key={bar}
                style={[
                  styles.difficultyBar,
                  {
                    backgroundColor: isActive 
                      ? (isSelected ? colors.background : colors.onBackground)
                      : (isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'),
                    borderWidth: borders.thin,
                    borderColor: isSelected ? colors.background : colors.onBackground,
                  },
                ]}
              />
            );
          })}
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
        Difficulty Level
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
        Number of moves needed to generate puzzles
      </Text>
      
      <View style={styles.optionsGrid}>
        {DIFFICULTY_OPTIONS.map(renderDifficultyOption)}
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
  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyOption: {
    borderRadius: 0, // Sharp corners for neobrutalism
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    minHeight: 70,
    justifyContent: 'center',
    minWidth: 80,
  },
  difficultyBars: {
    flexDirection: 'row',
    gap: 1,
    marginTop: 6,
  },
  difficultyBar: {
    width: 8,
    height: 2,
    borderRadius: 0, // Sharp corners for neobrutalism
  },
  disabled: {
    opacity: 0.5,
  },
});