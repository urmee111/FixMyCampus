import React from 'react'
import { Zap, Droplets, Sparkles, Armchair, Wifi, Wrench } from 'lucide-react'
import { cn } from '../../lib/utils'

// Light mode uses a dark (800) text shade on a 50 background, dark mode a 300 shade on a dark tint (both pass WCAG AA)
const CATEGORY_MAP = {
  electrical: {
    icon: Zap,
    label: 'Electrical',
    color: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
  },
  water: {
    icon: Droplets,
    label: 'Water',
    color: 'text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800',
  },
  cleanliness: {
    icon: Sparkles,
    label: 'Cleanliness',
    color: 'text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800',
  },
  furniture: {
    icon: Armchair,
    label: 'Furniture',
    color: 'text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
  },
  internet: {
    icon: Wifi,
    label: 'Internet',
    color: 'text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
  },
  other: {
    icon: Wrench,
    label: 'Other',
    color: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
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
          'rounded-xl border flex items-center justify-center shrink-0',
          config.color,
          sizes[size] || sizes.md
        )}
      >
        <Icon className={cn('stroke-[2]', iconSizes[size] || iconSizes.md)} aria-hidden="true" />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {config.label}
        </span>
      )}
    </div>
  )
}
