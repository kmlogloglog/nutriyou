import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface MetricsFormData {
  weight?: number;
  body_fat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateMetricsModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MetricsFormData>();

  const onSubmit = async (data: MetricsFormData) => {
    if (!user) return;
    
    // Filter out undefined values
    const metricsData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== '')
    );

    if (Object.keys(metricsData).length === 0) {
      alert('Please enter at least one measurement');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('metrics')
        .insert([
          {
            user_id: user.id,
            ...metricsData
          }
        ]);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating metrics:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all fields?')) {
      reset();
    }
  };

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold">Update Metrics</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="p-4 overflow-y-auto flex-grow">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="Enter weight"
                  {...register('weight', {
                    min: { value: 30, message: 'Weight must be at least 30kg' },
                    max: { value: 300, message: 'Weight must be less than 300kg' }
                  })}
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-error-500">{errors.weight.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body Fat %
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="Enter body fat percentage"
                  {...register('body_fat', {
                    min: { value: 1, message: 'Body fat must be at least 1%' },
                    max: { value: 50, message: 'Body fat must be less than 50%' }
                  })}
                />
                {errors.body_fat && (
                  <p className="mt-1 text-sm text-error-500">{errors.body_fat.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chest (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="Enter chest measurement"
                  {...register('chest', {
                    min: { value: 50, message: 'Chest must be at least 50cm' },
                    max: { value: 200, message: 'Chest must be less than 200cm' }
                  })}
                />
                {errors.chest && (
                  <p className="mt-1 text-sm text-error-500">{errors.chest.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waist (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="Enter waist measurement"
                  {...register('waist', {
                    min: { value: 40, message: 'Waist must be at least 40cm' },
                    max: { value: 200, message: 'Waist must be less than 200cm' }
                  })}
                />
                {errors.waist && (
                  <p className="mt-1 text-sm text-error-500">{errors.waist.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hips (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="Enter hips measurement"
                  {...register('hips', {
                    min: { value: 50, message: 'Hips must be at least 50cm' },
                    max: { value: 200, message: 'Hips must be less than 200cm' }
                  })}
                />
                {errors.hips && (
                  <p className="mt-1 text-sm text-error-500">{errors.hips.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline text-error-600 border-error-600 hover:bg-error-50"
            >
              Reset
            </button>
            <div className="space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Metrics'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMetricsModal;