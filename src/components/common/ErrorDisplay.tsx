import {motion} from 'framer-motion';
import {AlertCircle, X} from 'lucide-react';

interface Props {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorDisplay({message, onRetry, onDismiss}: Props) {
  return (
    <motion.div initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}} className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5"/>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
            >
              Try Again
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 hover:text-red-700 ml-auto"
          >
            <X className="w-6 h-6"/>
          </button>
        )}
      </div>
    </motion.div>
  );
}