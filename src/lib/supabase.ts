import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Debug: log loaded environment variables
console.log('Supabase URL loaded:', supabaseUrl);
console.log('Supabase Anon Key loaded:', supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);