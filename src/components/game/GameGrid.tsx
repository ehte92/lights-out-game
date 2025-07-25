import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { GameCell } from './GameCell';
import { GameState } from '../../types/game';
// Theme context not needed at grid level - all styling handled by GameCell

interface GameGridProps {
  gameState: GameState;
  onCellPress: (row: number, col: number) => void;
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

// Grid-size-aware specifications for responsive design
const getGridSpecs = (gridSize: number) => {
  switch (gridSize) {
    case 3:
      return { minCellSize: 75, gap: 14, maxWidth: 0.85 }; // Generous for 3x3
    case 4:
      return { minCellSize: 65, gap: 12, maxWidth: 0.88 }; // Classic 4x4
    case 5:
      return { minCellSize: 52, gap: 10, maxWidth: 0.90 }; // Tighter for 5x5
    case 6:
      return { minCellSize: 44, gap: 8, maxWidth: 0.92 };  // Compact for 6x6
    default:
      return { minCellSize: 65, gap: 12, maxWidth: 0.88 };
  }
};

export const GameGrid: React.FC<GameGridProps> = ({
  gameState,
  onCellPress,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  
  const { cellSize, gridWidth, cellGap } = useMemo(() => {
    const size = gameState.gridSize;
    const specs = getGridSpecs(size);
    
    // Use progressive screen width utilization
    const targetWidth = screenWidth * specs.maxWidth;
    
    // Calculate total gap space needed
    const totalGapSpace = (size - 1) * specs.gap;
    
    // Available space for just the cells
    const availableForCells = targetWidth - totalGapSpace;
    
    // Calculate optimal cell size
    const rawCellSize = availableForCells / size;
    const calculatedCellSize = Math.floor(rawCellSize);
    
    // Ensure minimum cell size for good touch targets (iOS: 44pt minimum)
    const finalCellSize = Math.max(calculatedCellSize, specs.minCellSize);
    
    // Recalculate grid width based on final cell size
    const actualCellsWidth = finalCellSize * size;
    const finalGridWidth = actualCellsWidth + totalGapSpace;
    
    // Debug logging for development
    if (__DEV__) {
      console.log(`📱 Grid sizing for ${size}×${size}:`, {
        screenWidth,
        targetWidth: Math.round(targetWidth),
        finalGridWidth: Math.round(finalGridWidth),
        cellSize: finalCellSize,
        gap: specs.gap,
        fitsOnScreen: finalGridWidth <= screenWidth
      });
    }
    
    return {
      cellSize: finalCellSize,
      gridWidth: finalGridWidth,
      cellGap: specs.gap,
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
  }, [gameState.isComplete, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderRow = (row: boolean[], rowIndex: number) => (
    <View key={rowIndex} style={[styles.row, { marginBottom: rowIndex < gameState.gridSize - 1 ? cellGap : 0 }]}>
      {row.map((cellValue, colIndex) => (
        <View
          key={`${rowIndex}-${colIndex}`}
          style={{ marginRight: colIndex < row.length - 1 ? cellGap : 0 }}
        >
          <GameCell
            isOn={cellValue}
            row={rowIndex}
            col={colIndex}
            size={cellSize}
            onPress={onCellPress}
            disabled={disabled || gameState.isComplete}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.floatingGrid,
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
    paddingVertical: 24, // Generous spacing for floating design
    flex: 1, // Fill available space naturally
  },
  floatingGrid: {
    // No background, no borders, no container styling
    // Cells float naturally in space
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});