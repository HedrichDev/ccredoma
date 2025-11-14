import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function initializeDatabase() {
  try {
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .limit(1);

    if (rolesError) {
      console.log('Database tables might not exist yet. Please create them in Supabase.');
      console.log('Error:', rolesError.message);
    } else {
      console.log('✓ Successfully connected to Supabase database');
    }
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
  }
}
