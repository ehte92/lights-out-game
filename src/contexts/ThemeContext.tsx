import React, { createContext, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme as usePaperTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useThemeStore, useCurrentTheme } from '../stores/themeStore';
import type { GameTheme } from '../themes/types';

interface ThemeContextValue {
  // Current theme data
  currentTheme: GameTheme;
  paperTheme: MD3Theme;
  
  // Theme actions
  setTheme: (themeId: string) => void;
  isThemeUnlocked: (themeId: string) => boolean;
  unlockTheme: (themeId: string) => void;
  
  // Theme state
  isTransitioning: boolean;
  availableThemes: GameTheme[];
  unlockedThemes: string[];
  
  // Convenience getters
  colors: GameTheme['gameColors'];
  animations: GameTheme['animations'];
  effects: GameTheme['effects'];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useGameTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useGameTheme must be used within a GameThemeProvider');
  }
  return context;
};

interface GameThemeProviderProps {
  children: React.ReactNode;
}

export const GameThemeProvider: React.FC<GameThemeProviderProps> = ({ children }) => {
  const paperTheme = usePaperTheme();
  const currentTheme = useCurrentTheme();
  
  const {
    setTheme,
    unlockTheme,
    isThemeUnlocked,
    isTransitioning,
    availableThemes,
    unlockedThemes,
    checkUnlockRequirements,
  } = useThemeStore();

  // Check for theme unlocks when component mounts
  // In a real app, this would be connected to game stats/achievements
  useEffect(() => {
    // Mock player data - in real app, get from game store
    const mockPlayerLevel = 15;
    const mockAchievements = ['first_medium', 'streak_5'];
    checkUnlockRequirements(mockPlayerLevel, mockAchievements);
  }, [checkUnlockRequirements]);

  const contextValue: ThemeContextValue = {
    // Current theme data
    currentTheme,
    paperTheme,
    
    // Theme actions
    setTheme,
    isThemeUnlocked,
    unlockTheme,
    
    // Theme state
    isTransitioning,
    availableThemes,
    unlockedThemes,
    
    // Convenience getters
    colors: currentTheme.gameColors,
    animations: currentTheme.animations,
    effects: currentTheme.effects || {},
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StatusBar 
        style={currentTheme.paperTheme.dark ? 'light' : 'dark'}
        backgroundColor={currentTheme.gameColors.gameBackground}
      />
      {children}
    </ThemeContext.Provider>
  );
};

// Additional hooks for specific theme aspects
export const useThemeColors = () => {
  const { colors } = useGameTheme();
  return colors;
};

export const useThemeAnimations = () => {
  const { animations } = useGameTheme();
  return animations;
};

export const useThemeEffects = () => {
  const { effects } = useGameTheme();
  return effects;
};