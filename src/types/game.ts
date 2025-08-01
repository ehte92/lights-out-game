export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameState = {
  grid: boolean[][];
  originalGrid: boolean[][]; // Store the original puzzle configuration for true reset
  moves: number;
  isComplete: boolean;
  difficulty: Difficulty;
  elapsedTime: number;
  lastResumeTime?: number;
  endTime?: number;
  gridSize: number;
};

export type GameStats = {
  totalGames: number;
  gamesWon: number;
  bestTimes: Record<Difficulty, number>;
  bestMoves: Record<Difficulty, number>;
  currentStreak: number;
  longestStreak: number;
};

export type Position = {
  row: number;
  col: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
};

export type GameSettings = {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  gridSize: number;
  difficulty: Difficulty;
};

export type PlayerProgression = {
  currentXP: number;
  currentLevel: number;
  totalXP: number;
  xpToNextLevel: number;
  lastUpdated: number;
};

export type XPReward = {
  source: 'game_completion' | 'achievement' | 'streak_bonus' | 'difficulty_bonus' | 'perfect_game';
  amount: number;
  description: string;
  timestamp: number;
};