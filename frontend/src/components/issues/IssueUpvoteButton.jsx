import React, { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { toggleUpvote } from '../../api/issues'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../hooks/useAuth'

export function IssueUpvoteButton({
  issueId,
  initialUpvotes = 0,
  initialHasUpvoted = false,
  onUpvoteChange,
  size = 'md',
  className,
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted)
  const [isMutating, setIsMutating] = useState(false)
  const toast = useToast()
  const { isAdmin } = useAuth()

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isMutating) return

    // Optimistic Update
    const prevUpvoted = hasUpvoted
    const prevCount = upvotes
    const nextUpvoted = !prevUpvoted
    const nextCount = nextUpvoted ? prevCount + 1 : Math.max(0, prevCount - 1)

    setHasUpvoted(nextUpvoted)
    setUpvotes(nextCount)
    onUpvoteChange?.(nextCount, nextUpvoted)

    setIsMutating(true)
    try {
      const res = await toggleUpvote(issueId)
      if (res.data) {
        setUpvotes(res.data.upvotes)
        setHasUpvoted(res.data.hasUpvoted)
        onUpvoteChange?.(res.data.upvotes, res.data.hasUpvoted)
      }
    } catch {
      // Rollback on failure
      setHasUpvoted(prevUpvoted)
      setUpvotes(prevCount)
      onUpvoteChange?.(prevCount, prevUpvoted)
      toast.error('Could not register your upvote. Please try again.')
    } finally {
      setIsMutating(false)
    }
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1 rounded-lg',
    md: 'px-3 py-1.5 text-xs gap-1.5 rounded-xl font-semibold',
    lg: 'px-3.5 py-2 text-sm gap-2 rounded-xl font-semibold',
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isMutating || isAdmin}
      aria-pressed={hasUpvoted}
      aria-label={`${hasUpvoted ? 'Remove upvote from' : 'Upvote'} issue. Currently ${upvotes} upvotes`}
      title={isAdmin ? 'Only students can upvote issues' : undefined}
      className={cn(
        'inline-flex items-center justify-center border transition-all duration-150 select-none active:scale-95',
        hasUpvoted
          ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-950/60 dark:border-brand-700 dark:text-brand-300 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200',
        sizes[size] || sizes.md,
        className
      )}
    >
      <ChevronUp
        className={cn(
          'w-4 h-4 stroke-[2.5] transition-transform duration-200',
          hasUpvoted && 'scale-110 text-brand-600 dark:text-brand-400'
        )}
      />
      <span>{upvotes}</span>
    </button>
  )
}
