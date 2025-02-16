import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ChevronDown, ChevronUp} from 'lucide-react';

type DataValue = string | number | string[];

interface KeyValueDisplayProps {
  data: Record<string, DataValue>;
  maxVisible?: number;
  maxChipLength?: number;
  className?: string;
}

function Chip({ content, maxLength = 12 }: { content: string; maxLength?: number }) {
  const displayText = content.length > maxLength
    ? `${content.slice(0, maxLength)}...`
    : content;

  return (
    <div className="group relative">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center h-[20px] px-2 bg-gradient-to-r from-primary-50 to-primary-100/50
          text-primary-700 rounded-full text-[11px] font-medium border border-primary-200/50
          hover:from-primary-100 hover:to-primary-200/50 hover:border-primary-300/50
          transition-all duration-200 cursor-default shadow-sm"
      >
        <span className="relative">
          <span className="relative z-10">{displayText}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent blur-sm" />
        </span>
      </motion.div>

      {content.length > maxLength && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0
            group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10"
        >
          <div className="bg-gray-900/95 backdrop-blur-sm text-white text-[11px] px-2 py-1
            rounded-lg shadow-lg whitespace-nowrap border border-white/10">
            {content}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2
              bg-gray-900/95 rotate-45 border-b border-r border-white/10"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function KeyValueDisplay({
                                          data,
                                          maxVisible = 3,
                                          maxChipLength = 12,
                                          className = ''
                                        }: KeyValueDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const entries = Object.entries(data);
  const hasMore = entries.length > maxVisible;

  const visibleEntries = isExpanded ? entries : entries.slice(0, maxVisible);
  const hiddenCount = entries.length - maxVisible;

  const renderValue = (value: DataValue) => {
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1.5 items-center">
          {value.map((item, idx) => (
            <Chip key={idx} content={item} maxLength={maxChipLength} />
          ))}
        </div>
      );
    }
    return (
      <div className="inline-flex items-center h-[20px] px-2 bg-gray-50/80 text-gray-700
        rounded-full text-[11px] font-medium border border-gray-200/50 shadow-sm">
        {value}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {visibleEntries.map(([key, value], index) => (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
              className="group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">
                  {key}
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-lg px-2.5 py-2
                shadow-sm border border-gray-100/50
                group-hover:bg-white/60 group-hover:border-primary-100/50 transition-all duration-200">
                {renderValue(value)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.div
          layout
          className="mt-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-1 text-[11px] font-medium
              text-primary-600 hover:text-primary-700 py-1.5 rounded-lg
              bg-primary-50/50 hover:bg-primary-100/50 border border-primary-200/30
              hover:border-primary-300/30 transition-all duration-200 shadow-sm"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show Less
              </>
            ) : (
              <>
                <span>+{hiddenCount} more</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Hover Preview */}
      {!isExpanded && hasMore && (
        <div className="group/preview">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full mb-2 w-72 opacity-0
              group-hover/preview:opacity-100 transition-all duration-200 pointer-events-none z-10"
          >
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl p-3 space-y-2
              border border-white/10">
              {entries.slice(maxVisible).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                      {key}
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-700 to-transparent" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(value) ? (
                      value.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center h-[18px] px-2
                          bg-primary-500/20 text-primary-200 rounded-full text-[11px] font-medium
                          border border-primary-400/20 leading-none">
                          {item.length > maxChipLength
                            ? `${item.slice(0, maxChipLength)}...`
                            : item}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center h-[18px] px-2
                        bg-gray-700/50 text-gray-200 rounded-full text-[11px] font-medium
                        border border-gray-600/50 leading-none">
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2
                bg-gray-900/95 rotate-45 border-l border-t border-white/10"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}