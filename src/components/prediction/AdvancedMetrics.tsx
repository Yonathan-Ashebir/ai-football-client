import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Goal, Target, AlertCircle } from 'lucide-react';

import {TeamMetrics} from "../../hooks/usePrediction.ts";

interface Props {
  homeTeam: string;
  awayTeam: string;
  metrics: TeamMetrics;
}

export default function AdvancedMetrics({ homeTeam, awayTeam, metrics }: Props) {
  const xgData = [
    { name: homeTeam, xG: metrics.homeXG },
    { name: awayTeam, xG: metrics.awayXG },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary-600" />
        Advanced Metrics
      </h3>

      {/* Both Teams Scoring */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Both Teams Scoring Probability</span>
          <div className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <div className="text-xs text-gray-500">Based on recent form</div>
          </div>
        </div>
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary-500 transition-all duration-500"
            style={{ width: `${metrics.bothTeamsScoring * 100}%` }}
          />
        </div>
        <div className="mt-2 text-right font-semibold text-primary-600">
          {(metrics.bothTeamsScoring * 100).toFixed(1)}%
        </div>
      </div>

      {/* Expected Goals */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Goal className="w-5 h-5 text-primary-600" />
          <h4 className="font-medium text-gray-900">Expected Goals (xG)</h4>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={xgData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="xG" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}