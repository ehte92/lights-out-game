import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GridSizeSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

const GRID_SIZES = [
  { size: 3, label: '3×3', description: 'Quick' },
  { size: 4, label: '4×4', description: 'Classic' },
  { size: 5, label: '5×5', description: 'Complex' },
  { size: 6, label: '6×6', description: 'Expert' },
];

export const GridSizeSelector: React.FC<GridSizeSelectorProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  
  const renderGridOption = (option: typeof GRID_SIZES[0]) => {
    const isSelected = value === option.size;
    const pressed = useSharedValue(false);
    
    const handlePress = () => {
      if (!disabled) {
        onValueChange(option.size);
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
    
    const backgroundColor = isSelected ? colors.secondary : colors.background;
    const textColor = isSelected ? colors.background : colors.onBackground;
    const borderColor = borders.color;
    
    return (
      <AnimatedPressable
        key={option.size}
        style={[
          styles.gridOption,
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
            typography.titleLarge,
            {
              color: textColor,
              fontWeight: '900', // Bold for neobrutalism
              textAlign: 'center',
            },
          ]}
        >
          {option.label}
        </Text>
        <Text
          style={[
            typography.bodySmall,
            {
              color: textColor,
              fontWeight: '700',
              textAlign: 'center',
              marginTop: 4,
            },
          ]}
        >
          {option.description}
        </Text>
        
        {/* Mini grid preview */}
        <View style={styles.previewGrid}>
          {Array.from({ length: option.size * option.size }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.previewCell,
                {
                  backgroundColor: isSelected ? colors.background : colors.onBackground,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.onBackground : colors.background,
                },
              ]}
            />
          ))}
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
        Grid Size
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
        Choose your puzzle difficulty
      </Text>
      
      <View style={styles.optionsGrid}>
        {GRID_SIZES.map(renderGridOption)}
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridOption: {
    width: '47%', // Two columns with gap
    borderRadius: 0, // Sharp corners for neobrutalism
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 32,
    height: 32,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCell: {
    width: 6,
    height: 6,
    margin: 0.5,
    borderRadius: 0, // Sharp corners for neobrutalism
  },
  disabled: {
    opacity: 0.5,
  },
});