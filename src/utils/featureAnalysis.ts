import {Feature} from "../types";

export interface FeatureCategory {
  name: string;
  features: string[];
  description: string;
}

export const featureCategories: FeatureCategory[] = [
  {
    name: 'Scoring',
    features: ['Gls', 'Sh', 'SoT', 'SoT%', 'Sh/90', 'SoT/90', 'G/Sh', 'G/SoT', 'Dist', 'FK', 'PK', 'PKatt', 'xG', 'npxG', 'npxG/Sh', 'G-xG', 'np:G-xG'],
    description: 'Metrics related to goal-scoring ability and shooting efficiency'
  },
  {
    name: 'Passing',
    features: ['Cmp', 'Att', 'Cmp%', 'TotDist', 'PrgDist', 'Ast', 'xAG', 'xA', 'A-xAG', 'KP', 'PPA', 'CrsPA', 'PrgP', 'TB', 'Sw', 'CK'],
    description: 'Passing accuracy, creativity, and distribution metrics'
  },
  {
    name: 'Defensive',
    features: ['Int', 'TklW', 'Clr', 'Err', 'Blocks', 'Def 3rd', 'Mid 3rd', 'Att 3rd', 'Tkl', 'Tkl%', 'Pass', 'Tkl+Int'],
    description: 'Defensive actions and positioning metrics'
  },
  {
    name: 'Possession',
    features: ['Recov', 'Won', 'Lost', 'Won%', 'Live', 'Dead'],
    description: 'Ball control and possession-related statistics'
  },
  {
    name: 'Disciplinary',
    features: ['CrdY', 'CrdR', '2CrdY', 'Fls', 'Fld'],
    description: 'Cards and fouls'
  },
  {
    name: 'Game Impact',
    features: ['SCA', 'SCA90', 'GCA', 'GCA90'],
    description: 'Shot and goal-creating actions'
  }
];

export const getFeatureName = (id: string): string => {
  const nameMap: Record<string, string> = {
    // Scoring
    'Gls': 'Goals',
    'Sh': 'Shots',
    'SoT': 'Shots on Target',
    'SoT%': 'Shots on Target %',
    'Sh/90': 'Shots per 90',
    'SoT/90': 'Shots on Target per 90',
    'G/Sh': 'Goals per Shot',
    'G/SoT': 'Goals per Shot on Target',
    'Dist': 'Average Shot Distance',
    'FK': 'Free Kicks',
    'PK': 'Penalties Scored',
    'PKatt': 'Penalty Attempts',
    'xG': 'Expected Goals',
    'npxG': 'Non-Penalty Expected Goals',
    'npxG/Sh': 'Non-Penalty Expected Goals per Shot',
    'G-xG': 'Goals minus Expected Goals',
    'np:G-xG': 'Non-Penalty Goals minus Expected Goals',

    // Passing
    'Cmp': 'Passes Completed',
    'Att': 'Passes Attempted',
    'Cmp%': 'Pass Completion %',
    'TotDist': 'Total Passing Distance',
    'PrgDist': 'Progressive Passing Distance',
    'Ast': 'Assists',
    'xAG': 'Expected Assisted Goals',
    'xA': 'Expected Assists',
    'A-xAG': 'Assists minus Expected Assisted Goals',
    'KP': 'Key Passes',
    'PPA': 'Passes into Penalty Area',
    'CrsPA': 'Crosses into Penalty Area',
    'PrgP': 'Progressive Passes',
    'TB': 'Through Balls',
    'Sw': 'Switches',
    'CK': 'Corner Kicks',

    // Defensive
    'Int': 'Interceptions',
    'TklW': 'Tackles Won',
    'Clr': 'Clearances',
    'Err': 'Errors',
    'Blocks': 'Blocks',
    'Def 3rd': 'Defensive Third Tackles',
    'Mid 3rd': 'Middle Third Tackles',
    'Att 3rd': 'Attacking Third Tackles',
    'Tkl': 'Tackles',
    'Tkl%': 'Tackle Success %',
    'Pass': 'Passes Blocked',
    'Tkl+Int': 'Tackles plus Interceptions',

    // Possession
    'Recov': 'Ball Recoveries',
    'Won': 'Duels Won',
    'Lost': 'Duels Lost',
    'Won%': 'Duel Win %',
    'Live': 'Live-Ball Touches',
    'Dead': 'Dead-Ball Touches',

    // Disciplinary
    'CrdY': 'Yellow Cards',
    'CrdR': 'Red Cards',
    '2CrdY': 'Second Yellow Cards',
    'Fls': 'Fouls Committed',
    'Fld': 'Fouls Drawn',

    // Game Impact
    'SCA': 'Shot-Creating Actions',
    'SCA90': 'Shot-Creating Actions per 90',
    'GCA': 'Goal-Creating Actions',
    'GCA90': 'Goal-Creating Actions per 90'
  };

  return nameMap[id] || `Unknown Feature (${id})`;
};

