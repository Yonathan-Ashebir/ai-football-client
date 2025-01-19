import {useState} from 'react';
import {AlertCircle, Brain, ChevronDown, Clock, Database, Info, LineChart, Trash2, X} from 'lucide-react';
import {formatDistanceToNow} from '../../utils/dateUtils';
import {formatFileSize} from '../../utils/formatters';
import {Model, ModelStatus} from "../../types/model.ts";
import ModelStatusDisplay from "./ModelStatus.tsx";
import {SearchBar} from "../common/SearchBar.tsx";
import {KeyValueChips} from "../common/KeyValueChips.tsx";
import {filterKeys} from "../../utils";


interface Props {
  model: Model;
  onDelete: (id: string) => void;
}

export default function ModelCard({model, onDelete}: Props) {
  const [showColumns, setShowColumns] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatasets, setShowDatasets] = useState(false);

  const displayType = model.type_label

  const filteredColumns = model.columns.filter(column =>
    column.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isError = ModelStatus.ERROR.test(model.status);
  const errorMessage = isError ? model.status.substring(6).trim() : null; // TODO: fix
  const isTraining = model.status === ModelStatus.TRAINING;
  const cleaned_information = model.information? filterKeys(model.information, "accuracy", "accuracy_description") : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative group flex flex-col justify-between">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary-600"/>
            <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
          </div>
          <ModelStatusDisplay status={model.status}/>
        </div>

        <div className="mt-4 space-y-3">
          {/* Datasets Section */}
          <div>
            <button
              onClick={() => setShowDatasets(!showDatasets)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Database className="w-4 h-4"/>
              <span>{model.datasets.length} Dataset{model.datasets.length !== 1 ? 's' : ''}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDatasets ? 'rotate-180' : ''}`}/>
            </button>

            {showDatasets && model.datasets.length > 0 && (
              <div className="mt-2 pl-6 space-y-2">
                {model.datasets.map(dataset => (
                  <div key={dataset.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{dataset.name}</span>
                    <span className="text-gray-500">{formatFileSize(dataset.size)}</span>
                  </div>
                ))}
              </div>
            )}

            {showDatasets && model.datasets.length === 0 && (
              <div className="mt-2 pl-6 text-sm text-gray-500 italic">
                No datasets associated with this model
              </div>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2"/>
            Created {formatDistanceToNow(model.created_at)}
          </div>
          {model.information?.accuracy !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              <LineChart className="w-4 h-4 mr-2"/>
              Accuracy: {model.information.accuracy}
              {model.information.accuracy_description && (
                <div className="relative group/tooltip ml-1">
                  <Info className="w-4 h-4 text-gray-400 cursor-help"/>
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10">
                    {model.information.accuracy_description}
                  </div>
                </div>
              )}
            </div>
          )}
          {cleaned_information && <KeyValueChips data={cleaned_information} beautify/>}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowColumns(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View {model.columns.length} Columns
          </button>
        </div>

        {isError && (
          <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0"/>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
        <div className="relative group/type">
          <span className="text-sm text-primary-600 cursor-help">{displayType}</span>
          {model.model_description && (
            <div
              className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/type:opacity-100 group-hover/type:visible transition-all z-10">
              {model.model_description}
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(model.id)}
          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4"/>
        </button>
      </div>

      {/* Columns Dialog */}
      {showColumns && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Model Columns</h3>
              <button
                onClick={() => setShowColumns(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6"/>
              </button>
            </div>

            <div className="p-4 border-b">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filteredColumns.map((column) => (
                  <div
                    key={column}
                    className="p-2 bg-gray-50 rounded-lg text-sm text-gray-700"
                  >
                    {column}
                  </div>
                ))}
              </div>
              {filteredColumns.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No columns found matching your search
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowColumns(false)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isTraining && (
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"/>
      )}
    </div>
  );
}