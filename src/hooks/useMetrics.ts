import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Metric {
  id: string;
  weight?: number;
  body_fat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  created_at: string;
}

export const useMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMetrics(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
};