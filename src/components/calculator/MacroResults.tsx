import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { SaveIcon, Share2, ArrowRight } from 'lucide-react';

// Register the required chart components
ChartJS.register(ArcElement, Tooltip, Legend);

interface MacroResultsProps {
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const MacroResults: React.FC<MacroResultsProps> = ({ macros }) => {
  const { currentUser } = useAuth();
  
  const { calories, protein, carbs, fat } = macros;
  
  // Calculate percentages for display
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;
  
  const proteinPercentage = Math.round((proteinCalories / calories) * 100);
  const carbsPercentage = Math.round((carbsCalories / calories) * 100);
  const fatPercentage = Math.round((fatCalories / calories) * 100);
  
  // Chart data
  const chartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [protein * 4, carbs * 4, fat * 9],
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B'],
        borderColor: ['#4F46E5', '#10B981', '#F59E0B'],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div className="animate-fade-in">
      <div className="card border-2 border-primary-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Your Personalized Macro Recommendations</h2>
          <p className="text-gray-600 mt-2">
            Based on your inputs, here are your recommended daily macronutrients
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-64 h-64 relative">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{calories}</span>
                <span className="text-sm text-gray-500">calories</span>
              </div>
            </div>
          </div>
          
          {/* Macro Breakdown */}
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Daily Targets</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">Protein</span>
                    <span className="font-medium text-secondary-600">{protein}g ({proteinPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-secondary-500 h-2 rounded-full" style={{ width: `${proteinPercentage}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">Carbohydrates</span>
                    <span className="font-medium text-primary-600">{carbs}g ({carbsPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${carbsPercentage}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">Fat</span>
                    <span className="font-medium text-accent-600">{fat}g ({fatPercentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-accent-500 h-2 rounded-full" style={{ width: `${fatPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {currentUser ? (
                <>
                  <button className="btn btn-outline flex items-center justify-center">
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Results
                  </button>
                  <button className="btn btn-outline flex items-center justify-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </>
              ) : (
                <Link to="/register" className="btn btn-primary flex items-center justify-center">
                  Create Account to Save Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Nutrition Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="mb-2">
                <strong>Protein sources:</strong> Chicken breast, turkey, lean beef, fish, eggs, tofu, lentils, Greek yogurt
              </p>
              <p>
                <strong>Carb sources:</strong> Brown rice, quinoa, sweet potatoes, oats, beans, fruits, vegetables
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong>Fat sources:</strong> Avocados, nuts, seeds, olive oil, fatty fish like salmon
              </p>
              <p>
                <strong>Hydration:</strong> Aim for 3-4 liters of water daily
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-primary-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Note:</strong> These recommendations are estimates based on the information provided. For a more personalized nutrition plan tailored to your specific needs and goals, consider our premium subscription.
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/pricing" className="btn btn-primary">
              Get a Personalized Nutrition Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroResults;