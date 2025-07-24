import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FeatureFlags, FeatureFlagKey, FeatureFlagConfig } from '../types/featureFlags';
import { storage } from '../utils/storageAdapter';

interface FeatureFlagState {
  flags: FeatureFlags;
  isLoading: boolean;
  
  // Actions
  isEnabled: (flag: FeatureFlagKey) => boolean;
  enableFlag: (flag: FeatureFlagKey) => void;
  disableFlag: (flag: FeatureFlagKey) => void;
  toggleFlag: (flag: FeatureFlagKey) => void;
  setFlag: (flag: FeatureFlagKey, enabled: boolean) => void;
  resetToDefaults: () => void;
  loadFlags: () => Promise<void>;
  getEnabledFlags: () => FeatureFlagKey[];
  canEnableFlag: (flag: FeatureFlagKey) => boolean;
}

// Default feature flag configuration
const DEFAULT_FLAGS: FeatureFlags = {
  // Phase 1: Enhanced User Experience
  tutorialSystem: false,
  hintSystem: false,
  soundEffects: false,
  expandedGridSizes: false,
  settingsScreen: false,
  
  // Phase 2: Gamification & Engagement
  expandedAchievements: false,
  detailedStatistics: false,
  playerProgression: false,
  levelSystem: false,
  
  // Phase 3: Visual Polish & Themes
  themeSystem: false,
  particleEffects: false,
  animationEnhancements: false,
  seasonalContent: false,
  
  // Phase 4: Advanced Features
  advancedGameMechanics: false,
  dailyChallenges: false,
  timeAttackMode: false,
  puzzleEditor: false,
  socialFeatures: false,
  
  // Phase 5: Platform Optimization
  gestureControls: false,
  platformSpecificFeatures: false,
  accessibilityEnhancements: false,
  
  // Development & Testing
  debugMode: __DEV__,
  experimentalFeatures: false,
  performanceMetrics: __DEV__,
};

// Feature flag metadata for validation and UI
export const FEATURE_FLAG_CONFIGS: Record<FeatureFlagKey, FeatureFlagConfig> = {
  // Phase 1
  tutorialSystem: {
    key: 'tutorialSystem',
    name: 'Interactive Tutorial',
    description: 'Step-by-step tutorial system for new players',
    phase: 1,
    defaultEnabled: false,
  },
  hintSystem: {
    key: 'hintSystem',
    name: 'Hint System',
    description: 'Show optimal move suggestions',
    phase: 1,
    defaultEnabled: false,
  },
  soundEffects: {
    key: 'soundEffects',
    name: 'Sound Effects',
    description: 'Audio feedback for game actions',
    phase: 1,
    defaultEnabled: false,
  },
  expandedGridSizes: {
    key: 'expandedGridSizes',
    name: 'Multiple Grid Sizes',
    description: 'Support for 3x3, 4x4, 5x5, 6x6 grids',
    phase: 1,
    defaultEnabled: false,
  },
  settingsScreen: {
    key: 'settingsScreen',
    name: 'Settings Screen',
    description: 'Comprehensive settings and customization',
    phase: 1,
    defaultEnabled: false,
  },
  
  // Phase 2
  expandedAchievements: {
    key: 'expandedAchievements',
    name: 'Expanded Achievements',
    description: '25+ achievements across multiple categories',
    phase: 2,
    defaultEnabled: false,
  },
  detailedStatistics: {
    key: 'detailedStatistics',
    name: 'Detailed Statistics',
    description: 'Advanced analytics and performance tracking',
    phase: 2,
    defaultEnabled: false,
  },
  playerProgression: {
    key: 'playerProgression',
    name: 'Player Progression',
    description: 'XP-based progression system',
    phase: 2,
    defaultEnabled: false,
  },
  levelSystem: {
    key: 'levelSystem',
    name: 'Level System',
    description: 'Player levels with unlock rewards',
    phase: 2,
    defaultEnabled: false,
    dependencies: ['playerProgression'],
  },
  
  // Phase 3
  themeSystem: {
    key: 'themeSystem',
    name: 'Theme System',
    description: 'Multiple visual themes and customization',
    phase: 3,
    defaultEnabled: false,
  },
  particleEffects: {
    key: 'particleEffects',
    name: 'Particle Effects',
    description: 'Visual effects for enhanced feedback',
    phase: 3,
    defaultEnabled: false,
    dependencies: ['themeSystem'],
  },
  animationEnhancements: {
    key: 'animationEnhancements',
    name: 'Enhanced Animations',
    description: 'Improved animations and transitions',
    phase: 3,
    defaultEnabled: false,
  },
  seasonalContent: {
    key: 'seasonalContent',
    name: 'Seasonal Content',
    description: 'Holiday themes and special events',
    phase: 3,
    defaultEnabled: false,
    dependencies: ['themeSystem'],
  },
  
  // Phase 4
  advancedGameMechanics: {
    key: 'advancedGameMechanics',
    name: 'Advanced Mechanics',
    description: 'Pattern variants and special cells',
    phase: 4,
    defaultEnabled: false,
  },
  dailyChallenges: {
    key: 'dailyChallenges',
    name: 'Daily Challenges',
    description: 'Daily puzzles with special rewards',
    phase: 4,
    defaultEnabled: false,
  },
  timeAttackMode: {
    key: 'timeAttackMode',
    name: 'Time Attack Mode',
    description: 'Time-based puzzle challenges',
    phase: 4,
    defaultEnabled: false,
  },
  puzzleEditor: {
    key: 'puzzleEditor',
    name: 'Puzzle Editor',
    description: 'Create and share custom puzzles',
    phase: 4,
    defaultEnabled: false,
  },
  socialFeatures: {
    key: 'socialFeatures',
    name: 'Social Features',
    description: 'Puzzle sharing and community features',
    phase: 4,
    defaultEnabled: false,
  },
  
  // Phase 5
  gestureControls: {
    key: 'gestureControls',
    name: 'Gesture Controls',
    description: 'Advanced touch and gesture controls',
    phase: 5,
    defaultEnabled: false,
  },
  platformSpecificFeatures: {
    key: 'platformSpecificFeatures',
    name: 'Platform Features',
    description: 'iOS widgets, Android shortcuts, etc.',
    phase: 5,
    defaultEnabled: false,
  },
  accessibilityEnhancements: {
    key: 'accessibilityEnhancements',
    name: 'Accessibility',
    description: 'Enhanced accessibility features',
    phase: 5,
    defaultEnabled: false,
  },
  
  // Development
  debugMode: {
    key: 'debugMode',
    name: 'Debug Mode',
    description: 'Development debugging features',
    phase: 0,
    defaultEnabled: __DEV__,
  },
  experimentalFeatures: {
    key: 'experimentalFeatures',
    name: 'Experimental Features',
    description: 'Cutting-edge features in testing',
    phase: 0,
    defaultEnabled: false,
  },
  performanceMetrics: {
    key: 'performanceMetrics',
    name: 'Performance Metrics',
    description: 'Performance monitoring and analytics',
    phase: 0,
    defaultEnabled: __DEV__,
  },
};

