import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, MessageSquare } from 'lucide-react'
import { IssueCategoryIcon } from './IssueCategoryIcon'
import { StatusBadge } from '../ui/StatusBadge'
import { PriorityBadge } from '../ui/PriorityBadge'
import { IssueUpvoteButton } from './IssueUpvoteButton'
import { formatRelativeTime, formatFullDate } from '../../lib/formatters'
import { cn } from '../../lib/utils'

// One issue as a card. `issue` is exactly what GET /issues returns for one item.
export function IssueCard({ issue, className }) {
  const navigate = useNavigate()
  const [upvotes, setUpvotes] = useState(issue?.upvoteCount || 0)

  if (!issue) return null

  const handleCardClick = (e) => {
    // If the click is inside an interactive element (button or link), let that handle it
    if (e.target.closest('button') || e.target.closest('a')) {
      return
    }
    navigate(`/issues/${issue.id}`)
  }

  return (
    <article
      onClick={handleCardClick}
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 ease-out cursor-pointer',
        'bg-white dark:bg-slate-900',
        'border-slate-200 dark:border-slate-800',
        'shadow-xs hover:shadow-card-hover',
        'hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5',
        'overflow-hidden',
        className
      )}
    >
      <div>
        {/* Photo banner (only when the reporter attached one) */}
        {issue.photoUrl && (
          <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-200 dark:border-slate-800">
            <img
              src={issue.photoUrl}
              alt={`Photo attached to “${issue.title}”`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
          </div>
        )}

        <div className="p-5">
          {/* Header row: Category & Priority */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <IssueCategoryIcon category={issue.category} size="sm" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {issue.category}
              </span>
            </div>

            {/* The API's priority is used until the upvote count changes on screen, then it is recalculated (10+ High, 5-9 Medium) */}
            <PriorityBadge
              upvotes={upvotes}
              priority={upvotes === issue.upvoteCount ? issue.priority : undefined}
              size="sm"
            />
          </div>

          {/* Title: Dominates the card */}
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors line-clamp-2 leading-snug">
            <Link
              to={`/issues/${issue.id}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {issue.title}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          {/* Location & Reporter row */}
          <div className="mt-3.5 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="font-medium truncate">{issue.location}</span>
            </div>
            {issue.createdBy?.name && (
              <span className="truncate max-w-[45%] text-right">by {issue.createdBy.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Status, Relative time, Upvotes, Comments */}
      <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusBadge status={issue.status} size="sm" />
          <span
            className="text-xs text-slate-600 dark:text-slate-400 truncate"
            title={formatFullDate(issue.createdAt)}
          >
            {formatRelativeTime(issue.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <IssueUpvoteButton issue={issue} onUpvoteChange={setUpvotes} size="sm" />

          <Link
            to={`/issues/${issue.id}#comments`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label={`${issue.commentCount} comments`}
            title={`${issue.commentCount} comments`}
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{issue.commentCount}</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
