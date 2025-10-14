import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseApiKey) {
  throw new Error('Missing Supabase environment variables');
};

export const supabase = createClient(supabaseUrl, supabaseApiKey);

export interface Anime {
  id: number;
  name: string;
  description: string;
  genre: string;
  rating: number;
  episodes: number;
  cover: string;
  status: 'finished' | 'inProgress';
  created_at: string;
};
