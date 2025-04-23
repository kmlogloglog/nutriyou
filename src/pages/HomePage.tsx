import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, Activity, Trophy, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Calculate Your Macros, Transform Your Life
              </h1>
              <p className="text-xl mb-8 text-primary-50">
                Get personalized nutrition recommendations based on your goals, body composition, and lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/calculator" className="btn bg-white text-primary-600 hover:bg-primary-50">
                  Try Calculator
                </Link>
                {!user && (
                  <Link to="/register" className="btn bg-accent-500 hover:bg-accent-600 text-white">
                    Create Account
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 animate-slide-up">
              <img 
                src="https://images.pexels.com/photos/3621168/pexels-photo-3621168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Healthy eating and fitness" 
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose NutriFit?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive tools help you achieve your health and fitness goals with personalized recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover:shadow-smooth-lg transition-shadow">
              <div className="p-2 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <PieChart className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Precise Macro Calculator</h3>
              <p className="text-gray-600">
                Get exact macro ratios based on your body type, goals, and activity level using our scientifically-backed calculator.
              </p>
            </div>

            <div className="card hover:shadow-smooth-lg transition-shadow">
              <div className="p-2 bg-secondary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <User className="h-7 w-7 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Plans</h3>
              <p className="text-gray-600">
                Upgrade to premium for customized nutrition plans tailored to your specific health needs and fitness goals.
              </p>
            </div>

            <div className="card hover:shadow-smooth-lg transition-shadow">
              <div className="p-2 bg-accent-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Activity className="h-7 w-7 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your nutrition journey with interactive charts and detailed metrics to stay motivated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="card text-center relative z-10">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-2">Calculate Your Macros</h3>
                <p className="text-gray-600">
                  Enter your details in our calculator to get your personalized macro recommendations.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-0.5 bg-gray-300 transform -translate-y-1/2 -translate-x-8 z-0"></div>
            </div>

            <div className="relative">
              <div className="card text-center relative z-10">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                <p className="text-gray-600">
                  Sign up to save your results and unlock additional features and recommendations.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-0.5 bg-gray-300 transform -translate-y-1/2 -translate-x-8 z-0"></div>
            </div>

            <div className="relative">
              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                <p className="text-gray-600">
                  Follow your personalized plan and monitor your results with our tracking tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from our satisfied users who transformed their health with NutriFit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Sarah J." 
                  className="w-12 h-12 object-cover rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Sarah J.</h4>
                  <p className="text-sm text-gray-500">Lost 28 lbs in 6 months</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The macro calculator helped me understand my nutrition needs. With the premium plan, I finally achieved my weight loss goals after years of struggling."
              </p>
              <div className="flex mt-4 text-accent-500">
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Michael T." 
                  className="w-12 h-12 object-cover rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className="text-sm text-gray-500">Gained 15 lbs of muscle</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The customized bulking plan was a game-changer for my fitness journey. I'm finally seeing the muscle gains I've been working for."
              </p>
              <div className="flex mt-4 text-accent-500">
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Jennifer L." 
                  className="w-12 h-12 object-cover rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Jennifer L.</h4>
                  <p className="text-sm text-gray-500">Improved energy levels</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Beyond just weight changes, I noticed a huge improvement in my energy levels and athletic performance using the recommended macros."
              </p>
              <div className="flex mt-4 text-accent-500">
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5 mr-1" />
                <Trophy className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-500 to-secondary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Nutrition?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of users who have already improved their health and fitness with our personalized nutrition plans.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/calculator" className="btn bg-white text-secondary-600 hover:bg-gray-100">
                Try the Calculator
              </Link>
              <Link to="/pricing" className="btn bg-accent-500 hover:bg-accent-600 text-white">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;