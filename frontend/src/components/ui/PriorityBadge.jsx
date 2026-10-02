import React from 'react'
import { getPriorityFromUpvotes } from '../../lib/formatters'
import { PRIORITIES, PRIORITY_CONFIG } from '../../lib/constants'
import { cn } from '../../lib/utils'
import { Flame, AlertCircle, ArrowDown } from 'lucide-react'

export function PriorityBadge({
  upvotes,
  priority: explicitPriority,
  size = 'md',
  showIcon = true,
  className,
}) {
  const derivedPriority = explicitPriority || getPriorityFromUpvotes(upvotes ?? 0)
  const config = PRIORITY_CONFIG[derivedPriority] || PRIORITY_CONFIG[PRIORITIES.LOW]

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold uppercase tracking-wider',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-semibold uppercase tracking-wider',
    lg: 'text-xs px-3 py-1 gap-1.5 font-bold uppercase tracking-wider',
  }

  const renderIcon = () => {
    if (!showIcon) return null
    if (derivedPriority === PRIORITIES.HIGH) {
      return <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
    }
    if (derivedPriority === PRIORITIES.MEDIUM) {
      return <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
    }
    return <ArrowDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border select-none transition-colors duration-150',
        config.badgeClass,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      title={`${config.label} (based on ${upvotes ?? 0} upvotes)`}
    >
      {renderIcon()}
      <span>{config.label}</span>
    </span>
  )
}
