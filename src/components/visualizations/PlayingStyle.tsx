import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StyleMetric {
  name: string;
  value: number;
  average: number;
}

interface Props {
  metrics: StyleMetric[];
  teamName: string;
}

export default function PlayingStyle({ metrics, teamName }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Playing Style Analysis - {teamName}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={metrics}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" name={teamName} />
            <Bar dataKey="average" fill="#6B7280" name="League Average" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}