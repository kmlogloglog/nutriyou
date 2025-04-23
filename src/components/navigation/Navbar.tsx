import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, DumbbellIcon, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <DumbbellIcon className="h-7 w-7 text-primary-500" />
            <span className="text-xl font-semibold text-gray-800">NutriFit</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
              Home
            </Link>
            <Link to="/calculator" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
              Calculator
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
              Pricing
            </Link>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-500 font-medium transition-colors"
                >
                  <span>{user.user_metadata?.full_name || user.email}</span>
                  <User className="h-5 w-5" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {user.user_metadata?.is_admin && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-500"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-500"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/dashboard/meals" 
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-500"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Meals
                    </Link>
                    <Link 
                      to="/dashboard/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-500"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-500 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-500 font-medium transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/calculator" 
                className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Calculator
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>

              {user ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  {user.user_metadata?.is_admin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/dashboard/meals" 
                    className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meals
                  </Link>
                  <Link 
                    to="/dashboard/profile" 
                    className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-primary-500 font-medium transition-colors flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;