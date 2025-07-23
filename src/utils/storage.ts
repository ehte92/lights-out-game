import { MMKV } from 'react-native-mmkv';
import { GameStats, GameSettings, Achievement } from '../types/game';

// Generate a secure encryption key
const generateEncryptionKey = (): string => {
  // Use a combination of timestamp and random values for uniqueness
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const packageId = 'lights-out-puzzle-game'; // From app.json slug
  return `${packageId}-${timestamp}-${random}`;
};

// Get or create encryption key
const getEncryptionKey = (): string => {
  const keyStorage = new MMKV({ id: 'encryption-key-store' });
  let key = keyStorage.getString('encryption_key');
  
  if (!key) {
    key = generateEncryptionKey();
    keyStorage.set('encryption_key', key);
  }
  
  return key;
};

// Initialize MMKV storage instance with secure encryption key
export const storage = new MMKV({
  id: 'lights-out-game',
  encryptionKey: getEncryptionKey(),
});

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
export const getGameStats = (): GameStats => {
  try {
    const statsString = storage.getString(STORAGE_KEYS.GAME_STATS);
    return statsString ? JSON.parse(statsString) : DEFAULT_STATS;
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting game stats:', error);
    }
    return DEFAULT_STATS;
  }
};

export const saveGameStats = (stats: GameStats): void => {
  try {
    storage.set(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving game stats:', error);
    }
  }
};

export const updateGameStats = (
  isWin: boolean,
  moves: number,
  timeInSeconds: number,
  difficulty: GameStats['bestTimes'][keyof GameStats['bestTimes']] extends number ? keyof GameStats['bestTimes'] : never
): void => {
  const stats = getGameStats();
  
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
  
  saveGameStats(stats);
};

// Settings functions
export const getSettings = (): GameSettings => {
  try {
    const settingsString = storage.getString(STORAGE_KEYS.SETTINGS);
    return settingsString ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsString) } : DEFAULT_SETTINGS;
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting settings:', error);
    }
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Partial<GameSettings>): void => {
  try {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settings };
    storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving settings:', error);
    }
  }
};

// Achievements functions
export const getAchievements = (): Achievement[] => {
  try {
    const achievementsString = storage.getString(STORAGE_KEYS.ACHIEVEMENTS);
    return achievementsString ? JSON.parse(achievementsString) : [];
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting achievements:', error);
    }
    return [];
  }
};

export const saveAchievements = (achievements: Achievement[]): void => {
  try {
    storage.set(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving achievements:', error);
    }
  }
};

export const unlockAchievement = (achievementId: string): boolean => {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === achievementId);
  
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    saveAchievements(achievements);
    return true; // Achievement was just unlocked
  }
  
  return false; // Achievement was already unlocked or doesn't exist
};

// Daily puzzle functions
export const isDailyPuzzleCompleted = (date: string): boolean => {
  try {
    return storage.getBoolean(`${STORAGE_KEYS.DAILY_PUZZLE_COMPLETED}_${date}`) || false;
  } catch (error) {
    if (__DEV__) {
      console.error('Error checking daily puzzle completion:', error);
    }
    return false;
  }
};

export const markDailyPuzzleCompleted = (date: string): void => {
  try {
    storage.set(`${STORAGE_KEYS.DAILY_PUZZLE_COMPLETED}_${date}`, true);
  } catch (error) {
    if (__DEV__) {
      console.error('Error marking daily puzzle completed:', error);
    }
  }
};

// Last played functions
export const getLastPlayed = (): number => {
  try {
    return storage.getNumber(STORAGE_KEYS.LAST_PLAYED) || 0;
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting last played time:', error);
    }
    return 0;
  }
};

export const updateLastPlayed = (): void => {
  try {
    storage.set(STORAGE_KEYS.LAST_PLAYED, Date.now());
  } catch (error) {
    if (__DEV__) {
      console.error('Error updating last played time:', error);
    }
  }
};

// Clear all data (for debugging or reset)
export const clearAllData = (): void => {
  try {
    storage.clearAll();
  } catch (error) {
    if (__DEV__) {
      console.error('Error clearing all data:', error);
    }
  }
};