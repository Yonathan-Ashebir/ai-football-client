import React from 'react';
import HeatMap from '../components/visualizations/HeatMap';
import FormationDisplay from '../components/visualizations/FormationDisplay';
import PlayingStyle from '../components/visualizations/PlayingStyle';
import PerformanceTimeline from '../components/visualizations/PerformanceTimeline';
import StrengthChart from '../components/visualizations/StrengthChart';
import TeamSelect from '../components/common/TeamSelect';

export default function TeamAnalysis() {
  const [selectedTeam, setSelectedTeam] = React.useState('');

  // Mock data - In production, this would come from your API
  const mockData = {
    positions: [
      { x: 30, y: 40, intensity: 0.8 },
      { x: 50, y: 50, intensity: 1 },
      { x: 70, y: 60, intensity: 0.6 },
    ],
    formation: [
      { id: '1', name: 'Alisson', position: [50, 90], number: 1 },
      { id: '2', name: 'Alexander-Arnold', position: [85, 75], number: 66 },
      // Add more players...
    ],
    playingStyle: [
      { name: 'Possession', value: 85, average: 50 },
      { name: 'High Press', value: 90, average: 60 },
      { name: 'Counter Attack', value: 75, average: 55 },
    ],
    performance: [
      { date: '2024-01', points: 15, goalsScored: 12, goalsConceded: 4 },
      { date: '2024-02', points: 12, goalsScored: 8, goalsConceded: 6 },
      // Add more data points...
    ],
    strengths: [
      { attribute: 'Attack', value: 85, average: 70 },
      { attribute: 'Defense', value: 80, average: 70 },
      { attribute: 'Possession', value: 90, average: 65 },
      { attribute: 'Set Pieces', value: 75, average: 60 },
      { attribute: 'Physical', value: 85, average: 70 },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team Analysis</h1>
        <div className="mt-4 max-w-xs">
          <TeamSelect
            value={selectedTeam}
            onChange={setSelectedTeam}
            placeholder="Select a team"
          />
        </div>
      </div>

      {selectedTeam && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Position Heat Map</h3>
              <HeatMap
                positions={mockData.positions}
                width={400}
                height={600}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Formation Analysis</h3>
              <FormationDisplay formation={mockData.formation} />
            </div>
          </div>

          <PlayingStyle
            metrics={mockData.playingStyle}
            teamName={selectedTeam}
          />

          <PerformanceTimeline
            data={mockData.performance}
            teamName={selectedTeam}
          />

          <StrengthChart
            attributes={mockData.strengths}
            teamName={selectedTeam}
          />
        </div>
      )}
    </div>
  );
}