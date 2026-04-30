import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiMessageSquare, FiUser, FiArrowRight, FiHome } from 'react-icons/fi'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

export default function UserDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ favorites: 0, inquiries: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const [f, i] = await Promise.all([api.get('/favorites'), api.get('/inquiries/my')])
        setStats({ favorites: f.data.data.favorites.length, inquiries: i.data.data.inquiries.length })
      } catch {}
    }
    load()
  }, [])

  const cards = [
    { icon: FiHeart, label: 'Saved Properties', value: stats.favorites, to: '/dashboard/saved', color: 'from-red-500 to-pink-500' },
    { icon: FiMessageSquare, label: 'My Inquiries', value: stats.inquiries, to: '/dashboard/inquiries', color: 'from-blue-500 to-royal-600' },
    { icon: FiUser, label: 'Profile Settings', value: null, to: '/dashboard/profile', color: 'from-emerald-500 to-teal-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your property dashboard</p>
          </div>

          {/* Profile card */}
          <div className="bg-gradient-luxury rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-white/70 text-sm">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-xs capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {cards.map(({ icon: Icon, label, value, to, color }) => (
              <motion.div key={label} whileHover={{ y: -4 }}>
                <Link to={to} className="block bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property hover:shadow-luxury transition-all border border-gray-100 dark:border-navy-800">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  {value !== null && (
                    <div className="text-3xl font-bold text-navy-900 dark:text-white mb-1">{value}</div>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
                  <div className="flex items-center gap-1 text-royal-600 text-xs mt-2">
                    View all <FiArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property border border-gray-100 dark:border-navy-800">
            <h3 className="font-semibold text-navy-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/listings" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-navy-800 rounded-xl hover:bg-royal-50 dark:hover:bg-royal-900/20 transition-all group">
                <FiHome size={18} className="text-royal-600" />
                <span className="text-sm font-medium text-navy-800 dark:text-gray-300 group-hover:text-royal-600">Browse Properties</span>
              </Link>
              <Link to="/dashboard/profile" className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-navy-800 rounded-xl hover:bg-royal-50 dark:hover:bg-royal-900/20 transition-all group">
                <FiUser size={18} className="text-royal-600" />
                <span className="text-sm font-medium text-navy-800 dark:text-gray-300 group-hover:text-royal-600">Edit Profile</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
