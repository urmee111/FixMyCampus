import { PRIORITIES } from './constants'

/**
 * Calculates priority based on the official spec:
 * 10+ upvotes -> High
 * 5-9 upvotes -> Medium
 * 0-4 upvotes -> Low
 */
export function getPriorityFromUpvotes(upvotes = 0) {
  if (upvotes >= 10) return PRIORITIES.HIGH
  if (upvotes >= 5) return PRIORITIES.MEDIUM
  return PRIORITIES.LOW
}

/**
 * Formats an ISO date into human-friendly relative time (e.g. '3 hours ago', 'Just now')
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) {
    return 'Yesterday'
  }
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Formats a full date for tooltips or detailed timelines
 */
export function formatFullDate(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * The role names shown to people ("admin" is called "Staff / Admin" in the UI)
 */
export function formatRole(role) {
  return role === 'admin' ? 'Staff / Admin' : 'Student'
}

/**
 * Location helpers. The backend stores "Building" or "Building, Spot" in one text field.
 * Building = text before the first comma. Spot = everything after it.
 */
export function joinLocation(building, spot = '') {
  const cleanSpot = spot.trim()
  return cleanSpot ? `${building}, ${cleanSpot}` : building
}

export function splitLocation(value = '') {
  const commaIndex = value.indexOf(',')
  if (commaIndex === -1) return { building: value.trim(), spot: '' }
  return { building: value.slice(0, commaIndex).trim(), spot: value.slice(commaIndex + 1).trim() }
}

/**
 * Formats large numbers compactly
 */
export function formatCount(count = 0) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}
