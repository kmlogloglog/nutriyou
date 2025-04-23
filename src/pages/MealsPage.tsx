import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Filter } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Meal {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image_url: string;
  recipe: string;
}

const MealsPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('name');

      if (error) throw error;
      setMeals(data || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meal Library</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search meals..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:w-48">
          <select
            className="input w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snacks</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <div 
            key={meal.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedMeal(meal)}
          >
            <img
              src={meal.image_url}
              alt={meal.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{meal.name}</h3>
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full capitalize">
                  {meal.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {meal.description}
              </p>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{meal.calories}</span>
                  <span className="text-gray-500"> kcal</span>
                </div>
                <div className="flex space-x-4">
                  <span>
                    <span className="font-medium">{meal.protein}g</span>
                    <span className="text-gray-500"> protein</span>
                  </span>
                  <span>
                    <span className="font-medium">{meal.carbs}g</span>
                    <span className="text-gray-500"> carbs</span>
                  </span>
                  <span>
                    <span className="font-medium">{meal.fat}g</span>
                    <span className="text-gray-500"> fat</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meal Details Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <img
              src={selectedMeal.image_url}
              alt={selectedMeal.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedMeal.name}</h2>
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full capitalize">
                  {selectedMeal.category}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedMeal.description}</p>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {selectedMeal.calories}
                  </div>
                  <div className="text-sm text-gray-500">calories</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {selectedMeal.protein}g
                  </div>
                  <div className="text-sm text-gray-500">protein</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {selectedMeal.carbs}g
                  </div>
                  <div className="text-sm text-gray-500">carbs</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {selectedMeal.fat}g
                  </div>
                  <div className="text-sm text-gray-500">fat</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Recipe</h3>
                <p className="text-gray-600">{selectedMeal.recipe}</p>
              </div>
              
              <button
                onClick={() => setSelectedMeal(null)}
                className="btn btn-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsPage;