import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

// One look for every button and button-like link: same sizes, radius, hover, focus and disabled states.
const BUTTON_VARIANTS = {
  primary:
    'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white border border-transparent',
  secondary:
    'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700',
  outline:
    'bg-transparent hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600',
  ghost:
    'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700 border border-transparent',
  danger:
    'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border border-transparent',
  subtle:
    'bg-brand-50 hover:bg-brand-100 active:bg-brand-200 text-brand-800 dark:bg-brand-950/40 dark:hover:bg-brand-900/50 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
}

const BUTTON_SIZES = {
  sm: 'min-h-8 px-3 py-1.5 text-xs rounded-lg gap-1.5 font-semibold',
  md: 'min-h-10 px-4 py-2 text-sm rounded-lg gap-2 font-semibold',
  lg: 'min-h-11 px-5 py-2.5 text-base rounded-xl gap-2.5 font-semibold',
}

const BASE_CLASSES =
  'inline-flex items-center justify-center whitespace-nowrap select-none transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500'

function buttonClasses({ variant = 'primary', size = 'md', disabled = false, className } = {}) {
  return cn(
    BASE_CLASSES,
    BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary,
    BUTTON_SIZES[size] || BUTTON_SIZES.md,
    disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
    className
  )
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
      aria-busy={isLoading || undefined}
      className={buttonClasses({ variant, size, disabled: isDisabled, className })}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
})

// A router link that looks exactly like a Button (use it for navigation, Button for actions)
export function ButtonLink({ to, children, variant = 'primary', size = 'md', leftIcon, rightIcon, className, ...props }) {
  return (
    <Link to={to} className={buttonClasses({ variant, size, className })} {...props}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Link>
  )
}
