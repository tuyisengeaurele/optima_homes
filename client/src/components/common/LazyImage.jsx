import { useState, useRef } from 'react'
import { useInView } from 'framer-motion'

export default function LazyImage({ src, alt, className = '', fallback, ...props }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '100px' })
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const fallbackSrc = fallback || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=60'

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} {...props}>
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      {isInView && (
        <img
          src={error ? fallbackSrc : src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true) }}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  )
}
