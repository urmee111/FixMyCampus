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
        'w-full bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 text-sm rounded-xl border transition-all duration-150 p-3.5',
        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-y',
        error
          ? 'border-rose-300 dark:border-rose-700/80 focus:ring-rose-500/20 focus:border-rose-500'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
        disabled && 'bg-slate-50 dark:bg-slate-900/40 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-800',
        className
      )}
      {...props}
    />
  )
})
