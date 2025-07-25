import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';
import { Difficulty } from '../../types/game';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DifficultySelectorProps {
  value: Difficulty;
  onValueChange: (value: Difficulty) => void;
  disabled?: boolean;
}

const DIFFICULTY_OPTIONS = [
  { 
    value: 'easy' as Difficulty, 
    label: 'Easy', 
    description: '3-5 moves',
    icon: '🟢'
  },
  { 
    value: 'medium' as Difficulty, 
    label: 'Medium', 
    description: '6-9 moves',
    icon: '🟡'
  },
  { 
    value: 'hard' as Difficulty, 
    label: 'Hard', 
    description: '10-15 moves',
    icon: '🔴'
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
    const pressed = useSharedValue(false);
    
    const handlePress = () => {
      if (!disabled) {
        onValueChange(option.value);
      }
    };
    
    const handlePressIn = () => {
      pressed.value = true;
    };
    
    const handlePressOut = () => {
      pressed.value = false;
    };
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: pressed.value ? 2 : 0 },
        { translateY: pressed.value ? 2 : 0 },
      ],
    }));
    
    const backgroundColor = isSelected ? colors.primary : colors.background;
    const textColor = isSelected ? colors.background : colors.onBackground;
    const borderColor = borders.color;
    
    return (
      <AnimatedPressable
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
                shadowOpacity: isSelected ? 0 : 1, // No shadow when pressed/selected
                shadowRadius: 0,
              },
              android: { elevation: isSelected ? 0 : 8 },
            }),
          },
          animatedStyle,
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Text
          style={[
            typography.headlineMedium,
            {
              color: textColor,
              fontWeight: '900',
              textAlign: 'center',
              marginBottom: 4,
            },
          ]}
        >
          {option.icon}
        </Text>
        <Text
          style={[
            typography.titleLarge,
            {
              color: textColor,
              fontWeight: '900', // Bold for neobrutalism
              textAlign: 'center',
              marginBottom: 4,
            },
          ]}
        >
          {option.label}
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            {
              color: textColor,
              fontWeight: '700',
              textAlign: 'center',
            },
          ]}
        >
          {option.description}
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
      </AnimatedPressable>
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
      
      <View style={styles.optionsContainer}>
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
  optionsContainer: {
    gap: 12,
  },
  difficultyOption: {
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  difficultyBars: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
  },
  difficultyBar: {
    width: 20,
    height: 4,
    borderRadius: 0, // Sharp corners for neobrutalism
  },
  disabled: {
    opacity: 0.5,
  },
});