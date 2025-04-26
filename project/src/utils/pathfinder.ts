import { Cell, Algorithm, AlgorithmStep } from '../types';

interface Node {
  row: number;
  col: number;
  g: number;
  h: number;
  f: number;
  parent?: Node;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function heuristic(row: number, col: number, endRow: number, endCol: number): number {
  return Math.abs(row - endRow) + Math.abs(col - endCol);
}

function getNeighbors(
  node: Node,
  grid: Cell[][],
  visited: Set<string>
): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;
  const directions = [
    ['north', -1, 0],
    ['east', 0, 1],
    ['south', 1, 0],
    ['west', 0, -1],
  ];

  for (const [wall, dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      !grid[row][col].walls[wall] &&
      !visited.has(`${newRow},${newCol}`)
    ) {
      neighbors.push({
        row: newRow,
        col: newCol,
        g: 0,
        h: 0,
        f: 0,
      });
    }
  }

  return neighbors;
}

export async function findPath(
  grid: Cell[][],
  [startRow, startCol]: [number, number],
  [endRow, endCol]: [number, number],
  algorithm: Algorithm,
  onVisit: (visited: string[], steps: AlgorithmStep[]) => void,
  speed: number
): Promise<[number, number][]> {
  const visited = new Set<string>();
  const steps: AlgorithmStep[] = [];
  const start: Node = {
    row: startRow,
    col: startCol,
    g: 0,
    h: heuristic(startRow, startCol, endRow, endCol),
    f: 0,
  };

  let openSet: Node[] = [start];
  const cameFrom = new Map<string, Node>();

  const addStep = (step: AlgorithmStep) => {
    steps.push(step);
    onVisit(Array.from(visited), steps);
  };

  while (openSet.length > 0) {
    if (algorithm === 'astar' || algorithm === 'greedy') {
      openSet.sort((a, b) => a.f - b.f);
    }

    const current = openSet.shift()!;
    const currentKey = `${current.row},${current.col}`;

    if (current.row === endRow && current.col === endCol) {
      // Reconstruct path
      const path: [number, number][] = [];
      let currentNode: Node | undefined = current;
      
      addStep({
        description: 'Path found! Reconstructing the optimal route.',
        visitedCells: Array.from(visited),
        type: 'complete'
      });

      while (currentNode) {
        path.unshift([currentNode.row, currentNode.col]);
        const key = `${currentNode.row},${currentNode.col}`;
        currentNode = cameFrom.get(key);
      }
      return path;
    }

    visited.add(currentKey);
    
    let stepDescription = '';
    switch (algorithm) {
      case 'astar':
        stepDescription = `Exploring node (${current.row},${current.col}) with f=${current.f}, g=${current.g}, h=${current.h}`;
        break;
      case 'dijkstra':
        stepDescription = `Exploring node (${current.row},${current.col}) with distance ${current.g}`;
        break;
      case 'greedy':
        stepDescription = `Moving to closest node to goal (${current.row},${current.col})`;
        break;
      case 'bfs':
        stepDescription = `Exploring level ${current.g} at node (${current.row},${current.col})`;
        break;
      case 'dfs':
        stepDescription = `Exploring depth ${visited.size} at node (${current.row},${current.col})`;
        break;
    }

    addStep({
      description: stepDescription,
      visitedCells: Array.from(visited),
      currentCell: [current.row, current.col],
      type: 'explore'
    });

    await sleep(100 - speed);

    const neighbors = getNeighbors(current, grid, visited);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;

      neighbor.g = current.g + 1;
      neighbor.h = heuristic(neighbor.row, neighbor.col, endRow, endCol);
      
      switch (algorithm) {
        case 'astar':
          neighbor.f = neighbor.g + neighbor.h;
          break;
        case 'dijkstra':
          neighbor.f = neighbor.g;
          break;
        case 'greedy':
          neighbor.f = neighbor.h;
          break;
        case 'bfs':
        case 'dfs':
          neighbor.f = 0;
          break;
      }

      cameFrom.set(neighborKey, current);
      
      if (algorithm === 'dfs') {
        openSet.unshift(neighbor);
      } else {
        openSet.push(neighbor);
      }

      addStep({
        description: `Adding neighbor (${neighbor.row},${neighbor.col}) to exploration queue`,
        visitedCells: Array.from(visited),
        currentCell: [neighbor.row, neighbor.col],
        type: 'explore'
      });
    }
  }

  addStep({
    description: 'No path found to the target.',
    visitedCells: Array.from(visited),
    type: 'complete'
  });

  return [];
}