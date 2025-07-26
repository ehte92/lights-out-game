import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { useAppTheme, useAppTypography } from '@/src/contexts/AppThemeContext';

export default function TabLayout() {
  const { colors } = useAppTheme();
  const typography = useAppTypography();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0066FF', // Electric blue for active tabs
        tabBarInactiveTintColor: '#333333', // Dark gray for inactive tabs (better contrast)
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontFamily: typography.bodyMedium.fontFamily,
          fontSize: 13, // Slightly smaller for balance
          fontWeight: '800', // Bold but not excessive
          marginBottom: Platform.OS === 'ios' ? 4 : 6,
          marginTop: Platform.OS === 'ios' ? 2 : 2,
        },
        tabBarStyle: {
          // Force pure white background on all platforms
          backgroundColor: '#FFFFFF',
          borderTopWidth: 4,
          borderTopColor: '#000000',
          height: Platform.OS === 'ios' ? 90 : 75,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 12 : 8,
          // Force no rounded corners
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          // Platform-specific shadows/elevation
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 0,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="grid-view" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="bar-chart" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
