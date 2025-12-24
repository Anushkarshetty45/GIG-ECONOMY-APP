import { createClient } from '@supabase/supabase-js'

// SECURITY: API keys are loaded from environment variables only
// Never hardcode credentials in source code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ CRITICAL: Supabase credentials missing!')
  console.error('Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  throw new Error('Supabase configuration missing. Check .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey
}

console.log('✅ Supabase configured successfully')
