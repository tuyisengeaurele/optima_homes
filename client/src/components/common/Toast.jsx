import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi'

const icons = {
  success: <FiCheckCircle className="text-green-400" size={20} />,
  error: <FiXCircle className="text-red-400" size={20} />,
  info: <FiInfo className="text-blue-400" size={20} />,
  warning: <FiAlertTriangle className="text-yellow-400" size={20} />,
}

const colors = {
  success: 'border-green-500/30 bg-green-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
  warning: 'border-yellow-500/30 bg-yellow-500/10',
}

export default function Toast() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed top-6 right-6 z-[9998] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-luxury min-w-[280px] max-w-[380px] ${colors[toast.type] || colors.info}`}
            style={{ background: 'rgba(13,31,60,0.9)' }}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {icons[toast.type] || icons.info}
            <p className="text-white text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <FiX size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
