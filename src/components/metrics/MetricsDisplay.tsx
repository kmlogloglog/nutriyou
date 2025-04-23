import React, { useState } from 'react';
import { format } from 'date-fns';
import { Scale, TrendingUp, TrendingDown } from 'lucide-react';
import type { Metric } from '../../hooks/useMetrics';
import MetricsChart from './MetricsChart';

interface Props {
  metrics: Metric[];
  onUpdateClick: () => void;
}

const MetricsDisplay: React.FC<Props> = ({ metrics, onUpdateClick }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['weight']);
  const latestMetrics = metrics[metrics.length - 1];
  const previousMetrics = metrics[metrics.length - 2];

  const getChange = (current?: number, previous?: number) => {
    if (!current || !previous) return null;
    return ((current - previous) / previous) * 100;
  };

  const metricOptions = [
    { value: 'weight', label: 'Weight' },
    { value: 'body_fat', label: 'Body Fat' },
    { value: 'chest', label: 'Chest' },
    { value: 'waist', label: 'Waist' },
    { value: 'hips', label: 'Hips' }
  ];

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Scale className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-xl font-semibold">Body Metrics</h2>
        </div>
        <button 
          onClick={onUpdateClick}
          className="btn btn-primary"
        >
          Update Metrics
        </button>
      </div>

      {/* Metric Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metricOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleMetricToggle(option.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedMetrics.includes(option.value)
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {metrics.length > 0 ? (
        <>
          <MetricsChart metrics={metrics} selectedMetrics={selectedMetrics} />

          {/* Latest Measurements */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {metricOptions.map(option => {
              const current = latestMetrics?.[option.value as keyof Metric] as number;
              const previous = previousMetrics?.[option.value as keyof Metric] as number;
              const change = getChange(current, previous);

              return (
                <div key={option.value} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">{option.label}</div>
                  <div className="text-xl font-semibold">
                    {current ? `${current.toFixed(1)}` : '-'}
                    {option.value === 'body_fat' && current ? '%' : ''}
                    {(option.value === 'chest' || option.value === 'waist' || option.value === 'hips') && current ? 'cm' : ''}
                    {option.value === 'weight' && current ? 'kg' : ''}
                  </div>
                  {change !== null && (
                    <div className={`text-sm flex items-center ${
                      change > 0 ? 'text-error-600' : 'text-success-600'
                    }`}>
                      {change > 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(change).toFixed(1)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Last updated: {format(new Date(latestMetrics.created_at), 'MMM d, yyyy')}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No metrics recorded yet. Click "Update Metrics" to get started.
        </div>
      )}
    </div>
  );
};

export default MetricsDisplay;