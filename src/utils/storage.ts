import { GameStats, GameSettings, Achievement, PlayerProgression, XPReward } from '../types/game';
import { storage } from './storageAdapter';
import { createDefaultProgression } from './playerProgression';

// Storage keys
const STORAGE_KEYS = {
  GAME_STATS: 'game_stats',
  SETTINGS: 'settings',
  ACHIEVEMENTS: 'achievements',
  PLAYER_PROGRESSION: 'player_progression',
  XP_HISTORY: 'xp_history',
  DAILY_PUZZLE_COMPLETED: 'daily_puzzle_completed',
  LAST_PLAYED: 'last_played',
} as const;

// Default values
const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  gamesWon: 0,
  bestTimes: {
    easy: Infinity,
    medium: Infinity,
    hard: Infinity,
  },
  bestMoves: {
    easy: Infinity,
    medium: Infinity,
    hard: Infinity,
  },
  currentStreak: 0,
  longestStreak: 0,
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'auto',
  gridSize: 4,
  difficulty: 'medium',
};

// Game Stats functions
export const getGameStats = async (): Promise<GameStats> => {
  try {
    const statsString = await storage.getString(STORAGE_KEYS.GAME_STATS);
    return statsString ? JSON.parse(statsString) : DEFAULT_STATS;
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting game stats:', error);
    }
    return DEFAULT_STATS;
  }
};

export const saveGameStats = async (stats: GameStats): Promise<void> => {
  try {
    await storage.set(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving game stats:', error);
    }
  }
};

export const updateGameStats = async (
  isWin: boolean,
  moves: number,
  timeInSeconds: number,
  difficulty: GameStats['bestTimes'][keyof GameStats['bestTimes']] extends number ? keyof GameStats['bestTimes'] : never
): Promise<void> => {
  const stats = await getGameStats();
  
  stats.totalGames += 1;
  
  if (isWin) {
    stats.gamesWon += 1;
    stats.currentStreak += 1;
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
    
    // Update best times and moves
    if (timeInSeconds < stats.bestTimes[difficulty]) {
      stats.bestTimes[difficulty] = timeInSeconds;
    }
    
    if (moves < stats.bestMoves[difficulty]) {
      stats.bestMoves[difficulty] = moves;
    }
  } else {
    stats.currentStreak = 0;
  }
  
  await saveGameStats(stats);
};

// Settings functions
export const getSettings = async (): Promise<GameSettings> => {
  try {
    const settingsString = await storage.getString(STORAGE_KEYS.SETTINGS);
    return settingsString ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsString) } : DEFAULT_SETTINGS;
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting settings:', error);
    }
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: Partial<GameSettings>): Promise<void> => {
  try {
    const currentSettings = await getSettings();
    const newSettings = { ...currentSettings, ...settings };
    await storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving settings:', error);
    }
  }
};

// Achievements functions
export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const achievementsString = await storage.getString(STORAGE_KEYS.ACHIEVEMENTS);
    return achievementsString ? JSON.parse(achievementsString) : [];
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting achievements:', error);
    }
    return [];
  }
};

export const saveAchievements = async (achievements: Achievement[]): Promise<void> => {
  try {
    await storage.set(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving achievements:', error);
    }
  }
};

export const unlockAchievement = async (achievementId: string): Promise<boolean> => {
  try {
    // Get current achievements and ensure they're properly initialized
    let achievements = await getAchievements();
    
    // If no achievements exist, initialize them first
    if (achievements.length === 0) {
      const { initializeAchievements } = await import('./achievements');
      achievements = await initializeAchievements();
    }
    
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!achievement) {
      if (__DEV__) {
        console.warn('🏆 Achievement not found:', achievementId);
      }
      return false;
    }
    
    if (achievement.unlocked) {
      if (__DEV__) {
        console.log('🏆 Achievement already unlocked:', achievementId);
      }
      return false; // Already unlocked
    }
    
    // Unlock the achievement
    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    await saveAchievements(achievements);
    
    if (__DEV__) {
      console.log('🏆 Achievement successfully unlocked:', achievementId, achievement.title);
    }
    
    return true; // Achievement was just unlocked
  } catch (error) {
    if (__DEV__) {
      console.error('🏆 Error unlocking achievement:', achievementId, error);
    }
    return false;
  }
};

