import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { InfoIcon, HelpCircle } from 'lucide-react';

import MacroResults from '../components/calculator/MacroResults';
import Tooltip from '../components/ui/Tooltip';

type FormValues = {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
};

const CalculatorPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [macros, setMacros] = useState<null | {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>(null);
  const navigate = useNavigate();

  const calculateBMR = (data: FormValues) => {
    // Mifflin-St Jeor Equation for BMR
    const { age, gender, weight, height } = data;
    
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const calculateTDEE = (bmr: number, activityLevel: string) => {
    const activityMultipliers = {
      'sedentary': 1.2, // Little or no exercise
      'lightly-active': 1.375, // Light exercise 1-3 days/week
      'moderately-active': 1.55, // Moderate exercise 3-5 days/week
      'very-active': 1.725, // Hard exercise 6-7 days/week
      'extra-active': 1.9 // Very hard exercise & physical job
    };
    
    return bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];
  };

  const calculateMacros = (tdee: number, goal: string) => {
    let calories = tdee;
    
    // Adjust calories based on goal
    switch (goal) {
      case 'lose-weight':
        calories = tdee * 0.8; // 20% deficit
        break;
      case 'maintain':
        calories = tdee;
        break;
      case 'gain-muscle':
        calories = tdee * 1.1; // 10% surplus
        break;
      default:
        calories = tdee;
    }
    
    // Calculate macros
    // Protein: 30% of calories, 4 calories per gram
    const protein = Math.round((calories * 0.3) / 4);
    
    // Fat: 25% of calories, 9 calories per gram
    const fat = Math.round((calories * 0.25) / 9);
    
    // Carbs: 45% of calories, 4 calories per gram
    const carbs = Math.round((calories * 0.45) / 4);
    
    return {
      calories: Math.round(calories),
      protein,
      carbs,
      fat
    };
  };

  const onSubmit = (data: FormValues) => {
    // Calculate BMR
    const bmr = calculateBMR(data);
    
    // Calculate TDEE
    const tdee = calculateTDEE(bmr, data.activityLevel);
    
    // Calculate macros
    const macroResults = calculateMacros(tdee, data.goal);
    
    // Set results
    setMacros(macroResults);
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4">Macro Nutrient Calculator</h1>
            <p className="text-lg text-gray-600">
              Calculate your recommended daily calories and macronutrients based on your body metrics and goals.
            </p>
          </div>
          
          <div className="card mb-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age Field */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    className={`input ${errors.age ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter your age"
                    {...register('age', { 
                      required: 'Age is required', 
                      min: { value: 18, message: 'Must be at least 18 years old' },
                      max: { value: 100, message: 'Must be at most 100 years old' }
                    })}
                  />
                  {errors.age && <p className="mt-1 text-sm text-error-500">{errors.age.message}</p>}
                </div>
                
                {/* Gender Field */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    className={`input ${errors.gender ? 'border-error-500 focus:ring-error-500' : ''}`}
                    {...register('gender', { required: 'Gender is required' })}
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-error-500">{errors.gender.message}</p>}
                </div>
                
                {/* Weight Field */}
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    className={`input ${errors.weight ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter your weight in kg"
                    {...register('weight', { 
                      required: 'Weight is required',
                      min: { value: 40, message: 'Must be at least 40 kg' },
                      max: { value: 200, message: 'Must be at most 200 kg' }
                    })}
                  />
                  {errors.weight && <p className="mt-1 text-sm text-error-500">{errors.weight.message}</p>}
                </div>
                
                {/* Height Field */}
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    className={`input ${errors.height ? 'border-error-500 focus:ring-error-500' : ''}`}
                    placeholder="Enter your height in cm"
                    {...register('height', { 
                      required: 'Height is required',
                      min: { value: 140, message: 'Must be at least 140 cm' },
                      max: { value: 220, message: 'Must be at most 220 cm' }
                    })}
                  />
                  {errors.height && <p className="mt-1 text-sm text-error-500">{errors.height.message}</p>}
                </div>
              </div>
              
              {/* Activity Level Field */}
              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                  <Tooltip content="Select the option that best describes your typical weekly activity">
                    <HelpCircle className="inline-block ml-1 w-4 h-4 text-gray-400" />
                  </Tooltip>
                </label>
                <select
                  id="activityLevel"
                  className={`input ${errors.activityLevel ? 'border-error-500 focus:ring-error-500' : ''}`}
                  {...register('activityLevel', { required: 'Activity level is required' })}
                >
                  <option value="">Select your activity level</option>
                  <option value="sedentary">Sedentary (office job, little exercise)</option>
                  <option value="lightly-active">Lightly Active (light exercise 1-3 days/week)</option>
                  <option value="moderately-active">Moderately Active (moderate exercise 3-5 days/week)</option>
                  <option value="very-active">Very Active (hard exercise 6-7 days/week)</option>
                  <option value="extra-active">Extra Active (very hard exercise & physical job)</option>
                </select>
                {errors.activityLevel && <p className="mt-1 text-sm text-error-500">{errors.activityLevel.message}</p>}
              </div>
              
              {/* Goal Field */}
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Goal
                </label>
                <select
                  id="goal"
                  className={`input ${errors.goal ? 'border-error-500 focus:ring-error-500' : ''}`}
                  {...register('goal', { required: 'Goal is required' })}
                >
                  <option value="">Select your goal</option>
                  <option value="lose-weight">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain-muscle">Gain Muscle</option>
                </select>
                {errors.goal && <p className="mt-1 text-sm text-error-500">{errors.goal.message}</p>}
              </div>
              
              <div className="flex justify-center pt-4">
                <button type="submit" className="btn btn-primary w-full sm:w-auto">
                  Calculate My Macros
                </button>
              </div>
            </form>
          </div>
          
          {/* Results Section */}
          <div id="results" className="scroll-mt-24">
            {macros && <MacroResults macros={macros} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;