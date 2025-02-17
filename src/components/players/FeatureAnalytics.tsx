import React from 'react';
import {Feature} from '../../types';
import {
  getFeatureName,
  getFeatureImportance,
  getFeatureInsights,
  featureCategories,
  getRelatedFeatures
} from '../../utils/featureAnalysis';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import {Info} from 'lucide-react';

interface FeatureAnalysisProps {
  feature: Feature;
  allFeatures: Feature[];
}

export const FeatureAnalysis: React.FC<FeatureAnalysisProps> = ({feature, allFeatures}) => {
  const importance = getFeatureImportance(feature);
  const insights = getFeatureInsights(feature);
  const relatedFeatures = getRelatedFeatures(feature.id);
  const category = featureCategories.find(cat => cat.features.includes(feature.id));

  // Prepare data for the importance comparison chart
  const relatedFeaturesData = relatedFeatures.map(id => {
    const relatedFeature = allFeatures.find(f => f.id === id);
    return {
      name: getFeatureName(id),
      importance: relatedFeature ? getFeatureImportance(relatedFeature) : 0,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          {getFeatureName(feature.id)}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded">
            {category?.name || 'Uncategorized'}
          </span>
          {!feature.optional && (
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded">
              Required
            </span>
          )}
        </div>
      </div>

      {/* Importance Meter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Feature Importance</span>
          <span className="text-sm text-gray-500">{Math.round(importance * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{width: `${importance * 100}%`}}
          />
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary-600"/>
          Key Insights
        </h4>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"/>
              {insight}
            </li>
          ))}
        </ul>
      </div>

      {/* Related Features Comparison */}
      {relatedFeaturesData.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Related Features Comparison</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {name: getFeatureName(feature.id), importance},
                ...relatedFeaturesData
              ]}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{fontSize: 12}}
                />
                <YAxis
                  domain={[0, 1]}
                  tickFormatter={(value) => `${Math.round(value * 100)}%`}
                />
                <Tooltip
                  formatter={(value: number) => `${Math.round(value * 100)}%`}
                  labelStyle={{color: '#374151'}}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem'
                  }}
                />
                <Bar
                  dataKey="importance"
                  fill="#7C3AED"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Feature Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {feature.minimum !== undefined && (
          <div className="space-y-1">
            <span className="text-gray-600">Minimum Value</span>
            <p className="font-medium text-gray-900">{feature.minimum}</p>
          </div>
        )}
        {feature.maximum !== undefined && (
          <div className="space-y-1">
            <span className="text-gray-600">Maximum Value</span>
            <p className="font-medium text-gray-900">{feature.maximum}</p>
          </div>
        )}
        {feature.score !== undefined && (
          <div className="space-y-1">
            <span className="text-gray-600">Feature Score</span>
            <p className="font-medium text-gray-900">{Math.round(feature.score * 100)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};