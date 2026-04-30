export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-navy-900 rounded-2xl overflow-hidden shadow-property">
      <div className="skeleton h-56 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-6 w-1/3 rounded" />
        <div className="flex gap-4 pt-2">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-96 w-full rounded-2xl" />
      <div className="space-y-3">
        <div className="skeleton h-8 w-2/3 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
      </div>
    </div>
  )
}

export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton rounded ${className}`} />
}
