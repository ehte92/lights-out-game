import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';

import { useCurrentTheme } from '@/src/stores/themeStore';
import { GameThemeProvider } from '@/src/contexts/ThemeContext';

// Root layout component that needs to bootstrap theme system
function RootLayoutContent() {
  const currentTheme = useCurrentTheme();
  
  // Get the appropriate navigation theme based on Paper theme
  const navigationTheme = currentTheme.paperTheme.dark ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={currentTheme.paperTheme}>
      <ThemeProvider value={navigationTheme}>
        <GameThemeProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GameThemeProvider>
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

  return <RootLayoutContent />;
}
