import { useFeatureFlagStore } from '../stores/featureFlagStore';
import { FeatureFlagKey } from '../types/featureFlags';

/**
 * Hook for checking if a feature flag is enabled
 * Automatically handles dependencies and validation
 */
export const useFeatureFlag = (flag: FeatureFlagKey): boolean => {
  return useFeatureFlagStore((state) => state.isEnabled(flag));
};

/**
 * Hook for getting multiple feature flags at once
 */
export const useFeatureFlags = (flags: FeatureFlagKey[]): Record<FeatureFlagKey, boolean> => {
  return useFeatureFlagStore((state) => {
    const result = {} as Record<FeatureFlagKey, boolean>;
    flags.forEach(flag => {
      result[flag] = state.isEnabled(flag);
    });
    return result;
  });
};

/**
 * Hook for managing feature flags (development only)
 */
export const useFeatureFlagManagement = () => {
  const {
    flags,
    isEnabled,
    enableFlag,
    disableFlag,
    toggleFlag,
    setFlag,
    resetToDefaults,
    canEnableFlag,
    getEnabledFlags,
  } = useFeatureFlagStore();

  if (!__DEV__) {
    // In production, only return read-only access
    return {
      flags,
      isEnabled,
      canEnableFlag,
      getEnabledFlags,
    };
  }

  return {
    flags,
    isEnabled,
    enableFlag,
    disableFlag,
    toggleFlag,
    setFlag,
    resetToDefaults,
    canEnableFlag,
    getEnabledFlags,
  };
};

/**
 * Utility function to check feature flags outside of React components
 */
export const isFeatureEnabled = (flag: FeatureFlagKey): boolean => {
  return useFeatureFlagStore.getState().isEnabled(flag);
};