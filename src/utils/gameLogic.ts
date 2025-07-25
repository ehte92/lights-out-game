import { GameState, Difficulty, Position } from '../types/game';

/**
 * Creates an empty grid with all cells turned off
 */
export const createEmptyGrid = (size: number): boolean[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(false));
};

/**
 * Creates a solved grid with all cells turned on (for debugging)
 */
export const createSolvedGrid = (size: number): boolean[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(true));
};

/**
 * Toggles a cell and its 4-directional neighbors
 */
export const toggleCell = (grid: boolean[][], row: number, col: number): boolean[][] => {
  const newGrid = grid.map(r => [...r]);
  const size = grid.length;
  
  // Directions: current cell + 4 neighbors (up, down, left, right)
  const directions = [
    [0, 0],   // current cell
    [-1, 0],  // up
    [1, 0],   // down
    [0, -1],  // left
    [0, 1],   // right
  ];

  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    
    // Check if the position is within bounds
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      newGrid[newRow][newCol] = !newGrid[newRow][newCol];
    }
  });

  return newGrid;
};

/**
 * Checks if the game is complete (all cells are off)
 */
export const isGameComplete = (grid: boolean[][]): boolean => {
  return grid.every(row => row.every(cell => !cell));
};

/**
 * Alternative win condition - all cells are on
 */
export const isGameCompleteAllOn = (grid: boolean[][]): boolean => {
  return grid.every(row => row.every(cell => cell));
};

/**
 * Generates a solvable puzzle by starting from solved state and applying random moves
 */
export const generatePuzzle = (size: number, difficulty: Difficulty): boolean[][] => {
  let grid = createEmptyGrid(size); // Start with all cells off (solved state)
  
  // Determine number of moves based on difficulty
  const moveCounts = {
    easy: { min: 3, max: 5 },
    medium: { min: 6, max: 9 },
    hard: { min: 10, max: 15 }
  };
  
  const { min, max } = moveCounts[difficulty];
  const numMoves = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Apply random moves to create a solvable puzzle
  const usedPositions = new Set<string>();
  
  for (let i = 0; i < numMoves; i++) {
    let row: number, col: number;
    let positionKey: string;
    
    // Avoid clicking the same position multiple times (would cancel out)
    do {
      row = Math.floor(Math.random() * size);
      col = Math.floor(Math.random() * size);
      positionKey = `${row},${col}`;
    } while (usedPositions.has(positionKey));
    
    usedPositions.add(positionKey);
    grid = toggleCell(grid, row, col);
  }
  
  return grid;
};

/**
 * Creates initial game state
 */
export const createInitialGameState = (
  gridSize: number, 
  difficulty: Difficulty
): GameState => {
  const grid = generatePuzzle(gridSize, difficulty);
  
  return {
    grid,
    moves: 0,
    isComplete: false,
    difficulty,
    elapsedTime: 0,
    lastResumeTime: Date.now(), // Start timing immediately
    gridSize,
  };
};

/**
 * Gets valid positions for hint system (cells that would progress towards solution)
 */
export const getHintPositions = (grid: boolean[][]): Position[] => {
  const positions: Position[] = [];
  const size = grid.length;
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // This is a simplified hint system
      // In a full implementation, you'd use Gaussian elimination to find optimal moves
      if (grid[row][col]) {
        positions.push({ row, col });
      }
    }
  }
  
  return positions;
};

/**
 * Calculates game score based on moves and time
 */
export const calculateScore = (moves: number, timeInSeconds: number, difficulty: Difficulty): number => {
  const difficultyMultipliers = {
    easy: 1,
    medium: 1.5,
    hard: 2
  };
  
  const baseScore = 1000;
  const movesPenalty = moves * 10;
  const timePenalty = timeInSeconds * 2;
  const difficultyBonus = baseScore * difficultyMultipliers[difficulty];
  
  return Math.max(0, Math.floor(difficultyBonus - movesPenalty - timePenalty));
};