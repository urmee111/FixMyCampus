import React from 'react'
import { AlertTriangle, MapPin, ChevronUp, ExternalLink, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function DuplicateWarning({
  similarIssue,
  onDismiss,
  className,
}) {
  if (!similarIssue) return null

  return (
    <div
      role="region"
      aria-label="Duplicate issue warning"
      className={cn(
        'rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/30 p-5 animate-slide-up',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Similar issue already reported
            </h4>
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
              Potential Duplicate
            </span>
          </div>
          <p className="text-xs text-amber-800/90 dark:text-amber-300/80 mt-1">
            A report with similar keywords exists at this location. You can upvote the existing issue to help prioritize it faster, or continue reporting if this is a separate incident.
          </p>

          {/* Similar issue summary card */}
          <div className="mt-3.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/50 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                "{similarIssue.title}"
              </h5>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {similarIssue.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
                  <ChevronUp className="w-3 h-3 stroke-[3]" />
                  {similarIssue.upvotes || 0} upvotes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/issues/${similarIssue.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <span>View issue</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              {onDismiss && (
                <Button
                  size="sm"
                  variant="subtle"
                  onClick={onDismiss}
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                >
                  Report anyway
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
