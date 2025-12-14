import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file. ' +
    'Copy env.example to .env and add your credentials from https://supabase.com/dashboard'
  );
}

// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production' && !SUPABASE_URL.startsWith('https://')) {
  throw new Error('SUPABASE_URL must use HTTPS in production');
}

// Create Supabase client with AsyncStorage for React Native
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
