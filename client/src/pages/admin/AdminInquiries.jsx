import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiMessageSquare, FiSearch } from 'react-icons/fi'
import { useUIStore } from '../../store/uiStore'
import api from '../../services/api'

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
  closed: 'bg-red-100 text-red-600',
}
const STATUS_OPTIONS = ['new', 'read', 'replied', 'closed']

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const { addToast } = useUIStore()

  const load = async () => {
    const params = {}
    if (filter) params.status = filter
    const { data } = await api.get('/inquiries', { params })
    setInquiries(data.data.inquiries)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status })
      setInquiries(inqs => inqs.map(i => i.id === id ? { ...i, status } : i))
      addToast('Status updated', 'success')
    } catch { addToast('Failed', 'error') }
  }

  const filtered = inquiries.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    i.property_title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Inquiries</h1>
        <p className="text-gray-500 text-sm mt-1">{inquiries.length} total inquiries</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-400 shadow-property" />
        </div>
        <div className="flex gap-1 bg-white dark:bg-navy-900 rounded-xl p-1 shadow-property border border-gray-100 dark:border-navy-800">
          <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filter ? 'bg-royal-600 text-white' : 'text-gray-500 hover:text-navy-900'}`}>All</button>
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === s ? 'bg-royal-600 text-white' : 'text-gray-500 hover:text-navy-900 dark:hover:text-white'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-property border border-gray-100 dark:border-navy-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FiMessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No inquiries found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-navy-800">
            {filtered.map((inq, i) => (
              <motion.div key={inq.id}
                className="p-5 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-navy-900 dark:text-white">{inq.name}</span>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{inq.email}</span>
                    </div>
                    <p className="text-xs text-royal-600 mb-2">{inq.property_title} — {inq.city}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{inq.message}</p>
                    {inq.phone && <p className="text-xs text-gray-400 mt-1">{inq.phone}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <select
                      value={inq.status}
                      onChange={(e) => updateStatus(inq.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border-0 outline-none cursor-pointer capitalize ${statusColors[inq.status]}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>)}
                    </select>
                    <span className="text-xs text-gray-400">{new Date(inq.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
