import type { Dataset } from '../types/dataset';

export function getDemoData(type: string): Record<string, any>[] {
  switch (type) {
    case 'Player Stats':
      return generatePlayerStats();
    case 'Match Results':
      return generateMatchResults();
    case 'Team Performance':
      return generateTeamPerformance();
    case 'Transfer Information':
      return generateTransferData();
    case 'Medical Data':
      return generateInjuryData();
    default:
      return [];
  }
}

function generatePlayerStats() {
  const players = [
    { name: 'Mohamed Salah', team: 'Liverpool', position: 'Forward' },
    { name: 'Kevin De Bruyne', team: 'Manchester City', position: 'Midfielder' },
    { name: 'Harry Kane', team: 'Bayern Munich', position: 'Forward' },
    // Add more players...
  ];

  return players.map(player => ({
    'Player Name': player.name,
    'Team': player.team,
    'Position': player.position,
    'Appearances': Math.floor(Math.random() * 30) + 10,
    'Minutes Played': Math.floor(Math.random() * 2000) + 500,
    'Goals': Math.floor(Math.random() * 20),
    'Assists': Math.floor(Math.random() * 15),
    'Expected Goals (xG)': (Math.random() * 15).toFixed(2),
    'Expected Assists (xA)': (Math.random() * 10).toFixed(2),
    'Shots on Target': Math.floor(Math.random() * 50) + 10,
    'Pass Completion %': Math.floor(Math.random() * 20) + 80,
    'Yellow Cards': Math.floor(Math.random() * 8),
    'Red Cards': Math.floor(Math.random() * 2),
  }));
}

// Implement other generator functions similarly...
function generateMatchResults() {
  // Implementation
  return [];
}

function generateTeamPerformance() {
  // Implementation
  return [];
}

function generateTransferData() {
  // Implementation
  return [];
}

function generateInjuryData() {
  // Implementation
  return [];
}