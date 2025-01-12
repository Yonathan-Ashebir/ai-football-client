import { Search, RefreshCw, Filter } from 'lucide-react';

interface Props {
  onRefresh: () => void;
  isLoading: boolean;
  totalMatches: number;
}

export default function MatchesHeader({ onRefresh, isLoading, totalMatches }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
      <div className="flex-1">
        <div className="text-sm text-gray-600">
          Showing {totalMatches} upcoming {totalMatches === 1 ? 'match' : 'matches'}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
    </div>
  );
}