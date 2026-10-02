import React, { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { toggleUpvote } from '../../api/issues'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../hooks/useAuth'

// Upvote toggle for one issue. `issue` needs: id, upvoteCount, hasUpvoted, status, createdBy { id }.
// The count changes immediately (optimistic) and is rolled back if the server says no.
// The backend rules are repeated here only to disable the button and explain why:
// admins can't upvote, nobody can upvote their own issue, and Resolved issues are closed for upvotes.
export function IssueUpvoteButton({ issue, onUpvoteChange, size = 'md', className }) {
  const [upvotes, setUpvotes] = useState(issue.upvoteCount)
  const [hasUpvoted, setHasUpvoted] = useState(issue.hasUpvoted)
  const [isMutating, setIsMutating] = useState(false)
  const toast = useToast()
  const { user, isAdmin } = useAuth()

  // Follow the issue when the page loads fresh data
  useEffect(() => {
    setUpvotes(issue.upvoteCount)
    setHasUpvoted(issue.hasUpvoted)
  }, [issue.upvoteCount, issue.hasUpvoted])

  const blockedReason = isAdmin
    ? 'Only students can upvote issues'
    : issue.createdBy?.id === user?.id
      ? "You can't upvote your own issue"
      : issue.status === 'Resolved'
        ? 'Resolved issues can no longer be upvoted'
        : null

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isMutating || blockedReason) return

    // Optimistic update
    const prevUpvoted = hasUpvoted
    const prevCount = upvotes
    const nextUpvoted = !prevUpvoted
    const nextCount = nextUpvoted ? prevCount + 1 : Math.max(0, prevCount - 1)

    setHasUpvoted(nextUpvoted)
    setUpvotes(nextCount)
    onUpvoteChange?.(nextCount, nextUpvoted)

    setIsMutating(true)
    try {
      const res = await toggleUpvote(issue.id)
      setUpvotes(res.data.upvoteCount)
      setHasUpvoted(res.data.upvoted)
      onUpvoteChange?.(res.data.upvoteCount, res.data.upvoted)
    } catch (err) {
      // Roll back to what we showed before the click
      setHasUpvoted(prevUpvoted)
      setUpvotes(prevCount)
      onUpvoteChange?.(prevCount, prevUpvoted)
      toast.error(err.error?.message || 'Could not register your upvote. Please try again.')
    } finally {
      setIsMutating(false)
    }
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1 rounded-lg',
    md: 'px-3 py-1.5 text-sm gap-1.5 rounded-xl font-semibold',
    lg: 'px-3.5 py-2 text-sm gap-2 rounded-xl font-semibold',
  }

  const label = blockedReason
    ? `${upvotes} upvotes. ${blockedReason}`
    : `${hasUpvoted ? 'Remove your upvote' : 'Upvote'}. ${upvotes} upvotes`

  return (
    // The tooltip sits on the wrapper because browsers do not show tooltips on disabled buttons
    <span title={blockedReason || undefined} className="inline-flex">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isMutating || Boolean(blockedReason)}
        aria-pressed={hasUpvoted}
        aria-label={label}
        className={cn(
          'inline-flex items-center justify-center border transition-colors duration-150 select-none',
          hasUpvoted
            ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-950/60 dark:border-brand-700 dark:text-brand-300'
            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white',
          (isMutating || blockedReason) && 'opacity-60 cursor-not-allowed',
          sizes[size] || sizes.md,
          className
        )}
      >
        <ChevronUp className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        <span>{upvotes}</span>
      </button>
    </span>
  )
}
