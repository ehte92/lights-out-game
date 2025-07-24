import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import type { GameTheme, ThemeAnimations, GameColors } from './types';

// Standard animation configurations
const standardAnimations: ThemeAnimations = {
  cellToggleDuration: 300,
  cellToggleEasing: 'ease-out',
  cellHoverScale: 1.05,
  victoryType: 'bounce',
  victoryDuration: 600,
  victoryDelay: 100,
  themeTransitionDuration: 500,
  staggerDelay: 50,
  hoverEffect: true,
  pressEffect: true,
  particleEffect: false,
};

const quickAnimations: ThemeAnimations = {
  ...standardAnimations,
  cellToggleDuration: 150,
  victoryType: 'pulse',
  victoryDuration: 300,
};

const dramaticAnimations: ThemeAnimations = {
  ...standardAnimations,
  cellToggleDuration: 400,
  victoryType: 'cascade',
  victoryDuration: 1000,
  victoryDelay: 150,
  particleEffect: true,
};

// Helper to create Paper theme with game colors
const createPaperTheme = (
  baseTheme: MD3Theme,
  primary: string,
  secondary: string,
  surface: string,
  background: string,
  onSurface: string,
  onBackground: string
): MD3Theme => ({
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    primary,
    secondary,
    surface,
    background,
    onSurface,
    onBackground,
    primaryContainer: primary + '20',
    secondaryContainer: secondary + '20',
    surfaceVariant: surface,
    outline: surface + '80',
    outlineVariant: surface + '40',
  }
});

// 1. Classic Lights Theme (Default)
const classicGameColors: GameColors = {
  cellOn: '#fbbf24',        // Warm amber
  cellOff: '#374151',       // Cool gray
  cellBorder: '#d1d5db',    // Light gray border
  cellShadow: '#1f2937',    // Dark shadow
  gridBackground: 'rgba(0, 0, 0, 0.1)',
  gameBackground: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
  panelBackground: 'rgba(0, 0, 0, 0.8)',
  accent: '#fbbf24', 
  textMuted: '#6b7280',
};

const classicPaperTheme = createPaperTheme(
  MD3DarkTheme,
  '#fbbf24',    // primary (amber)
  '#60a5fa',    // secondary (blue)
  '#1e293b',    // surface
  '#0f172a',    // background
  '#ffffff',    // onSurface
  '#ffffff'     // onBackground
);

export const classicTheme: GameTheme = {
  id: 'classic',
  name: 'Classic Lights',
  description: 'Modern interpretation of traditional lights with warm, inviting colors',
  unlockLevel: 1,
  isDefault: true,
  category: 'classic',
  paperTheme: classicPaperTheme,
  gameColors: classicGameColors,
  animations: standardAnimations,
  sounds: {
    cellToggle: 'cell_toggle_classic.mp3',
    victory: 'victory_classic.mp3',
    volumeModifier: 1.0,
  },
  effects: {
    glowEffect: true,
    particleEffect: false,
  },
};

// 2. Neon Circuit Board Theme
const neonGameColors: GameColors = {
  cellOn: '#00f5ff',        // Electric cyan
  cellOff: '#1a1a2e',       // Deep blue-black
  cellBorder: '#0066cc',    // Electric blue border
  cellShadow: '#001122',    // Very dark blue
  gridBackground: '#16213e',
  gameBackground: 'radial-gradient(circle, #0f0f23, #16213e, #1a1a2e)',
  panelBackground: 'rgba(0, 20, 40, 0.9)',
  accent: '#00f5ff',
  textMuted: '#475569',
};

const neonPaperTheme = createPaperTheme(
  MD3DarkTheme,
  '#00f5ff',    // primary (cyan)
  '#9d4edd',    // secondary (purple)
  '#16213e',    // surface
  '#0f0f23',    // background
  '#00f5ff',    // onSurface
  '#00f5ff'     // onBackground
);

