import React from 'react'
import { Zap, Droplets, Sparkles, Armchair, Wifi, Wrench } from 'lucide-react'
import { cn } from '../../lib/utils'

const CATEGORY_MAP = {
  electrical: {
    icon: Zap,
    label: 'Electrical',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80',
  },
  water: {
    icon: Droplets,
    label: 'Water',
    color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/80',
  },
  cleanliness: {
    icon: Sparkles,
    label: 'Cleanliness',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80',
  },
  furniture: {
    icon: Armchair,
    label: 'Furniture',
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80',
  },
  internet: {
    icon: Wifi,
    label: 'Internet',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80',
  },
  other: {
    icon: Wrench,
    label: 'Other',
    color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  },
}

export function IssueCategoryIcon({
  category = 'other',
  size = 'md',
  showLabel = false,
  className,
}) {
  const normalized = (category || 'other').toLowerCase()
  const config = CATEGORY_MAP[normalized] || CATEGORY_MAP.other
  const Icon = config.icon

  const sizes = {
    sm: 'w-6 h-6 p-1 text-xs',
    md: 'w-8 h-8 p-1.5 text-sm',
    lg: 'w-10 h-10 p-2 text-base',
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className={cn('inline-flex items-center gap-2 select-none', className)}>
      <div
        className={cn(
          'rounded-xl border flex items-center justify-center shrink-0 transition-colors',
          config.color,
          sizes[size] || sizes.md
        )}
      >
        <Icon className={cn('stroke-[2]', iconSizes[size] || iconSizes.md)} />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {config.label}
        </span>
      )}
    </div>
  )
}
