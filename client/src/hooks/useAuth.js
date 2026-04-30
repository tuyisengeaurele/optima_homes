import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { user, isAuthenticated, loading, login, register, logout, fetchMe, updateProfile } = useAuthStore()

  const isAdmin = user?.role === 'admin'

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin,
    login,
    register,
    logout,
    fetchMe,
    updateProfile,
  }
}
