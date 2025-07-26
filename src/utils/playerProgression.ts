import { PlayerProgression, XPReward, Difficulty, GameState } from '../types/game';

// XP Configuration
export const XP_CONFIG = {
  // Base XP for completing games by difficulty
  GAME_COMPLETION: {
    easy: 50,
    medium: 100,
    hard: 200,
  },
  
  // Bonus XP multipliers
  PERFECT_GAME_MULTIPLIER: 1.5, // Perfect game (minimum moves)
  STREAK_BONUS_PER_GAME: 10,    // Additional XP per consecutive win
  SPEED_BONUS_THRESHOLD: 30,    // Seconds - bonus for completing under this time
  SPEED_BONUS_XP: 25,
  
  // Achievement XP rewards
  ACHIEVEMENT_XP: {
    bronze: 100,
    silver: 250,
    gold: 500,
    platinum: 1000,
  },
  
  // Level calculation constants
  LEVEL_BASE_XP: 1000,          // XP required for level 2
  LEVEL_GROWTH_RATE: 1.5,       // Exponential growth factor
  MAX_LEVEL: 50,                // Cap to prevent infinite progression
};

/**
 * Calculate the total XP required to reach a specific level
 */
export const getXPRequiredForLevel = (level: number): number => {
  if (level <= 1) return 0;
  if (level > XP_CONFIG.MAX_LEVEL) return Infinity;
  
  // Exponential growth: XP = BASE_XP * (GROWTH_RATE ^ (level - 2))
  return Math.floor(
    XP_CONFIG.LEVEL_BASE_XP * Math.pow(XP_CONFIG.LEVEL_GROWTH_RATE, level - 2)
  );
};

/**
 * Calculate the cumulative XP required to reach a specific level
 */
export const getTotalXPForLevel = (level: number): number => {
  let totalXP = 0;
  for (let i = 1; i <= level; i++) {
    totalXP += getXPRequiredForLevel(i);
  }
  return totalXP;
};

/**
 * Calculate the current level and progress from total XP
 */
export const calculateLevelFromXP = (totalXP: number): PlayerProgression => {
  let currentLevel = 1;
  let xpUsed = 0;
  
  // Find the highest level achievable with current XP
  while (currentLevel <= XP_CONFIG.MAX_LEVEL) {
    const xpForNextLevel = getXPRequiredForLevel(currentLevel + 1);
    if (xpUsed + xpForNextLevel > totalXP) {
      break;
    }
    xpUsed += xpForNextLevel;
    currentLevel++;
  }
  
  const currentXP = totalXP - xpUsed;
  const xpToNextLevel = currentLevel >= XP_CONFIG.MAX_LEVEL 
    ? 0 
    : getXPRequiredForLevel(currentLevel + 1) - currentXP;
  
  return {
    currentXP,
    currentLevel,
    totalXP,
    xpToNextLevel,
    lastUpdated: Date.now(),
  };
};

/**
 * Calculate XP reward for completing a game
 */
export const calculateGameCompletionXP = (
  gameState: GameState,
  isPerfectGame: boolean,
  currentStreak: number,
  completionTimeSeconds: number
): XPReward[] => {
  const rewards: XPReward[] = [];
  
  // Base completion XP
  const baseXP = XP_CONFIG.GAME_COMPLETION[gameState.difficulty];
  rewards.push({
    source: 'game_completion',
    amount: baseXP,
    description: `Completed ${gameState.difficulty} ${gameState.gridSize}×${gameState.gridSize} puzzle`,
    timestamp: Date.now(),
  });
  
  // Perfect game bonus (minimum moves)
  if (isPerfectGame) {
    const bonusXP = Math.floor(baseXP * (XP_CONFIG.PERFECT_GAME_MULTIPLIER - 1));
    rewards.push({
      source: 'perfect_game',
      amount: bonusXP,
      description: 'Perfect game - minimum moves!',
      timestamp: Date.now(),
    });
  }
  
  // Streak bonus
  if (currentStreak > 1) {
    const streakXP = (currentStreak - 1) * XP_CONFIG.STREAK_BONUS_PER_GAME;
    rewards.push({
      source: 'streak_bonus',
      amount: streakXP,
      description: `${currentStreak} game win streak!`,
      timestamp: Date.now(),
    });
  }
  
  // Speed bonus
  if (completionTimeSeconds <= XP_CONFIG.SPEED_BONUS_THRESHOLD) {
    rewards.push({
      source: 'difficulty_bonus',
      amount: XP_CONFIG.SPEED_BONUS_XP,
      description: `Speed demon - under ${XP_CONFIG.SPEED_BONUS_THRESHOLD}s!`,
      timestamp: Date.now(),
    });
  }
  
  return rewards;
};

/**
 * Calculate XP reward for unlocking an achievement
 */
export const calculateAchievementXP = (
  achievementId: string,
  achievementTier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze'
): XPReward => {
  return {
    source: 'achievement',
    amount: XP_CONFIG.ACHIEVEMENT_XP[achievementTier],
    description: `Achievement unlocked: ${achievementId}`,
    timestamp: Date.now(),
  };
};

/**
 * Apply XP rewards and calculate new progression
 */
export const applyXPRewards = (
  currentProgression: PlayerProgression,
  rewards: XPReward[]
): { 
  newProgression: PlayerProgression; 
  leveledUp: boolean; 
  levelsGained: number;
} => {
  const totalNewXP = rewards.reduce((sum, reward) => sum + reward.amount, 0);
  const newTotalXP = currentProgression.totalXP + totalNewXP;
  
  const oldLevel = currentProgression.currentLevel;
  const newProgression = calculateLevelFromXP(newTotalXP);
  
  const levelsGained = newProgression.currentLevel - oldLevel;
  const leveledUp = levelsGained > 0;
  
  return {
    newProgression,
    leveledUp,
    levelsGained,
  };
};

/**
 * Check if a player can unlock a specific theme based on level
 */
export const canUnlockTheme = (
  playerLevel: number,
  themeUnlockLevel: number,
  requiredAchievements: string[] = [],
  unlockedAchievements: string[] = []
): boolean => {
  // Check level requirement
  if (playerLevel < themeUnlockLevel) {
    return false;
  }
  
  // Check achievement requirements
  if (requiredAchievements.length > 0) {
    const hasAllAchievements = requiredAchievements.every(
      achievement => unlockedAchievements.includes(achievement)
    );
    if (!hasAllAchievements) {
      return false;
    }
  }
  
  return true;
};

/**
 * Get the next milestone level for progression display
 */
export const getNextMilestone = (currentLevel: number): number => {
  const milestones = [5, 10, 15, 20, 25, 30, 40, 50];
  return milestones.find(milestone => milestone > currentLevel) || XP_CONFIG.MAX_LEVEL;
};

/**
 * Initialize default player progression
 */
export const createDefaultProgression = (): PlayerProgression => {
  return calculateLevelFromXP(0);
};