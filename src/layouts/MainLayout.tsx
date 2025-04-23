import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ChatButton from '../components/chat/ChatButton';

const MainLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {user && !user.user_metadata?.is_admin && <ChatButton />}
    </div>
  );
};

export default MainLayout;