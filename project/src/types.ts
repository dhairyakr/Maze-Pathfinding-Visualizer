export interface Cell {
  walls: {
    north: boolean;
    east: boolean;
    south: boolean;
    west: boolean;
  };
  visited?: boolean;
}

export type Algorithm = 'astar' | 'dijkstra' | 'bfs' | 'dfs' | 'greedy';

export interface Stats {
  visitedCount: number;
  pathLength: number;
  executionTime: number;
  steps: AlgorithmStep[];
}

export interface AlgorithmStep {
  description: string;
  visitedCells: string[];
  currentCell?: [number, number];
  type: 'explore' | 'backtrack' | 'path' | 'complete';
}