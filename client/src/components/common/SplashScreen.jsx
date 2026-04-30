import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'

export default function SplashScreen() {
  const setSplashDone = useUIStore((s) => s.setSplashDone)

  useEffect(() => {
    const timer = setTimeout(setSplashDone, 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0D1F3C 0%, #1e3a8a 60%, #2563eb 100%)' }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Logo container */}
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Glowing ring */}
          <motion.div
            className="absolute rounded-full border-2 border-blue-400/30"
            style={{ width: 180, height: 180 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Logo icon */}
          <motion.div
            className="relative w-28 h-28 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* House SVG */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <motion.path
                d="M32 8 L58 30 L58 58 L38 58 L38 42 L26 42 L26 58 L6 58 L6 30 Z"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="3"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
              <motion.path
                d="M24 58 L24 44 L40 44 L40 58"
                fill="#3b82f6"
                fillOpacity="0.6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              />
              <motion.rect
                x="28" y="18" width="8" height="8" rx="1"
                fill="#93c5fd"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
              />
              <motion.path
                d="M14 30 L32 8 L50 30"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </svg>
          </motion.div>

          {/* Brand name */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-white">optima</span>
              <span className="text-blue-400">homes</span>
            </h1>
            <motion.p
              className="text-blue-200/70 text-sm mt-2 tracking-[0.3em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Your Trusted Real Estate Partner
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="mt-10 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, delay: 0.8, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
