import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiGrid, FiHome, FiUsers, FiMessageSquare,
  FiLogOut, FiMenu, FiX,
} from 'react-icons/fi'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'

const NAV = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/properties', icon: FiHome, label: 'Properties' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/inquiries', icon: FiMessageSquare, label: 'Inquiries' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    addToast('Logged out', 'success')
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-navy-950">
      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-navy-900 text-white"
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-navy-800">
          <div className="w-9 h-9 rounded-xl bg-royal-600 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
              <path d="M32 8L58 30V58H38V42H26V58H6V30L32 8Z" fill="none" stroke="white" strokeWidth="4" strokeLinejoin="round" />
              <rect x="26" y="42" width="12" height="16" fill="#60a5fa" />
            </svg>
          </div>
          {!collapsed && <span className="font-bold text-sm whitespace-nowrap">OptimaHomes Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-royal-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`
              }>
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-navy-800">
          {!collapsed && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <FiLogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse btn */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-royal-600 flex items-center justify-center shadow-lg"
        >
          {collapsed ? <FiMenu size={12} /> : <FiX size={12} />}
        </button>
      </motion.aside>

      {/* Main */}
      <main
        className="flex-1 transition-all duration-200"
        style={{ marginLeft: collapsed ? 72 : 240 }}
      >
        <Outlet />
      </main>
    </div>
  )
}
