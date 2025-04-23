import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Check both metadata locations for admin status
  const isAdmin = user?.user_metadata?.is_admin === true || 
                 user?.raw_user_meta_data?.is_admin === true;

  if (!user || !isAdmin) {
    console.log('Access denied: User is not admin', {
      userExists: !!user,
      userMetadata: user?.user_metadata,
      rawMetadata: user?.raw_user_meta_data
    });
    // Redirect to homepage if not an admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;