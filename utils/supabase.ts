import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: true
    }
  }
);

// Optional: Dev-only logging
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase client initialized in development mode');
}
