import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

// 1 … 4 5 6 … 20  (always the first page, the last page and the pages around the current one)
function pageNumbers(current, total) {
  const wanted = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const result = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('gap')
    result.push(p)
  })
  return result
}

const arrowClass =
  'p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors'

export function IssuePagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 9,
  onPageChange,
  className,
}) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, totalItems)

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800',
        className
      )}
    >
      <p className="text-sm text-slate-700 dark:text-slate-300">
        Showing <span className="font-semibold">{startItem}–{endItem}</span> of{' '}
        <span className="font-semibold">{totalItems}</span> issues
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className={arrowClass}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        {pageNumbers(currentPage, totalPages).map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-slate-600 dark:text-slate-400" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
              className={cn(
                'min-w-8 h-8 px-2 rounded-xl text-sm font-semibold transition-colors',
                p === currentPage
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className={arrowClass}
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
