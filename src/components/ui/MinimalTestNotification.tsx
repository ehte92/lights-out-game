import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MinimalTestProps {
  title: string;
  description: string;
}

/**
 * Minimal test component to isolate React Native text rendering issues
 * This component uses only basic Text elements with explicit string props
 */
export const MinimalTestNotification: React.FC<MinimalTestProps> = ({ title, description }) => {
  // Explicit string conversion at the component level
  const testTitle = String(title || 'Test Title');
  const testDescription = String(description || 'Test Description');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {testTitle}
      </Text>
      <Text style={styles.description}>
        {testDescription}
      </Text>
      {/* Test with hardcoded strings */}
      <Text style={styles.hardcoded}>
        Hardcoded Test Text
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0066FF',
    borderWidth: 4,
    borderColor: '#000000',
    margin: 16,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
  },
  hardcoded: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 8,
  },
});