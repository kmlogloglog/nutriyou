import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

interface NutritionAssessmentFormData {
  // Personal Information
  full_name: string;
  age: number;
  gender: string;
  height: number;
  current_weight: number;
  goal_weight?: number;
  email: string;
  phone?: string;

  // Health Background
  medical_conditions: string[];
  medications: string[];
  allergies: string[];
  previous_diets: string[];
  family_history?: string;

  // Lifestyle Assessment
  occupation?: string;
  work_schedule?: string;
  activity_level: string;
  exercise_routine?: string;
  exercise_frequency?: string;
  sleep_pattern?: string;
  stress_level?: number;
  smoking_status: boolean;
  alcohol_consumption?: string;

  // Dietary Habits
  meal_structure?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  food_preferences: string[];
  dietary_restrictions: string[];
  typical_daily_food?: string;
  water_consumption?: string;
  supplements: string[];

  // Goals and Preferences
  primary_goals: string[];
  timeline?: string;
  preferred_meal_frequency?: number;
  budget_range?: string;
  meal_prep_time?: string;
  special_requirements?: string;
}

interface Props {
  onClose: () => void;
}

const NutritionAssessmentForm: React.FC<Props> = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<NutritionAssessmentFormData>();

  const totalSteps = 5;

  const onSubmit = async (data: NutritionAssessmentFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('nutrition_assessments')
        .insert([
          {
            user_id: user.id,
            ...data,
          }
        ]);

      if (error) throw error;

      onClose();
      navigate('/dashboard', { 
        state: { 
          message: 'Your nutrition assessment has been submitted successfully!' 
        }
      });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Request Nutrition Plan</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-1/5 h-2 rounded-full mx-1 ${
                    index + 1 <= currentStep ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input"
                      {...register('full_name', { required: 'Full name is required' })}
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-error-500">{errors.full_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      className="input"
                      {...register('age', { 
                        required: 'Age is required',
                        min: { value: 18, message: 'Must be at least 18 years old' }
                      })}
                    />
                    {errors.age && (
                      <p className="mt-1 text-sm text-error-500">{errors.age.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      className="input"
                      {...register('gender', { required: 'Gender is required' })}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-error-500">{errors.gender.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      className="input"
                      {...register('height', { required: 'Height is required' })}
                    />
                    {errors.height && (
                      <p className="mt-1 text-sm text-error-500">{errors.height.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input"
                      {...register('current_weight', { required: 'Current weight is required' })}
                    />
                    {errors.current_weight && (
                      <p className="mt-1 text-sm text-error-500">{errors.current_weight.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Goal Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input"
                      {...register('goal_weight')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Health Background */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Health Background</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Conditions
                  </label>
                  <textarea
                    className="input h-24"
                    placeholder="List any medical conditions..."
                    {...register('medical_conditions')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Medications
                  </label>
                  <textarea
                    className="input h-24"
                    placeholder="List any medications..."
                    {...register('medications')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies/Intolerances
                  </label>
                  <textarea
                    className="input h-24"
                    placeholder="List any allergies or food intolerances..."
                    {...register('allergies')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Diets
                  </label>
                  <textarea
                    className="input h-24"
                    placeholder="Describe any previous diets you've tried..."
                    {...register('previous_diets')}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Lifestyle Assessment */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Lifestyle Assessment</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      className="input"
                      {...register('occupation')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Schedule
                    </label>
                    <select className="input" {...register('work_schedule')}>
                      <option value="">Select schedule type</option>
                      <option value="regular">Regular (9-5)</option>
                      <option value="flexible">Flexible</option>
                      <option value="shift">Shift Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Level
                    </label>
                    <select 
                      className="input"
                      {...register('activity_level', { required: 'Activity level is required' })}
                    >
                      <option value="">Select activity level</option>
                      <option value="sedentary">Sedentary</option>
                      <option value="lightly_active">Lightly Active</option>
                      <option value="moderately_active">Moderately Active</option>
                      <option value="very_active">Very Active</option>
                      <option value="extra_active">Extra Active</option>
                    </select>
                    {errors.activity_level && (
                      <p className="mt-1 text-sm text-error-500">{errors.activity_level.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exercise Frequency
                    </label>
                    <select className="input" {...register('exercise_frequency')}>
                      <option value="">Select frequency</option>
                      <option value="never">Never</option>
                      <option value="1-2_times">1-2 times per week</option>
                      <option value="3-4_times">3-4 times per week</option>
                      <option value="5+_times">5+ times per week</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stress Level (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="input"
                      {...register('stress_level')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sleep Pattern
                    </label>
                    <select className="input" {...register('sleep_pattern')}>
                      <option value="">Select sleep pattern</option>
                      <option value="less_than_6">Less than 6 hours</option>
                      <option value="6-8_hours">6-8 hours</option>
                      <option value="more_than_8">More than 8 hours</option>
                      <option value="irregular">Irregular</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Dietary Habits */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Dietary Habits</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Daily Meals
                  </label>
                  <div className="space-y-4">
                    <textarea
                      className="input"
                      placeholder="Describe your typical breakfast..."
                      {...register('meal_structure.breakfast')}
                    />
                    <textarea
                      className="input"
                      placeholder="Describe your typical lunch..."
                      {...register('meal_structure.lunch')}
                    />
                    <textarea
                      className="input"
                      placeholder="Describe your typical dinner..."
                      {...register('meal_structure.dinner')}
                    />
                    <textarea
                      className="input"
                      placeholder="Describe your typical snacks..."
                      {...register('meal_structure.snacks')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Restrictions
                  </label>
                  <textarea
                    className="input"
                    placeholder="List any dietary restrictions..."
                    {...register('dietary_restrictions')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Water Consumption
                  </label>
                  <select className="input" {...register('water_consumption')}>
                    <option value="">Select daily water intake</option>
                    <option value="less_than_1L">Less than 1L</option>
                    <option value="1-2L">1-2L</option>
                    <option value="2-3L">2-3L</option>
                    <option value="more_than_3L">More than 3L</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplements
                  </label>
                  <textarea
                    className="input"
                    placeholder="List any supplements you currently take..."
                    {...register('supplements')}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Goals and Preferences */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Goals and Preferences</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Goals
                  </label>
                  <select 
                    multiple 
                    className="input h-32"
                    {...register('primary_goals', { required: 'Please select at least one goal' })}
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="energy_improvement">Energy Improvement</option>
                    <option value="sports_performance">Sports Performance</option>
                    <option value="health_management">Health Management</option>
                  </select>
                  {errors.primary_goals && (
                    <p className="mt-1 text-sm text-error-500">{errors.primary_goals.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline
                  </label>
                  <select className="input" {...register('timeline')}>
                    <option value="">Select your goal timeline</option>
                    <option value="1-3_months">1-3 months</option>
                    <option value="3-6_months">3-6 months</option>
                    <option value="6-12_months">6-12 months</option>
                    <option value="more_than_12">More than 12 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Meal Frequency
                  </label>
                  <select className="input" {...register('preferred_meal_frequency')}>
                    <option value="">Select preferred number of meals per day</option>
                    <option value="3">3 meals</option>
                    <option value="4">4 meals</option>
                    <option value="5">5 meals</option>
                    <option value="6">6 meals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Available for Meal Prep
                  </label>
                  <select className="input" {...register('meal_prep_time')}>
                    <option value="">Select available time for meal prep</option>
                    <option value="minimal">Minimal (15-30 mins)</option>
                    <option value="moderate">Moderate (30-60 mins)</option>
                    <option value="extensive">Extensive (60+ mins)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    className="input"
                    placeholder="Any additional requirements or preferences..."
                    {...register('special_requirements')}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Previous
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary ml-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NutritionAssessmentForm;