export const getFeatureImportance = (feature: Feature): number => {
  // Base importance weights for different categories
  const categoryWeights: Record<string, number> = {
    'Scoring': 0.9,
    'Passing': 0.85,
    'Defensive': 0.8,
    'Possession': 0.75,
    'Game Impact': 0.85,
    'Disciplinary': 0.6
  };

  // Find which category the feature belongs to
  const category = featureCategories.find(cat => cat.features.includes(feature.id));
  const baseWeight = category ? categoryWeights[category.name] : 0.5;

  // Adjust weight based on feature properties
  let importance = baseWeight;

  // Adjust based on whether it's optional
  if (!feature.optional) {
    importance *= 1.2;
  }

  // Adjust based on feature score if available
  if (feature.score !== undefined) {
    importance *= (0.5 + feature.score / 2); // Scale score's impact
  }

  // Normalize to 0-1 range
  return Math.min(Math.max(importance, 0), 1);
};

export interface FeatureCorrelation {
  feature1: string;
  feature2: string;
  correlation: number;
  relationship: 'Strong Positive' | 'Moderate Positive' | 'Weak Positive' |
    'Strong Negative' | 'Moderate Negative' | 'Weak Negative' |
    'No Correlation';
}

export const getRelatedFeatures = (featureId: string): string[] => {
  // Define related features based on logical relationships
  const relationshipMap: Record<string, string[]> = {
    'Gls': ['xG', 'Sh', 'SoT', 'G/Sh', 'G/SoT', 'npxG'],
    'Sh': ['SoT', 'Sh/90', 'G/Sh', 'xG', 'npxG/Sh'],
    'Ast': ['xA', 'KP', 'PPA', 'CrsPA', 'xAG'],
    'xG': ['npxG', 'G-xG', 'Sh', 'SoT', 'Gls'],
    'Int': ['Tkl', 'Tkl+Int', 'Def 3rd', 'Mid 3rd'],
    'PK': ['PKatt', 'Gls', 'xG'],
    'CrdY': ['CrdR', '2CrdY', 'Fls'],
    'Won': ['Lost', 'Won%', 'Recov'],
    'SCA': ['SCA90', 'GCA', 'GCA90', 'KP', 'Ast']
  };

  return relationshipMap[featureId] || [];
};

export const getFeatureInsights = (feature: Feature): string[] => {
  const insights: string[] = [];
  const name = getFeatureName(feature.id);

  // Add general insight about the feature
  insights.push(`${name} is a ${feature.optional ? 'supplementary' : 'core'} metric for player analysis.`);

  // Add insights based on feature properties
  if (feature.minimum !== undefined && feature.maximum !== undefined) {
    insights.push(`Typical values range from ${feature.minimum} to ${feature.maximum}.`);
  }

  // Add category-specific insights
  const category = featureCategories.find(cat => cat.features.includes(feature.id));
  if (category) {
    insights.push(`This metric is part of the ${category.name} category, which ${category.description}.`);
  }

  // Add importance-based insight
  const importance = getFeatureImportance(feature);
  if (importance > 0.8) {
    insights.push('This is a highly influential metric for position prediction.');
  } else if (importance > 0.6) {
    insights.push('This metric has moderate influence on position prediction.');
  } else {
    insights.push('This metric has supplementary influence on position prediction.');
  }

  // Add related features insight
  const relatedFeatures = getRelatedFeatures(feature.id);
  if (relatedFeatures.length > 0) {
    insights.push(`Closely related metrics include: ${relatedFeatures.map(getFeatureName).join(', ')}.`);
  }

  return insights;
};