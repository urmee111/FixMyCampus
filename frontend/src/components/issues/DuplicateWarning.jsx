import React from 'react'
import { AlertTriangle, MapPin, ChevronUp, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { StatusBadge } from '../ui/StatusBadge'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

// Soft warning shown while typing the title. It never blocks the form: "Report anyway" just hides it.
// `issues` is the array GET /issues/similar returns: [{ id, title, location, status, upvoteCount }].
export function DuplicateWarning({ issues, onDismiss, className }) {
  if (!issues || issues.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Possible duplicate issues"
      aria-live="polite"
      className={cn(
        'rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 sm:p-5 animate-slide-up',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            Similar {issues.length === 1 ? 'issue' : 'issues'} already reported here
          </h2>
          <p className="text-sm text-amber-900 dark:text-amber-300 mt-1">
            Upvote {issues.length === 1 ? 'it' : 'one of them'} instead so it gets fixed sooner. If yours is a different problem, you can still report it.
          </p>

          <ul className="mt-3 space-y-2">
            {issues.map((issue) => (
              <li
                key={issue.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <Link
                    to={`/issues/${issue.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:underline break-words"
                  >
                    {issue.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {issue.location}
                    </span>
                    <StatusBadge status={issue.status} size="sm" />
                    <span className="flex items-center gap-1 font-semibold text-brand-700 dark:text-brand-300">
                      <ChevronUp className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                      {issue.upvoteCount} {issue.upvoteCount === 1 ? 'upvote' : 'upvotes'}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/issues/${issue.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                >
                  Upvote instead
                  <span className="sr-only"> (opens the issue in a new tab)</span>
                </Link>
              </li>
            ))}
          </ul>

          {onDismiss && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={onDismiss}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
              >
                Report anyway
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
