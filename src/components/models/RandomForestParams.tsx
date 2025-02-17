import { useState } from 'react';
import { Trees as Tree, ChevronDown, Trees } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  numTrees: number;
  maxDepth: number;
  minSamplesSplit: number;
  minSamplesLeaf: number;
  onNumTreesChange: (value: number) => void;
  onMaxDepthChange: (value: number) => void;
  onMinSamplesSplitChange: (value: number) => void;
  onMinSamplesLeafChange: (value: number) => void;
}

export default function RandomForestParams({
                                             numTrees,
                                             maxDepth,
                                             minSamplesSplit,
                                             minSamplesLeaf,
                                             onNumTreesChange,
                                             onMaxDepthChange,
                                             onMinSamplesSplitChange,
                                             onMinSamplesLeafChange,
                                           }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Default ranges based on common practices
  const ranges = {
    numTrees: { min: 10, max: 1000, default: 100 },
    maxDepth: { min: 1, max: 50, default: 10 },
    minSamplesSplit: { min: 2, max: 20, default: 2 },
    minSamplesLeaf: { min: 1, max: 10, default: 1 }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between p-4
          bg-gradient-to-r from-gray-50 to-white
          border border-gray-200 rounded-lg
          hover:border-primary-500 hover:shadow-md
          transition-all duration-200
          group
        `}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
            <Trees className="w-5 h-5 text-primary-600"/>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-900">Random Forest Parameters</span>
            <span className="text-sm text-gray-500">{numTrees} trees, max depth {maxDepth}</span>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-all duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 p-6 border rounded-lg bg-white shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                {/* Number of Trees */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tree className="w-4 h-4 text-primary-600" />
                    <label className="block text-sm font-medium text-gray-700">
                      Number of Trees
                    </label>
                  </div>
                  <input
                    type="number"
                    value={numTrees}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseInt(e.target.value) || ranges.numTrees.min, ranges.numTrees.min),
                        ranges.numTrees.max
                      );
                      onNumTreesChange(value);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    Range: {ranges.numTrees.min} - {ranges.numTrees.max}
                  </p>
                </div>

                {/* Max Depth */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tree className="w-4 h-4 text-primary-600" />
                    <label className="block text-sm font-medium text-gray-700">
                      Maximum Depth
                    </label>
                  </div>
                  <input
                    type="number"
                    value={maxDepth}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseInt(e.target.value) || ranges.maxDepth.min, ranges.maxDepth.min),
                        ranges.maxDepth.max
                      );
                      onMaxDepthChange(value);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    Range: {ranges.maxDepth.min} - {ranges.maxDepth.max}
                  </p>
                </div>

                {/* Min Samples Split */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tree className="w-4 h-4 text-primary-600" />
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Samples Split
                    </label>
                  </div>
                  <input
                    type="number"
                    value={minSamplesSplit}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseInt(e.target.value) || ranges.minSamplesSplit.min, ranges.minSamplesSplit.min),
                        ranges.minSamplesSplit.max
                      );
                      onMinSamplesSplitChange(value);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    Range: {ranges.minSamplesSplit.min} - {ranges.minSamplesSplit.max}
                  </p>
                </div>

                {/* Min Samples Leaf */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tree className="w-4 h-4 text-primary-600" />
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Samples Leaf
                    </label>
                  </div>
                  <input
                    type="number"
                    value={minSamplesLeaf}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseInt(e.target.value) || ranges.minSamplesLeaf.min, ranges.minSamplesLeaf.min),
                        ranges.minSamplesLeaf.max
                      );
                      onMinSamplesLeafChange(value);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    Range: {ranges.minSamplesLeaf.min} - {ranges.minSamplesLeaf.max}
                  </p>
                </div>
              </div>

              {/* Parameter Descriptions */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Parameter Descriptions</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><strong>Number of Trees:</strong> The number of trees in the forest. More trees provide better results but increase computation time.</li>
                  <li><strong>Maximum Depth:</strong> The maximum depth of each tree. Deeper trees can capture more complex patterns but may overfit.</li>
                  <li><strong>Minimum Samples Split:</strong> The minimum number of samples required to split an internal node.</li>
                  <li><strong>Minimum Samples Leaf:</strong> The minimum number of samples required to be at a leaf node.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}