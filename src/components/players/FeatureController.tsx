import {Feature} from "../../types";
import {AnimatePresence, motion} from "framer-motion";
import {Check, Info, Lock} from "lucide-react";
import {getReadableFeatureName} from "../../data/constants.ts";

interface FeatureContollerProps {
  feature: Feature;
  selectedFeatures: Record<string, { enabled: boolean; value: number }>;
  toggleFeature: (feature: Feature) => void;
  updateFeature: (feature: Feature, value: number) => void;
}

const getToProgress = (feature: Feature) => {
  const minimum = feature.minimum ?? 0
  const maximum = feature.maximum ?? 100
  return (value: number) => (value - minimum) * 100 / (maximum - minimum)
}

const getToValue = (feature: Feature) => {
  const minimum = feature.minimum ?? 0
  const maximum = feature.maximum ?? 100
  return (progress: number) => minimum + (maximum - minimum) * progress / 100
}


export function FeatureController({
                                    feature,
                                    selectedFeatures,
                                    toggleFeature,
                                    updateFeature,
                                  }: FeatureContollerProps) {
  const isEnabled = selectedFeatures[feature.id]?.enabled;
  const currentValue = selectedFeatures[feature.id]?.value ?? feature.default ?? 0;

  const getProgressPercentage = () => {
    return getToProgress(feature)(currentValue);
  };

  // Get the readable feature name
  const readableFeatureName = getReadableFeatureName(feature.name);

  return (
    <div className="relative group">
      <div className={`p-4 rounded-xl transition-all duration-200 ${
        isEnabled
          ? 'bg-primary-50 ring-2 ring-primary shadow-sm'
          : 'bg-white hover:bg-gray-50 ring-1 ring-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => toggleFeature(feature)}
              disabled={!feature.optional}
              className={`relative group/checkbox ${!feature.optional ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                isEnabled
                  ? 'bg-primary text-white ring-2 ring-primary-300'
                  : 'bg-white ring-2 ring-gray-300'
              }`}>
                <AnimatePresence>
                  {isEnabled && (
                    <motion.div
                      initial={{scale: 0}}
                      animate={{scale: 1}}
                      exit={{scale: 0}}
                    >
                      <Check className="w-3 h-3"/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {!feature.optional && (
                <Lock className="absolute -top-1 -right-1 w-3 h-3 text-gray-400"/>
              )}
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-medium transition-colors ${
                  isEnabled ? 'text-primary' : 'text-gray-700'
                }`}>
                  {readableFeatureName}
                </span>
                {feature.optional && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
                    Optional
                  </span>
                )}
              </div>
            </div>
          </div>

          <motion.div
            animate={{
              scale: isEnabled ? 1 : 0.95,
              opacity: isEnabled ? 1 : 0.7
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isEnabled
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {feature.prefix}{feature.isInteger ? currentValue : currentValue?.toFixed(1)}{feature.suffix}
          </motion.div>
        </div>

        {/* Slider */}
        <div className="relative px-1">
          <div className="relative h-14 flex items-center">
            <div className="absolute inset-0 flex items-center">
              {/* Track Background */}
              <div className={`w-full h-3 rounded-full ${
                isEnabled ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                {/* Filled Track */}
                <motion.div
                  className={`h-full rounded-full ${
                    isEnabled ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  style={{width: `${getProgressPercentage()}%`}}
                  initial={false}
                  animate={{opacity: isEnabled ? 0.3 : 0.1}}
                  transition={{duration: 0.2}}
                />
              </div>
            </div>

            {/* Range Input */}
            <input
              type="range"
              min={0}
              max={100}
              value={getProgressPercentage()}
              onChange={(e) => {
                const progress = parseFloat(e.target.value);
                const value = getToValue(feature)(feature.isInteger ? Math.round(progress) : progress);
                updateFeature(feature, value);
              }}
              disabled={!isEnabled}
              className={`
                absolute inset-0 w-full appearance-none bg-transparent
                cursor-pointer disabled:cursor-not-allowed
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-7
                [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:rounded-xl
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:transition-all
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-webkit-slider-thumb]:active:scale-95
                [&::-webkit-slider-thumb]:border-4
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:relative
                [&::-webkit-slider-thumb]:z-10
                ${isEnabled
                ? '[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:hover:shadow-primary-200'
                : '[&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:hover:shadow-gray-200'
              }
              `}
            />
          </div>

          {/* Min/Max Labels */}
          <div className="flex justify-between mt-1 px-1">
            <span className="text-xs text-gray-500">
              {feature.prefix}{(feature.isInteger ? feature.minimum : feature.minimum?.toFixed(1)) || 0}{feature.suffix}
            </span>
            <span className="text-xs text-gray-500">
              {feature.prefix}{(feature.isInteger ? feature.maximum : feature.maximum?.toFixed(1)) || 100}{feature.suffix}
            </span>
          </div>
        </div>
      </div>

      {/* Info Tooltip */}
      <div className="absolute -top-1 -right-1">
        <div className="relative group/tooltip">
          <div className="p-1 rounded-full bg-primary-100">
            <Info className="w-3 h-3 text-primary"/>
          </div>
          <motion.div
            initial={{opacity: 0, y: -5}}
            whileHover={{opacity: 1, y: 0}}
            className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg pointer-events-none"
          >
            Adjust {readableFeatureName.toLowerCase()} within the range
            of {feature.minimum || 0}{feature.suffix} to {feature.maximum || 100}{feature.suffix}
            <div className="absolute bottom-0 right-4 -mb-1 w-2 h-2 bg-gray-900 transform rotate-45"/>
          </motion.div>
        </div>
      </div>
    </div>
  );
}