import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { HistoricalMatch } from '../../types';

interface Props {
  matches: HistoricalMatch[];
  homeTeam: string;
  awayTeam: string;
}

export default function PerformanceChart({ matches, homeTeam, awayTeam }: Props) {
  const data = matches.map(match => ({
    date: new Date(match.date).toLocaleDateString(),
    [homeTeam]: match.homeTeam === homeTeam ? match.homeScore : match.awayScore,
    [awayTeam]: match.awayTeam === awayTeam ? match.awayScore : match.homeScore,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Trend</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={homeTeam}
              stroke="#059669"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey={awayTeam}
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}