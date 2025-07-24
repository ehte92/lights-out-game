import type { MD3Theme } from 'react-native-paper';

// Theme categories from THEMES.md
export type ThemeCategory = 'classic' | 'futuristic' | 'nature' | 'retro' | 'minimal' | 'seasonal';

// Animation configuration for themes
export interface ThemeAnimations {
  // Cell Animations
  cellToggleDuration: number;     // Toggle animation duration (ms)
  cellToggleEasing: string;       // Animation easing function
  cellHoverScale: number;         // Scale on hover/press
  
  // Victory Animations
  victoryType: 'bounce' | 'pulse' | 'sparkle' | 'explode' | 'cascade';
  victoryDuration: number;
  victoryDelay: number;
  
  // Transition Effects
  themeTransitionDuration: number;
  staggerDelay: number;           // Delay between cell animations
  
  // Interactive Feedback
  hoverEffect: boolean;
  pressEffect: boolean;
  particleEffect: boolean;
}

// Sound integration for themes
export interface ThemeSounds {
  cellToggle: string;       // Cell toggle sound file
  victory: string;          // Victory sound file
  ambient?: string;         // Optional ambient background
  volumeModifier: number;   // Volume adjustment (0.0 - 1.0)
}

// Background system
export interface ThemeBackground {
  type: 'solid' | 'gradient' | 'pattern' | 'animated';
  source?: string;          // Image/pattern source
  colors?: string[];        // Gradient colors
  animation?: BackgroundAnimation;
}

export interface BackgroundAnimation {
  type: 'particles' | 'floating' | 'pulse' | 'wave';
  speed: number;
  intensity: number;
}

// Game-specific colors (extends Paper theme)
export interface GameColors {
  // Cell States
  cellOn: string;           // Active cell color
  cellOff: string;          // Inactive cell color  
  cellBorder: string;       // Cell border color
  cellShadow: string;       // Cell shadow color
  
  // Grid & Layout
  gridBackground: string;   // Grid container background
  gameBackground: string;   // Main game background
  panelBackground: string;  // Stats/UI panel background
  
  // Game-specific UI
  accent: string;           // Primary accent color
  textMuted: string;        // Muted text color
}

// Complete game theme configuration
export interface GameTheme {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  isDefault: boolean;
  category: ThemeCategory;
  
  // Paper theme integration
  paperTheme: MD3Theme;
  paperThemeLight?: MD3Theme;
  
  // Game-specific colors
  gameColors: GameColors;
  
  // Theme features
  animations: ThemeAnimations;
  sounds?: ThemeSounds;
  background?: ThemeBackground;
  
  // Special effects
  effects?: {
    particleEffect?: boolean;
    glowEffect?: boolean;
    scanlineEffect?: boolean;
    pulseEffect?: boolean;
  };
}

// Theme unlock requirements
export interface ThemeUnlockRequirement {
  level: number;
  achievements?: string[];
  always?: boolean;
}

// Theme store state
export interface ThemeState {
  currentTheme: string;
  availableThemes: GameTheme[];
  unlockedThemes: string[];
  isTransitioning: boolean;
  
  // Actions
  setTheme: (themeId: string) => void;
  unlockTheme: (themeId: string) => void;
  checkUnlockRequirements: (playerLevel: number, unlockedAchievements: string[]) => void;
}