import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Base colors from DESIGN_LANGUAGE.md
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#3b82f6',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    700: '#d97706', 
    900: '#92400e',
  },
  purple: {
    500: '#8b5cf6',
    700: '#7c3aed',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

const backgrounds = {
  dark: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    surface: '#475569',
  },
  light: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    surface: '#e2e8f0',
  }
};

const textColors = {
  dark: {
    primary: '#ffffff',
    secondary: '#e2e8f0',
    tertiary: '#94a3b8',
    disabled: '#64748b',
  },
  light: {
    primary: '#0f172a',
    secondary: '#334155', 
    tertiary: '#64748b',
    disabled: '#94a3b8',
  }
};

// Dark theme configuration (primary theme for game)
export const darkPaperTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors
    primary: colors.primary[500],
    onPrimary: textColors.dark.primary,
    primaryContainer: colors.primary[900],
    onPrimaryContainer: colors.primary[100],
    
    // Secondary colors  
    secondary: colors.secondary[500],
    onSecondary: textColors.dark.primary,
    secondaryContainer: colors.secondary[900],
    onSecondaryContainer: colors.secondary[100],
    
    // Surface colors
    surface: backgrounds.dark.secondary,
    onSurface: textColors.dark.primary,
    surfaceVariant: backgrounds.dark.tertiary,
    onSurfaceVariant: textColors.dark.secondary,
    
    // Background
    background: backgrounds.dark.primary,
    onBackground: textColors.dark.primary,
    
    // Error colors
    error: colors.error,
    onError: textColors.dark.primary,
    errorContainer: '#7f1d1d',
    onErrorContainer: '#fecaca',
    
    // Outline
    outline: backgrounds.dark.surface,
    outlineVariant: backgrounds.dark.tertiary,
    
    // Other colors
    inverseSurface: backgrounds.light.secondary,
    inverseOnSurface: textColors.light.primary,
    inversePrimary: colors.primary[700],
    
    // Surface tints
    surfaceTint: colors.primary[500],
    
    // Elevation surfaces
    elevation: {
      level0: 'transparent',
      level1: backgrounds.dark.secondary,
      level2: backgrounds.dark.tertiary, 
      level3: backgrounds.dark.surface,
      level4: '#5f6b7c',
      level5: '#6b7785',
    },
  },
};

// Light theme configuration (optional)
export const lightPaperTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors
    primary: colors.primary[500],
    onPrimary: textColors.light.primary,
    primaryContainer: colors.primary[100],
    onPrimaryContainer: colors.primary[900],
    
    // Secondary colors
    secondary: colors.secondary[500], 
    onSecondary: textColors.light.primary,
    secondaryContainer: colors.secondary[100],
    onSecondaryContainer: colors.secondary[900],
    
    // Surface colors
    surface: backgrounds.light.secondary,
    onSurface: textColors.light.primary,
    surfaceVariant: backgrounds.light.tertiary,
    onSurfaceVariant: textColors.light.secondary,
    
    // Background
    background: backgrounds.light.primary,
    onBackground: textColors.light.primary,
    
    // Error colors
    error: colors.error,
    onError: textColors.light.primary,
    errorContainer: '#fee2e2',
    onErrorContainer: '#7f1d1d',
    
    // Outline
    outline: backgrounds.light.surface,
    outlineVariant: backgrounds.light.tertiary,
    
    // Other colors
    inverseSurface: backgrounds.dark.secondary,
    inverseOnSurface: textColors.dark.primary,
    inversePrimary: colors.primary[100],
    
    // Surface tints
    surfaceTint: colors.primary[500],
    
    // Elevation surfaces
    elevation: {
      level0: 'transparent',
      level1: backgrounds.light.secondary,
      level2: backgrounds.light.tertiary,
      level3: backgrounds.light.surface,
      level4: '#ddd6fe',
      level5: '#c4b5fd',
    },
  },
};

export { colors, backgrounds, textColors };