// Player Progression functions
export const getPlayerProgression = async (): Promise<PlayerProgression> => {
  try {
    const progressionString = await storage.getString(STORAGE_KEYS.PLAYER_PROGRESSION);
    return progressionString ? JSON.parse(progressionString) : createDefaultProgression();
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting player progression:', error);
    }
    return createDefaultProgression();
  }
};

export const savePlayerProgression = async (progression: PlayerProgression): Promise<void> => {
  try {
    await storage.set(STORAGE_KEYS.PLAYER_PROGRESSION, JSON.stringify(progression));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving player progression:', error);
    }
  }
};

export const addXPRewards = async (rewards: XPReward[]): Promise<PlayerProgression> => {
  try {
    const currentProgression = await getPlayerProgression();
    const totalNewXP = rewards.reduce((sum, reward) => sum + reward.amount, 0);
    
    const newProgression: PlayerProgression = {
      ...currentProgression,
      totalXP: currentProgression.totalXP + totalNewXP,
      lastUpdated: Date.now(),
    };
    
    // Recalculate level and XP to next level
    const { calculateLevelFromXP } = await import('./playerProgression');
    const calculatedProgression = calculateLevelFromXP(newProgression.totalXP);
    
    await savePlayerProgression(calculatedProgression);
    
    // Save XP history
    await saveXPHistory(rewards);
    
    return calculatedProgression;
  } catch (error) {
    if (__DEV__) {
      console.error('Error adding XP rewards:', error);
    }
    return await getPlayerProgression();
  }
};

// XP History functions (for tracking recent rewards)
export const getXPHistory = async (): Promise<XPReward[]> => {
  try {
    const historyString = await storage.getString(STORAGE_KEYS.XP_HISTORY);
    const history = historyString ? JSON.parse(historyString) : [];
    
    // Keep only last 50 rewards and rewards from last 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return history
      .filter((reward: XPReward) => reward.timestamp > sevenDaysAgo)
      .slice(-50);
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting XP history:', error);
    }
    return [];
  }
};

export const saveXPHistory = async (newRewards: XPReward[]): Promise<void> => {
  try {
    const currentHistory = await getXPHistory();
    const updatedHistory = [...currentHistory, ...newRewards];
    
    // Keep only last 50 rewards
    const trimmedHistory = updatedHistory.slice(-50);
    
    await storage.set(STORAGE_KEYS.XP_HISTORY, JSON.stringify(trimmedHistory));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving XP history:', error);
    }
  }
};

// Daily puzzle functions
export const isDailyPuzzleCompleted = async (date: string): Promise<boolean> => {
  try {
    return await storage.getBoolean(`${STORAGE_KEYS.DAILY_PUZZLE_COMPLETED}_${date}`) || false;
  } catch (error) {
    if (__DEV__) {
      console.error('Error checking daily puzzle completion:', error);
    }
    return false;
  }
};

export const markDailyPuzzleCompleted = async (date: string): Promise<void> => {
  try {
    await storage.set(`${STORAGE_KEYS.DAILY_PUZZLE_COMPLETED}_${date}`, true);
  } catch (error) {
    if (__DEV__) {
      console.error('Error marking daily puzzle completed:', error);
    }
  }
};

// Last played functions
export const getLastPlayed = async (): Promise<number> => {
  try {
    return await storage.getNumber(STORAGE_KEYS.LAST_PLAYED) || 0;
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting last played time:', error);
    }
    return 0;
  }
};

export const updateLastPlayed = async (): Promise<void> => {
  try {
    await storage.set(STORAGE_KEYS.LAST_PLAYED, Date.now());
  } catch (error) {
    if (__DEV__) {
      console.error('Error updating last played time:', error);
    }
  }
};

// Clear all data (for debugging or reset)
export const clearAllData = async (): Promise<void> => {
  try {
    if (storage.clearAll) {
      await storage.clearAll();
    }
  } catch (error) {
    if (__DEV__) {
      console.error('Error clearing all data:', error);
    }
  }
};