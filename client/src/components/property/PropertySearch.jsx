import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX } from 'react-icons/fi'
import api from '../../services/api'
import { useDebounce } from '../hooks/useDebounce'

export default function PropertySearch({ className = '' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const search = useCallback(async (q) => {
    if (!q.trim() || q.length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const { data } = await api.get('/properties', { params: { search: q, limit: 5 } })
      setResults(data.data.properties || [])
      setOpen(true)
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, [])

  const handleChange = (e) => {
    const v = e.target.value
    setQuery(v)
    search(v)
  }

  const handleSelect = (property) => {
    navigate(`/listings/${property.id}`)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  const clear = () => { setQuery(''); setResults([]); setOpen(false) }

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <FiSearch className="absolute left-3 text-gray-400" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search properties..."
          className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-400 transition-colors"
        />
        {query && (
          <button onClick={clear} className="absolute right-3 text-gray-400 hover:text-gray-600">
            <FiX size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-900 rounded-xl shadow-luxury border border-gray-100 dark:border-navy-700 overflow-hidden z-50"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {results.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors text-left"
              >
                {p.primary_image && (
                  <img src={p.primary_image} alt="" className="w-10 h-8 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.city} · For {p.type}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
