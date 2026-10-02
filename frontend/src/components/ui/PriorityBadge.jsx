import React from 'react'
import { getPriority } from '../../lib/formatters'
import { PRIORITIES, PRIORITY_CONFIG } from '../../lib/constants'
import { cn } from '../../lib/utils'
import { Flame, AlertTriangle, ArrowDown } from 'lucide-react'

const PRIORITY_ICONS = {
  [PRIORITIES.HIGH]: Flame,
  [PRIORITIES.MEDIUM]: AlertTriangle,
  [PRIORITIES.LOW]: ArrowDown,
}

// High (5 or more upvotes) = red, Medium (3-4) = orange. Low is hidden. The level comes from getPriority(), never from the API.
export function PriorityBadge({
  upvotes,
  size = 'md',
  showIcon = true,
  className,
}) {
  const derivedPriority = getPriority(upvotes ?? 0)
  // Low is not shown at all
  if (derivedPriority === PRIORITIES.LOW) return null

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
