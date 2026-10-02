import React from 'react'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

// One number with a label. `value` can be a number or text (for example "N/A").
export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  variant = 'neutral',
  className,
}) {
  const iconVariants = {
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300',
    accent: 'bg-accent/10 text-accent dark:bg-accent/15',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    success: 'bg-green-50 text-green-800 dark:bg-green-950/60 dark:text-green-300',
    danger: 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300',
  }

  return (
    <Card className={cn('p-5 flex flex-col justify-between', className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
        {Icon && (
          <div className={cn('p-2 rounded-xl shrink-0', iconVariants[variant] || iconVariants.neutral)}>
            <Icon className="w-4 h-4 stroke-[2]" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <span className="block text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
          {value}
        </span>
        {description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-normal">{description}</p>
        )}
      </div>
    </Card>
  )
}
