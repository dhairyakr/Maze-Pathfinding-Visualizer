import React from 'react';
import { Settings2, Play, RefreshCw } from 'lucide-react';
import { Algorithm } from '../types';

interface ControlsProps {
  algorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  gridSize: { rows: number; cols: number };
  onGridSizeChange: (size: { rows: number; cols: number }) => void;
  onGenerateNewMaze: () => void;
  onStartPathfinding: () => void;
  isAnimating: boolean;
  darkMode: boolean;
}

export function Controls({
  algorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  gridSize,
  onGridSizeChange,
  onGenerateNewMaze,
  onStartPathfinding,
  isAnimating,
  darkMode,
}: ControlsProps) {
  const buttonClass = `px-4 py-2 rounded-lg flex items-center gap-2 ${
    darkMode
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-blue-500 hover:bg-blue-600 text-white'
  }`;

  const selectClass = `px-4 py-2 rounded-lg ${
    darkMode
      ? 'bg-gray-800 border-gray-700 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  } border`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
          className={selectClass}
          disabled={isAnimating}
        >
          <option value="astar">A* Algorithm</option>
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="bfs">Breadth-First Search</option>
          <option value="dfs">Depth-First Search</option>
          <option value="greedy">Greedy Best-First Search</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Animation Speed</label>
        <input
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full"
          disabled={isAnimating}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Grid Size</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="5"
            max="50"
            value={gridSize.rows}
            onChange={(e) =>
              onGridSizeChange({ ...gridSize, rows: Number(e.target.value) })
            }
            className={`w-20 px-2 py-1 rounded ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border`}
            disabled={isAnimating}
          />
          <span className="self-center">×</span>
          <input
            type="number"
            min="5"
            max="50"
            value={gridSize.cols}
            onChange={(e) =>
              onGridSizeChange({ ...gridSize, cols: Number(e.target.value) })
            }
            className={`w-20 px-2 py-1 rounded ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border`}
            disabled={isAnimating}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onGenerateNewMaze}
          className={buttonClass}
          disabled={isAnimating}
        >
          <RefreshCw size={20} />
          New Maze
        </button>
        <button
          onClick={onStartPathfinding}
          className={buttonClass}
          disabled={isAnimating}
        >
          <Play size={20} />
          Start
        </button>
      </div>
    </div>
  );
}