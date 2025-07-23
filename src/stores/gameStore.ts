import { create } from 'zustand';
import { GameState, Difficulty, GameStats, GameSettings, Achievement } from '../types/game';
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
  updateLastPlayed
} from '../utils/simpleStorage';
import { GameHaptics } from '../utils/haptics';

interface GameStore {
  // Game state
  currentGame: GameState | null;
  isPlaying: boolean;
  isPaused: boolean;
  
  // Statistics and settings
  stats: GameStats;
  settings: GameSettings;
  achievements: Achievement[];
  
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
  isLoading: false,
  showVictory: false,
  showSettings: false,

  // Game actions
  startNewGame: async (gridSize?: number, difficulty?: Difficulty) => {
    const { settings } = get();
    const gameGridSize = gridSize || settings.gridSize;
    const gameDifficulty = difficulty || settings.difficulty;
    
    const newGame = createInitialGameState(gameGridSize, gameDifficulty);
    
    set({
      currentGame: newGame,
      isPlaying: true,
      isPaused: false,
      showVictory: false,
    });
    
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

    // Haptic feedback
    if (gameComplete) {
      await GameHaptics.victorySequence();
    } else {
      await GameHaptics.cellTap();
    }

    // Update statistics if game is complete
    if (gameComplete) {
      const timeInSeconds = (updatedGame.endTime! - updatedGame.startTime) / 1000;
      await updateGameStats(true, newMoves, timeInSeconds, updatedGame.difficulty);
      
      // Reload stats to reflect changes
      const newStats = await getGameStats();
      set({ stats: newStats });
      
      // Check for achievements
      await get().checkAchievements();
    }
  },

  pauseGame: () => {
    set({ isPaused: true });
    GameHaptics.buttonPress();
  },

  resumeGame: () => {
    set({ isPaused: false });
    GameHaptics.buttonPress();
  },

  resetGame: () => {
    const { currentGame } = get();
    if (!currentGame) return;
    
    const newGame = createInitialGameState(currentGame.gridSize, currentGame.difficulty);
    
    set({
      currentGame: newGame,
      isPlaying: true,
      isPaused: false,
      showVictory: false,
    });
    
    GameHaptics.buttonPress();
  },

  // Settings actions
  updateSettings: async (newSettings: Partial<GameSettings>) => {
    const { settings } = get();
    const updatedSettings = { ...settings, ...newSettings };
    
    await saveSettings(newSettings);
    set({ settings: updatedSettings });
  },

  loadSettings: async () => {
    const settings = await getSettings();
    set({ settings });
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
                   (currentGame.endTime - currentGame.startTime) / 1000 < 30,
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