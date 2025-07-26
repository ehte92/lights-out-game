import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';

import { AppThemeProvider, useAppTheme } from '@/src/contexts/AppThemeContext';
import { GameAudio } from '@/src/utils/audioManager';
import { suppressKnownWarnings } from '@/src/utils/warningSuppressionSetup';

// Root layout component that needs to bootstrap theme system
function RootLayoutContent() {
  const { paperTheme, isDark } = useAppTheme();
  
  // Initialize app systems when app starts
  useEffect(() => {
    // Enable warning suppression for React 19.0.0 + RN 0.79.5 compatibility
    suppressKnownWarnings();
    
    GameAudio.initialize().catch((error) => {
      console.error('Failed to initialize audio system:', error);
    });

    return () => {
      // Cleanup audio when app is destroyed
      GameAudio.cleanup().catch((error) => {
        console.error('Failed to cleanup audio system:', error);
      });
    };
  }, []);
  
  // Get the appropriate navigation theme based on app theme
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              animation: 'fade',
            }} 
          />
          <Stack.Screen 
            name="game" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AppThemeProvider>
      <RootLayoutContent />
    </AppThemeProvider>
  );
}
