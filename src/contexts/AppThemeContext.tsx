import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import type { MD3Theme } from 'react-native-paper';
import { appTheme, AppColors, AppGradients, AppTypography, AppSpacing, AppAnimations, AppBorders, AppShadows } from '../themes/appTheme';
import type { AppTheme } from '../themes/appTheme';

interface AppThemeContextValue {
  // Theme data
  theme: AppTheme;
  colors: typeof AppColors;
  gradients: typeof AppGradients;
  typography: typeof AppTypography;
  spacing: typeof AppSpacing;
  animations: typeof AppAnimations;
  borders: typeof AppBorders;
  shadows: typeof AppShadows;
  
  // Paper theme for React Native Paper components
  paperTheme: MD3Theme;
  
  // Theme state
  isDark: boolean;
  
  // Theme actions
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
};

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  // Default to light mode for neobrutalist design
  const [isDark, setIsDark] = useState(false);
  
  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);
  
  const setDarkMode = useCallback((darkMode: boolean) => {
    setIsDark(darkMode);
  }, []);
  
  // Select appropriate Paper theme
  const paperTheme = isDark ? appTheme.paperThemeDark : appTheme.paperTheme;
  
  // Create theme object with current dark mode state
  const currentTheme: AppTheme = {
    ...appTheme,
    isDark,
  };
  
  const contextValue: AppThemeContextValue = {
    // Theme data
    theme: currentTheme,
    colors: AppColors,
    gradients: AppGradients,
    typography: AppTypography,
    spacing: AppSpacing,
    animations: AppAnimations,
    borders: AppBorders,
    shadows: AppShadows,
    
    // Paper theme
    paperTheme,
    
    // Theme state
    isDark,
    
    // Theme actions
    toggleDarkMode,
    setDarkMode,
  };
  
  return (
    <AppThemeContext.Provider value={contextValue}>
      {children}
    </AppThemeContext.Provider>
  );
};

// Convenience hooks for specific theme aspects
export const useAppColors = () => {
  const { colors } = useAppTheme();
  return colors;
};

export const useAppGradients = () => {
  const { gradients } = useAppTheme();
  return gradients;
};

export const useAppTypography = () => {
  const { typography } = useAppTheme();
  return typography;
};

export const useAppSpacing = () => {
  const { spacing } = useAppTheme();
  return spacing;
};

export const useAppAnimations = () => {
  const { animations } = useAppTheme();
  return animations;
};

export const useAppBorders = () => {
  const { borders } = useAppTheme();
  return borders;
};

export const useAppShadows = () => {
  const { shadows } = useAppTheme();
  return shadows;
};