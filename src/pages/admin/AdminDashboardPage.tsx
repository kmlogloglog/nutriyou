import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Bell, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlans: 0,
    pendingRequests: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total users
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Fetch active nutrition plans
      const { count: planCount } = await supabase
        .from('nutrition_plans')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      // Fetch pending requests
      const { count: requestCount } = await supabase
        .from('nutrition_assessments')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      // Fetch recent requests
      const { data: recentData } = await supabase
        .from('nutrition_assessments')
        .select(`
          id,
          full_name,
          created_at,
          status
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: userCount || 0,
        activePlans: planCount || 0,
        pendingRequests: requestCount || 0,
        revenue: 0 // Revenue calculation would depend on your payment system
      });

      setRecentRequests(recentData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    // Navigate to production page with empty form
    window.location.href = '/admin/production';
  };

  const handleGenerateReport = async () => {
    try {
      const { data: assessments } = await supabase
        .from('nutrition_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      // Create CSV content
      const csvContent = [
        ['Name', 'Date', 'Status'].join(','),
        ...(assessments || []).map(assessment => [
          assessment.full_name,
          new Date(assessment.created_at).toLocaleDateString(),
          assessment.status
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutrition-assessments-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <Users className="h-6 w-6 text-primary-500" />
          </div>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Active Plans</h2>
            <CheckCircle className="h-6 w-6 text-primary-500" />
          </div>
          <p className="text-3xl font-bold">{stats.activePlans}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Pending Requests</h2>
            <Bell className="h-6 w-6 text-primary-500" />
          </div>
          <p className="text-3xl font-bold">{stats.pendingRequests}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Plan Requests</h2>
            <Link to="/admin/client-requests" className="text-primary-600 hover:text-primary-700 text-sm">
              View all
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request: any) => (
                  <tr key={request.id} className="border-b">
                    <td className="py-3 px-4">{request.full_name}</td>
                    <td className="py-3 px-4">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleCreatePlan}
              className="btn btn-primary"
            >
              Create New Plan
            </button>
            <button 
              onClick={handleGenerateReport}
              className="btn btn-outline"
            >
              Generate Report
            </button>
            <Link 
              to="/admin/messages" 
              className="btn btn-outline"
            >
              View Messages
            </Link>
            <Link 
              to="/admin/client-requests" 
              className="btn btn-outline"
            >
              View Requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;