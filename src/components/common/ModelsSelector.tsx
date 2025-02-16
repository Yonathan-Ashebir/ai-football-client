import {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Brain, Search, Loader2, HelpCircle, Sparkles, AlertCircle, ChevronRight} from 'lucide-react';
import {Model, ModelStatus, ModelType} from '../../types/model.ts';
import ErrorDisplay from "./ErrorDisplay.tsx";

interface Props {
  models: Model[];
  selectedModels: { [K in ModelType]?: Model['id'] };
  onSelect: (typeId: ModelType, modelId: Model['id']) => void;
  modelTypes: readonly {
    readonly id: ModelType;
    readonly label: string;
    readonly description: string;
  }[];
  loadingStates: { [K in ModelType]?: boolean }
  errors: { [K in ModelType]?: Error | null };
  onRetry: (typeId: ModelType) => void;
}

export default function ModelsSelector({
                                         models,
                                         selectedModels,
                                         onSelect,
                                         modelTypes,
                                         loadingStates,
                                         errors,
                                         onRetry
                                       }: Props) {
  const [activeTab, setActiveTab] = useState(modelTypes[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredModels = models.filter(
    model =>
      model.type === activeTab &&
      model.status === ModelStatus.READY &&
      model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setActiveTab(modelTypes.find(type => !selectedModels[type.id])?.id ?? activeTab)
  }, [selectedModels]);

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-primary-100">
      {/* Header with Tabs */}
      <div className="bg-gradient-to-r from-primary to-primary-800 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary-300"/>
            <h2 className="text-lg font-semibold text-white">Select Models</h2>
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="sm:hidden bg-white/10 p-2 rounded-lg text-white"
          >
            <Search className="w-5 h-5"/>
          </button>

          {/* Search Input */}
          <div className={`relative ${isSearchVisible ? 'block' : 'hidden'} sm:block`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300 w-4 h-4"/>
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-1.5 bg-white/10 text-white placeholder-primary-300
                       rounded-lg border border-primary-400/30 focus:outline-none focus:ring-2
                       focus:ring-primary-400 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Scrollable Tabs Container */}
        <div className="overflow-x-auto -mx-4 px-4 pb-2 sm:pb-0 sm:overflow-visible sm:-mx-0 sm:px-0">
          <div className="flex space-x-1 min-w-max">
            {modelTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                onMouseEnter={() => setShowTooltip(type.id)}
                onMouseLeave={() => setShowTooltip(null)}
                className={`relative px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === type.id
                    ? 'bg-white text-primary'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{type.label}</span>
                  {loadingStates[type.id] ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin"/>
                  ) : errors[type.id] ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-300"/>
                  ) : (
                    <HelpCircle className="w-3.5 h-3.5 opacity-50"/>
                  )}
                </span>

                <AnimatePresence>
                  {showTooltip === type.id && (
                    <motion.div
                      initial={{opacity: 0, y: 5}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: 5}}
                      className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2
                               bg-gray-900 text-white text-xs rounded-lg shadow-xl hidden sm:block"
                    >
                      {type.description}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                                    rotate-45 w-2 h-2 bg-gray-900"/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -20}}
            transition={{duration: 0.2}}
            className="space-y-3"
          >
            {loadingStates[activeTab] ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto"/>
                  <p className="text-primary-900">
                    Loading {modelTypes.find(t => t.id === activeTab)?.label} models...
                  </p>
                </div>
              </div>
            ) : errors[activeTab] ? (
              <ErrorDisplay message={errors[activeTab]?.message} onRetry={() => onRetry(activeTab)}/>
            ) : (
              <>
                {filteredModels.map((model) => (
                  <motion.button
                    key={model.id}
                    onClick={() => onSelect(activeTab, model.id)}
                    whileHover={{scale: 1.01}}
                    whileTap={{scale: 0.99}}
                    className={`w-full flex items-start sm:items-center p-3 sm:p-4 rounded-lg 
                              border transition-all ${
                      selectedModels[activeTab] === model.id
                        ? 'border-primary bg-primary-50 shadow-md'
                        : 'border-primary-100 hover:border-primary hover:shadow-md'
                    }`}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      selectedModels[activeTab] === model.id
                        ? 'bg-primary text-white'
                        : 'bg-primary-100 text-primary'
                    }`}>
                      <Brain className="w-5 h-5"/>
                    </div>

                    <div className="ml-3 sm:ml-4 flex-1 text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="font-medium text-gray-900">{model.name}</p>
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedModels[activeTab] === model.id
                              ? 'bg-primary text-white'
                              : 'bg-primary-100 text-primary'
                          }`}>
                            {model?.information?.accuracy !== undefined ? model.information.accuracy + " Accuracy" : "N/A"}
                          </div>
                          <ChevronRight className={`hidden sm:block w-4 h-4 ${
                            selectedModels[activeTab] === model.id ? 'text-primary' : 'text-gray-400'
                          }`}/>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Optimized for {model.type_label} analysis
                      </p>
                    </div>
                  </motion.button>
                ))}

                {filteredModels.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No matching models found</p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-2 text-primary hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}