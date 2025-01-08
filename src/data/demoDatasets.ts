import type { Dataset } from '../types';

export const demoDatasets: Dataset[] = [
  {
    id: 'ds-001',
    name: 'Premier League Player Stats 2024',
    size: 2458000, // ~2.4MB
    type: 'Player Stats',
    columns: [
      'Player Name', 'Team', 'Position', 'Appearances', 'Minutes Played',
      'Goals', 'Assists', 'Expected Goals (xG)', 'Expected Assists (xA)',
      'Shots on Target', 'Pass Completion %', 'Yellow Cards', 'Red Cards'
    ],
    uploaded_at: '2024-03-15T08:30:00Z'
  },
  {
    id: 'ds-002',
    name: 'Match Results 2023/24 Season',
    size: 1248000, // ~1.2MB
    type: 'Match Results',
    columns: [
      'Match Date', 'Competition', 'Home Team', 'Away Team', 'Home Score',
      'Away Score', 'Stadium', 'Attendance', 'Referee', 'Possession %',
      'Shots', 'Shots on Target', 'Corners', 'Fouls'
    ],
    uploaded_at: '2024-03-14T15:45:00Z'
  },
  {
    id: 'ds-003',
    name: 'Team Performance Analytics 2024',
    size: 856000, // ~856KB
    type: 'Team Performance',
    columns: [
      'Team Name', 'Matches Played', 'Wins', 'Draws', 'Losses',
      'Goals Scored', 'Goals Conceded', 'Clean Sheets', 'Points',
      'Expected Goals (xG)', 'Expected Points (xP)', 'Form Last 5'
    ],
    uploaded_at: '2024-03-13T11:20:00Z'
  },
  {
    id: 'ds-004',
    name: 'Transfer Market Data 2023',
    size: 1648000, // ~1.6MB
    type: 'Transfer Information',
    columns: [
      'Player Name', 'Age', 'Position', 'From Club', 'To Club',
      'Transfer Fee', 'Market Value', 'Contract Length', 'Transfer Date',
      'Season', 'League From', 'League To'
    ],
    uploaded_at: '2024-03-12T09:15:00Z'
  },
  {
    id: 'ds-005',
    name: 'Player Injury Records 2023/24',
    size: 945000, // ~945KB
    type: 'Medical Data',
    columns: [
      'Player Name', 'Team', 'Injury Type', 'Date Started',
      'Expected Return', 'Games Missed', 'Previous Similar Injuries',
      'Recovery Progress', 'Treatment Plan'
    ],
    uploaded_at: '2024-03-11T14:40:00Z'
  }
];