import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Send } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  sender: {
    email: string;
    full_name: string;
  };
}

interface User {
  id: string;
  email: string;
  full_name: string;
  last_message?: {
    content: string;
    created_at: string;
  };
}

const MessagesPage = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const checkSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUsers();
    setupMessagesSubscription();
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      markMessagesAsRead(selectedUser.id);
    }
  }, [selectedUser]);

  const setupMessagesSubscription = () => {
    const sub = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, payload => {
        const newMessage = payload.new as Message;
        if (selectedUser && 
            (newMessage.sender_id === selectedUser.id || 
             newMessage.receiver_id === selectedUser.id)) {
          setMessages(prev => [...prev, newMessage]);
          markMessagesAsRead(selectedUser.id);
        }
        updateUserLastMessage(newMessage);
      })
      .subscribe();

    setSubscription(sub);
  };

  const fetchUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name')
        .neq('id', user.id);

      if (usersError) throw usersError;

      // Get last message for each user
      const usersWithLastMessage = await Promise.all(
        usersData.map(async user => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...user,
            last_message: lastMessage
          };
        })
      );

      setUsers(usersWithLastMessage);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(email, full_name)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (senderId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .is('read_at', null);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const updateUserLastMessage = (message: Message) => {
    setUsers(prev => prev.map(user => {
      if (user.id === message.sender_id || user.id === message.receiver_id) {
        return {
          ...user,
          last_message: {
            content: message.content,
            created_at: message.created_at
          }
        };
      }
      return user;
    }));
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: selectedUser.id,
            content: newMessage.trim()
          }
        ]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Conversations</h2>
          <div className="space-y-2">
            {users.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium">{user.full_name || user.email}</p>
                    {user.last_message && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate max-w-[150px]">
                          {user.last_message.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(user.last_message.created_at), 'MMM d, HH:mm')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4">
          <div className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {selectedUser ? (
                <div className="flex flex-col space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.sender_id === supabase.auth.getUser().data?.user?.id;
                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg py-2 px-4 max-w-xs ${
                          isCurrentUser 
                            ? 'bg-primary-100 text-primary-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t pt-4">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="input flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={!selectedUser}
                />
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedUser || !newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;