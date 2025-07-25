import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// App-wide color system - Neobrutalist Design
// Bold, high-contrast palette for uncompromising visual impact
export const AppColors = {
  // Primary Colors (Electric Blue family) - commanding attention
  primary: '#0066FF',           // Electric Blue - main actions, primary elements
  primaryLight: '#3399FF',      // Bright Blue - hover states, highlights
  primaryDark: '#0052CC',       // Deep Blue - pressed states, emphasis
  
  // Secondary Colors (Hot Pink family) - bold accents
  secondary: '#FF006E',         // Hot Pink - secondary actions, accents
  secondaryLight: '#FF4499',    // Light Pink - subtle highlights
  secondaryDark: '#CC0055',     // Deep Pink - secondary emphasis
  
  // Neobrutalist Neutral Colors (Stark contrasts)
  background: '#FFFFFF',        // Pure White - main background (maximum contrast)
  surface: '#FFFFFF',          // Pure White - card/panel backgrounds
  surfaceVariant: '#F5F5F5',   // Light Gray - elevated surfaces only
  outline: '#000000',          // Pure Black - all outlines and borders
  
  // High Contrast Text Colors (Maximum readability)
  onBackground: '#000000',      // Pure Black - primary text on white
  onSurface: '#000000',         // Pure Black - secondary text on white
  onSurfaceVariant: '#333333',  // Dark Gray - muted text when needed
  
  // Bold Accent Colors (Maximum saturation)
  accent: '#00FF00',           // Neon Green - special highlights, success
  success: '#00FF00',          // Neon Green - success states
  warning: '#FFFF00',          // Bright Yellow - warnings
  error: '#FF0000',            // Pure Red - errors
  
  // Neobrutalist Special Effects
  shadow: '#000000',           // Pure Black - harsh drop shadows
  overlay: '#00000080',        // Black overlay - modals/overlays
  disabled: '#999999',         // Mid Gray - disabled elements
  
  // Game-specific Colors
  cellOn: '#00FF00',           // Neon Green - active game cells
  cellOff: '#FFFFFF',          // Pure White - inactive game cells
  gameBackground: '#FFFFFF',   // White game board background
  panelBackground: '#FFFFFF',  // White panel backgrounds
} as const;

// Neobrutalist Design - NO GRADIENTS, Only Flat Colors
// Bold, flat color blocks for uncompromising visual impact
export const AppGradients = {
  // Background - Pure flat white (no gradients in neobrutalism)
  primary: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
  
  // Overlay - Flat black overlay when needed
  overlay: ['transparent', '#00000080', '#00000080'],
  
  // Button "gradients" - Actually flat colors (keeping structure for compatibility)
  primaryButton: ['#0066FF', '#0066FF'], // Electric blue flat
  secondaryButton: ['#FF006E', '#FF006E'], // Hot pink flat
  
  // No particles in neobrutalism - keeping for compatibility but transparent
  particles: ['transparent', 'transparent', 'transparent'],
} as const;

// Create Paper theme with neobrutalist colors - high contrast light theme
const createAppPaperTheme = (isDark: boolean = false): MD3Theme => {
  const baseTheme = MD3LightTheme; // Always use light theme for neobrutalism
  
  // Neobrutalist theme with stark contrasts and flat colors
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      // Core neobrutalist colors
      primary: AppColors.primary,      // Electric blue
      secondary: AppColors.secondary,  // Hot pink
      background: AppColors.background, // Pure white
      surface: AppColors.surface,      // Pure white
      onBackground: AppColors.onBackground, // Pure black
      onSurface: AppColors.onSurface,  // Pure black
      outline: AppColors.outline,      // Pure black for borders
      surfaceVariant: AppColors.surfaceVariant, // Light gray
      onSurfaceVariant: AppColors.onSurfaceVariant, // Dark gray
      
      // High contrast containers (no transparency in neobrutalism)
      primaryContainer: AppColors.primaryLight,    // Bright blue
      onPrimaryContainer: '#FFFFFF',               // White on blue
      secondaryContainer: AppColors.secondaryLight, // Light pink
      onSecondaryContainer: '#FFFFFF',             // White on pink
      tertiary: AppColors.accent,                  // Neon green
      tertiaryContainer: AppColors.accent,         // Neon green (flat)
      onTertiary: '#000000',                       // Black on green
      onTertiaryContainer: '#000000',              // Black on green
      
      // Button colors - high contrast
      onPrimary: '#FFFFFF',    // White text on blue buttons
      onSecondary: '#FFFFFF',  // White text on pink buttons
      
      // Status colors - bold and saturated
      error: AppColors.error,        // Pure red
      onError: '#FFFFFF',            // White on red
      errorContainer: AppColors.error, // Pure red (no transparency)
      onErrorContainer: '#FFFFFF',   // White on red
      
      // System colors - stark
      shadow: AppColors.shadow,      // Pure black shadows
      scrim: AppColors.overlay,      // Black overlay
      inverseSurface: '#000000',     // Black inverse
      inverseOnSurface: '#FFFFFF',   // White on black inverse
      inversePrimary: AppColors.primaryLight, // Bright blue inverse
    }
  };
};

