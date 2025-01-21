import {AnimatePresence, motion} from 'framer-motion';
import {ChevronRight, Database, Download, Eye, FileText, Trash2} from 'lucide-react';
import { Dataset } from '../../types/dataset';
import {formatFileSize} from "../../utils/formatters.ts";
import {formatDistanceToNow} from "../../utils/dateUtils.ts";

interface Props {
  dataset: Dataset;
  onDelete: (id: string) => void;
  onPreview: (dataset: Dataset) => void;
  getDownloadLink: (id: string) => string;
}

export default function DatasetCard({ dataset, onDelete, onPreview, getDownloadLink }: Props) {

  return (
    <motion.div
      className="group relative flex flex-col justify-between bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-primary-100"
    >
      {/* Header */}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="shrink-0 p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
              <Database className="w-5 h-5 text-primary"/>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                {dataset.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {dataset.type_label} • {formatFileSize(dataset.size)}
              </p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Uploaded {formatDistanceToNow(dataset.uploaded_at)}
           </span>
        </div>

        {/* Columns */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-primary-400"/>
              <span>Columns ({dataset.columns.length})</span>
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {dataset.columns.slice(0, 5).map((column) => (
              <span
                key={column}
                className="px-2 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary ring-1 ring-primary-100"
              >
                {column}
              </span>
            ))}
            {dataset.columns.length > 5 && (
              <motion.button
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                className="px-2 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary flex items-center space-x-1"
              >
                <span>+{dataset.columns.length - 5} more</span>
                <ChevronRight className="w-3 h-3"/>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gradient-to-b from-white to-primary-50 border-t border-primary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              onClick={() => onPreview(dataset)}
              className="p-2 rounded-lg text-primary hover:bg-primary-100 transition-colors"
              title="Preview Dataset"
            >
              <Eye className="w-5 h-5"/>
            </motion.button>
            <motion.a
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              href={getDownloadLink(dataset.id)}
              className="p-2 rounded-lg text-primary hover:bg-primary-100 transition-colors"
              title="Download Dataset"
            >
              <Download className="w-5 h-5" />
            </motion.a>
          </div>
          <AnimatePresence>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(dataset.id)}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Delete Dataset"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 border-2 border-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}