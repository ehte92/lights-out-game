import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// App-wide color system based on color theory research
// Serene Night palette for comfortable dark theme experience
export const AppColors = {
  // Primary Colors (Soft Indigo family) - work well on dark backgrounds
  primary: '#6366f1',           // Soft Indigo - main actions, primary elements
  primaryLight: '#a5b4fc',      // Light Indigo - hover states, highlights
  primaryDark: '#4338ca',       // Dark Indigo - pressed states, emphasis
  
  // Secondary Colors (Gentle Purple family)
  secondary: '#8b5cf6',         // Gentle Purple - secondary actions, accents
  secondaryLight: '#c4b5fd',    // Light Purple - subtle backgrounds
  secondaryDark: '#7c3aed',     // Dark Purple - secondary emphasis
  
  // Dark Theme Neutral Colors (Comfortable slate family)
  background: '#0f172a',        // Deep Slate - main background (eye-friendly)
  surface: '#1e293b',          // Medium Slate - card/panel backgrounds
  surfaceVariant: '#334155',   // Light Slate - elevated surfaces, borders
  outline: '#475569',          // Soft Slate - outlines, subtle borders
  
  // Dark Theme Text Colors (High contrast for readability)
  onBackground: '#f1f5f9',      // Cool White - primary text on dark
  onSurface: '#e2e8f0',         // Light Gray - secondary text on dark
  onSurfaceVariant: '#cbd5e1',  // Medium Gray - muted text on dark
  
  // Accent Colors (Optimized for dark backgrounds)
  accent: '#06b6d4',           // Calm Cyan - special highlights, links
  success: '#10b981',          // Soft Emerald - success states
  warning: '#f59e0b',          // Gentle Amber - warnings
  error: '#ef4444',            // Coral Red - errors
  
  // Dark Theme Special Effects
  shadow: '#00000040',         // Dark shadow for depth
  overlay: '#00000060',        // Modal/overlay background
  disabled: '#64748b',         // Disabled text/elements (muted)
} as const;

// Atmospheric gradients for dark theme consistency
export const AppGradients = {
  // Main background gradient - comfortable dark slate progression
  primary: ['#0f172a', '#1e293b', '#334155'],
  
  // Subtle overlay gradients for dark theme
  overlay: ['transparent', '#0f172a80', '#1e293b60'],
  
  // Button gradients (maintain vibrant colors on dark)
  primaryButton: ['#6366f1', '#8b5cf6'],
  secondaryButton: ['#1e293b', '#334155'],
  
  // Atmospheric particles (gentle glow on dark)
  particles: ['#6366f160', '#8b5cf640', '#06b6d430'],
} as const;

// Create Paper theme with app colors - optimized for dark theme
const createAppPaperTheme = (isDark: boolean = true): MD3Theme => {
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  
  // Since we're now dark-first, this is the primary theme
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      // Core colors
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      background: AppColors.background,
      surface: AppColors.surface,
      onBackground: AppColors.onBackground,
      onSurface: AppColors.onSurface,
      outline: AppColors.outline,
      surfaceVariant: AppColors.surfaceVariant,
      onSurfaceVariant: AppColors.onSurfaceVariant,
      
      // Additional MD3 colors optimized for dark theme
      primaryContainer: `${AppColors.primary}30`,
      onPrimaryContainer: AppColors.primaryLight,
      secondaryContainer: `${AppColors.secondary}30`,
      onSecondaryContainer: AppColors.secondaryLight,
      tertiary: AppColors.accent,
      tertiaryContainer: `${AppColors.accent}30`,
      onTertiary: '#ffffff',
      onTertiaryContainer: AppColors.accent,
      
      // Button and interaction colors
      onPrimary: '#ffffff',
      onSecondary: '#ffffff', 
      
      // Status colors
      error: AppColors.error,
      onError: '#ffffff',
      errorContainer: `${AppColors.error}20`,
      onErrorContainer: AppColors.error,
      
      // System colors
      shadow: AppColors.shadow,
      scrim: AppColors.overlay,
      inverseSurface: '#f1f5f9',
      inverseOnSurface: '#1e293b',
      inversePrimary: AppColors.primaryDark,
    }
  };
};

// App theme configuration
export interface AppTheme {
  colors: typeof AppColors;
  gradients: typeof AppGradients;
  paperTheme: MD3Theme;
  paperThemeDark: MD3Theme;
  isDark: boolean;
}

// Main app theme (dark by default for eye comfort)
export const appTheme: AppTheme = {
  colors: AppColors,
  gradients: AppGradients,
  paperTheme: createAppPaperTheme(true),   // Dark theme as default
  paperThemeDark: createAppPaperTheme(true), // Keep dark theme
  isDark: true,
};

// Typography scale for consistent text sizing
export const AppTypography = {
  // Display text (hero sections)
  displayLarge: { fontSize: 57, fontWeight: '400', lineHeight: 64 },
  displayMedium: { fontSize: 45, fontWeight: '400', lineHeight: 52 },
  displaySmall: { fontSize: 36, fontWeight: '400', lineHeight: 44 },
  
  // Headlines (section titles)
  headlineLarge: { fontSize: 32, fontWeight: '400', lineHeight: 40 },
  headlineMedium: { fontSize: 28, fontWeight: '400', lineHeight: 36 },
  headlineSmall: { fontSize: 24, fontWeight: '400', lineHeight: 32 },
  
  // Titles (card titles, important text)
  titleLarge: { fontSize: 22, fontWeight: '400', lineHeight: 28 },
  titleMedium: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  titleSmall: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  
  // Body text
  bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  
  // Labels (buttons, tabs)
  labelLarge: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  labelMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  labelSmall: { fontSize: 11, fontWeight: '500', lineHeight: 16 },
} as const;

// Spacing system (4pt grid)
export const AppSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64,
} as const;

// Animation values for consistency
export const AppAnimations = {
  duration: {
    short: 150,
    medium: 300,
    long: 500,
  },
  easing: {
    standard: 'ease-out',
    entrance: 'ease-out',
    exit: 'ease-in',
  },
} as const;