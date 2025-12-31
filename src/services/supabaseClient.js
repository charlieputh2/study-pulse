import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://krdocvyhqttfyhbhcice.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_okjtlco2JXLny4ytO7ey4Q_dE8-tR-W';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
