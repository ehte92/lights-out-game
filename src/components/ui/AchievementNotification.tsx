import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Achievement } from '../../types/game';
// Removed useAppTheme and useAppTypography to avoid hook conflicts

interface AchievementNotificationProps {
  achievement: Achievement;
  visible: boolean;
  onAnimationComplete?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  visible,
  onAnimationComplete,
}) => {
  const insets = useSafeAreaInsets();
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (__DEV__) {
        console.log(`🏆 📱 AchievementNotification: Starting animation for ${String(achievement.title)}`);
      }
      
      // Show animation sequence
      Animated.sequence([
        // Slide in from left with scale
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 16,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 120,
            friction: 6,
          }),
        ]),
        // Icon rotation celebration
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        // Pulse effect
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Hold for reading
        Animated.delay(2000),
        // Slide out to right
        Animated.spring(slideAnim, {
          toValue: screenWidth,
          useNativeDriver: true,
          tension: 80,
          friction: 6,
        }),
      ]).start(() => {
        if (__DEV__) {
          console.log(`🏆 📱 AchievementNotification: Animation completed for ${String(achievement.title)}`);
        }
        
        // Reset animations for next time
        slideAnim.setValue(-screenWidth);
        scaleAnim.setValue(0.8);
        pulseAnim.setValue(1);
        rotateAnim.setValue(0);
        onAnimationComplete?.();
      });
    }
  }, [visible, achievement.id, slideAnim, scaleAnim, rotateAnim, pulseAnim, onAnimationComplete]);

  if (!visible) return null;

  // Ensure all text properties are safe strings
  const safeTitle = String(achievement?.title || 'Achievement');
  const safeDescription = String(achievement?.description || '');

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 20, // Dynamic safe area + padding
          transform: [
            { translateX: slideAnim },
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
          ],
        },
      ]}
    >
      <View style={[styles.notification, { backgroundColor: '#0066FF' }]}> {/* Electric blue */}
        {/* Trophy Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <MaterialIcons 
            name="emoji-events" 
            size={32} 
            color="#FFFFFF"
          />
        </Animated.View>

        {/* Achievement Text */}
        <View style={styles.textContainer}>
          <Text 
            style={styles.title}
            numberOfLines={1}
          >
            {'🏆 ACHIEVEMENT UNLOCKED!'}
          </Text>
          <Text 
            style={styles.achievementTitle}
            numberOfLines={2}
          >
            {safeTitle}
          </Text>
          <Text 
            style={styles.description}
            numberOfLines={3}
          >
            {safeDescription}
          </Text>
        </View>
      </View>

      {/* Celebration particles effect */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [-screenWidth, 16, screenWidth],
                      outputRange: [0, Math.random() * 20 - 10, 0],
                    }),
                  },
                  {
                    translateY: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0, -5],
                    }),
                  },
                ],
                opacity: slideAnim.interpolate({
                  inputRange: [-screenWidth, 16, screenWidth],
                  outputRange: [0, 1, 0],
                }),
              },
            ]}
          >
            <Text style={styles.particleText}>{'✨'}</Text>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10000, // Higher z-index to ensure it's above everything
  },
  notification: {
    marginHorizontal: 16,
    borderRadius: 0, // Sharp corners for neobrutalism
    borderWidth: 4,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'flex-start', // Change to flex-start for better text alignment
    padding: 20, // Increased padding for better spacing
    minHeight: 80, // Minimum height to prevent cramping
    // Neobrutalist shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4, // Slight offset to align with text
  },
  textContainer: {
    flex: 1,
    paddingRight: 8, // Extra padding to prevent text from hitting edge
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 6,
    lineHeight: 14, // Explicit line height
  },
  achievementTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 4,
    lineHeight: 22, // Explicit line height
  },
  description: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    opacity: 0.9,
    lineHeight: 18, // Explicit line height
    // Removed flexWrap as it's not valid for Text components
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    top: 20,
    left: '50%',
  },
  particleText: {
    fontSize: 16,
    color: '#FFD700',
  },
});