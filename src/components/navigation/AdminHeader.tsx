import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <div className="flex-1 flex">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:text-primary-500 transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-4 w-4 bg-accent-500 rounded-full flex items-center justify-center text-xs text-white">
            3
          </span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end">
            <span className="font-medium text-sm">{currentUser?.name}</span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>
          <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;