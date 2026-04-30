import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from 'react-icons/fi'
import { useUIStore } from '../../store/uiStore'
import api from '../../services/api'

const formatPrice = (p) => {
  const n = Number(p)
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  return n.toLocaleString()
}

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  sold: 'bg-red-100 text-red-700',
  rented: 'bg-purple-100 text-purple-700',
  pending: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-600',
}

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const { addToast } = useUIStore()

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/properties', { params: { limit: 50, search } })
      setProperties(data.data.properties)
    } catch { addToast('Failed to load properties', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return
    setDeleting(id)
    try {
      await api.delete(`/properties/${id}`)
      addToast('Property deleted', 'success')
      setProperties(p => p.filter(x => x.id !== id))
    } catch { addToast('Delete failed', 'error') }
    finally { setDeleting(null) }
  }

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{properties.length} total listings</p>
        </div>
        <Link to="/admin/properties/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-sm font-medium rounded-xl shadow-md transition-all">
          <FiPlus size={16} /> Add Property
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text" placeholder="Search properties..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-400 shadow-property"
        />
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-property border border-gray-100 dark:border-navy-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No properties found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-navy-800">
                <tr>
                  {['Property', 'Type', 'Price', 'Status', 'Views', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-navy-800">
                {filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.primary_image ? (
                          <img src={p.primary_image} alt="" className="w-11 h-9 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-11 h-9 rounded-lg bg-gray-200 dark:bg-navy-700 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-navy-900 dark:text-white line-clamp-1">{p.title}</p>
                          <p className="text-xs text-gray-400">{p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${p.type === 'sale' ? 'bg-emerald-100 text-emerald-700' : 'bg-royal-100 text-royal-700'}`}>
                        {p.type === 'sale' ? 'For Sale' : 'For Rent'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-navy-900 dark:text-white whitespace-nowrap">
                      {formatPrice(p.price)} RWF
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[p.status] || statusColors.active}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.views}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/listings/${p.id}`} target="_blank"
                          className="p-1.5 text-gray-400 hover:text-royal-600 transition-colors">
                          <FiEye size={15} />
                        </Link>
                        <Link to={`/admin/properties/edit/${p.id}`}
                          className="p-1.5 text-gray-400 hover:text-royal-600 transition-colors">
                          <FiEdit size={15} />
                        </Link>
                        <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40">
                          <FiTrash2 size={15} />
                        </button>
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
