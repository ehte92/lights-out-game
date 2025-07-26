import { Achievement, GameStats, GameState } from '../types/game';

// Achievement checking helper types
export interface AchievementCheckContext {
  stats: GameStats;
  currentGame?: GameState;
  completedGame?: GameState;
  sessionStartTime?: number;
  recentGames?: GameState[];
  currentTime?: number;
}

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // ========== PROGRESSION ACHIEVEMENTS ==========
  {
    id: 'first_win',
    title: 'Getting Started',
    description: 'Complete your first puzzle',
    unlocked: false,
  },
  {
    id: 'committed',
    title: 'Committed',
    description: 'Complete 10 puzzles',
    unlocked: false,
  },
  {
    id: 'dedicated',
    title: 'Dedicated Player',
    description: 'Complete 25 puzzles',
    unlocked: false,
  },
  {
    id: 'expert',
    title: 'Expert',
    description: 'Complete 50 puzzles',
    unlocked: false,
  },
  {
    id: 'master',
    title: 'Puzzle Master',
    description: 'Complete 100 puzzles',
    unlocked: false,
  },
  {
    id: 'legend',
    title: 'Living Legend',
    description: 'Complete 250 puzzles',
    unlocked: false,
  },

  // ========== STREAK ACHIEVEMENTS ==========
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Win 3 games in a row',
    unlocked: false,
  },
  {
    id: 'streak_5',
    title: 'Streak Master',
    description: 'Win 5 games in a row',
    unlocked: false,
  },
  {
    id: 'streak_10',
    title: 'Unstoppable',
    description: 'Win 10 games in a row',
    unlocked: false,
  },
  {
    id: 'streak_20',
    title: 'Dominator',
    description: 'Win 20 games in a row',
    unlocked: false,
  },

  // ========== SPEED ACHIEVEMENTS ==========
  {
    id: 'speed_easy',
    title: 'Quick Fingers',
    description: 'Complete an easy puzzle in under 15 seconds',
    unlocked: false,
  },
  {
    id: 'speed_medium',
    title: 'Speed Demon',
    description: 'Complete a medium puzzle in under 30 seconds',
    unlocked: false,
  },
  {
    id: 'speed_hard',
    title: 'Lightning Fast',
    description: 'Complete a hard puzzle in under 60 seconds',
    unlocked: false,
  },
  {
    id: 'speed_any_10s',
    title: 'Blink of an Eye',
    description: 'Complete any puzzle in under 10 seconds',
    unlocked: false,
  },

  // ========== SKILL ACHIEVEMENTS ==========
  {
    id: 'perfectionist_easy',
    title: 'Efficient',
    description: 'Complete an easy puzzle in minimum moves',
    unlocked: false,
  },
  {
    id: 'perfectionist_medium',
    title: 'Precise',
    description: 'Complete a medium puzzle in minimum moves',
    unlocked: false,
  },
  {
    id: 'perfectionist_hard',
    title: 'Perfectionist',
    description: 'Complete a hard puzzle in minimum moves',
    unlocked: false,
  },
  {
    id: 'no_mistakes',
    title: 'Flawless Victory',
    description: 'Complete 5 puzzles in a row without any wasted moves',
    unlocked: false,
  },

  // ========== GRID SIZE ACHIEVEMENTS ==========
  {
    id: 'small_grid_master',
    title: 'Pocket Master',
    description: 'Complete 20 puzzles on 3x3 grid',
    unlocked: false,
  },
  {
    id: 'large_grid_master',
    title: 'Big Picture Thinker',
    description: 'Complete 20 puzzles on 6x6 grid',
    unlocked: false,
  },

  // ========== SPECIAL ACHIEVEMENTS ==========
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a puzzle between midnight and 6 AM',
    unlocked: false,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a puzzle between 6 AM and 8 AM',
    unlocked: false,
  },
  {
    id: 'comeback_kid',
    title: 'Comeback Kid',
    description: 'Win a game after losing 3 in a row',
    unlocked: false,
  },
  {
    id: 'marathon_session',
    title: 'Marathon Session',
    description: 'Play for 30 minutes straight',
    unlocked: false,
  },
  {
    id: 'daily_grind',
    title: 'Daily Grind',
    description: 'Play at least one game for 7 days in a row',
    unlocked: false,
  },
];

