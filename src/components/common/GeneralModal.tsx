import React from 'react';
import {X} from 'lucide-react';
import {motion} from 'framer-motion';

interface Action {
  onClick: () => void;
  content: string | React.ReactNode;
  icon?: React.ComponentType<any>;
  className?: string;
}

interface GeneralModalProps {
  title: string;
  children: string | React.ReactNode;
  actions?: Action[];
  onClose?: () => void;
}

export function GeneralModal({title, children, actions, onClose}: GeneralModalProps) {
  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div initial={{y: 20, scale: 0.8}} animate={{y: 0, scale: 1}}
                  exit={{scale: 0.8}} className="w-full max-w-lg bg-white rounded-xl shadow-xl">
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 truncate">
                {title}
              </h3>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-50"
            >
              <X className="w-5 h-5"/>
            </button>
          )}
        </div>

        <div className="p-6">
          {typeof children === 'string' ? (
            <p className="text-gray-600">{children}</p>
          ) : (
            children
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${action.className || 'bg-primary-600 text-white hover:bg-primary-700'}`}
                >
                  {Icon && <Icon className="w-4 h-4 mr-2"/>}
                  {action.content}
                </button>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}