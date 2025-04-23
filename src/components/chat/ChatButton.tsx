import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import ChatWindow from './ChatWindow';

const ChatButton = () => {
  console.log('[ChatButton] Component rendering started.');
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminUser, setAdminUser] = useState<{ id: string; full_name: string } | null>(null);

  useEffect(() => {
    fetchAdminUser();
    if (user) {
      fetchUnreadCount();
      setupMessageSubscription();
    }
  }, [user]);

  const fetchAdminUser = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_user_info');

      if (error) {
        console.error('Error calling get_admin_user_info RPC:', error);
        throw error;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        console.log('[ChatButton] Admin user info from RPC:', data);
        // Use admin_id as the auth.users.id for the chat
        setAdminUser({ id: data[0].admin_id, full_name: data[0].admin_name });
      } else {
        console.log('[ChatButton] No admin user found via RPC. Data:', data);
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Error fetching admin user via RPC:', error);
      setAdminUser(null);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('receiver_id', user?.id)
        .is('read_at', null);

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const setupMessageSubscription = () => {
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user?.id}`
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  console.log('[ChatButton] Checking render conditions:', { 
    isUserPresent: !!user, 
    isAdminPresent: !!adminUser, 
    userObject: user, // Log the actual user object 
    adminUserObject: adminUser // Log the actual admin user object
  });

  if (!user || !adminUser) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors z-40"
      >
        <MessageSquare className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showChat && (
        <ChatWindow
          receiverId={adminUser.id}
          receiverName={adminUser.full_name || 'Admin'}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default ChatButton;