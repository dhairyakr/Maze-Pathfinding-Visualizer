import React, { useState, useEffect, useCallback } from 'react';
import { Settings2, Play, RefreshCw, Moon, Sun, Info, X, ChevronRight, Timer, Zap, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MazeGrid } from './components/MazeGrid';
import { Controls } from './components/Controls';
import { generateMaze } from './utils/mazeGenerator';
import { findPath } from './utils/pathfinder';
import { Cell, Algorithm, Stats } from './types';
import { Tutorial } from './components/Tutorial';
import { StatsPanel } from './components/StatsPanel';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gridSize, setGridSize] = useState({ rows: 20, cols: 20 });
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [speed, setSpeed] = useState(50);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<[number, number][]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [stats, setStats] = useState<Stats>({
    visitedCount: 0,
    pathLength: 0,
    executionTime: 0,
    steps: []
  });

  const initializeMaze = useCallback(() => {
    const newMaze = generateMaze(gridSize.rows, gridSize.cols);
    setGrid(newMaze);
    setVisitedCells(new Set());
    setPath([]);
    setStats({ visitedCount: 0, pathLength: 0, executionTime: 0, steps: [] });
  }, [gridSize]);

  useEffect(() => {
    initializeMaze();
  }, [initializeMaze]);

  const handleAlgorithmChange = (newAlgorithm: Algorithm) => {
    setAlgorithm(newAlgorithm);
    setVisitedCells(new Set());
    setPath([]);
    setStats({ visitedCount: 0, pathLength: 0, executionTime: 0, steps: [] });
  };

  const startPathfinding = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setVisitedCells(new Set());
    setPath([]);
    setStats(prev => ({ ...prev, steps: [] }));

    const startTime = performance.now();
    const result = await findPath(
      grid,
      [0, 0],
      [gridSize.rows - 1, gridSize.cols - 1],
      algorithm,
      (visited, steps) => {
        setVisitedCells(new Set(visited));
        setStats(prev => ({ ...prev, visitedCount: visited.length, steps }));
      },
      speed
    );
    const endTime = performance.now();

    setPath(result);
    setStats(prev => ({
      ...prev,
      pathLength: result.length,
      executionTime: endTime - startTime
    }));
    setIsAnimating(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Maze Pathfinding Visualizer
          </motion.h1>
          <div className="flex items-center gap-4">
            <motion.a
              href="https://calm-douhua-29943c.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full flex items-center gap-2 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Route size={20} />
              <span className="text-sm">Route Optimization</span>
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowTutorial(true)}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Info size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>
        </div>

        <Controls
          algorithm={algorithm}
          onAlgorithmChange={handleAlgorithmChange}
          speed={speed}
          onSpeedChange={setSpeed}
          gridSize={gridSize}
          onGridSizeChange={setGridSize}
          onGenerateNewMaze={initializeMaze}
          onStartPathfinding={startPathfinding}
          isAnimating={isAnimating}
          darkMode={darkMode}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <MazeGrid
              grid={grid}
              visitedCells={visitedCells}
              path={path}
              darkMode={darkMode}
            />
          </div>
          <div className="lg:col-span-1">
            <StatsPanel
              stats={stats}
              algorithm={algorithm}
              darkMode={darkMode}
              isAnimating={isAnimating}
            />
          </div>
        </div>

        <AnimatePresence>
          {showTutorial && (
            <Tutorial onClose={() => setShowTutorial(false)} darkMode={darkMode} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;