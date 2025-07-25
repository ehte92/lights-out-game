import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Surface, Text, Icon } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '../../contexts/AppThemeContext';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

interface MenuCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  variant = 'secondary',
  disabled = false,
}) => {
  const { colors, paperTheme } = useAppTheme();
  
  const scale = useSharedValue(1);
  const elevation = useSharedValue(2);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
    elevation.value = withTiming(1);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    elevation.value = withTiming(variant === 'primary' ? 4 : 2);
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const animatedSurfaceProps = useAnimatedStyle(() => ({
    elevation: elevation.value,
  }));

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return paperTheme.colors.primary;
      case 'tertiary':
        return paperTheme.colors.tertiary;
      default:
        return colors.panelBackground;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return paperTheme.colors.onPrimary;
      case 'tertiary':
        return paperTheme.colors.onTertiary;
      default:
        return paperTheme.colors.onSurface;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return paperTheme.colors.onPrimary;
      case 'tertiary':
        return paperTheme.colors.onTertiary;
      default:
        return paperTheme.colors.primary;
    }
  };

  return (
    <Animated.View style={[animatedStyle, styles.container]}>
      <AnimatedSurface
        style={[
          styles.surface,
          { backgroundColor: getBackgroundColor() },
          animatedSurfaceProps,
        ]}
        elevation={variant === 'primary' ? 4 : 2}
      >
        <Pressable
          style={styles.pressable}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
        >
          <Icon
            source={icon}
            size={24}
            color={getIconColor()}
          />
          <Text
            variant={variant === 'primary' ? 'headlineSmall' : 'titleMedium'}
            style={[styles.title, { color: getTextColor() }]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              variant="bodyMedium"
              style={[styles.subtitle, { color: getTextColor(), opacity: 0.7 }]}
            >
              {subtitle}
            </Text>
          )}
        </Pressable>
      </AnimatedSurface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  surface: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 60,
  },
  title: {
    flex: 1,
    marginLeft: 16,
    fontWeight: '600',
  },
  subtitle: {
    marginLeft: 16,
    fontSize: 12,
  },
});