import React, { createContext, useContext, useEffect } from 'react';
import { useThemeStore, useCurrentTheme } from '../stores/themeStore';
import type { GameTheme } from '../themes/types';

interface GameThemeContextValue {
  // Current game theme data
  currentTheme: GameTheme;
  
  // Theme actions
  setTheme: (themeId: string) => void;
  isThemeUnlocked: (themeId: string) => boolean;
  unlockTheme: (themeId: string) => void;
  
  // Theme state
  isTransitioning: boolean;
  availableThemes: GameTheme[];
  unlockedThemes: string[];
  
  // Game-specific getters (only affects game screen)
  gameColors: GameTheme['gameColors'];
  animations: GameTheme['animations'];
  effects: GameTheme['effects'];
}

const GameThemeContext = createContext<GameThemeContextValue | null>(null);

export const useGameTheme = () => {
  const context = useContext(GameThemeContext);
  if (!context) {
    throw new Error('useGameTheme must be used within a GameThemeProvider');
  }
  return context;
};

interface GameThemeProviderProps {
  children: React.ReactNode;
}

export const GameThemeProvider: React.FC<GameThemeProviderProps> = ({ children }) => {
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

  // Check for theme unlocks when component mounts using real player progression
  useEffect(() => {
    const loadPlayerProgressionAndCheckUnlocks = async () => {
      try {
        const { getPlayerProgression } = await import('../utils/storage');
        const { getAchievements } = await import('../utils/storage');
        
        const progression = await getPlayerProgression();
        const achievements = await getAchievements();
        
        const unlockedAchievementIds = achievements
          .filter(achievement => achievement.unlocked)
          .map(achievement => achievement.id);
        
        checkUnlockRequirements(progression.currentLevel, unlockedAchievementIds);
        
        if (__DEV__) {
          console.log('🎨 Theme unlock check:', {
            playerLevel: progression.currentLevel,
            totalXP: progression.totalXP,
            unlockedAchievements: unlockedAchievementIds,
          });
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Error loading player progression for theme unlocks:', error);
        }
        // Fallback to default unlocks if there's an error
        checkUnlockRequirements(1, []);
      }
    };
    
    loadPlayerProgressionAndCheckUnlocks();
  }, [checkUnlockRequirements]);

  const contextValue: GameThemeContextValue = {
    // Current game theme data
    currentTheme,
    
    // Theme actions
    setTheme,
    isThemeUnlocked,
    unlockTheme,
    
    // Theme state
    isTransitioning,
    availableThemes,
    unlockedThemes,
    
    // Game-specific getters (only affects game screen)
    gameColors: currentTheme.gameColors,
    animations: currentTheme.animations,
    effects: currentTheme.effects || {},
  };

  return (
    <GameThemeContext.Provider value={contextValue}>
      {children}
    </GameThemeContext.Provider>
  );
};

// Additional hooks for specific game theme aspects
export const useGameColors = () => {
  const { gameColors } = useGameTheme();
  return gameColors;
};

export const useGameAnimations = () => {
  const { animations } = useGameTheme();
  return animations;
};

export const useGameEffects = () => {
  const { effects } = useGameTheme();
  return effects;
};