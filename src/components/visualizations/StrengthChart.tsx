import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Attribute {
  attribute: string;
  value: number;
  average: number;
}

interface Props {
  attributes: Attribute[];
  teamName: string;
}

export default function StrengthChart({ attributes, teamName }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Team Strengths & Weaknesses - {teamName}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={attributes}>
            <PolarGrid />
            <PolarAngleAxis dataKey="attribute" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name={teamName}
              dataKey="value"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
            />
            <Radar
              name="League Average"
              dataKey="average"
              stroke="#6B7280"
              fill="#6B7280"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}