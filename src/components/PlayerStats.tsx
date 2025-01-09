import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UserCircle, Upload, Loader2, Check, AlertCircle, Brain, Search } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { demoModels } from '../data/demoModels';
import {Model, ModelStatus, ModelTypes} from '../types/model';

interface PlayerAttribute {
  name: string;
  value: number;
  isSelected: boolean;
}

const initialAttributes: PlayerAttribute[] = [
  { name: 'Pace', value: 50, isSelected: true },
  { name: 'Shooting', value: 50, isSelected: true },
  { name: 'Passing', value: 50, isSelected: true },
  { name: 'Dribbling', value: 50, isSelected: true },
  { name: 'Defending', value: 50, isSelected: true },
  { name: 'Physical', value: 50, isSelected: true },
  { name: 'Vision', value: 50, isSelected: true },
  { name: 'Crossing', value: 50, isSelected: true },
  { name: 'Finishing', value: 50, isSelected: true },
  { name: 'Positioning', value: 50, isSelected: true },
  { name: 'Tackling', value: 50, isSelected: true }
];

export default function PlayerStats() {
  const [attributes, setAttributes] = useState<PlayerAttribute[]>(initialAttributes);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);

  const availableModels = models.filter(model => 
    model.type === ModelTypes.PLAYER_STATISTICS_WITH_SCALER &&
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadModels = async () => {
      setIsLoadingModels(true);
      setModelsError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setModels(demoModels.filter(m => m.type === 'player-position' && m.status === 'completed'));
      } catch (err) {
        setModelsError('Failed to load prediction models. Please try again.');
      } finally {
        setIsLoadingModels(false);
      }
    };
    loadModels();
  }, []);

  const handleRetryModels = () => {
    setModels([]);
    setSelectedModel(null);
    setModelsError(null);
    loadModels();
  };

  const selectedCount = attributes.filter(attr => attr.isSelected).length;

  const handleFileDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setError('Please upload a CSV or XLSX file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setAttributes(prev => prev.map(attr => ({
          ...attr,
          value: Math.floor(Math.random() * 100),
          isSelected: true
        })));
      } catch (err) {
        setError('Error parsing file. Please check the format.');
      }
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    multiple: false
  });

  const toggleAttribute = (index: number) => {
    setAttributes(prev => prev.map((attr, i) => 
      i === index ? { ...attr, isSelected: !attr.isSelected } : attr
    ));
  };

  const handleAttributeChange = (index: number, value: number) => {
    setAttributes(prev => prev.map((attr, i) => 
      i === index ? { ...attr, value } : attr
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCount < 3 || !selectedModel) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const positions = ['Striker', 'Midfielder', 'Defender'];
      setPosition(positions[Math.floor(Math.random() * positions.length)]);
    } catch (err) {
      setError('Failed to predict position. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserCircle className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-800">Player Position Predictor</h2>
      </div>

      {/* Model Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Model</h3>
        
        {modelsError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Models</h3>
                <p className="mt-1 text-sm text-red-700">{modelsError}</p>
                <button
                  onClick={handleRetryModels}
                  className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                disabled={isLoadingModels}
              />
            </div>
            <div className="space-y-2">
              {isLoadingModels ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                </div>
              ) : availableModels.length > 0 ? (
                availableModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full flex items-center p-4 rounded-lg border transition-all ${
                      selectedModel?.id === model.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-500'
                    }`}
                  >
                    <Brain className="w-5 h-5 text-primary-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{model.name}</p>
                      <p className="text-sm text-gray-500">
                        Accuracy: {(model.accuracy! * 100).toFixed(1)}%
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No models found matching your search
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedModel && !modelsError && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div {...getRootProps()} className="relative">
            <input {...getInputProps()} />
            <div className={`absolute inset-0 -m-4 rounded-lg border-2 border-dashed transition-colors pointer-events-none ${
              isDragActive ? 'border-primary-500 bg-primary-50/50' : 'border-transparent'
            }`} />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900">Select Attributes</h3>
                  <div className="text-sm text-gray-500">
                    Drag & drop a CSV/XLSX file or adjust manually
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {selectedCount} of {attributes.length} selected
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attributes.map((attr, index) => (
                  <div key={attr.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleAttribute(index)}
                        className={`flex items-center gap-2 text-sm font-medium ${
                          attr.isSelected ? 'text-primary-600' : 'text-gray-500'
                        }`}
                      >
                        {attr.isSelected ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <div className="w-4 h-4 border rounded-sm" />
                        )}
                        {attr.name}
                      </button>
                      <span className="text-sm text-gray-600">{attr.value}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, parseInt(e.target.value, 10))}
                      disabled={!attr.isSelected}
                      className="w-full accent-primary-600 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || selectedCount < 3 || !selectedModel}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Predict Position'
            )}
          </button>
        </form>
      )}

      {position && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700">
              Based on the provided stats, this player would be best suited as a
              <span className="font-bold text-primary-600 ml-1">{position}</span>
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={attributes.filter(attr => attr.isSelected).map(attr => ({
                subject: attr.name,
                value: attr.value
              }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Stats"
                  dataKey="value"
                  stroke="#7C3AED"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}