export const useFeatureFlagStore = create<FeatureFlagState>()(
  persist(
    (set, get) => ({
      flags: DEFAULT_FLAGS,
      isLoading: false,
      
      isEnabled: (flag: FeatureFlagKey) => {
        const state = get();
        return state.flags[flag] && state.canEnableFlag(flag);
      },
      
      canEnableFlag: (flag: FeatureFlagKey) => {
        const config = FEATURE_FLAG_CONFIGS[flag];
        const state = get();
        
        // Check dependencies
        if (config.dependencies) {
          return config.dependencies.every(dep => state.flags[dep]);
        }
        
        return true;
      },
      
      enableFlag: (flag: FeatureFlagKey) => {
        set((state) => {
          if (!state.canEnableFlag(flag)) {
            if (__DEV__) {
              console.warn(`Cannot enable flag ${flag}: dependencies not met`);
            }
            return state;
          }
          
          return {
            flags: {
              ...state.flags,
              [flag]: true,
            },
          };
        });
      },
      
      disableFlag: (flag: FeatureFlagKey) => {
        set((state) => {
          // Check if other flags depend on this one
          const dependentFlags = Object.entries(FEATURE_FLAG_CONFIGS)
            .filter(([, config]) => config.dependencies?.includes(flag))
            .map(([key]) => key as FeatureFlagKey)
            .filter(key => state.flags[key]);
          
          if (dependentFlags.length > 0 && __DEV__) {
            console.warn(`Disabling flag ${flag} will also disable: ${dependentFlags.join(', ')}`);
          }
          
          // Disable this flag and all dependent flags
          const updatedFlags = { ...state.flags, [flag]: false };
          dependentFlags.forEach(key => {
            updatedFlags[key] = false;
          });
          
          return {
            flags: updatedFlags,
          };
        });
      },
      
      toggleFlag: (flag: FeatureFlagKey) => {
        const state = get();
        if (state.flags[flag]) {
          state.disableFlag(flag);
        } else {
          state.enableFlag(flag);
        }
      },
      
      setFlag: (flag: FeatureFlagKey, enabled: boolean) => {
        if (enabled) {
          get().enableFlag(flag);
        } else {
          get().disableFlag(flag);
        }
      },
      
      resetToDefaults: () => {
        set({ flags: DEFAULT_FLAGS });
      },
      
      loadFlags: async () => {
        set({ isLoading: true });
        try {
          // Load any server-side feature flags or A/B test configurations here
          // For now, just use persisted local flags
          await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async load
        } catch (error) {
          if (__DEV__) {
            console.error('Failed to load feature flags:', error);
          }
        } finally {
          set({ isLoading: false });
        }
      },
      
      getEnabledFlags: () => {
        const state = get();
        return Object.entries(state.flags)
          .filter(([, enabled]) => enabled)
          .map(([key]) => key as FeatureFlagKey);
      },
    }),
    {
      name: 'lights-out-feature-flags',
      storage: {
        getItem: async (name) => {
          try {
            const result = await storage.getItem(name);
            return result;
          } catch (error) {
            if (__DEV__) {
              console.error('Feature flag storage getItem error:', error);
            }
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await storage.setItem(name, value);
          } catch (error) {
            if (__DEV__) {
              console.error('Feature flag storage setItem error:', error);
            }
          }
        },
        removeItem: async (name) => {
          try {
            await storage.removeItem(name);
          } catch (error) {
            if (__DEV__) {
              console.error('Feature flag storage removeItem error:', error);
            }
          }
        },
      },
    }
  )
);

// Utility hook for checking feature flags
export const useFeatureFlag = (flag: FeatureFlagKey): boolean => {
  return useFeatureFlagStore((state) => state.isEnabled(flag));
};

// Utility function for checking feature flags outside of components
export const isFeatureEnabled = (flag: FeatureFlagKey): boolean => {
  return useFeatureFlagStore.getState().isEnabled(flag);
};

// Development helper for enabling multiple flags at once
export const enablePhase = (phase: number): void => {
  if (!__DEV__) return;
  
  const phaseFlags = Object.values(FEATURE_FLAG_CONFIGS)
    .filter(config => config.phase === phase)
    .map(config => config.key);
  
  const store = useFeatureFlagStore.getState();
  phaseFlags.forEach(flag => store.enableFlag(flag));
  
  console.log(`Enabled Phase ${phase} flags:`, phaseFlags);
};