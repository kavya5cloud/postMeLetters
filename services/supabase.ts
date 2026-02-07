
import { createClient } from '@supabase/supabase-js';

// Safe environment variable access
const getEnv = (key: string) => {
  try {
    return (process.env as any)[key];
  } catch {
    return undefined;
  }
};

const supabaseUrl = getEnv('SUPABASE_URL') || 'https://placeholder.supabase.co';
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || 'placeholder-key';

// We create the client, but the storage service will check if it's actually "usable" 
// before making calls to prevent runtime errors in the console.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
