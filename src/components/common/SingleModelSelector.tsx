import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Brain, ChevronRight, Loader2, Sparkles} from 'lucide-react';
import type {Model} from "../../types/model";
import {SearchBar} from "./SearchBar.tsx";
import ErrorDisplay from "./ErrorDisplay.tsx";

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
      <div className="bg-gradient-to-r from-primary to-primary-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-300"/>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Select Model</h2>
              <p className="text-primary-300 text-xs sm:text-sm">Choose an AI model for your task</p>
            </div>
          </div>
          {selectedModel && (
            <motion.div
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              className="w-full sm:w-auto px-3 py-1.5 bg-white/10 rounded-lg border border-primary-400/30"
            >
              <p className="text-primary-200 text-xs sm:text-sm">Selected: <span
                className="text-white font-medium">{selectedModel.name}</span></p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Search and Content */}
      <div className="p-4 sm:p-6">
        {error ? (
          <ErrorDisplay message={error.message} onRetry={onRetry}/>
        ) : (
          <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} large={true} disabled={isLoading}/>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  className="py-8 sm:py-12 text-center"
                >
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-3 animate-spin"/>
                  <p className="text-sm sm:text-base text-primary-900">Loading available models...</p>
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
                      className={`text-start w-full flex items-center p-3 sm:p-4 rounded-lg border transition-all ${
                        selectedModel?.id === model.id
                          ? 'border-primary bg-primary-50 shadow-md'
                          : 'border-primary-100 hover:border-primary hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 sm:p-3 rounded-lg ${
                        selectedModel?.id === model.id
                          ? 'bg-primary text-white'
                          : hoveredModel === model.id
                            ? 'bg-primary-100 text-primary'
                            : 'bg-primary-50 text-primary-600'
                      }`}>
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6"/>
                      </div>

                      <div className="ml-3 sm:ml-4 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                          <div>
                            <h3 className="font-medium text-sm sm:text-base text-gray-900">{model.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                              Optimized for {model.type_label} tasks
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                              selectedModel?.id === model.id
                                ? 'bg-primary text-white'
                                : 'bg-primary-100 text-primary'
                            }`}>
                              {model?.information?.accuracy !== undefined ? model.information.accuracy + " Accuracy" : "N/A"}
                            </div>
                            <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
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
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-sm sm:text-base text-gray-500 mb-2">No models found matching your search</p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-xs sm:text-sm text-primary hover:underline"
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