import React from 'react';
import { View, StyleSheet, Modal, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Achievement } from '../../types/game';
import { useAppTheme, useAppTypography, useAppBorders } from '../../contexts/AppThemeContext';
import { AchievementsList } from './AchievementsList';

interface AchievementsModalProps {
  visible: boolean;
  achievements: Achievement[];
  onClose: () => void;
}

// Modal Content Component with Safe Area Context
const ModalContent: React.FC<{
  achievements: Achievement[];
  onClose: () => void;
}> = ({ achievements, onClose }) => {
  const { colors } = useAppTheme();
  const typography = useAppTypography();
  const borders = useAppBorders();
  const insets = useSafeAreaInsets();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 16 : 32 }]}>
        <View style={styles.headerContent}>
          {/* Empty left spacer for symmetry */}
          <View style={styles.headerSpacer} />
          
          {/* Title Container */}
          <View style={styles.titleContainer}>
            <Text style={[
              typography.headlineLarge,
              {
                color: colors.background, // White text
                fontWeight: '900',
                textAlign: 'center',
              }
            ]}>
              ALL ACHIEVEMENTS
            </Text>
          </View>
          
          {/* Close Button */}
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: colors.background,
                  borderWidth: borders.medium,
                  borderColor: borders.color,
                }
              ]}
              accessibilityLabel="Close Achievements"
            >
              <MaterialIcons name="close" size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Subtitle with completion stats */}
        <Text style={[
          typography.bodyLarge,
          {
            color: colors.background,
            fontWeight: '600',
            textAlign: 'center',
            marginTop: 12,
            opacity: 0.9,
          }
        ]}>
          {unlockedCount} of {totalCount} achievements unlocked ({completionPercentage}%)
        </Text>
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        <AchievementsList achievements={achievements} />
      </View>
    </View>
  );
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  visible,
  achievements,
  onClose,
}) => {
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaProvider>
        <View style={styles.atmosphericBackground}>
          <ModalContent achievements={achievements} onClose={onClose} />
        </View>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Rich dark blue base matching other screens
  },
  atmosphericBackground: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Rich dark blue base matching other screens
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 44, // Same width as close button for symmetry
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  closeButtonContainer: {
    width: 44,
    alignItems: 'center',
  },
  closeButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 0, // Sharp corners for neobrutalism
    justifyContent: 'center',
    alignItems: 'center',
    // Neobrutalist shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
      },
      android: { 
        elevation: 4,
      },
    }),
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)', // Subtle overlay
    marginTop: 8,
    // Sharp corners for neobrutalism
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 4,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16,
  },
});