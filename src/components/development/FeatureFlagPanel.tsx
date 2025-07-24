import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useFeatureFlagStore, FEATURE_FLAG_CONFIGS, enablePhase } from '../../stores/featureFlagStore';
import { FeatureFlagKey } from '../../types/featureFlags';

/**
 * Development panel for managing feature flags
 * Only visible in development mode
 */
export const FeatureFlagPanel: React.FC = () => {
  const {
    flags,
    isEnabled,
    toggleFlag,
    resetToDefaults,
    canEnableFlag,
    getEnabledFlags,
  } = useFeatureFlagStore();

  if (!__DEV__) {
    return null;
  }

  const groupedFlags = Object.values(FEATURE_FLAG_CONFIGS).reduce((acc, config) => {
    const phase = config.phase === 0 ? 'Development' : `Phase ${config.phase}`;
    if (!acc[phase]) {
      acc[phase] = [];
    }
    acc[phase].push(config);
    return acc;
  }, {} as Record<string, typeof FEATURE_FLAG_CONFIGS[FeatureFlagKey][]>);

  const enabledCount = getEnabledFlags().length;
  const totalCount = Object.keys(flags).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feature Flags</Text>
        <Text style={styles.subtitle}>
          {enabledCount} of {totalCount} enabled
        </Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={resetToDefaults}
        >
          <Text style={styles.buttonText}>Reset to Defaults</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => enablePhase(1)}
        >
          <Text style={styles.buttonText}>Enable Phase 1</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => enablePhase(2)}
        >
          <Text style={styles.buttonText}>Enable Phase 2</Text>
        </TouchableOpacity>
      </View>

      {Object.entries(groupedFlags).map(([phase, configs]) => (
        <View key={phase} style={styles.section}>
          <Text style={styles.sectionTitle}>{phase}</Text>
          
          {configs.map((config) => {
            const enabled = flags[config.key];
            const canEnable = canEnableFlag(config.key);
            const hasUnmetDependencies = !canEnable && config.dependencies;
            
            return (
              <View key={config.key} style={styles.flagItem}>
                <View style={styles.flagInfo}>
                  <Text style={[
                    styles.flagName,
                    !canEnable && styles.disabledText
                  ]}>
                    {config.name}
                  </Text>
                  <Text style={[
                    styles.flagDescription,
                    !canEnable && styles.disabledText
                  ]}>
                    {config.description}
                  </Text>
                  
                  {hasUnmetDependencies && (
                    <Text style={styles.dependencyText}>
                      Requires: {config.dependencies?.join(', ')}
                    </Text>
                  )}
                </View>
                
                <Switch
                  value={enabled}
                  onValueChange={() => toggleFlag(config.key)}
                  disabled={!canEnable && !enabled}
                  trackColor={{ false: '#767577', true: '#4CAF50' }}
                  thumbColor={enabled ? '#fff' : '#f4f3f4'}
                />
              </View>
            );
          })}
        </View>
      ))}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Development Mode Only - Not visible in production
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 16,
  },
  flagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  flagInfo: {
    flex: 1,
    marginRight: 16,
  },
  flagName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  flagDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dependencyText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontStyle: 'italic',
  },
  disabledText: {
    opacity: 0.5,
  },
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  footerText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});