// Helper functions for achievement checking
const calculateMinimumMoves = (gridSize: number, difficulty: string): number => {
  // Approximate minimum moves based on grid size and difficulty
  const baseMoves = Math.ceil(gridSize * 0.6);
  const difficultyMultiplier = {
    'easy': 1.0,
    'medium': 1.2,
    'hard': 1.5,
  }[difficulty] || 1.0;
  
  return Math.ceil(baseMoves * difficultyMultiplier);
};

const getHourOfDay = (timestamp: number): number => {
  return new Date(timestamp).getHours();
};

const isTimeInRange = (timestamp: number, startHour: number, endHour: number): boolean => {
  const hour = getHourOfDay(timestamp);
  if (startHour <= endHour) {
    return hour >= startHour && hour < endHour;
  } else {
    // Handles overnight ranges like 23-6 (11PM to 6AM)
    return hour >= startHour || hour < endHour;
  }
};

// Achievement checking functions
export const checkAchievements = (context: AchievementCheckContext): string[] => {
  const { stats, completedGame, sessionStartTime, currentTime = Date.now() } = context;
  const unlockedAchievements: string[] = [];

  // Only check if we have a completed game
  if (!completedGame) {
    if (__DEV__) {
      console.log('🏆 checkAchievements: No completed game provided');
    }
    return unlockedAchievements;
  }

  if (__DEV__) {
    console.log('🏆 checkAchievements: Starting checks with context:', {
      gamesWon: stats.gamesWon,
      currentStreak: stats.currentStreak,
      gameTime: completedGame.elapsedTime,
      moves: completedGame.moves,
      difficulty: completedGame.difficulty,
      gridSize: completedGame.gridSize
    });
  }

  const gameTime = completedGame.elapsedTime;
  const moves = completedGame.moves;
  const difficulty = completedGame.difficulty;
  const gridSize = completedGame.gridSize;
  const minimumMoves = calculateMinimumMoves(gridSize, difficulty);

  // ========== PROGRESSION ACHIEVEMENTS ==========
  if (stats.gamesWon >= 1) unlockedAchievements.push('first_win');
  if (stats.gamesWon >= 10) unlockedAchievements.push('committed');
  if (stats.gamesWon >= 25) unlockedAchievements.push('dedicated');
  if (stats.gamesWon >= 50) unlockedAchievements.push('expert');
  if (stats.gamesWon >= 100) unlockedAchievements.push('master');
  if (stats.gamesWon >= 250) unlockedAchievements.push('legend');

  // ========== STREAK ACHIEVEMENTS ==========
  if (stats.currentStreak >= 3) unlockedAchievements.push('streak_3');
  if (stats.currentStreak >= 5) unlockedAchievements.push('streak_5');
  if (stats.currentStreak >= 10) unlockedAchievements.push('streak_10');
  if (stats.currentStreak >= 20) unlockedAchievements.push('streak_20');

  // ========== SPEED ACHIEVEMENTS ==========
  if (difficulty === 'easy' && gameTime < 15) {
    unlockedAchievements.push('speed_easy');
  }
  if (difficulty === 'medium' && gameTime < 30) {
    unlockedAchievements.push('speed_medium');
  }
  if (difficulty === 'hard' && gameTime < 60) {
    unlockedAchievements.push('speed_hard');
  }
  if (gameTime < 10) {
    unlockedAchievements.push('speed_any_10s');
  }

  // ========== SKILL ACHIEVEMENTS ==========
  if (moves <= minimumMoves) {
    if (difficulty === 'easy') unlockedAchievements.push('perfectionist_easy');
    if (difficulty === 'medium') unlockedAchievements.push('perfectionist_medium');
    if (difficulty === 'hard') unlockedAchievements.push('perfectionist_hard');
  }

  // ========== GRID SIZE ACHIEVEMENTS ==========
  // Note: These require tracking games per grid size - would need additional stats
  // For now, we'll approximate based on current stats and grid size
  if (gridSize === 3 && stats.gamesWon >= 20) {
    unlockedAchievements.push('small_grid_master');
  }
  if (gridSize === 6 && stats.gamesWon >= 20) {
    unlockedAchievements.push('large_grid_master');
  }

  // ========== SPECIAL ACHIEVEMENTS ==========
  const completionTime = completedGame.endTime || currentTime;
  
  // Night Owl (midnight to 6 AM)
  if (isTimeInRange(completionTime, 0, 6)) {
    unlockedAchievements.push('night_owl');
  }
  
  // Early Bird (6 AM to 8 AM)
  if (isTimeInRange(completionTime, 6, 8)) {
    unlockedAchievements.push('early_bird');
  }

  // Marathon Session (30 minutes)
  if (sessionStartTime && (currentTime - sessionStartTime) >= 30 * 60 * 1000) {
    unlockedAchievements.push('marathon_session');
  }

  if (__DEV__) {
    console.log('🏆 checkAchievements: Returning potential unlocks:', unlockedAchievements);
  }

  return unlockedAchievements;
};

