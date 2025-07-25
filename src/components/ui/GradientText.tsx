import React from 'react';
import { Text, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useGameTheme } from '../../contexts/ThemeContext';

interface GradientTextProps {
  children: string;
  style?: TextStyle;
  colors?: string[];
  locations?: number[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  style,
  colors,
  locations,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}) => {
  const { colors: themeColors, paperTheme } = useGameTheme();

  // Default premium gradient colors based on theme
  const defaultColors = colors || [
    themeColors.accent || paperTheme.colors.primary,
    themeColors.cellOn || paperTheme.colors.secondary,
    paperTheme.colors.tertiary,
  ];

  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={defaultColors}
        locations={locations}
        start={start}
        end={end}
        style={style}
      >
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
};