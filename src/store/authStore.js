import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../config/supabase'
import { validatePassword, sanitizeString, createRateLimiter, logSecurityEvent } from '../utils/security'

// Rate limiters for security
const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
const signupRateLimiter = createRateLimiter(3, 60 * 60 * 1000) // 3 attempts per hour

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

          // Rate limiting check
          const rateLimitCheck = signupRateLimiter()
          if (!rateLimitCheck.allowed) {
            logSecurityEvent('signup_rate_limit_exceeded', { email })
            throw new Error(rateLimitCheck.error)
          }

          // Sanitize email
          const sanitizedEmail = sanitizeString(email).toLowerCase().trim()

          // Validate password strength
          const passwordValidation = validatePassword(password)
          if (!passwordValidation.valid) {
            logSecurityEvent('signup_weak_password', { email: sanitizedEmail })
            throw new Error(passwordValidation.errors[0])
          }

          // Development mode - bypass Supabase auth
          if (import.meta.env.VITE_DEV_MODE === 'true') {
            const mockUser = {
              id: 'dev-user-' + Date.now(),
              email: sanitizedEmail,
              user_metadata: userData || { name: 'Dev User' }
            }
            const mockSession = {
              user: mockUser,
              access_token: 'dev-token-' + Date.now()
            }

            set({
              user: mockUser,
              session: mockSession,
              loading: false,
            })

            logSecurityEvent('signup_success_dev', { email: sanitizedEmail })
            console.log('🔧 Development mode: Registration bypassed')
            return { success: true, data: { user: mockUser, session: mockSession } }
          }

          const { data, error } = await supabase.auth.signUp({
            email: sanitizedEmail,
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

          logSecurityEvent('signup_success', { email: sanitizedEmail, userId: data.user?.id })
          return { success: true, data }
        } catch (error) {
          logSecurityEvent('signup_failed', { email, error: error.message })
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      signIn: async (email, password) => {
        try {
          set({ loading: true, error: null })

          // Rate limiting check
          const rateLimitCheck = loginRateLimiter()
          if (!rateLimitCheck.allowed) {
            logSecurityEvent('login_rate_limit_exceeded', { email })
            throw new Error(rateLimitCheck.error)
          }

          // Sanitize email
          const sanitizedEmail = sanitizeString(email).toLowerCase().trim()

          // Development mode - bypass Supabase auth
          if (import.meta.env.VITE_DEV_MODE === 'true') {
            const mockUser = {
              id: 'dev-user-123',
              email: sanitizedEmail,
              user_metadata: { name: 'Dev User' }
            }
            const mockSession = {
              user: mockUser,
              access_token: 'dev-token-123'
            }

            set({
              user: mockUser,
              session: mockSession,
              loading: false,
            })

            logSecurityEvent('login_success_dev', { email: sanitizedEmail })
            console.log('🔧 Development mode: Auth bypassed')
            return { success: true, data: { user: mockUser, session: mockSession } }
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email: sanitizedEmail,
            password,
          })

          if (error) throw error

          set({
            user: data.user,
            session: data.session,
            loading: false,
          })

          logSecurityEvent('login_success', { email: sanitizedEmail, userId: data.user?.id })
          return { success: true, data }
        } catch (error) {
          logSecurityEvent('login_failed', { email, error: error.message })
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      signOut: async () => {
        try {
          set({ loading: true })

          const currentUser = get().user
          const { error } = await supabase.auth.signOut()

          if (error) throw error

          set({
            user: null,
            session: null,
            loading: false,
          })

          logSecurityEvent('logout_success', { userId: currentUser?.id })
          return { success: true }
        } catch (error) {
          logSecurityEvent('logout_failed', { error: error.message })
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      resetPassword: async (email) => {
        try {
          set({ loading: true, error: null })

          // Sanitize email
          const sanitizedEmail = sanitizeString(email).toLowerCase().trim()

          const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
            redirectTo: window.location.origin + '/reset-password',
          })

          if (error) throw error

          set({ loading: false })
          logSecurityEvent('password_reset_requested', { email: sanitizedEmail })
          return { success: true }
        } catch (error) {
          logSecurityEvent('password_reset_failed', { email, error: error.message })
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },

      updatePassword: async (newPassword) => {
        try {
          set({ loading: true, error: null })

          // Validate password strength
          const passwordValidation = validatePassword(newPassword)
          if (!passwordValidation.valid) {
            logSecurityEvent('password_update_weak_password', { userId: get().user?.id })
            throw new Error(passwordValidation.errors[0])
          }

          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          })

          if (error) throw error

          set({ loading: false })
          logSecurityEvent('password_updated', { userId: get().user?.id })
          return { success: true }
        } catch (error) {
          logSecurityEvent('password_update_failed', { userId: get().user?.id, error: error.message })
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
