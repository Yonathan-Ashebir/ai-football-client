import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PerformanceData {
  date: string;
  points: number;
  goalsScored: number;
  goalsConceded: number;
}

interface Props {
  data: PerformanceData[];
  teamName: string;
}

export default function PerformanceTimeline({ data, teamName }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Historical Performance - {teamName}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="points"
              stroke="#10B981"
              name="Points"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="goalsScored"
              stroke="#3B82F6"
              name="Goals Scored"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="goalsConceded"
              stroke="#EF4444"
              name="Goals Conceded"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}