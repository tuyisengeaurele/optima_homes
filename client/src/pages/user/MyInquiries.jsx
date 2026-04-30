import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMessageSquare, FiExternalLink } from 'react-icons/fi'
import api from '../../services/api'

const statusColors = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  read: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  replied: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function MyInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/inquiries/my').then(({ data }) => setInquiries(data.data.inquiries)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <FiMessageSquare size={22} className="text-royal-600" />
            <h1 className="text-3xl font-bold text-navy-900 dark:text-white">My Inquiries</h1>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-navy-900 rounded-2xl shadow-property">
              <FiMessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">No inquiries yet</h3>
              <p className="text-gray-400 mb-6">Contact agents about properties you're interested in</p>
              <Link to="/listings" className="px-6 py-3 bg-royal-600 text-white rounded-xl font-medium">Browse Properties</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq, i) => (
                <motion.div key={inq.id}
                  className="bg-white dark:bg-navy-900 rounded-2xl p-5 shadow-property border border-gray-100 dark:border-navy-800"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      {inq.property_image && (
                        <img src={inq.property_image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-navy-900 dark:text-white text-sm">{inq.property_title}</div>
                        <div className="text-gray-400 text-xs">{inq.city}</div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{inq.message}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[inq.status] || statusColors.new}`}>
                        {inq.status}
                      </span>
                      <Link to={`/listings/${inq.property_id}`} className="text-royal-600 hover:text-royal-700">
                        <FiExternalLink size={14} />
                      </Link>
                      <div className="text-gray-400 text-xs">{new Date(inq.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
