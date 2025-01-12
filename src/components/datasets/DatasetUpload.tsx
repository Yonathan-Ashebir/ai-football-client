import {FormEvent, useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {AlertCircle, Loader2, Trophy, Upload, UserCircle, X} from 'lucide-react';
import {DatasetType} from "../../utils/api.ts";

interface Props {
  onUpload: (file: File, name: string, type: DatasetType) => Promise<void>;
}

export default function DatasetUpload({ onUpload }: Props) {
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [type, setType] = useState<DatasetType>('Match Results');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setName(file.name.split('.')[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: isUploading
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !name.trim()) {
      setError('Please provide both a file and a name');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await onUpload(selectedFile, name.trim(), type);
      setSelectedFile(null);
      setName('');
      setType('Match Results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload dataset. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Dataset Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Enter dataset name"
            disabled={isUploading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dataset Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('Match Results')}
              disabled={isUploading}
              className={`relative flex flex-col items-center p-4 border rounded-lg transition-all ${
                type === 'Match Results'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 text-gray-600 hover:bg-gray-50'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Trophy className={`w-6 h-6 mb-2 ${
                type === 'Match Results' ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <span className="text-sm font-medium">Match Results</span>
              {type === 'Match Results' && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setType('Player Statistics')}
              disabled={isUploading}
              className={`relative flex flex-col items-center p-4 border rounded-lg transition-all ${
                type === 'Player Statistics'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 text-gray-600 hover:bg-gray-50'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <UserCircle className={`w-6 h-6 mb-2 ${
                type === 'Player Statistics' ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <span className="text-sm font-medium">Player Statistics</span>
              {type === 'Player Statistics' && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500" />
              )}
            </button>
          </div>
        </div>

        <div>
          {selectedFile ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Upload className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">{selectedFile.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-gray-500"
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'}
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop a file here, or click to select
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Maximum file size: 10MB
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile || !name.trim() || isUploading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Dataset'
          )}
        </button>
      </form>
    </div>
  );
}