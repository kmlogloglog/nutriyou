import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { Metric } from '../../hooks/useMetrics';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  metrics: Metric[];
  selectedMetrics: string[];
}

const MetricsChart: React.FC<Props> = ({ metrics, selectedMetrics }) => {
  const colors = {
    weight: 'rgb(59, 130, 246)', // blue
    body_fat: 'rgb(239, 68, 68)', // red
    chest: 'rgb(16, 185, 129)', // green
    waist: 'rgb(245, 158, 11)', // amber
    hips: 'rgb(99, 102, 241)' // indigo
  };

  const labels = metrics.map(m => format(new Date(m.created_at), 'MMM d'));

  const datasets = selectedMetrics.map(metric => ({
    label: metric.charAt(0).toUpperCase() + metric.slice(1).replace('_', ' '),
    data: metrics.map(m => m[metric as keyof Metric]),
    borderColor: colors[metric as keyof typeof colors],
    backgroundColor: colors[metric as keyof typeof colors],
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 6
  })).filter(dataset => dataset.data.some(value => value !== null && value !== undefined));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="h-[300px] w-full">
      <Line
        data={{
          labels,
          datasets
        }}
        options={options}
      />
    </div>
  );
};

export default MetricsChart;