export interface FeatureFlags {
  // Phase 1: Enhanced User Experience
  tutorialSystem: boolean;
  hintSystem: boolean;
  soundEffects: boolean;
  expandedGridSizes: boolean;
  settingsScreen: boolean;
  
  // Phase 2: Gamification & Engagement
  expandedAchievements: boolean;
  detailedStatistics: boolean;
  playerProgression: boolean;
  levelSystem: boolean;
  
  // Phase 3: Visual Polish & Themes
  themeSystem: boolean;
  particleEffects: boolean;
  animationEnhancements: boolean;
  seasonalContent: boolean;
  
  // Phase 4: Advanced Features
  advancedGameMechanics: boolean;
  dailyChallenges: boolean;
  timeAttackMode: boolean;
  puzzleEditor: boolean;
  socialFeatures: boolean;
  
  // Phase 5: Platform Optimization
  gestureControls: boolean;
  platformSpecificFeatures: boolean;
  accessibilityEnhancements: boolean;
  
  // Development & Testing
  debugMode: boolean;
  experimentalFeatures: boolean;
  performanceMetrics: boolean;
}

export type FeatureFlagKey = keyof FeatureFlags;

export interface FeatureFlagConfig {
  key: FeatureFlagKey;
  name: string;
  description: string;
  phase: number;
  defaultEnabled: boolean;
  requiredLevel?: number;
  dependencies?: FeatureFlagKey[];
}