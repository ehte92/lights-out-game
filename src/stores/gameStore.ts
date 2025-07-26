import { create } from 'zustand';
import { GameState, Difficulty, GameStats, GameSettings, Achievement, PlayerProgression, XPReward } from '../types/game';
import { 
  createInitialGameState, 
  toggleCell, 
  isGameComplete,
  calculateScore 
} from '../utils/gameLogic';
import { 
  getGameStats, 
  saveGameStats, 
  updateGameStats,
  getSettings,
  saveSettings,
  getAchievements,
  saveAchievements,
  unlockAchievement,
  updateLastPlayed,
  getPlayerProgression,
  addXPRewards
} from '../utils/storage';
import { 
  calculateGameCompletionXP, 
  calculateLevelFromXP,
  applyXPRewards,
  createDefaultProgression
} from '../utils/playerProgression';
import { GameHaptics } from '../utils/haptics';
import { GameAudio } from '../utils/audioManager';

interface GameStore {
  // Game state
  currentGame: GameState | null;
  isPlaying: boolean;
  isPaused: boolean;
  
  // Statistics and settings
  stats: GameStats;
  settings: GameSettings;
  achievements: Achievement[];
  progression: PlayerProgression;
  
  // UI state
  isLoading: boolean;
  showVictory: boolean;
  showSettings: boolean;
  