// App theme configuration
export interface AppTheme {
  colors: typeof AppColors;
  gradients: typeof AppGradients;
  typography: typeof AppTypography;
  spacing: typeof AppSpacing;
  animations: typeof AppAnimations;
  borders: typeof AppBorders;
  shadows: typeof AppShadows;
  paperTheme: MD3Theme;
  paperThemeDark: MD3Theme;
  isDark: boolean;
}

// Main app theme (neobrutalist light theme for maximum impact)
export const appTheme: AppTheme = {
  colors: AppColors,
  gradients: AppGradients,
  typography: AppTypography,
  spacing: AppSpacing,
  animations: AppAnimations,
  borders: AppBorders,
  shadows: AppShadows,
  paperTheme: createAppPaperTheme(false),   // Light theme for neobrutalism
  paperThemeDark: createAppPaperTheme(false), // No dark theme in neobrutalism
  isDark: false,
};

// Neobrutalist Typography - Bold, heavy fonts with maximum impact
export const AppTypography = {
  // Display text (hero sections) - Maximum impact
  displayLarge: { fontSize: 57, fontWeight: '900', lineHeight: 60 }, // Ultra-bold, tight spacing
  displayMedium: { fontSize: 45, fontWeight: '900', lineHeight: 48 },
  displaySmall: { fontSize: 36, fontWeight: '900', lineHeight: 40 },
  
  // Headlines (section titles) - Heavy emphasis
  headlineLarge: { fontSize: 32, fontWeight: '800', lineHeight: 36 },
  headlineMedium: { fontSize: 28, fontWeight: '800', lineHeight: 32 },
  headlineSmall: { fontSize: 24, fontWeight: '800', lineHeight: 28 },
  
  // Titles (card titles, important text) - Bold hierarchy
  titleLarge: { fontSize: 22, fontWeight: '700', lineHeight: 26 },
  titleMedium: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
  titleSmall: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
  
  // Body text - Strong readability
  bodyLarge: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  bodyMedium: { fontSize: 14, fontWeight: '600', lineHeight: 18 },
  bodySmall: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  
  // Labels (buttons, tabs) - Maximum boldness
  labelLarge: { fontSize: 14, fontWeight: '800', lineHeight: 18 },
  labelMedium: { fontSize: 12, fontWeight: '800', lineHeight: 16 },
  labelSmall: { fontSize: 11, fontWeight: '800', lineHeight: 14 },
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

// Animation values for consistency - Neobrutalist snappy animations
export const AppAnimations = {
  duration: {
    short: 100,    // Faster, more abrupt
    medium: 200,   // Snappy transitions
    long: 300,     // Still quick but noticeable
  },
  easing: {
    standard: 'linear',    // No easing in neobrutalism
    entrance: 'linear',    // Abrupt entrances
    exit: 'linear',        // Sharp exits
  },
} as const;

// Neobrutalist Border System - Thick, black borders everywhere
export const AppBorders = {
  // Border widths
  thin: 2,      // Minimum border thickness
  medium: 4,    // Standard border thickness
  thick: 6,     // Heavy emphasis borders
  extra: 8,     // Maximum impact borders
  
  // Border styles - always solid black
  style: 'solid' as const,
  color: '#000000', // Pure black borders
  
  // Border radius - NONE in neobrutalism
  radius: {
    none: 0,    // Sharp corners only
    small: 0,   // No rounded corners
    medium: 0,  // Completely angular
    large: 0,   // Harsh geometry
  },
} as const;

// Neobrutalist Shadow System - Heavy drop shadows
export const AppShadows = {
  // Shadow offsets - always visible and dramatic
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,        // Full opacity
    shadowRadius: 0,         // No blur
    elevation: 4,            // Android shadow
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
  },
  extra: {
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 16,
  },
} as const;