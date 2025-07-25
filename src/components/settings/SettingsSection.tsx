import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
}) => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.onBackground,
            borderWidth: borders.thick,
            borderColor: borders.color,
          },
        ]}
      >
        <Text
          style={[
            typography.headlineMedium,
            {
              color: colors.background, // White text on black background
              fontWeight: '900', // Extra bold for neobrutalism
              textAlign: 'center',
            },
          ]}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              typography.bodyMedium,
              {
                color: colors.background, // White text on black background
                fontWeight: '700',
                textAlign: 'center',
                marginTop: 4,
              },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      
      {/* Section Content */}
      <View style={styles.content}>
        {children}
      </View>
      
      {/* Section Divider */}
      <View
        style={[
          styles.divider,
          {
            backgroundColor: borders.color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    borderRadius: 0, // Sharp corners for neobrutalism
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    // Content styling handled by individual components
  },
  divider: {
    height: 4, // Thick divider for bold separation
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
});