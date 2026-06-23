import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env');
  process.exit(1);
}

/**
 * Backend Supabase client uses the SERVICE ROLE key.
 * This bypasses Row Level Security — never expose this key to the browser.
 */
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Test the connection against the Supabase database.
 */
export async function testConnection(): Promise<void> {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = table not found — acceptable before migration runs
      console.warn('⚠️  Supabase query warning:', error.message);
    } else {
      console.log('✅ Supabase connected successfully (backend)');
      console.log(`   URL: ${supabaseUrl}`);
    }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
    process.exit(1);
  }
}
