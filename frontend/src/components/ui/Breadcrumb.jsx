import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Breadcrumb({ items, className }) {
  if (!items || items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs font-medium', className)}>
      <ol className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
        <li>
          <Link
            to="/issues"
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-600 shrink-0" />
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'truncate max-w-[200px] sm:max-w-xs',
                    isLast
                      ? 'text-slate-900 dark:text-slate-100 font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
