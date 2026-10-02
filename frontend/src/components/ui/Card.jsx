import React from 'react'
import { cn } from '../../lib/utils'

export function Card({
  children,
  className,
  hoverable = false,
  interactive = false,
  ...props
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200 ease-out',
        'bg-white dark:bg-slate-900/80',
        'border-slate-200/80 dark:border-slate-800/80',
        'shadow-xs dark:shadow-none',
        hoverable && 'hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700/80 hover:-translate-y-0.5',
        interactive && 'cursor-pointer active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/60', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('p-5 sm:p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30 rounded-b-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
