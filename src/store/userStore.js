import { create } from 'zustand';
import { supabase } from '../config/supabase';

// User data store
export const useUserStore = create((set, get) => ({
  // State
  profile: null,
  totalSavings: 0,
  transactions: [],
  categories: [],
  savingsGoals: [],
  loading: false,
  error: null,

  // Actions
  setProfile: (profile) => set({ profile }),
  setTotalSavings: (totalSavings) => set({ totalSavings }),
  setTransactions: (transactions) => set({ transactions }),
  setCategories: (categories) => set({ categories }),
  setSavingsGoals: (savingsGoals) => set({ savingsGoals }),

  // Fetch user profile
  fetchProfile: async (userId) => {
    try {
      set({ loading: true });

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      set({ profile: data, loading: false });
      return { success: true, data };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Calculate total savings
  calculateSavings: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', userId);

      if (error) throw error;

      const total = data.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
          return acc + transaction.amount;
        } else if (transaction.type === 'expense') {
          return acc - transaction.amount;
        }
        return acc;
      }, 0);

      set({ totalSavings: total });
      return { success: true, total };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Fetch transactions
  fetchTransactions: async (userId) => {
    try {
      set({ loading: true });

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ transactions: data, loading: false });
      return { success: true, data };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Add transaction
  addTransaction: async (transaction) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select();

      if (error) throw error;

      // Update local state
      const currentTransactions = get().transactions;
      set({ transactions: [data[0], ...currentTransactions] });

      // Recalculate savings
      await get().calculateSavings(transaction.user_id);

      return { success: true, data: data[0] };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Fetch categories
  fetchCategories: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      set({ categories: data });
      return { success: true, data };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Add category
  addCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select();

      if (error) throw error;

      const currentCategories = get().categories;
      set({ categories: [...currentCategories, data[0]] });

      return { success: true, data: data[0] };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Fetch savings goals
  fetchSavingsGoals: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      set({ savingsGoals: data });
      return { success: true, data };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Add savings goal
  addSavingsGoal: async (goal) => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([goal])
        .select();

      if (error) throw error;

      const currentGoals = get().savingsGoals;
      set({ savingsGoals: [...currentGoals, data[0]] });

      return { success: true, data: data[0] };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },
}));
