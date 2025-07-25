import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeState, GameTheme } from '../themes/types';
import { ALL_THEMES, THEMES_BY_ID, THEME_UNLOCK_REQUIREMENTS } from '../themes/gameThemes';

interface ThemeStore extends ThemeState {
  // Additional store methods
  getTheme: (themeId: string) => GameTheme | undefined;
  getCurrentTheme: () => GameTheme;
  getAvailableThemes: () => GameTheme[];
  isThemeUnlocked: (themeId: string) => boolean;
  startThemeTransition: () => void;
  finishThemeTransition: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTheme: 'serene',
      availableThemes: ALL_THEMES,
      unlockedThemes: ['serene', 'classic'], // Serene and Classic are always unlocked
      isTransitioning: false,

      // Actions
      setTheme: (themeId: string) => {
        const state = get();
        const theme = THEMES_BY_ID[themeId];
        
        if (!theme) {
          console.warn(`Theme '${themeId}' not found`);
          return;
        }

        if (!state.unlockedThemes.includes(themeId)) {
          console.warn(`Theme '${themeId}' is not unlocked`);
          return;
        }

        set({
          currentTheme: themeId,
          isTransitioning: true,
        });

        // Simulate theme transition time
        setTimeout(() => {
          set({ isTransitioning: false });
        }, theme.animations.themeTransitionDuration);
      },

      unlockTheme: (themeId: string) => {
        const state = get();
        const theme = THEMES_BY_ID[themeId];
        
        if (!theme) {
          console.warn(`Theme '${themeId}' not found`);
          return;
        }

        if (state.unlockedThemes.includes(themeId)) {
          return; // Already unlocked
        }

        set({
          unlockedThemes: [...state.unlockedThemes, themeId]
        });
      },

      checkUnlockRequirements: (playerLevel: number, unlockedAchievements: string[]) => {
        const state = get();
        const newlyUnlocked: string[] = [];

        ALL_THEMES.forEach(theme => {
          if (state.unlockedThemes.includes(theme.id)) {
            return; // Already unlocked
          }

          const requirements = THEME_UNLOCK_REQUIREMENTS[theme.id as keyof typeof THEME_UNLOCK_REQUIREMENTS];
          if (!requirements) return;

          // Check level requirement
          if (playerLevel < requirements.level) {
            return;
          }

          // Check achievement requirements
          if (requirements.achievements) {
            const hasAllAchievements = requirements.achievements.every(
              achievement => unlockedAchievements.includes(achievement)
            );
            if (!hasAllAchievements) {
              return;
            }
          }

          // Requirements met, unlock theme
          newlyUnlocked.push(theme.id);
        });

        if (newlyUnlocked.length > 0) {
          set({
            unlockedThemes: [...state.unlockedThemes, ...newlyUnlocked]
          });
        }
      },

      // Getters
      getTheme: (themeId: string) => THEMES_BY_ID[themeId],

      getCurrentTheme: () => {
        const state = get();
        return THEMES_BY_ID[state.currentTheme] || THEMES_BY_ID.serene;
      },

      getAvailableThemes: () => {
        const state = get();
        return state.availableThemes;
      },

      isThemeUnlocked: (themeId: string) => {
        const state = get();
        return state.unlockedThemes.includes(themeId);
      },

      startThemeTransition: () => set({ isTransitioning: true }),
      finishThemeTransition: () => set({ isTransitioning: false }),
    }),
    {
      name: 'lights-out-theme-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        unlockedThemes: state.unlockedThemes,
      }),
    }
  )
);

// Hook to get current theme with Paper integration
export const useCurrentTheme = () => {
  const getCurrentTheme = useThemeStore(state => state.getCurrentTheme);
  return getCurrentTheme();
};

// Hook to check if theme is unlocked
export const useThemeUnlocked = (themeId: string) => {
  const isThemeUnlocked = useThemeStore(state => state.isThemeUnlocked);
  return isThemeUnlocked(themeId);
};