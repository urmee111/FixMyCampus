import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const IconButton = forwardRef(function IconButton(
  {
    children,
    label,
    variant = 'ghost',
    size = 'md',
    className,
    disabled = false,
    ...props
  },
  ref
) {
  const sizes = {
    sm: 'p-1.5 rounded-lg text-xs',
    md: 'p-2 rounded-lg text-sm',
    lg: 'p-2.5 rounded-xl text-base',
  }

  const variants = {
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700',
    outline: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700',
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20',
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 ease-out focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2',
        !disabled && 'active:scale-95',
        sizes[size] || sizes.md,
        variants[variant] || variants.ghost,
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
