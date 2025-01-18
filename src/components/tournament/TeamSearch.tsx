import {HelpCircle, Shuffle} from 'lucide-react';
import {motion} from 'framer-motion';
import {SearchBar} from "../common/SearchBar.tsx";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRandomSelect: () => void;
}

export default function TeamSearch({ searchQuery, setSearchQuery, onRandomSelect }: Props) {
  return (
    <div className="flex items-center gap-3">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>

      <div className="relative group">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRandomSelect}
          className="relative px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg text-white
            font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200
            flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          <span>Random</span>
        </motion.button>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100
          transition-opacity duration-200 pointer-events-none"
        >
          <div className="relative bg-gray-900 text-white text-sm p-2 rounded-lg shadow-lg">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
              <p>Randomly select remaining teams to quickly simulate a match</p>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}