import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <p className="text-gray-700">Email: {user?.email || 'Not available'}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;