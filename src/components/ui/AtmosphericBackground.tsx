import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
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

interface AtmosphericBackgroundProps {
  children: React.ReactNode;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ children }) => {
  const { colors, paperTheme } = useAppTheme();
  
  // Create floating particles based on theme
  const particles: FloatingParticle[] = React.useMemo(() => {
    const particleCount = 12;
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      initialX: Math.random() * screenWidth,
      initialY: Math.random() * screenHeight,
      size: Math.random() * 6 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 8000 + 12000, // 12-20 seconds
    }));
  }, []);

  const getThemeGradients = () => {
    const themeId = 'serene'; // Fixed to app theme
    
    switch (themeId) {
      case 'serene':
        return {
          primary: ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8'],
          secondary: ['#6366f1', '#8b5cf6', '#06b6d4'],
          particle: '#6366f1',
        };
      case 'neon':
        return {
          primary: ['#0f0f23', '#1a1a2e', '#16213e', '#0f3460'],
          secondary: ['#e94560', '#f39c12', '#00d4aa'],
          particle: '#00d4aa',
        };
      case 'nature':
        return {
          primary: ['#1e3c72', '#2a5298', '#134e5e', '#71b280'],
          secondary: ['#71b280', '#134e5e', '#2a5298'],
          particle: '#71b280',
        };
      case 'space':
        return {
          primary: ['#0c0c0c', '#1a1a2e', '#16213e', '#0f3460'],
          secondary: ['#ffffff', '#e94560', '#f39c12'],
          particle: '#ffffff',
        };
      case 'retro':
        return {
          primary: ['#ff0080', '#ff8c00', '#40e0d0', '#9400d3'],
          secondary: ['#ff0080', '#ff8c00', '#40e0d0'],
          particle: '#ff0080',
        };
      case 'minimal':
        return {
          primary: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da'],
          secondary: ['#6c757d', '#495057', '#343a40'],
          particle: '#6c757d',
        };
      case 'classic':
        return {
          primary: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
          secondary: ['#ffecd2', '#fcb69f', '#667eea'],
          particle: '#667eea',
        };
      default: // serene fallback
        return {
          primary: ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8'],
          secondary: ['#6366f1', '#8b5cf6', '#06b6d4'],
          particle: '#6366f1',
        };
    }
  };

  const themeGradients = getThemeGradients();

  return (
    <Animated.View style={styles.container}>
      {/* Primary Background Gradient */}
      <LinearGradient
        colors={themeGradients.primary}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Secondary Overlay Gradient */}
      <LinearGradient
        colors={[
          'transparent',
          `${themeGradients.secondary[0]}15`,
          `${themeGradients.secondary[1]}10`,
          'transparent',
        ]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Floating Particles */}
      {particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          particle={particle}
          color={themeGradients.particle}
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
    // Floating animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(particle.initialY - 100, { duration: particle.duration }),
        withTiming(particle.initialY + 100, { duration: particle.duration })
      ),
      -1,
      true
    );
    
    // Horizontal drift
    translateX.value = withRepeat(
      withSequence(
        withTiming(particle.initialX + 50, { duration: particle.duration * 1.5 }),
        withTiming(particle.initialX - 50, { duration: particle.duration * 1.5 })
      ),
      -1,
      true
    );
    
    // Opacity breathing
    opacity.value = withRepeat(
      withSequence(
        withTiming(particle.opacity * 0.3, { duration: particle.duration * 0.6 }),
        withTiming(particle.opacity, { duration: particle.duration * 0.6 })
      ),
      -1,
      true
    );
    
    // Scale pulsing
    scale.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: particle.duration * 0.8 }),
        withTiming(1.2, { duration: particle.duration * 0.8 })
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
          backgroundColor: color,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});