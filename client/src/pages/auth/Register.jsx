import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'

export default function Register() {
  const [showPass, setShowPass] = useState(false)
  const { register: signup, loading } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async ({ name, email, password }) => {
    const result = await signup(name, email, password)
    if (result.success) {
      addToast('Account created! Welcome to OptimaHomes!', 'success')
      navigate('/')
    } else {
      addToast(result.message, 'error')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-luxury items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center px-12">
          <h2 className="text-4xl font-bold text-white mb-3">Join OptimaHomes</h2>
          <p className="text-white/60 text-lg">Start your property journey today</p>
          <div className="mt-10 space-y-4">
            {['Free Account Forever', 'Save Favorite Properties', 'Direct Agent Contact', 'Personalized Recommendations'].map(f => (
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

      <div className="flex-1 flex items-center justify-center px-6 py-20 bg-gray-50 dark:bg-navy-950">
        <motion.div className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-luxury p-8 border border-gray-100 dark:border-navy-800">
            <div className="mb-8">
              <Link to="/" className="flex items-center gap-2 mb-8">
                <span className="text-xl font-bold"><span className="text-navy-900 dark:text-white">optima</span><span className="text-royal-600">homes</span></span>
              </Link>
              <h1 className="text-2xl font-bold text-navy-900 dark:text-white mb-1">Create Account</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Join thousands of happy homeowners</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input {...register('name', { required: 'Name required', minLength: { value: 2, message: 'At least 2 characters' } })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                    type="email" placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input {...register('password', { required: 'Password required', minLength: { value: 6, message: 'At least 6 characters' } })}
                    type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input {...register('confirmPassword', { required: 'Please confirm password', validate: v => v === password || 'Passwords do not match' })}
                    type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <motion.button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-royal-600 hover:bg-royal-700 disabled:opacity-60 text-white font-medium rounded-xl transition-all shadow-md mt-2"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                {loading ? 'Creating Account...' : <><span>Create Account</span><FiArrowRight /></>}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-royal-600 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
