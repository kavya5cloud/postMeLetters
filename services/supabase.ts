
import { createClient } from '@supabase/supabase-js';

// These should be replaced with actual environment variables or hardcoded if allowed in your context.
// Assuming they might be provided in process.env for security.
const supabaseUrl = (process.env as any).SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
