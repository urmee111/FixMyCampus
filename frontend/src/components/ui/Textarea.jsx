import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Textarea = forwardRef(function Textarea(
  {
    className,
    error,
    rows = 4,
    disabled = false,
    ...props
  },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      disabled={disabled}
      aria-invalid={Boolean(error)}
      className={cn(
        'w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm rounded-xl border transition-all duration-150 p-3.5',
        'placeholder:text-slate-500 dark:placeholder:text-slate-500',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 resize-y',
        error
          ? 'border-red-400 dark:border-red-700/80 focus:ring-red-500/30 focus:border-red-500'
          : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
        disabled && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
})
