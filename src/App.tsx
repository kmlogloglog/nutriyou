import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MealsPage from './pages/MealsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ClientRequestsPage from './pages/admin/ClientRequestsPage';
import NutritionPlansPage from './pages/admin/NutritionPlansPage';
import MessagesPage from './pages/admin/MessagesPage';
import ProductionPage from './pages/admin/ProductionPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthCallback from './pages/auth/AuthCallback';

// Components
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Auth callback route */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected user routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="meals" element={<MealsPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="client-requests" element={<ClientRequestsPage />} />
        <Route path="nutrition-plans" element={<NutritionPlansPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="production" element={<ProductionPage />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;