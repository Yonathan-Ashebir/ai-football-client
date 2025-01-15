import {RefreshCw} from 'lucide-react';
import {DateRangeSelector} from "../DataRangeSelector.tsx";

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalMatches: number;
}

export default function MatchesHeader({
                                        onRefresh,
                                        isLoading,
                                        totalMatches,
                                        startDate,
                                        endDate,
                                        setStartDate,
                                        setEndDate
                                      }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
      <div className="flex-1 flex flex-col">
        <span className='ml-1'><DateRangeSelector startDate={startDate} endDate={endDate} onStartDateChange={(date) => {
          console.log('onStartDateChange', date);
          setStartDate(date)
        }}
          onEndDateChange={setEndDate}/></span>
          <div className="text-sm text-gray-600 ml-2 mt-2">
          Showing {totalMatches} upcoming {totalMatches === 1 ? 'match' : 'matches'}
          </div>
          </div>

          <div className="flex items-center gap-2">
          <button
          onClick={onRefresh}
                                                  disabled={isLoading}
                                                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
          Refresh
        </button>
      </div>
    </div>
  );
}