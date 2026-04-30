import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiHeart, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Listings' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const { darkMode, toggleDarkMode, addToast } = useUIStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    addToast('Logged out successfully', 'success')
    navigate('/')
    setDropdownOpen(false)
  }

  const navClasses = scrolled
    ? 'bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl shadow-luxury border-b border-gray-100 dark:border-navy-800'
    : 'bg-transparent'

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClasses}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-900 to-royal-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
                <path d="M32 8L58 30V58H38V42H26V58H6V30L32 8Z" fill="none" stroke="white" strokeWidth="4" strokeLinejoin="round" />
                <rect x="26" y="42" width="12" height="16" fill="#60a5fa" />
                <rect x="28" y="18" width="8" height="8" rx="1" fill="#93c5fd" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold">
                <span className={scrolled ? 'text-navy-900 dark:text-white' : 'text-white'}>optima</span>
                <span className="text-royal-600">homes</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-royal-600 bg-royal-50 dark:bg-royal-900/20'
                      : scrolled
                      ? 'text-navy-700 dark:text-gray-300 hover:text-royal-600 hover:bg-gray-50 dark:hover:bg-navy-800'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all ${
                scrolled
                  ? 'text-navy-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-royal-200 dark:border-royal-800 bg-white dark:bg-navy-900 hover:border-royal-400 transition-all shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-royal flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-navy-900 dark:text-white max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-navy-900 rounded-2xl shadow-luxury border border-gray-100 dark:border-navy-700 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-navy-700">
                        <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-navy-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800">
                          <FiGrid size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-navy-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800">
                        <FiUser size={16} /> My Dashboard
                      </Link>
                      <Link to="/dashboard/saved" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-navy-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800">
                        <FiHeart size={16} /> Saved Properties
                      </Link>
                      <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-navy-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800">
                        <FiSettings size={16} /> Settings
                      </Link>
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-gray-100 dark:border-navy-700">
                        <FiLogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    scrolled ? 'text-navy-700 dark:text-gray-300 hover:text-royal-600' : 'text-white/90 hover:text-white'
                  }`}>
                  Login
                </Link>
                <Link to="/register"
                  className="px-5 py-2 bg-royal-600 hover:bg-royal-700 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu btn */}
          <button
            className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-navy-900 dark:text-white' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-navy-950 border-t border-gray-100 dark:border-navy-800"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-royal-50 dark:bg-royal-900/20 text-royal-600' : 'text-navy-700 dark:text-gray-300'
                    }`
                  }>
                  {label}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-gray-100 dark:border-navy-800 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm text-navy-700 dark:text-gray-300">My Dashboard</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl text-sm text-navy-700 dark:text-gray-300">Admin</Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-500">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm text-navy-700 dark:text-gray-300">Login</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl bg-royal-600 text-white text-sm text-center font-medium">Get Started</Link>
                  </>
                )}
                <button onClick={toggleDarkMode}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-navy-700 dark:text-gray-300">
                  {darkMode ? <><FiSun size={16} /> Light Mode</> : <><FiMoon size={16} /> Dark Mode</>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
