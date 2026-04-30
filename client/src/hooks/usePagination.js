import { useMemo } from 'react'

export function usePagination({ total, page, perPage = 12, siblingCount = 1 }) {
  const pages = Math.ceil(total / perPage)

  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5
    if (totalPageNumbers >= pages) return range(1, pages)

    const leftSibling = Math.max(page - siblingCount, 1)
    const rightSibling = Math.min(page + siblingCount, pages)
    const showLeft = leftSibling > 2
    const showRight = rightSibling < pages - 2

    if (!showLeft && showRight) return [...range(1, 3 + 2 * siblingCount), '...', pages]
    if (showLeft && !showRight) return [1, '...', ...range(pages - 3 - 2 * siblingCount, pages)]
    return [1, '...', ...range(leftSibling, rightSibling), '...', pages]
  }, [total, page, perPage, siblingCount])

  return { pages, paginationRange, hasNext: page < pages, hasPrev: page > 1 }
}
