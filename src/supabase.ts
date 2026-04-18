import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please add them to your environment variables.');
}

// IMPORTANT: Ensure Row Level Security (RLS) is enabled in your Supabase dashboard
// for all tables to prevent unauthorized access.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
