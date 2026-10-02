import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { ChevronDown } from 'lucide-react'

export const Select = forwardRef(function Select(
  {
    className,
    error,
    children,
    disabled = false,
    ...props
  },
  ref
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm rounded-xl border transition-all duration-150 py-2.5 pl-3.5 pr-10',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 cursor-pointer',
          error
            ? 'border-red-400 dark:border-red-700/80 focus:ring-red-500/30 focus:border-red-500'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
          disabled && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 dark:text-slate-500">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  )
})
