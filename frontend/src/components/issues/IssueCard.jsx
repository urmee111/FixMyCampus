import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, MessageSquare } from 'lucide-react'
import { IssueCategoryIcon } from './IssueCategoryIcon'
import { StatusBadge } from '../ui/StatusBadge'
import { PriorityBadge } from '../ui/PriorityBadge'
import { IssueUpvoteButton } from './IssueUpvoteButton'
import { Avatar } from '../ui/Avatar'
import { formatRelativeTime, formatFullDate } from '../../lib/formatters'
import { cn } from '../../lib/utils'
import { useState } from 'react'

export function IssueCard({ issue, className }) {
  const navigate = useNavigate()
  const [upvotes, setUpvotes] = useState(issue?.upvotes || 0)

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
        'bg-white dark:bg-slate-900/80',
        'border-slate-200/80 dark:border-slate-800/80',
        'shadow-2xs dark:shadow-none hover:shadow-card-hover',
        'hover:border-slate-300 dark:hover:border-slate-700/80 hover:-translate-y-0.5',
        'overflow-hidden',
        className
      )}
    >
      <div>
        {/* Optional Image Banner if issue contains photo */}
        {issue.imageUrl && (
          <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-slate-800/80">
            <img
              src={issue.imageUrl}
              alt={issue.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
            {/* Soft gradient bottom overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        <div className="p-5">
          {/* Header row: Category & Priority */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <IssueCategoryIcon category={issue.category} size="sm" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize truncate">
                {issue.category}
              </span>
            </div>

            <PriorityBadge upvotes={upvotes} size="sm" />
          </div>

          {/* Title: Dominates the card */}
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
            <Link
              to={`/issues/${issue.id}`}
              onClick={(e) => e.stopPropagation()}
              className="focus:outline-none"
            >
              {issue.title}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          {/* Location & Reporter row */}
          <div className="mt-3.5 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="font-medium truncate">{issue.location}</span>
            </div>

            {issue.reporter && (
              <div
                className="flex items-center gap-1.5 shrink-0"
                title={`Reported by ${issue.reporter.name}`}
              >
                <Avatar
                  src={issue.reporter.avatar}
                  name={issue.reporter.name}
                  size="xs"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Status, Relative time, Upvotes, Comments */}
      <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusBadge status={issue.status} size="sm" />
          <span
            className="text-[11px] text-slate-400 dark:text-slate-500 truncate"
            title={formatFullDate(issue.createdAt)}
          >
            {formatRelativeTime(issue.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <IssueUpvoteButton
            issueId={issue.id}
            initialUpvotes={issue.upvotes}
            initialHasUpvoted={issue.hasUpvoted}
            onUpvoteChange={setUpvotes}
            size="sm"
          />

          <Link
            to={`/issues/${issue.id}#comments`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
            title={`${issue.commentsCount || 0} discussion updates`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{issue.commentsCount || 0}</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
