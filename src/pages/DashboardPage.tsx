import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { format } from 'date-fns';
import { 
  Scale, 
  TrendingUp, 
  Utensils, 
  Calendar,
  Plus
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useMetrics } from '../hooks/useMetrics';
import NutritionAssessmentForm from '../components/forms/NutritionAssessmentForm';
import UpdateMetricsModal from '../components/metrics/UpdateMetricsModal';
import ChatButton from '../components/chat/ChatButton';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { metrics, loading: metricsLoading, refetch: refetchMetrics } = useMetrics();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);

  const latestMetrics = metrics[metrics.length - 1];

  const weightData = {
    labels: metrics.map(m => format(new Date(m.created_at), 'MMM d')),
    datasets: [
      {
        label: 'Weight (kg)',
        data: metrics.map(m => m.weight),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const nutritionPlan = {
    status: 'pending',
    requestDate: new Date(),
    type: 'Weight Loss',
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowRequestModal(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request Nutrition Plan
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metrics Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Body Metrics</h2>
            <Scale className="w-6 h-6 text-primary-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weight</span>
              <span className="font-semibold">{latestMetrics?.weight || '-'} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Body Fat</span>
              <span className="font-semibold">{latestMetrics?.body_fat || '-'}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chest</span>
              <span className="font-semibold">{latestMetrics?.chest || '-'} cm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Waist</span>
              <span className="font-semibold">{latestMetrics?.waist || '-'} cm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hips</span>
              <span className="font-semibold">{latestMetrics?.hips || '-'} cm</span>
            </div>
            {latestMetrics && (
              <div className="text-sm text-gray-500 mt-4">
                Last updated: {format(new Date(latestMetrics.created_at), 'MMM d, yyyy')}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowMetricsModal(true)}
            className="btn btn-outline w-full mt-4"
          >
            Update Metrics
          </button>
        </div>

        {/* Progress Graph */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Progress</h2>
            <TrendingUp className="w-6 h-6 text-primary-500" />
          </div>
          <div className="h-64">
            <Line data={weightData} options={chartOptions} />
          </div>
        </div>

        {/* Nutrition Plan Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Nutrition Plan</h2>
            <Utensils className="w-6 h-6 text-primary-500" />
          </div>
          
          {nutritionPlan ? (
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  nutritionPlan.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {nutritionPlan.status.charAt(0).toUpperCase() + nutritionPlan.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2 flex-grow">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{nutritionPlan.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Requested</span>
                  <span className="font-medium">{format(nutritionPlan.requestDate, 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to="/meal-planner" className="btn btn-primary w-full">
                  View Meal Plan
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No active nutrition plan</p>
              <button 
                onClick={() => setShowRequestModal(true)}
                className="btn btn-primary"
              >
                Request Plan
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Upcoming Meals Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Today's Meals</h2>
          <Calendar className="w-6 h-6 text-primary-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
            <div key={meal} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{meal}</h3>
              <p className="text-gray-600">Suggested meals will appear here</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showRequestModal && (
        <NutritionAssessmentForm onClose={() => setShowRequestModal(false)} />
      )}
      
      {showMetricsModal && (
        <UpdateMetricsModal 
          onClose={() => setShowMetricsModal(false)}
          onSuccess={refetchMetrics}
        />
      )}
      {/* Chat Button - visible to logged in users */}
      <ChatButton />
    </div>
  );
};

export default DashboardPage;