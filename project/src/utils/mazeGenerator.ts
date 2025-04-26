import { Cell } from '../types';

export function generateMaze(rows: number, cols: number): Cell[][] {
  // Initialize grid with all walls
  const grid: Cell[][] = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          walls: { north: true, east: true, south: true, west: true },
        }))
    );

  const stack: [number, number][] = [];
  const visited = new Set<string>();

  // Start from top-left corner
  stack.push([0, 0]);
  visited.add('0,0');

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack[stack.length - 1];
    const neighbors: [number, number][] = [];

    // Check all possible neighbors
    const directions = [
      [-1, 0, 'north', 'south'], // North
      [0, 1, 'east', 'west'],    // East
      [1, 0, 'south', 'north'],  // South
      [0, -1, 'west', 'east'],   // West
    ];

    for (const [dr, dc, wall1, wall2] of directions) {
      const newRow = currentRow + dr;
      const newCol = currentCol + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited.has(`${newRow},${newCol}`)
      ) {
        neighbors.push([newRow, newCol, wall1, wall2]);
      }
    }

    if (neighbors.length > 0) {
      // Choose a random unvisited neighbor
      const [nextRow, nextCol, wall1, wall2] = neighbors[
        Math.floor(Math.random() * neighbors.length)
      ];

      // Remove walls between current cell and chosen neighbor
      grid[currentRow][currentCol].walls[wall1] = false;
      grid[nextRow][nextCol].walls[wall2] = false;

      stack.push([nextRow, nextCol]);
      visited.add(`${nextRow},${nextCol}`);
    } else {
      stack.pop();
    }
  }

  return grid;
}