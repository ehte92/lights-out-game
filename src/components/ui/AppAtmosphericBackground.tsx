import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../contexts/AppThemeContext';

interface AppAtmosphericBackgroundProps {
  children: React.ReactNode;
}

export const AppAtmosphericBackground: React.FC<AppAtmosphericBackgroundProps> = ({ children }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Pure neobrutalist background - stark white, no effects */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});