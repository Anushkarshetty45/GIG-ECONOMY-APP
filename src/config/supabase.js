import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://motdfjvymyjvgmfpkrqo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdGRmanZ5bXlqdmdtZnBrcnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NzQ5NjQsImV4cCI6MjA4MTI1MDk2NH0.shsca4ES39IWdtY5y0aBlr4KQgmcH_25i9Ym5JYVv2U'

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

if (isSupabaseConfigured()) {
  console.log('✅ Supabase configured successfully')
} else {
  console.warn('⚠️ Supabase credentials not found. App will run in demo mode.')
}
