import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (email, password) => {
        set({ loading: true })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          const { user, token } = data.data
          localStorage.setItem('token', token)
          set({ user, token, isAuthenticated: true, loading: false })
          return { success: true }
        } catch (err) {
          set({ loading: false })
          return { success: false, message: err.response?.data?.message || 'Login failed' }
        }
      },

      register: async (name, email, password) => {
        set({ loading: true })
        try {
          const { data } = await api.post('/auth/register', { name, email, password })
          const { user, token } = data.data
          localStorage.setItem('token', token)
          set({ user, token, isAuthenticated: true, loading: false })
          return { success: true }
        } catch (err) {
          set({ loading: false })
          return { success: false, message: err.response?.data?.message || 'Registration failed' }
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch {}
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      fetchMe: async () => {
        const token = localStorage.getItem('token')
        if (!token) return
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.data.user, isAuthenticated: true })
        } catch {
          localStorage.removeItem('token')
          set({ user: null, token: null, isAuthenticated: false })
        }
      },

      updateProfile: async (fields) => {
        const { data } = await api.put('/auth/profile', fields)
        set({ user: data.data.user })
        return data
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
