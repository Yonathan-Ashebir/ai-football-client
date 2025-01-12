import {Trophy, UserCircle} from 'lucide-react';

interface Props {
  selectedType: 'match-prediction' | 'player-position' | null;
  onSelect: (type: 'match-prediction' | 'player-position' ) => void;
}

export default function ModelTypeSelector({ selectedType, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Model Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('match-prediction')}
          className={`p-4 text-left rounded-lg border transition-all ${
            selectedType === 'match-prediction'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-500'
          }`}
        >
          <Trophy className="h-6 w-6 text-primary-600 mb-2" />
          <h3 className="font-medium text-gray-900">Match Prediction</h3>
          <p className="text-sm text-gray-500">
            Predict match outcomes and winning probabilities
          </p>
        </button>

        <button
          onClick={() => onSelect('player-position')}
          className={`p-4 text-left rounded-lg border transition-all ${
            selectedType === 'player-position'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-500'
          }`}
        >
          <UserCircle className="h-6 w-6 text-primary-600 mb-2" />
          <h3 className="font-medium text-gray-900">Player Position</h3>
          <p className="text-sm text-gray-500">
            Determine optimal player positions based on stats
          </p>
        </button>
      </div>
    </div>
  );
}