import React from 'react';
import { Trophy, Target, ArrowRight } from 'lucide-react';
import type { HeadToHeadStats } from '../../types';

interface Props {
  stats: HeadToHeadStats;
  homeTeam: string;
  awayTeam: string;
}

export default function HeadToHeadStats({ stats, homeTeam, awayTeam }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Head-to-Head Statistics</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-emerald-600">{stats.homeTeamWins}</div>
          <div className="text-sm text-gray-600">{homeTeam} Wins</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-600">{stats.draws}</div>
          <div className="text-sm text-gray-600">Draws</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">{stats.awayTeamWins}</div>
          <div className="text-sm text-gray-600">{awayTeam} Wins</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Matches</span>
          <span className="font-semibold">{stats.totalMatches}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Goals Scored ({homeTeam})</span>
          <span className="font-semibold">{stats.homeTeamGoals}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Goals Scored ({awayTeam})</span>
          <span className="font-semibold">{stats.awayTeamGoals}</span>
        </div>
      </div>
    </div>
  );
}