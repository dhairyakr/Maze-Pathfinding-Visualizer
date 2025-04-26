import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, ChevronRight, History } from 'lucide-react';
import { Algorithm, Stats, AlgorithmStep } from '../types';

interface StatsPanelProps {
  stats: Stats;
  algorithm: Algorithm;
  darkMode: boolean;
  isAnimating: boolean;
}

export function StatsPanel({ stats, algorithm, darkMode, isAnimating }: StatsPanelProps) {
  const algorithmDescriptions = {
    astar: "A* combines Dijkstra's algorithm with heuristic estimation for optimal pathfinding.",
    dijkstra: "Dijkstra's algorithm guarantees the shortest path by exploring all possible routes.",
    bfs: "Breadth-First Search explores level by level, ideal for unweighted shortest paths.",
    dfs: "Depth-First Search explores as far as possible along each branch before backtracking.",
    greedy: "Greedy Best-First Search always moves toward the goal, fast but not always optimal.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-xl p-6 shadow-lg`}
    >
      <h2 className="text-2xl font-bold mb-6">Algorithm Stats</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Current Algorithm</h3>
          <p className="text-sm opacity-80">{algorithmDescriptions[algorithm]}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Timer size={20} />
            </div>
            <div>
              <p className="text-sm opacity-80">Execution Time</p>
              <p className="text-xl font-bold">
                {stats.executionTime.toFixed(2)} ms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Zap size={20} />
            </div>
            <div>
              <p className="text-sm opacity-80">Cells Visited</p>
              <p className="text-xl font-bold">{stats.visitedCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <ChevronRight size={20} />
            </div>
            <div>
              <p className="text-sm opacity-80">Path Length</p>
              <p className="text-xl font-bold">{stats.pathLength}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <History size={18} />
            Algorithm Steps
          </h3>
          <div className={`max-h-60 overflow-y-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
            <AnimatePresence mode="popLayout">
              {stats.steps?.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-2 rounded-lg mb-2 text-sm ${
                    step.type === 'complete'
                      ? 'bg-green-500 bg-opacity-10 text-green-500'
                      : step.type === 'explore'
                      ? darkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-100'
                      : ''
                  }`}
                >
                  {step.description}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-blue-500 bg-opacity-10 rounded-lg"
          >
            <p className="text-sm text-blue-500">
              Algorithm is running...
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}