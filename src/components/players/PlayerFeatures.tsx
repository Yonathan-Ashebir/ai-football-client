import { useState, useMemo } from 'react';
import {Feature} from "../../types";
import {Model} from "../../types/model.ts";
import {useResource} from "../../hooks/useResource.ts";
import {playerStatisticsApi} from "../../utils/api.ts";
import {useEffect} from "react";
import {formatFileSize} from "../../utils/formatters.ts";
import {useDropzone} from "react-dropzone";
import {AlertCircle, ChevronDown, Loader2, Search, SlidersHorizontal, X} from "lucide-react";
import ErrorDisplay from "../common/ErrorDisplay.tsx";
import {FeatureController} from "./FeatureController.tsx";

const MAX_PLAYER_MEASUREMENT_SIZE = 10 * 1024

export const PlayerFeatures = ({selectedModel, selectedFeatures, setSelectedFeatures, setAllNecessaryFeaturesSelected}: {
  selectedModel: Model,
  selectedFeatures: Record<Feature['id'], { value: number, enabled: boolean }>,
  setSelectedFeatures: (updatedFeatures: Record<Feature['id'], { value: number, enabled: boolean }>) => void,
  setAllNecessaryFeaturesSelected: (ready: boolean) => void
}) => {
  const {
    resource: features,
    isLoading: isLoadingFeatures,
    error: featuresError,
    reload: reloadFeatures,
  } = useResource<Feature[]>(() => playerStatisticsApi.getAdjustableFeatures(selectedModel!.id), [selectedModel], {
    initialValue: [],
  })

  // New state for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreThreshold, setScoreThreshold] = useState(0);
  const [limit, setLimit] = useState(50);
  const [showFilters, setShowFilters] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const selectedCount = Object.entries(selectedFeatures).filter(([, value]) => value.enabled).length

  const [isExtractingMeasures, setIsExtractingMeasures] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  // Filter features based on search and filters
  const filteredFeatures = useMemo(() => {
    return features
      .filter(feature => {
        const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesScore = feature.score !== undefined ? feature.score >= scoreThreshold : true;
        return matchesSearch && matchesScore;
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, limit);
  }, [features, searchQuery, scoreThreshold, limit]);

  const updateSelectedFeatures = (updatedFeatures: Record<Feature['id'], { value: number, enabled: boolean }>) => {
    setSelectedFeatures(updatedFeatures);
    setAllNecessaryFeaturesSelected(features.filter(f => !f.optional).every(feature => updatedFeatures[feature.id].enabled));
  }

  const toggleFeature = (feature: Feature) => {
    if (!feature.optional) return
    updateSelectedFeatures({
      ...selectedFeatures,
      [feature.id]: {...selectedFeatures[feature.id], enabled: !selectedFeatures[feature.id]?.enabled}
    });
  }

  const updateFeature = (feature: Feature, value: number) => {
    updateSelectedFeatures({...selectedFeatures, [feature.id]: {...selectedFeatures[feature.id], value}})
  }

  const handleFileDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setFileUploadError('Please upload a CSV or XLSX file');
      return;
    }

    if (file.size > MAX_PLAYER_MEASUREMENT_SIZE) {
      setFileUploadError('File size must be less than ' + formatFileSize(MAX_PLAYER_MEASUREMENT_SIZE));
      return;
    }

    setFileUploadError(null);
    setIsExtractingMeasures(true);
    try {
      const newFeatures = await playerStatisticsApi.extractPlayerMeasurements(file)
      const featuresMap = Object.fromEntries(features.map(f => [f.id, f]))
      const filtered = Object.entries(newFeatures).filter(([id, value]) => id in selectedFeatures && (!featuresMap[id].maximum || value < featuresMap[id].maximum) && (!featuresMap[id].minimum || value > featuresMap[id].minimum)).map(([id, value]) => [id, {
        value,
        enabled: true
      }])
      updateSelectedFeatures({...selectedFeatures, ...Object.fromEntries(filtered)})
    } catch (err) {
      setFileUploadError('Error parsing file. Please check the format.');
    } finally {
      setIsExtractingMeasures(false);
    }
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true
  });

  useEffect(() => {
    return () => {
      setSelectedFeatures({})
      setAllNecessaryFeaturesSelected(false)
    }
  }, [selectedModel])

  const getFeatureDefault = (feature: Feature) => (feature.minimum !== undefined && feature.maximum !== undefined) ? (feature.minimum + feature.maximum) / 2 : feature.minimum !== undefined ? feature.minimum : feature.maximum !== undefined ? feature.maximum : 0

  useEffect(() => {
      if (features.some(feature => selectedFeatures[feature.id] === undefined)) {
        updateSelectedFeatures(Object.fromEntries(features.map(feature => [feature.id, {
          value: getFeatureDefault(feature),
          enabled: !feature.optional
        }])))
      }
    }, [features, selectedFeatures]
  )

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

  const limitOptions = [
    { value: 10, label: '10 features' },
    { value: 25, label: '25 features' },
    { value: 50, label: '50 features' },
    { value: 100, label: '100 features' },
    { value: 1000, label: 'All features' },
  ];

  return isLoadingFeatures ? (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin"/>
      <span className="ml-3 text-gray-600">Loading model features...</span>
    </div>
  ) : featuresError ? (
    <ErrorDisplay message={featuresError.message} onRetry={reloadFeatures}/>
  ) : (
    <div {...getRootProps()} className="relative">
      <input {...getInputProps()} className="hidden"/>
      <div
        className={`absolute inset-0 -m-4 rounded-lg border-2 border-dashed transition-colors pointer-events-none ${
          isDragActive ? 'border-primary-500 bg-primary-50/50' : 'border-transparent'
        }`}/>

      <div className="space-y-6">
        {/* Search and Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filters Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <SlidersHorizontal className="w-4 h-4"/>
                <span>Filters</span>
              </button>
              <span className="text-sm text-gray-500">
                Showing {filteredFeatures.length} of {features.length} features
              </span>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Score Threshold
                  </label>
                  <div className="relative pt-2">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scoreThreshold}
                        onChange={(e) => setScoreThreshold(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div
                        className="absolute -top-8 transform -translate-x-1/2 transition-all duration-200"
                        style={{ left: `${scoreThreshold}%` }}
                      >
                        <span className="bg-primary-500 text-white px-2 py-1 rounded text-sm">
                          {scoreThreshold}
                        </span>
                        <div className="w-2 h-2 bg-primary-500 rotate-45 absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limit Results
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                      className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span>{limitOptions.find(opt => opt.value === limit)?.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSelectOpen ? 'transform rotate-180' : ''}`} />
                      </div>
                    </button>
                    {isSelectOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {limitOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setLimit(option.value);
                              setIsSelectOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${
                              option.value === limit ? 'bg-primary-50 text-primary-600' : ''
                            } first:rounded-t-lg last:rounded-b-lg`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900">Model Features</h3>
              <div className="text-sm text-gray-500">
                Drag & drop a CSV/XLSX file or adjust manually
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {selectedCount} of {features.length} selected
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeatures.map((feature) => (
              <FeatureController
                key={feature.id}
                feature={feature}
                selectedFeatures={selectedFeatures}
                toggleFeature={toggleFeature}
                updateFeature={updateFeature}
                getToProgress={getToProgress}
                getToValue={getToValue}
              />
            ))}
          </div>
        </div>
      </div>

      {isExtractingMeasures && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin"/>
        </div>
      )}

      {fileUploadError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg justify-between mt-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5"/>
            <p>{fileUploadError}</p>
          </div>
          <button
            onClick={() => setFileUploadError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-6 h-6"/>
          </button>
        </div>
      )}
    </div>
  )
}