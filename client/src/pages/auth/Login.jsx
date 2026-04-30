import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const { login, loading } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email, password }) => {
    const result = await login(email, password)
    if (result.success) {
      addToast('Welcome back!', 'success')
      navigate(from, { replace: true })
    } else {
      addToast(result.message, 'error')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-luxury items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
              <path d="M32 8L58 30V58H38V42H26V58H6V30L32 8Z" fill="none" stroke="white" strokeWidth="3.5" strokeLinejoin="round" />
              <rect x="26" y="42" width="12" height="16" fill="#60a5fa" />
              <rect x="28" y="18" width="8" height="8" rx="1" fill="#93c5fd" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Welcome Back</h2>
          <p className="text-white/60 text-lg">Your dream home is waiting for you</p>
          <div className="mt-10 space-y-4">
            {['500+ Premium Properties', 'Verified Listings Only', '24/7 Expert Support'].map(f => (
              <div key={f} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-5 h-5 rounded-full bg-royal-500/30 flex items-center justify-center flex-shrink-0">✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="absolute rounded-full border border-white/10"
            style={{ width: 200 + i * 150, height: 200 + i * 150, left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
        ))}
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 bg-gray-50 dark:bg-navy-950">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-luxury p-8 border border-gray-100 dark:border-navy-800">
            <div className="mb-8">
              <Link to="/" className="flex items-center gap-2 mb-8">
                <span className="text-xl font-bold"><span className="text-navy-900 dark:text-white">optima</span><span className="text-royal-600">homes</span></span>
              </Link>
              <h1 className="text-2xl font-bold text-navy-900 dark:text-white mb-1">Sign In</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                    type="email" placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500/20 transition-all"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500/20 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <motion.button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-royal-600 hover:bg-royal-700 disabled:opacity-60 text-white font-medium rounded-xl transition-all shadow-md"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              >
                {loading ? 'Signing in...' : <><span>Sign In</span><FiArrowRight /></>}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-royal-600 font-medium hover:underline">Create one</Link>
            </p>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-600 dark:text-blue-400">
              <strong>Demo Admin:</strong> admin@optimahomes.com / admin123
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
