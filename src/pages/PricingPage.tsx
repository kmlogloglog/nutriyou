import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, X, Info } from 'lucide-react';
import Tooltip from '../components/ui/Tooltip';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popularFeature?: string;
  isPopular?: boolean;
}

const PricingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Basic features for individuals just getting started.',
      features: [
        'Macro calculator',
        'Basic food database access',
        'Calorie tracking (limited)',
        'Weight tracking (limited)',
      ],
    },
    {
      id: 'pro',
      name: 'Premium',
      price: billingCycle === 'monthly' ? 9.99 : 89.99,
      description: 'Everything you need for serious nutrition planning.',
      features: [
        'All Free features',
        'Advanced macro calculator with adjustments',
        'Unlimited food logging',
        'Meal plan generator',
        'Recipe database access',
        'Progress analytics',
        'Weekly check-ins',
      ],
      popularFeature: 'Meal plan generator',
      isPopular: true,
    },
    {
      id: 'coach',
      name: 'Coaching',
      price: billingCycle === 'monthly' ? 29.99 : 279.99,
      description: 'Personal nutrition coaching and customized plans.',
      features: [
        'All Premium features',
        'Personal nutrition coach',
        'Custom meal plans updated weekly',
        'Direct messaging with coach',
        'Video consultations (2/month)',
        'Advanced health metrics tracking',
        'Priority support',
      ],
    },
  ];
  
  const handleBillingCycleChange = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
  };

  const getSavingsPercentage = () => {
    // Assuming yearly price is equivalent to 10 months of monthly price
    return Math.round((2 / 12) * 100);
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Nutrition Plan</h1>
          <p className="text-xl text-gray-600">
            Select the plan that best fits your fitness goals and nutrition needs.
          </p>
          
          <div className="mt-8 inline-flex items-center p-1 bg-gray-100 rounded-lg">
            <button
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => handleBillingCycleChange('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => handleBillingCycleChange('yearly')}
            >
              Yearly
              <span className="ml-2 py-0.5 px-2 text-xs bg-accent-100 text-accent-800 rounded-full">
                Save {getSavingsPercentage()}%
              </span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`rounded-xl overflow-hidden transition-all duration-300 ${
                plan.isPopular 
                  ? 'transform md:-translate-y-4 ring-2 ring-primary-500' 
                  : 'border border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="bg-primary-500 text-white text-center py-2 font-medium text-sm">
                  MOST POPULAR
                </div>
              )}
              
              <div className="bg-white p-8">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600 h-12">{plan.description}</p>
                
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                
                <div className="mt-8">
                  {currentUser ? (
                    <Link
                      to={{
                        pathname: currentUser.isPremium && plan.id !== 'free' ? '#' : `/checkout/${plan.id}`,
                      }}
                      className={`w-full btn ${
                        currentUser.isPremium && plan.id !== 'free'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : plan.isPopular
                          ? 'btn-primary'
                          : 'btn-outline hover:text-primary-600 hover:border-primary-500'
                      }`}
                      onClick={(e) => {
                        if (currentUser.isPremium && plan.id !== 'free') {
                          e.preventDefault();
                        }
                      }}
                    >
                      {currentUser.isPremium && plan.id !== 'free'
                        ? 'Current Plan'
                        : plan.id === 'free'
                        ? 'Current Plan'
                        : `Upgrade to ${plan.name}`}
                    </Link>
                  ) : (
                    <Link
                      to={plan.id === 'free' ? '/register' : '/register'}
                      className={`w-full btn ${
                        plan.isPopular ? 'btn-primary' : 'btn-outline hover:text-primary-600 hover:border-primary-500'
                      }`}
                    >
                      {plan.id === 'free' ? 'Sign Up Free' : 'Get Started'}
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-8 py-8">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  What's included
                </h4>
                <ul className="mt-4 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-gray-700">{feature}</span>
                      {feature === plan.popularFeature && (
                        <Tooltip content="Most valued feature by our users">
                          <span className="ml-1 inline-flex">
                            <Info className="h-4 w-4 text-primary-400" />
                          </span>
                        </Tooltip>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="px-8 py-6">
              <h3 className="text-lg font-medium text-gray-900">Can I cancel my subscription at any time?</h3>
              <p className="mt-2 text-gray-600">
                Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your current billing cycle.
              </p>
            </div>
            
            <div className="px-8 py-6">
              <h3 className="text-lg font-medium text-gray-900">How do I work with a nutrition coach?</h3>
              <p className="mt-2 text-gray-600">
                After signing up for the Coaching plan, you'll be matched with a certified nutrition coach who will contact you to schedule an initial consultation. From there, they'll create your personalized plan and provide ongoing support.
              </p>
            </div>
            
            <div className="px-8 py-6">
              <h3 className="text-lg font-medium text-gray-900">Are there refunds if I'm not satisfied?</h3>
              <p className="mt-2 text-gray-600">
                We offer a 14-day money-back guarantee if you're not completely satisfied with your premium subscription. Simply contact our support team within 14 days of your purchase.
              </p>
            </div>
            
            <div className="px-8 py-6">
              <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, including Visa, MasterCard, American Express, and Discover. We also support payment through PayPal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;