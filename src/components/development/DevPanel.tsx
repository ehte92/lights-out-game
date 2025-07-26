import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { FeatureFlagPanel } from './FeatureFlagPanel';
import { useGameStore } from '../../stores/gameStore';
import { MinimalTestNotification } from '../ui/MinimalTestNotification';

/**
 * Development panel with feature flags and other dev tools
 * Only visible in development mode
 */
export const DevPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showMinimalTest, setShowMinimalTest] = useState(false);
  const { showAchievementNotification } = useGameStore();

  if (!__DEV__) {
    return null;
  }

  const testAchievementNotification = () => {
    const testAchievement = {
      id: 'test_achievement',
      title: 'Test Achievement',
      description: 'This is a test notification to preview the UI',
      unlocked: true,
      unlockedAt: Date.now(),
    };
    
    showAchievementNotification(testAchievement);
    // Keep dev panel open for testing
  };

  return (
    <>
      {/* Floating dev button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.floatingButtonText}>🛠️</Text>
      </TouchableOpacity>

      {/* Dev panel modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Development Tools</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsVisible(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {/* Achievement Test Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievement System</Text>
            <TouchableOpacity
              style={styles.testButton}
              onPress={testAchievementNotification}
            >
              <Text style={styles.testButtonText}>🏆 Test Achievement Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => setShowMinimalTest(!showMinimalTest)}
            >
              <Text style={styles.testButtonText}>🧪 Toggle Minimal Test Component</Text>
            </TouchableOpacity>
            <Text style={styles.sectionDescription}>
              Tap to preview the achievement notification UI or test minimal component
            </Text>
          </View>

          <FeatureFlagPanel />

          {/* Minimal Test Component */}
          {showMinimalTest && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Minimal Test Component</Text>
              <MinimalTestNotification
                title="Minimal Test Title"
                description="This is a minimal test description to isolate React Native text rendering issues"
              />
            </View>
          )}
        </ScrollView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  floatingButtonText: {
    fontSize: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  testButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: '#000000',
    marginVertical: 8,
    // Neobrutalist shadow
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});