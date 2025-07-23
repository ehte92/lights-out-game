import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameStats, GameSettings, Achievement } from '../types/game';
import { DEFAULT_ACHIEVEMENTS } from './achievements';

// Simple AsyncStorage wrapper as fallback
// This provides the same interface as our MMKV storage but uses AsyncStorage

// Storage keys
const STORAGE_KEYS = {
  GAME_STATS: 'game_stats',
  SETTINGS: 'settings',
  ACHIEVEMENTS: 'achievements',
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
    const statsString = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATS);
    return statsString ? JSON.parse(statsString) : DEFAULT_STATS;
  } catch (error) {
    console.error('Error getting game stats:', error);
    return DEFAULT_STATS;
  }
};

export const saveGameStats = async (stats: GameStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving game stats:', error);
  }
};

export const updateGameStats = async (
  isWin: boolean,
  moves: number,
  timeInSeconds: number,
  difficulty: keyof GameStats['bestTimes']
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
    const settingsString = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsString ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsString) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: Partial<GameSettings>): Promise<void> => {
  try {
    const currentSettings = await getSettings();
    const newSettings = { ...currentSettings, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Achievements functions
export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const achievementsString = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (achievementsString) {
      return JSON.parse(achievementsString);
    } else {
      // Initialize with default achievements if none exist
      await saveAchievements(DEFAULT_ACHIEVEMENTS);
      return DEFAULT_ACHIEVEMENTS;
    }
  } catch (error) {
    console.error('Error getting achievements:', error);
    return DEFAULT_ACHIEVEMENTS;
  }
};

export const saveAchievements = async (achievements: Achievement[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
};

export const unlockAchievement = async (achievementId: string): Promise<boolean> => {
  const achievements = await getAchievements();
  const achievement = achievements.find(a => a.id === achievementId);
  
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    await saveAchievements(achievements);
    return true; // Achievement was just unlocked
  }
  
  return false; // Achievement was already unlocked or doesn't exist
};

// Daily puzzle functions
export const isDailyPuzzleCompleted = async (date: string): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(`${STORAGE_KEYS.DAILY_PUZZLE_COMPLETED}_${date}`);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking daily puzzle completion:', error);
    return false;
  }
};

export const markDailyPuzzleCompleted = async (date: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(`${STORAGE_KEYS.DAILY_PUZZLE_COMPLETED}_${date}`, 'true');
  } catch (error) {
    console.error('Error marking daily puzzle completed:', error);
  }
};

// Last played functions
export const getLastPlayed = async (): Promise<number> => {
  try {
    const lastPlayed = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
    return lastPlayed ? parseInt(lastPlayed, 10) : 0;
  } catch (error) {
    console.error('Error getting last played time:', error);
    return 0;
  }
};

export const updateLastPlayed = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_PLAYED, Date.now().toString());
  } catch (error) {
    console.error('Error updating last played time:', error);
  }
};

// Clear all data (for debugging or reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};