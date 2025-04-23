import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DumbbellIcon, 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare,
  LogOut,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: 'Client Requests',
      path: '/admin/client-requests',
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: 'Nutrition Plans',
      path: '/admin/nutrition-plans',
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      name: 'Production',
      path: '/admin/production',
      icon: <FileText className="w-4 h-4" />,
    }
  ];
  
  return (
    <div className="h-full w-[200px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <Link to="/admin" className="flex items-center space-x-2">
          <DumbbellIcon className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-semibold text-gray-800">Admin Portal</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-2 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-2 py-1.5 rounded-md text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-500'
                }`}
              >
                {item.icon}
                <span className="ml-2 text-sm">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          className="flex items-center text-gray-600 hover:text-primary-500 px-2 py-1.5 w-full rounded-md text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-2">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;