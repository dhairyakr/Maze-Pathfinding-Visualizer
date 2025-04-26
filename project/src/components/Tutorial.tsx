import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
  darkMode: boolean;
}

export function Tutorial({ onClose, darkMode }: TutorialProps) {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl p-6 max-w-2xl w-full mx-4 relative`}
        variants={modalVariants}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">How to Use the Visualizer</h2>

        <div className="space-y-4">
          <section>
            <h3 className="text-xl font-semibold mb-2">Algorithms</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>A* (A-Star):</strong> Combines Dijkstra's and heuristic approach for optimal pathfinding</li>
              <li><strong>Dijkstra's:</strong> Guarantees shortest path by exploring all directions equally</li>
              <li><strong>BFS:</strong> Explores level by level, good for unweighted shortest paths</li>
              <li><strong>DFS:</strong> Explores as far as possible along each branch before backtracking</li>
              <li><strong>Greedy:</strong> Always moves toward the goal, fast but not always optimal</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">Controls</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Grid Size:</strong> Adjust the maze dimensions (5-50)</li>
              <li><strong>Speed:</strong> Control the animation speed</li>
              <li><strong>New Maze:</strong> Generate a fresh random maze</li>
              <li><strong>Start:</strong> Begin the pathfinding visualization</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">Cell Colors</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Green:</strong> Start point (top-left)</li>
              <li><strong>Red:</strong> End point (bottom-right)</li>
              <li><strong>Blue:</strong> Visited cells during search</li>
              <li><strong>Yellow:</strong> Final path found</li>
            </ul>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}