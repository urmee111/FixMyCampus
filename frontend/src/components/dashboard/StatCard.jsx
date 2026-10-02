import React from 'react'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'neutral',
  className,
}) {
  const iconVariants = {
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    danger: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
  }

  return (
    <Card className={cn('p-5 flex flex-col justify-between shadow-xs', className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className={cn('p-2 rounded-xl shrink-0', iconVariants[variant] || iconVariants.neutral)}>
            <Icon className="w-4 h-4 stroke-[2]" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </span>
          {trend && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {trend}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            {description}
          </p>
        )}
      </div>
    </Card>
  )
}
