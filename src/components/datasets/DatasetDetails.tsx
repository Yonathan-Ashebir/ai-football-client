import { FileText, Calendar, Database } from 'lucide-react';

interface Props {
  name: string;
  type: string;
  size: number;
  columns: string[];
  uploadDate: string;
}

export default function DatasetDetails({ name, type, size, columns, uploadDate }: Props) {
  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900">{name}</h3>
        </div>
        <span className="text-sm text-gray-500">{formatFileSize(size)}</span>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Database className="w-4 h-4" />
          <span>{type}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(uploadDate)}</span>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Columns</h4>
          <div className="flex flex-wrap gap-2">
            {columns.map((column, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {column}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}