export const neonTheme: GameTheme = {
  id: 'neon',
  name: 'Neon Circuit Board',
  description: 'Cyberpunk aesthetic with electric blues and digital effects',
  unlockLevel: 6,
  isDefault: false,
  category: 'futuristic',
  paperTheme: neonPaperTheme,
  gameColors: neonGameColors,
  animations: quickAnimations,
  sounds: {
    cellToggle: 'cell_toggle_electric.mp3',
    victory: 'victory_digital.mp3',
    volumeModifier: 0.8,
  },
  background: {
    type: 'pattern',
    source: 'circuit_pattern.png',
  },
  effects: {
    glowEffect: true,
    scanlineEffect: true,
    particleEffect: true,
  },
};

// 3. Nature Garden Theme  
const natureGameColors: GameColors = {
  cellOn: '#22c55e',        // Vibrant green (bloomed)
  cellOff: '#78716c',       // Earth brown (dormant)
  cellBorder: '#a3a3a3',    // Natural gray
  cellShadow: '#44403c',    // Rich earth shadow
  gridBackground: '#f3f4f6',
  gameBackground: 'linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0)',
  panelBackground: 'rgba(34, 197, 94, 0.1)',
  accent: '#22c55e',
  textMuted: '#6b7280',
};

const naturePaperTheme = createPaperTheme(
  MD3LightTheme,
  '#22c55e',    // primary (green)
  '#f59e0b',    // secondary (amber)
  '#f3f4f6',    // surface
  '#ecfdf5',    // background
  '#1f2937',    // onSurface
  '#1f2937'     // onBackground
);

export const natureTheme: GameTheme = {
  id: 'nature',
  name: 'Nature Garden',
  description: 'Organic garden theme with blooming flowers and earth tones',
  unlockLevel: 10,
  isDefault: false,
  category: 'nature',
  paperTheme: naturePaperTheme,
  gameColors: natureGameColors,
  animations: {
    ...standardAnimations,
    victoryType: 'cascade',
    cellToggleDuration: 400,
    particleEffect: true,
  },
  sounds: {
    cellToggle: 'cell_toggle_nature.mp3',
    victory: 'victory_nature.mp3',
    ambient: 'ambient_garden.mp3',
    volumeModifier: 0.9,
  },
  background: {
    type: 'animated',
    animation: {
      type: 'floating',
      speed: 0.3,
      intensity: 0.5,
    },
  },
  effects: {
    particleEffect: true,
    glowEffect: false,
  },
};

// 4. Space Station Theme
const spaceGameColors: GameColors = {
  cellOn: '#3b82f6',        // Space blue (active system)
  cellOff: '#64748b',       // Metallic gray (inactive)
  cellBorder: '#94a3b8',    // Light metallic
  cellShadow: '#1e293b',    // Deep space shadow
  gridBackground: '#0f172a',
  gameBackground: 'radial-gradient(ellipse, #1e293b, #0f172a, #020617)',
  panelBackground: 'rgba(15, 23, 42, 0.9)',
  accent: '#3b82f6',
  textMuted: '#64748b',
};

const spacePaperTheme = createPaperTheme(
  MD3DarkTheme,
  '#3b82f6',    // primary (blue)
  '#8b5cf6',    // secondary (purple)
  '#0f172a',    // surface
  '#020617',    // background
  '#f1f5f9',    // onSurface
  '#f1f5f9'     // onBackground
);

export const spaceTheme: GameTheme = {
  id: 'space',
  name: 'Space Station',
  description: 'Sci-fi control panel interface with holographic effects',
  unlockLevel: 15,
  isDefault: false,
  category: 'futuristic',
  paperTheme: spacePaperTheme,
  gameColors: spaceGameColors,
  animations: dramaticAnimations,
  sounds: {
    cellToggle: 'cell_toggle_tech.mp3',
    victory: 'victory_space.mp3',
    ambient: 'ambient_space.mp3',
    volumeModifier: 0.7,
  },
  background: {
    type: 'animated',
    animation: {
      type: 'particles',
      speed: 0.1,
      intensity: 0.3,
    },
  },
  effects: {
    glowEffect: true,
    pulseEffect: true,
    particleEffect: true,
  },
};

