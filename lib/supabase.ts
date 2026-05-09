import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials missing. Client will fail on actual usage.');
    }
    
    supabaseClient = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder");
  }
  return supabaseClient;
};