// Advanced achievement checking that requires additional game history
export const checkAdvancedAchievements = (
  context: AchievementCheckContext, 
  gameHistory: GameState[]
): string[] => {
  const unlockedAchievements: string[] = [];
  const { stats } = context;

  // ========== COMEBACK KID ==========
  // Check if player won after losing 3 in a row
  if (gameHistory.length >= 4) {
    const lastFour = gameHistory.slice(-4);
    const recentWin = lastFour[3].isComplete; // Last game was won
    const threeLosses = !lastFour[0].isComplete && !lastFour[1].isComplete && !lastFour[2].isComplete;
    
    if (recentWin && threeLosses) {
      unlockedAchievements.push('comeback_kid');
    }
  }

  // ========== FLAWLESS VICTORY ==========
  // Check for 5 consecutive perfect games (minimum moves)
  if (gameHistory.length >= 5) {
    const lastFive = gameHistory.slice(-5);
    const allPerfect = lastFive.every(game => {
      if (!game.isComplete) return false;
      const minMoves = calculateMinimumMoves(game.gridSize, game.difficulty);
      return game.moves <= minMoves;
    });
    
    if (allPerfect) {
      unlockedAchievements.push('no_mistakes');
    }
  }

  return unlockedAchievements;
};

// Initialize achievements in storage if they don't exist
export const initializeAchievements = async (): Promise<Achievement[]> => {
  try {
    // Import storage functions dynamically to avoid circular imports
    const { getAchievements, saveAchievements } = await import('./storage');
    
    const existingAchievements = await getAchievements();
    
    if (existingAchievements.length === 0) {
      // Initialize with default achievements
      const initialAchievements = DEFAULT_ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        unlocked: false,
        unlockedAt: undefined,
      }));
      
      await saveAchievements(initialAchievements);
      return initialAchievements;
    }
    
    // Check if we need to add new achievements
    const existingIds = new Set(existingAchievements.map(a => a.id));
    const newAchievements = DEFAULT_ACHIEVEMENTS.filter(a => !existingIds.has(a.id));
    
    if (newAchievements.length > 0) {
      const updatedAchievements = [
        ...existingAchievements,
        ...newAchievements.map(achievement => ({
          ...achievement,
          unlocked: false,
          unlockedAt: undefined,
        }))
      ];
      
      await saveAchievements(updatedAchievements);
      return updatedAchievements;
    }
    
    return existingAchievements;
  } catch (error) {
    console.error('Error initializing achievements:', error);
    return DEFAULT_ACHIEVEMENTS;
  }
};