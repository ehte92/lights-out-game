import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useAppTheme } from '../../contexts/AppThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FloatingParticle {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  opacity: number;
  duration: number;
}

interface AppAtmosphericBackgroundProps {
  children: React.ReactNode;
}

export const AppAtmosphericBackground: React.FC<AppAtmosphericBackgroundProps> = ({ children }) => {
  const { colors, gradients } = useAppTheme();
  
  // Create gentle floating particles for soothing effect
  const particles: FloatingParticle[] = React.useMemo(() => {
    const particleCount = 8; // Fewer particles for subtlety
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      initialX: Math.random() * screenWidth,
      initialY: Math.random() * screenHeight,
      size: Math.random() * 4 + 2, // Smaller particles
      opacity: Math.random() * 0.15 + 0.05, // Very subtle opacity
      duration: Math.random() * 12000 + 18000, // Slower movement
    }));
  }, []);

  return (
    <Animated.View style={styles.container}>
      {/* Primary Background Gradient - Fixed soothing colors */}
      <LinearGradient
        colors={gradients.primary}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Subtle Overlay Gradient */}
      <LinearGradient
        colors={gradients.overlay}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Gentle Floating Particles */}
      {particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          particle={particle}
          color={colors.primary}
        />
      ))}
      
      {/* Content */}
      {children}
    </Animated.View>
  );
};

interface FloatingParticleProps {
  particle: FloatingParticle;
  color: string;
}

const FloatingParticle: React.FC<FloatingParticleProps> = ({ particle, color }) => {
  const translateY = useSharedValue(particle.initialY);
  const translateX = useSharedValue(particle.initialX);
  const opacity = useSharedValue(particle.opacity);
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    // Gentle floating animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(particle.initialY - 60, { duration: particle.duration }),
        withTiming(particle.initialY + 60, { duration: particle.duration })
      ),
      -1,
      true
    );
    
    // Subtle horizontal drift
    translateX.value = withRepeat(
      withSequence(
        withTiming(particle.initialX + 30, { duration: particle.duration * 1.2 }),
        withTiming(particle.initialX - 30, { duration: particle.duration * 1.2 })
      ),
      -1,
      true
    );
    
    // Very gentle opacity breathing
    opacity.value = withRepeat(
      withSequence(
        withTiming(particle.opacity * 0.4, { duration: particle.duration * 0.8 }),
        withTiming(particle.opacity, { duration: particle.duration * 0.8 })
      ),
      -1,
      true
    );
    
    // Minimal scale pulsing
    scale.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: particle.duration }),
        withTiming(1.1, { duration: particle.duration })
      ),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size,
          backgroundColor: `${color}40`, // 40% opacity for subtlety
          borderRadius: particle.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, // Increased for better visibility on dark backgrounds
    shadowRadius: 4,
    elevation: 2, // Android shadow for dark theme
  },
});