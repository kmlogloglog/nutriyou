import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { supabase } from '../lib/supabase';

interface FormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the redirect location from state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const getErrorMessage = (error: any): string => {
    if (error.message?.toLowerCase().includes('invalid login credentials')) {
      return 'The email or password you entered is incorrect. Please try again.';
    }
    if (error.message?.toLowerCase().includes('email not confirmed')) {
      return 'Please verify your email address before logging in.';
    }
    if (error.message?.toLowerCase().includes('too many requests')) {
      return 'Too many login attempts. Please try again later.';
    }
    return 'An error occurred while signing in. Please try again.';
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError('');
    
    try {
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(),
        password: data.password
      });

      if (signInError) {
        throw signInError;
      }

      if (!session) {
        throw new Error('No session found');
      }

      // Debug logging
      console.log('Session User:', {
        id: session.user.id,
        email: session.user.email,
        metadata: session.user.user_metadata,
        rawMetadata: session.user.raw_user_meta_data
      });

      // Check both metadata locations for admin status
      const isAdmin = session.user.raw_user_meta_data?.is_admin === true || 
                     session.user.user_metadata?.is_admin === true;

      console.log('Is Admin Check:', {
        rawMetadataAdmin: session.user.raw_user_meta_data?.is_admin,
        userMetadataAdmin: session.user.user_metadata?.is_admin,
        finalIsAdmin: isAdmin
      });
      
      if (isAdmin) {
        console.log('Redirecting to admin dashboard');
        navigate('/admin');
      } else {
        console.log('Redirecting to regular dashboard');
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error('Login error details:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-md mx-auto px-4">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>
          
          {error && (
            <div className="mb-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p>{error}</p>
                {error.includes('incorrect') && (
                  <p className="text-sm mt-1">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                      Sign up here
                    </Link>
                  </p>
                )}
              </div>
            </div>
          )}
          
          <GoogleSignInButton mode="signin" className="mb-6" />
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`input pl-10 ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-error-500">{errors.email.message}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  className={`input pl-10 ${errors.password ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-error-500">{errors.password.message}</p>}
            </div>
            
            <div>
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;