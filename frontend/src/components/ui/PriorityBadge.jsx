import React from 'react'
import { getPriorityFromUpvotes } from '../../lib/formatters'
import { PRIORITIES, PRIORITY_CONFIG } from '../../lib/constants'
import { cn } from '../../lib/utils'
import { Flame, AlertTriangle, ArrowDown } from 'lucide-react'

const PRIORITY_ICONS = {
  [PRIORITIES.HIGH]: Flame,
  [PRIORITIES.MEDIUM]: AlertTriangle,
  [PRIORITIES.LOW]: ArrowDown,
}

// High (10+ upvotes) = red, Medium (5-9) = orange, Low = slate.
// `priority` is the word the API sends; without it the badge works it out from the upvote count with the same rule.
export function PriorityBadge({
  upvotes,
  priority: explicitPriority,
  size = 'md',
  showIcon = true,
  className,
}) {
  const derivedPriority = explicitPriority || getPriorityFromUpvotes(upvotes ?? 0)
  const config = PRIORITY_CONFIG[derivedPriority] || PRIORITY_CONFIG[PRIORITIES.LOW]
  const Icon = PRIORITY_ICONS[derivedPriority] || ArrowDown

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1 gap-1.5 font-bold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border select-none whitespace-nowrap',
        config.badgeClass,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      title={`${config.label} (${upvotes ?? 0} upvotes)`}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  )
}
