import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiHome, FiUsers, FiMessageSquare, FiEye, FiTrendingUp, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const formatPrice = (p) => {
  const n = Number(p)
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B RWF`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M RWF`
  return `${n.toLocaleString()} RWF`
}

const statusColors = { new: 'bg-blue-100 text-blue-700', read: 'bg-gray-100 text-gray-600', replied: 'bg-green-100 text-green-700', closed: 'bg-red-100 text-red-600' }

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/dashboard').then(({ data }) => setStats(data.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    </div>
  )

  const cards = [
    { icon: FiHome, label: 'Total Properties', value: stats?.properties?.total, sub: `${stats?.properties?.active} active`, color: 'from-royal-500 to-royal-700', to: '/admin/properties' },
    { icon: FiUsers, label: 'Total Users', value: stats?.users?.total, sub: `${stats?.users?.active} active`, color: 'from-emerald-500 to-emerald-700', to: '/admin/users' },
    { icon: FiMessageSquare, label: 'Inquiries', value: stats?.inquiries?.total, sub: `${stats?.inquiries?.new_count} new`, color: 'from-purple-500 to-purple-700', to: '/admin/inquiries' },
    { icon: FiEye, label: 'Total Views', value: stats?.properties?.total_views?.toLocaleString(), sub: 'Property views', color: 'from-orange-500 to-orange-700', to: '/admin/properties' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of your platform</p>
        </div>
        <Link to="/admin/properties/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-sm font-medium rounded-xl transition-all shadow-md">
          <FiPlus size={16} /> Add Property
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(({ icon: Icon, label, value, sub, color, to }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={to} className="block bg-white dark:bg-navy-900 rounded-2xl p-5 shadow-property hover:shadow-luxury transition-all border border-gray-100 dark:border-navy-800">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <FiTrendingUp size={16} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-navy-900 dark:text-white">{value}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-0.5">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent properties */}
        <motion.div className="bg-white dark:bg-navy-900 rounded-2xl shadow-property p-6 border border-gray-100 dark:border-navy-800"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900 dark:text-white">Recent Properties</h3>
            <Link to="/admin/properties" className="text-xs text-royal-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {stats?.recentProperties?.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-navy-800 rounded-xl">
                {p.primary_image ? (
                  <img src={p.primary_image} alt="" className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-10 rounded-lg bg-gray-200 dark:bg-navy-700 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.city} · {p.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-navy-900 dark:text-white">{formatPrice(p.price)}</div>
                  <span className={`text-xs capitalize ${p.status === 'active' ? 'text-green-500' : 'text-gray-400'}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent inquiries */}
        <motion.div className="bg-white dark:bg-navy-900 rounded-2xl shadow-property p-6 border border-gray-100 dark:border-navy-800"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900 dark:text-white">Recent Inquiries</h3>
            <Link to="/admin/inquiries" className="text-xs text-royal-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {stats?.recentInquiries?.map(inq => (
              <div key={inq.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-navy-800 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-gradient-royal flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {inq.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 dark:text-white">{inq.name}</p>
                  <p className="text-xs text-gray-400 truncate">{inq.property_title}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[inq.status] || statusColors.new}`}>
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
