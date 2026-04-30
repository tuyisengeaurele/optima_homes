import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      darkMode: false,
      splashDone: false,
      toasts: [],

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setSplashDone: () => set({ splashDone: true }),

      addToast: (message, type = 'success') => {
        const id = Date.now()
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
        setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4000)
      },

      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ darkMode: state.darkMode, splashDone: state.splashDone }),
    }
  )
)
