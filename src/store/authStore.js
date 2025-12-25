import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../config/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      initialize: async () => {
        try {
          set({ loading: true })

          const { data: { session }, error } = await supabase.auth.getSession()

          if (error) throw error

          if (session) {
            set({
              user: session.user,
              session,
              loading: false,
            })
          } else {
            set({ loading: false })
          }

          supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event)
            set({
              user: session?.user ?? null,
              session: session ?? null,
            })
          })
        } catch (error) {
          console.error('Error initializing auth:', error)
          set({ error: error.message, loading: false })
        }
      },

      signUp: async (email, password, userData) => {
        try {
          set({ loading: true, error: null })

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData,
              emailRedirectTo: `${window.location.origin}/login`,
            },
          })

          if (error) throw error

          set({
            user: data.user,
            session: data.session,
            loading: false,
          })

          return { success: true, data }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      signIn: async (email, password) => {
        try {
          set({ loading: true, error: null })

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          set({
            user: data.user,
            session: data.session,
            loading: false,
          })

          return { success: true, data }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      signOut: async () => {
        try {
          set({ loading: true })

          const { error } = await supabase.auth.signOut()

          if (error) throw error

          set({
            user: null,
            session: null,
            loading: false,
          })

          return { success: true }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      resetPassword: async (email) => {
        try {
          set({ loading: true, error: null })

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password',
          })

          if (error) throw error

          set({ loading: false })
          return { success: true }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      updatePassword: async (newPassword) => {
        try {
          set({ loading: true, error: null })

          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          })

          if (error) throw error

          set({ loading: false })
          return { success: true }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
