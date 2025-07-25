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
import { useAppTheme, useAppBorders } from '../../contexts/AppThemeContext';

interface GameGridProps {
  gameState: GameState;
  onCellPress: (row: number, col: number) => void;
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const GRID_MARGIN = 24; // Reduced margins for larger grid
const MAX_GRID_WIDTH = Math.min(screenWidth - GRID_MARGIN, 500); // Increased max size

export const GameGrid: React.FC<GameGridProps> = ({
  gameState,
  onCellPress,
  disabled = false,
}) => {
  const { colors } = useAppTheme();
  const borders = useAppBorders();
  const scale = useSharedValue(1);
  
  const { cellSize, gridWidth, cellGap } = useMemo(() => {
    const size = gameState.gridSize;
    const gap = 12; // Generous gap for floating cell aesthetic
    
    // Use most of the screen width for natural floating appearance
    const targetWidth = Math.min(screenWidth * 0.9, 480); // Larger for floating design
    
    // Calculate total gap space needed
    const totalGapSpace = (size - 1) * gap;
    
    // Available space for just the cells (no padding needed for floating design)
    const availableForCells = targetWidth - totalGapSpace;
    
    // Calculate cell size
    const rawCellSize = availableForCells / size;
    const calculatedCellSize = Math.floor(rawCellSize);
    
    // Ensure excellent cell size for floating design
    const minCellSize = 70; // Larger cells for better floating aesthetic
    const finalCellSize = Math.max(calculatedCellSize, minCellSize);
    
    // Recalculate grid width based on final cell size
    const actualCellsWidth = finalCellSize * size;
    const finalGridWidth = actualCellsWidth + totalGapSpace;
    
    return {
      cellSize: finalCellSize,
      gridWidth: finalGridWidth,
      cellGap: gap,
    };
  }, [gameState.gridSize, screenWidth]);

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