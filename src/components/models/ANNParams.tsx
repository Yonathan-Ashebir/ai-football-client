import { useState } from 'react';
import { Layers, Plus, Minus, Settings2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {Layer} from "../../types";


interface Props {
  layers: Layer[];
  epochs: number;
  learningRate: number;
  onLayersChange: (layers: Layer[]) => void;
  onEpochsChange: (epochs: number) => void;
  onLearningRateChange: (rate: number) => void;
  minLayerSize?: number;
  maxLayerSize?: number;
  minLayerCount?: number;
  maxLayerCount?: number;
  minEpochs?: number;
  maxEpochs?: number;
  minLearningRate?: number;
  maxLearningRate?: number;
}

const activationFunctions = ['ReLU', 'Sigmoid', 'Tanh', 'Linear'] as const;

export default function ANNParams({
                                    layers,
                                    epochs,
                                    learningRate,
                                    onLayersChange,
                                    onEpochsChange,
                                    onLearningRateChange,
                                    minLayerSize = 1,
                                    maxLayerSize = Number.MAX_VALUE,
                                    minLayerCount  = 0,
                                    maxLayerCount = Number.MAX_VALUE,
                                    minEpochs = 1,
                                    maxEpochs = 1000,
                                    minLearningRate = 0.001,
                                    maxLearningRate = 10,
                                  }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const addLayer = () => {
    if (layers.length < maxLayerCount) {
      onLayersChange([...layers, { size: minLayerSize, activation: 'ReLU' }]);
    }
  };

  const removeLayer = (index: number) => {
    if (layers.length > minLayerCount) {
      onLayersChange(layers.filter((_, i) => i !== index));
    }
  };

  const updateLayer = (index: number, updates: Partial<Layer>) => {
    onLayersChange(
      layers.map((layer, i) =>
        i === index ? { ...layer, ...updates } : layer
      )
    );
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 border rounded-lg hover:border-primary-500 group"
      >
        <div className="flex items-center gap-2 text-gray-700">
          <Settings2 className="w-5 h-5 text-primary-600"/>
          <span>Neural Network Parameters</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-transform duration-200 ${
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
            <div className="space-y-6 p-4 border rounded-lg">
              {/* Layers Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Hidden Layers</h4>
                  <button
                    onClick={addLayer}
                    disabled={layers.length >= maxLayerCount}
                    className="flex items-center gap-1 px-2 py-1 text-sm text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Layer
                  </button>
                </div>

                <div className="space-y-3">
                  {layers.map((layer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <Layers className="w-5 h-5 text-primary-600" />
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Neurons
                          </label>
                          <input
                            type="number"
                            value={layer.size}
                            onChange={(e) => {
                              const size = Math.min(
                                Math.max(parseInt(e.target.value) || minLayerSize, minLayerSize),
                                maxLayerSize
                              );
                              updateLayer(index, { size });
                            }}
                            className="w-full px-3 py-1 border rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Activation
                          </label>
                          <select
                            value={layer.activation}
                            onChange={(e) => updateLayer(index, {
                              activation: e.target.value as Layer['activation']
                            })}
                            className="w-full px-3 py-1 border rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          >
                            {activationFunctions.map((fn) => (
                              <option key={fn} value={fn}>
                                {fn}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLayer(index)}
                        disabled={layers.length <= minLayerCount}
                        className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Training Parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Epochs
                  </label>
                  <input
                    type="number"
                    value={epochs}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseInt(e.target.value) || minEpochs, minEpochs),
                        maxEpochs
                      );
                      onEpochsChange(value);
                    }}
                    className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Range: {minEpochs} - {maxEpochs}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Rate
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={learningRate}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(parseFloat(e.target.value) || minLearningRate, minLearningRate),
                        maxLearningRate
                      );
                      onLearningRateChange(value);
                    }}
                    className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Range: {minLearningRate} - {maxLearningRate}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}