import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';

interface HintButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Example component that uses feature flags
 * Only renders when hintSystem feature flag is enabled
 */
export const HintButton: React.FC<HintButtonProps> = ({ onPress, disabled = false }) => {
  const isHintSystemEnabled = useFeatureFlag('hintSystem');

  // Don't render if feature flag is disabled
  if (!isHintSystemEnabled) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        💡 Hint
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  disabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.6,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledText: {
    color: '#cccccc',
  },
});