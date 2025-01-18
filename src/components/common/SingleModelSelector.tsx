import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {AlertCircle, Brain, ChevronRight, Loader2, Sparkles} from 'lucide-react';
import type {Model} from "../../types/model";
import {SearchBar} from "./SearchBar.tsx";

interface Props {
  models: Model[];
  selectedModel: Model | null;
  onSelect: (model: Model) => void;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function SingleModelSelector({
                                              models,
                                              selectedModel,
                                              onSelect,
                                              isLoading = false,
                                              error = null,
                                              onRetry
                                            }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-primary-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary-300"/>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Select Model</h2>
              <p className="text-primary-300 text-sm">Choose an AI model for your task</p>
            </div>
          </div>
          {selectedModel && (
            <motion.div
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              className="px-3 py-1.5 bg-white/10 rounded-lg border border-primary-400/30"
            >
              <p className="text-primary-200 text-sm">Selected: <span
                className="text-white font-medium">{selectedModel.name}</span></p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Search and Content */}
      <div className="p-6">
        {error ? (
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            className="bg-red-50 rounded-lg p-6 border border-red-100"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600"/>
              </div>
              <div className="flex-1">
                <h3 className="text-red-900 font-medium mb-1">Failed to Load Models</h3>
                <p className="text-red-700 text-sm mb-3">{error.message}</p>
                <button
                  onClick={onRetry}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Loader2 className="w-4 h-4"/>
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} large={true} disabled={isLoading}/>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  className="py-12 text-center"
                >
                  <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin"/>
                  <p className="text-primary-900">Loading available models...</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  className="space-y-3"
                >
                  {filteredModels.map((model) => (
                    <motion.button
                      key={model.id}
                      onClick={() => onSelect(model)}
                      onMouseEnter={() => setHoveredModel(model.id)}
                      onMouseLeave={() => setHoveredModel(null)}
                      whileHover={{scale: 1.01}}
                      whileTap={{scale: 0.99}}
                      className={`text-start w-full flex items-center p-4 rounded-lg border transition-all ${
                        selectedModel?.id === model.id
                          ? 'border-primary bg-primary-50 shadow-md'
                          : 'border-primary-100 hover:border-primary hover:shadow-md'
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${
                        selectedModel?.id === model.id
                          ? 'bg-primary text-white'
                          : hoveredModel === model.id
                            ? 'bg-primary-100 text-primary'
                            : 'bg-primary-50 text-primary-600'
                      }`}>
                        <Brain className="w-6 h-6"/>
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{model.name}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                              Optimized for {model.type_label} tasks
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              selectedModel?.id === model.id
                                ? 'bg-primary text-white'
                                : 'bg-primary-100 text-primary'
                            }`}>
                              {model?.information?.accuracy !== undefined ? model.information.accuracy + " Accuracy" : "N/A"}
                            </div>
                            <ChevronRight className={`w-5 h-5 transition-colors ${
                              selectedModel?.id === model.id || hoveredModel === model.id
                                ? 'text-primary'
                                : 'text-gray-400'
                            }`}/>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}

                  {filteredModels.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-2">No models found matching your search</p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-primary hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}