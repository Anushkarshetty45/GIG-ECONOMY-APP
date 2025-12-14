import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// In development mode, allow app to run without Supabase (for UI testing)
const isDevelopment = process.env.NODE_ENV === 'development' || __DEV__;

// Validate required environment variables in production
if (!isDevelopment && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  throw new Error(
    'Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file. ' +
    'Copy env.example to .env and add your credentials from https://supabase.com/dashboard'
  );
}

// Warn in development if env vars are missing
if (isDevelopment && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  console.warn(
    '⚠️  Supabase credentials not configured. App will run in demo mode.\n' +
    'To connect to Supabase:\n' +
    '1. Copy env.example to .env\n' +
    '2. Add your credentials from https://supabase.com/dashboard\n' +
    '3. Restart the development server'
  );
}

// Enforce HTTPS in production
if (!isDevelopment && SUPABASE_URL && !SUPABASE_URL.startsWith('https://')) {
  throw new Error('SUPABASE_URL must use HTTPS in production');
}

// Create Supabase client with AsyncStorage for React Native
// Use dummy values if not configured (development only)
const supabaseUrl = SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database table names (for reference)
export const TABLES = {
  USERS: 'users',
  ACCOUNTS: 'accounts',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  SAVINGS_GOALS: 'savings_goals',
  TAX_RECORDS: 'tax_records',
  INSURANCE_PLANS: 'insurance_plans',
  LINKED_BANKS: 'linked_banks',
};