// 5. Retro Arcade Theme
const retroGameColors: GameColors = {
  cellOn: '#ffff00',        // Classic arcade yellow
  cellOff: '#ff00ff',       // Magenta for contrast
  cellBorder: '#ffffff',    // Pure white borders
  cellShadow: '#000000',    // Pure black shadow
  gridBackground: '#000080',
  gameBackground: '#000000',
  panelBackground: '#000080',
  accent: '#ffff00',
  textMuted: '#808080',
};

const retroPaperTheme = createPaperTheme(
  MD3DarkTheme,
  '#ffff00',    // primary (yellow)
  '#00ffff',    // secondary (cyan)
  '#000080',    // surface
  '#000000',    // background
  '#ffffff',    // onSurface
  '#ffffff'     // onBackground
);

export const retroTheme: GameTheme = {
  id: 'retro',
  name: 'Retro Arcade',
  description: '8-bit pixel art aesthetic with classic arcade colors',
  unlockLevel: 20,
  isDefault: false,
  category: 'retro',
  paperTheme: retroPaperTheme,
  gameColors: retroGameColors,
  animations: {
    ...quickAnimations,
    cellToggleDuration: 100,
    victoryType: 'pulse',
    hoverEffect: false,
    particleEffect: false,
  },
  sounds: {
    cellToggle: 'cell_toggle_8bit.mp3',
    victory: 'victory_arcade.mp3',
    volumeModifier: 1.2,
  },
  effects: {
    scanlineEffect: true,
    glowEffect: false,
    particleEffect: false,
  },
};

// 6. Minimalist Theme
const minimalGameColors: GameColors = {
  cellOn: '#000000',        // Pure black
  cellOff: '#ffffff',       // Pure white
  cellBorder: '#e5e5e5',    // Subtle gray border
  cellShadow: '#00000010',  // Minimal shadow
  gridBackground: '#fafafa',
  gameBackground: '#ffffff',
  panelBackground: '#f9f9f9',
  accent: '#000000',
  textMuted: '#999999',
};

const minimalPaperTheme = createPaperTheme(
  MD3LightTheme,
  '#000000',    // primary (black)
  '#666666',    // secondary (gray)
  '#fafafa',    // surface
  '#ffffff',    // background
  '#000000',    // onSurface
  '#000000'     // onBackground
);

export const minimalTheme: GameTheme = {
  id: 'minimal',
  name: 'Minimalist',
  description: 'Clean, geometric design focused on pure gameplay',
  unlockLevel: 25,
  isDefault: false,
  category: 'minimal',
  paperTheme: minimalPaperTheme,
  gameColors: minimalGameColors,
  animations: {
    ...standardAnimations,
    cellToggleDuration: 200,
    victoryType: 'pulse',
    particleEffect: false,
  },
  sounds: {
    cellToggle: 'cell_toggle_minimal.mp3',
    victory: 'victory_minimal.mp3',
    volumeModifier: 0.6,
  },
  effects: {
    glowEffect: false,
    particleEffect: false,
  },
};

// Export all themes
export const ALL_THEMES: GameTheme[] = [
  classicTheme,
  neonTheme,
  natureTheme,
  spaceTheme,
  retroTheme,
  minimalTheme,
];

// Theme lookup map
export const THEMES_BY_ID = ALL_THEMES.reduce((acc, theme) => {
  acc[theme.id] = theme;
  return acc;
}, {} as Record<string, GameTheme>);

// Theme unlock requirements
export const THEME_UNLOCK_REQUIREMENTS = {
  'classic': { level: 1, always: true },
  'neon': { level: 6, achievements: ['first_medium'] },
  'nature': { level: 10, achievements: ['streak_5'] },
  'space': { level: 15, achievements: ['speed_demon'] },
  'retro': { level: 20, achievements: ['dedicated'] },
  'minimal': { level: 25, achievements: ['perfectionist'] },
};