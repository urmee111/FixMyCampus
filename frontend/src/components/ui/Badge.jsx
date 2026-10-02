import React from 'react'
import { cn } from '../../lib/utils'

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  ...props
}) {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    brand: 'bg-brand-50 text-brand-700 border-brand-200/80 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    success: 'bg-green-50 text-green-700 border-green-200/80 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800',
    danger: 'bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors select-none',
        variants[variant] || variants.neutral,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
