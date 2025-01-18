import {Search, RefreshCw} from 'lucide-react';
import {SearchBar} from "../common/SearchBar.tsx";

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function ModelsHeader({searchQuery, onSearchChange, onRefresh, isRefreshing}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <SearchBar searchQuery={searchQuery} setSearchQuery={onSearchChange}/>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
          isRefreshing
            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}/>
        Refresh
      </button>
    </div>
  );
}