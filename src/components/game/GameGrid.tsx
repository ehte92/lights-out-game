import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { GameCell } from './GameCell';
import { GameState } from '../../types/game';

interface GameGridProps {
  gameState: GameState;
  onCellPress: (row: number, col: number) => void;
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const GRID_PADDING = 40;
const MAX_GRID_WIDTH = Math.min(screenWidth - GRID_PADDING, 400);

export const GameGrid: React.FC<GameGridProps> = ({
  gameState,
  onCellPress,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  
  const { cellSize, gridWidth } = useMemo(() => {
    const size = gameState.gridSize;
    const totalMargin = (size - 1) * 8; // 4px margin on each side of each cell
    const availableWidth = MAX_GRID_WIDTH - totalMargin;
    const calculatedCellSize = Math.floor(availableWidth / size);
    const calculatedGridWidth = (calculatedCellSize * size) + totalMargin;
    
    return {
      cellSize: calculatedCellSize,
      gridWidth: calculatedGridWidth,
    };
  }, [gameState.gridSize]);

  // Victory animation
  React.useEffect(() => {
    if (gameState.isComplete) {
      scale.value = withDelay(
        100,
        withSpring(1.05, { duration: 300 }, () => {
          scale.value = withSpring(1, { duration: 200 });
        })
      );
    }
  }, [gameState.isComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderRow = (row: boolean[], rowIndex: number) => (
    <View key={rowIndex} style={styles.row}>
      {row.map((cellValue, colIndex) => (
        <GameCell
          key={`${rowIndex}-${colIndex}`}
          isOn={cellValue}
          row={rowIndex}
          col={colIndex}
          size={cellSize}
          onPress={onCellPress}
          disabled={disabled || gameState.isComplete}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.grid,
          {
            width: gridWidth,
            height: gridWidth,
          },
          animatedStyle,
        ]}
      >
        {gameState.grid.map((row, rowIndex) => renderRow(row, rowIndex))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  grid: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});