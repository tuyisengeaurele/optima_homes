import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi'
import { useUIStore } from '../../store/uiStore'
import api from '../../services/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { addToast } = useUIStore()

  const load = async () => {
    const { data } = await api.get('/users?limit=100')
    setUsers(data.data.users)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleStatus = async (id) => {
    try {
      await api.put(`/users/${id}/toggle`)
      setUsers(u => u.map(x => x.id === id ? { ...x, is_active: !x.is_active } : x))
      addToast('User status updated', 'success')
    } catch { addToast('Failed', 'error') }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(u => u.filter(x => x.id !== id))
      addToast('User deleted', 'success')
    } catch { addToast('Delete failed', 'error') }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-400 shadow-property" />
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-property border border-gray-100 dark:border-navy-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-navy-800">
                <tr>
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-navy-800">
                {filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-royal flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-navy-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 dark:bg-navy-700 dark:text-gray-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleStatus(u.id)} className={`p-1.5 transition-colors ${u.is_active ? 'text-green-500 hover:text-gray-400' : 'text-gray-400 hover:text-green-500'}`}>
                          {u.is_active ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                        </button>
                        {u.role !== 'admin' && (
                          <button onClick={() => deleteUser(u.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <FiTrash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
