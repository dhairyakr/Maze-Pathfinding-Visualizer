import React from 'react';
import { Cell } from '../types';

interface MazeGridProps {
  grid: Cell[][];
  visitedCells: Set<string>;
  path: [number, number][];
  darkMode: boolean;
}

export function MazeGrid({ grid, visitedCells, path, darkMode }: MazeGridProps) {
  const cellSize = Math.min(
    Math.floor((window.innerWidth - 32) / grid[0]?.length),
    25
  );

  return (
    <div
      className={`border ${
        darkMode ? 'border-gray-700' : 'border-gray-300'
      } rounded-lg p-4 overflow-auto`}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0]?.length}, ${cellSize}px)`,
          gap: '1px',
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const isStart = i === 0 && j === 0;
            const isEnd =
              i === grid.length - 1 && j === grid[0].length - 1;
            const isVisited = visitedCells.has(`${i},${j}`);
            const isPath = path.some(([x, y]) => x === i && y === j);

            let backgroundColor = darkMode ? 'bg-gray-800' : 'bg-white';
            if (isStart) backgroundColor = 'bg-green-500';
            else if (isEnd) backgroundColor = 'bg-red-500';
            else if (isPath) backgroundColor = 'bg-yellow-400';
            else if (isVisited) backgroundColor = darkMode ? 'bg-blue-900' : 'bg-blue-200';

            return (
              <div
                key={`${i}-${j}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                className={`${backgroundColor} relative`}
              >
                {cell.walls.north && (
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  />
                )}
                {cell.walls.east && (
                  <div
                    className={`absolute top-0 right-0 bottom-0 w-0.5 ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  />
                )}
                {cell.walls.south && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  />
                )}
                {cell.walls.west && (
                  <div
                    className={`absolute top-0 left-0 bottom-0 w-0.5 ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}