import {useState} from 'react';
import {ChevronDown, Trees as Tree, Zap} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';

interface Props {
  numTrees: number;
  maxDepth: number;
  learningRate: number;
  minChildWeight: number;
  subsample: number;
  colsampleByTree: number;
  onNumTreesChange: (value: number) => void;
  onMaxDepthChange: (value: number) => void;
  onLearningRateChange: (value: number) => void;
  onMinChildWeightChange: (value: number) => void;
  onSubsampleChange: (value: number) => void;
  onColsampleByTreeChange: (value: number) => void;
}

export default function XGBoostParams({
                                        numTrees,
                                        maxDepth,
                                        learningRate,
                                        minChildWeight,
                                        subsample,
                                        colsampleByTree,
                                        onNumTreesChange,
                                        onMaxDepthChange,
                                        onLearningRateChange,
                                        onMinChildWeightChange,
                                        onSubsampleChange,
                                        onColsampleByTreeChange,
                                      }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Default ranges based on common practices
  const ranges = {
    numTrees: {min: 10, max: 1000, default: 100},
    maxDepth: {min: 3, max: 15, default: 6},
    learningRate: {min: 0.01, max: 1, default: 0.3},
    minChildWeight: {min: 0, max: 10, default: 1},
    subsample: {min: 0.5, max: 1, default: 1},
    colsampleByTree: {min: 0.5, max: 1, default: 1}
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
            <Zap className="w-5 h-5 text-primary-600"/>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-900">XGBoost Parameters</span>
            <span className="text-sm text-gray-500">{numTrees} trees, learning rate {learningRate}</span>
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
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.2}}
            className="overflow-hidden"
          >
            <div className="space-y-6 p-6 border rounded-lg bg-white shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                {/* Number of Trees */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tree className="w-4 h-4 text-primary-600"/>
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
                    <Tree className="w-4 h-4 text-primary-600"/>
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

                {/* Learning Rate */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-600"/>
                    <label className="block text-sm font-medium text-gray-700">
                      Learning Rate
                    </label>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={learningRate}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseFloat(e.target.value) || ranges.learningRate.min, ranges.learningRate.min),
                        ranges.learningRate.max
                      );
                      onLearningRateChange(value);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    Range: {ranges.learningRate.min} - {ranges.learningRate.max}
                  </p>
                </div>

                {/* Min Child Weight */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tree className="w-4 h-4 text-primary-600"/>
                    <label className="block text-sm font-medium text-gray-700">
                      Min Child Weight
                    </label>
                  </div>
                  <input
                    type="number"
                    step="1"
                    value={minChildWeight}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseInt(e.target.value) || ranges.minChildWeight.min, ranges.minChildWeight.min),
                        ranges.minChildWeight.max
                      );
                      onMinChildWeightChange(value);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    Range: {ranges.minChildWeight.min} - {ranges.minChildWeight.max}
                  </p>
                </div>

                {/* Subsample */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tree className="w-4 h-4 text-primary-600"/>
                    <label className="block text-sm font-medium text-gray-700">
                      Subsample Ratio
                    </label>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={subsample}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseFloat(e.target.value) || ranges.subsample.min, ranges.subsample.min),
                        ranges.subsample.max
                      );
                      onSubsampleChange(value);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    Range: {ranges.subsample.min} - {ranges.subsample.max}
                  </p>
                </div>

                {/* Colsample By Tree */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tree className="w-4 h-4 text-primary-600"/>
                    <label className="block text-sm font-medium text-gray-700">
                      Column Sample Ratio
                    </label>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={colsampleByTree}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseFloat(e.target.value) || ranges.colsampleByTree.min, ranges.colsampleByTree.min),
                        ranges.colsampleByTree.max
                      );
                      onColsampleByTreeChange(value);
                    }}
                    className="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <p className="text-xs text-gray-500">
                    Range: {ranges.colsampleByTree.min} - {ranges.colsampleByTree.max}
                  </p>
                </div>
              </div>

              {/* Parameter Descriptions */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Parameter Descriptions</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><strong>Number of Trees:</strong> The number of trees in the ensemble. More trees can lead to
                    better performance but increase training time.
                  </li>
                  <li><strong>Maximum Depth:</strong> Maximum depth of each tree. Deeper trees can model more complex
                    patterns but may overfit.
                  </li>
                  <li><strong>Learning Rate:</strong> Step size shrinkage used to prevent overfitting. Lower values make
                    the model more robust.
                  </li>
                  <li><strong>Min Child Weight:</strong> Minimum sum of instance weight needed in a child node. Higher
                    values prevent overfitting.
                  </li>
                  <li><strong>Subsample Ratio:</strong> Fraction of samples used for training each tree. Values less
                    than 1 can help prevent overfitting.
                  </li>
                  <li><strong>Column Sample Ratio:</strong> Fraction of features used for training each tree. Helps
                    prevent overfitting in high-dimensional data.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}