  // Actions
  startNewGame: (gridSize?: number, difficulty?: Difficulty) => void;
  makeMove: (row: number, col: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  
  // Settings
  updateSettings: (newSettings: Partial<GameSettings>) => Promise<void>;
  loadSettings: () => Promise<void>;
  
  // Statistics
  loadStats: () => Promise<void>;
  resetStats: () => Promise<void>;
  
  // Achievements
  loadAchievements: () => Promise<void>;
  checkAchievements: () => Promise<void>;
  
  // Player Progression
  loadProgression: () => Promise<void>;
  awardXP: (rewards: XPReward[]) => Promise<boolean>; // Returns true if leveled up
  
  // UI actions
  setShowVictory: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentGame: null,
  isPlaying: false,
  isPaused: false,
  stats: {
    totalGames: 0,
    gamesWon: 0,
    bestTimes: { easy: Infinity, medium: Infinity, hard: Infinity },
    bestMoves: { easy: Infinity, medium: Infinity, hard: Infinity },
    currentStreak: 0,
    longestStreak: 0,
  },
  settings: {
    soundEnabled: true,
    hapticsEnabled: true,
    theme: 'auto',
    gridSize: 4,
    difficulty: 'medium',
  },
  achievements: [],
  progression: createDefaultProgression(),
  isLoading: false,
  showVictory: false,
  showSettings: false,

  // Game actions
  startNewGame: async (gridSize?: number, difficulty?: Difficulty) => {
    const { settings } = get();
    const gameGridSize = gridSize || settings.gridSize;
    const gameDifficulty = difficulty || settings.difficulty;
    
    if (__DEV__) {
      console.log('🆕 Starting new game:', { 
        gridSize: gameGridSize, 
        difficulty: gameDifficulty 
      });
    }
    
    const newGame = createInitialGameState(gameGridSize, gameDifficulty);
    
    set({
      currentGame: newGame,
      isPlaying: true,
      isPaused: false,
      showVictory: false,
    });
    
    if (__DEV__) {
      console.log('🆕 New game created:', { 
        isPlaying: true,
        isPaused: false,
        hasResumeTime: !!newGame.lastResumeTime,
        moves: newGame.moves,
        isComplete: newGame.isComplete
      });
    }
    
    await updateLastPlayed();
    await GameHaptics.buttonPress();
  },

  makeMove: async (row: number, col: number) => {
    const { currentGame, isPlaying, isPaused } = get();
    
    if (!currentGame || !isPlaying || isPaused || currentGame.isComplete) {
      return;
    }

    // Apply the move
    const newGrid = toggleCell(currentGame.grid, row, col);
    const newMoves = currentGame.moves + 1;
    const gameComplete = isGameComplete(newGrid);
    
    const updatedGame: GameState = {
      ...currentGame,
      grid: newGrid,
      moves: newMoves,
      isComplete: gameComplete,
      endTime: gameComplete ? Date.now() : undefined,
    };

    set({
      currentGame: updatedGame,
      isPlaying: !gameComplete,
      showVictory: gameComplete,
    });

    // Haptic and audio feedback
    if (gameComplete) {
      await GameHaptics.victorySequence();
      await GameAudio.playVictory();
    } else {
      await GameHaptics.cellTap();
      await GameAudio.playCellTap();
    }

    // Update statistics if game is complete
    if (gameComplete) {
      // Calculate final elapsed time
      const finalElapsedTime = updatedGame.elapsedTime + 
        (updatedGame.lastResumeTime ? (Date.now() - updatedGame.lastResumeTime) / 1000 : 0);
      
      await updateGameStats(true, newMoves, finalElapsedTime, updatedGame.difficulty);
      
      // Reload stats to reflect changes
      const newStats = await getGameStats();
      set({ stats: newStats });
      
      // Award XP for game completion
      const isPerfectGame = false; // TODO: Implement perfect game detection logic
      const xpRewards = calculateGameCompletionXP(
        updatedGame,
        isPerfectGame,
        newStats.currentStreak,
        finalElapsedTime
      );
      
      const leveledUp = await get().awardXP(xpRewards);
      
      if (__DEV__) {
        const totalXP = xpRewards.reduce((sum, reward) => sum + reward.amount, 0);
        console.log('🎯 XP awarded for game completion:', {
          totalXP,
          rewards: xpRewards.map(r => ({ source: r.source, amount: r.amount })),
          leveledUp,
        });
      }
      
      // Check for achievements
      await get().checkAchievements();
    }
  },

  pauseGame: () => {
    const { currentGame, isPlaying } = get();
    
    if (__DEV__) {
      console.log('🟡 pauseGame called:', { 
        hasCurrentGame: !!currentGame, 
        isPlaying, 
        currentlyPaused: get().isPaused,
        hasResumeTime: !!currentGame?.lastResumeTime 
      });
    }
    
    if (!currentGame || !currentGame.lastResumeTime) {
      set({ isPaused: true });
      GameHaptics.buttonPress();
      if (__DEV__) console.log('🟡 Game paused (no resume time)');
      return;
    }

    // Calculate elapsed time and pause
    const now = Date.now();
    const sessionTime = (now - currentGame.lastResumeTime) / 1000;
    const updatedGame = {
      ...currentGame,
      elapsedTime: currentGame.elapsedTime + sessionTime,
      lastResumeTime: undefined, // Clear resume time when paused
    };

    set({ 
      currentGame: updatedGame,
      isPaused: true 
    });
    GameHaptics.buttonPress();
    
    if (__DEV__) console.log('🟡 Game paused with time update:', { elapsedTime: updatedGame.elapsedTime });
  },

  resumeGame: () => {
    const { currentGame, isPaused } = get();
    
    if (__DEV__) {
      console.log('🟢 resumeGame called:', { 
        hasCurrentGame: !!currentGame, 
        currentlyPaused: isPaused,
        isComplete: currentGame?.isComplete 
      });
    }
    
    if (!currentGame) {
      set({ isPaused: false });
      GameHaptics.buttonPress();
      if (__DEV__) console.log('🟢 Game resumed (no current game)');
      return;
    }

    // Resume timer
    const updatedGame = {
      ...currentGame,
      lastResumeTime: Date.now(), // Set new resume time
    };

    set({ 
      currentGame: updatedGame,
      isPaused: false 
    });
    GameHaptics.buttonPress();
    
    if (__DEV__) console.log('🟢 Game resumed with new resume time');
  },

  resetGame: () => {
    const { currentGame } = get();
    if (!currentGame) return;
    
    if (__DEV__) {
      console.log('🔄 Resetting game to original puzzle state');
    }
    
    // True reset: restore the same puzzle to its original state
    const resetGame = {
      ...currentGame,
      grid: currentGame.originalGrid.map(row => [...row]), // Deep copy of original grid
      moves: 0,
      isComplete: false,
      elapsedTime: 0,
      lastResumeTime: Date.now(), // Start timing from reset
      endTime: undefined,
    };
    
    set({
      currentGame: resetGame,
      isPlaying: true,
      isPaused: false,
      showVictory: false,
    });
    
    if (__DEV__) {
      console.log('🔄 Game reset to original puzzle state');
    }
    
    GameHaptics.buttonPress();
  },

  // Settings actions
  updateSettings: async (newSettings: Partial<GameSettings>) => {
    const { settings } = get();
    const updatedSettings = { ...settings, ...newSettings };
    
    await saveSettings(newSettings);
    set({ settings: updatedSettings });
    
    // Sync sound enabled state with audio manager
    if ('soundEnabled' in newSettings) {
      GameAudio.setEnabled(newSettings.soundEnabled!);
    }
  },

  loadSettings: async () => {
    const settings = await getSettings();
    set({ settings });
    
    // Sync sound enabled state with audio manager
    GameAudio.setEnabled(settings.soundEnabled);
  },

  // Statistics actions
  loadStats: async () => {
    const stats = await getGameStats();
    set({ stats });
  },

  resetStats: async () => {
    const defaultStats: GameStats = {
      totalGames: 0,
      gamesWon: 0,
      bestTimes: { easy: Infinity, medium: Infinity, hard: Infinity },
      bestMoves: { easy: Infinity, medium: Infinity, hard: Infinity },
      currentStreak: 0,
      longestStreak: 0,
    };
    
    await saveGameStats(defaultStats);
    set({ stats: defaultStats });
    await GameHaptics.buttonPress();
  },

  // Achievements actions
  loadAchievements: async () => {
    const achievements = await getAchievements();
    set({ achievements });
  },

  checkAchievements: async () => {
    const { stats, currentGame } = get();
    
    // Example achievements - you can expand this
    const achievementChecks = [
      {
        id: 'first_win',
        title: 'First Victory',
        description: 'Complete your first puzzle',
        condition: stats.gamesWon >= 1,
      },
      {
        id: 'streak_5',
        title: 'Streak Master',
        description: 'Win 5 games in a row',
        condition: stats.currentStreak >= 5,
      },
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete a medium puzzle in under 30 seconds',
        condition: currentGame?.difficulty === 'medium' && 
                   currentGame?.endTime && 
                   currentGame.elapsedTime < 30,
      },
    ];

    let achievements = await getAchievements();
    let hasNewAchievements = false;

    for (const check of achievementChecks) {
      if (check.condition) {
        const wasUnlocked = await unlockAchievement(check.id);
        if (wasUnlocked) {
          hasNewAchievements = true;
          await GameHaptics.achievementUnlock();
        }
      }
    }

    if (hasNewAchievements) {
      achievements = await getAchievements();
      set({ achievements });
    }
  },
  
  // Player Progression
  loadProgression: async () => {
    const progression = await getPlayerProgression();
    set({ progression });
  },
  
  awardXP: async (rewards: XPReward[]): Promise<boolean> => {
    const { progression } = get();
    
    const { newProgression, leveledUp, levelsGained } = applyXPRewards(progression, rewards);
    
    // Update stored progression
    await addXPRewards(rewards);
    
    // Update state
    set({ progression: newProgression });
    
    if (leveledUp) {
      if (__DEV__) {
        console.log('🎉 Level up!', {
          oldLevel: progression.currentLevel,
          newLevel: newProgression.currentLevel,
          levelsGained,
          totalXP: newProgression.totalXP,
        });
      }
      
      // Trigger level up haptics
      await GameHaptics.achievementUnlock();
    }
    
    return leveledUp;
  },

  // UI actions
  setShowVictory: (show: boolean) => {
    set({ showVictory: show });
  },

  setShowSettings: (show: boolean) => {
    set({ showSettings: show });
    if (show) GameHaptics.buttonPress();
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));