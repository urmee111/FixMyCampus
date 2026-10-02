import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

const BUTTON_VARIANTS = {
  primary:
    'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-sm shadow-brand-600/20 border border-transparent',
  secondary:
    'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700',
  outline:
    'bg-transparent hover:bg-slate-100/80 active:bg-slate-200 dark:hover:bg-slate-800/80 dark:active:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
  ghost:
    'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700 border border-transparent',
  danger:
    'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm shadow-rose-600/20 border border-transparent',
  subtle:
    'bg-brand-50 hover:bg-brand-100 active:bg-brand-200 text-brand-700 dark:bg-brand-950/40 dark:hover:bg-brand-900/50 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50',
}

const BUTTON_SIZES = {
  sm: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5 font-medium',
  md: 'px-3.5 py-2 text-sm rounded-lg gap-2 font-medium',
  lg: 'px-4.5 py-2.5 text-base rounded-xl gap-2.5 font-semibold',
}

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center select-none transition-all duration-150 ease-out focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2',
        !isDisabled && 'active:scale-[0.98]',
        BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary,
        BUTTON_SIZES[size] || BUTTON_SIZES.md,
        isDisabled && 'opacity-60 cursor-not-allowed pointer-events-none shadow-none',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
})
