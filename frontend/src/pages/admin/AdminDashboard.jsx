import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { BarList, StackedBar } from '../../components/dashboard/Charts'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PriorityBadge } from '../../components/ui/PriorityBadge'
import { SkeletonStat, Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { getStats } from '../../api/stats'
import { getIssues, updateStatus } from '../../api/issues'
import { useToast } from '../../hooks/useToast'
import { CATEGORIES, STATUSES } from '../../lib/constants'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Timer,
  CalendarCheck,
  MapPin,
  Flame,
  ArrowRight,
  ChevronUp,
  QrCode,
} from 'lucide-react'

const quickButtonClass =
  'px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-60 disabled:cursor-not-allowed'

export function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentIssues, setRecentIssues] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingIssueId, setPendingIssueId] = useState(null)
  const toast = useToast()

  // silent = refresh the numbers after a status change without showing skeletons again
  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true)
      setError(null)
    }
    try {
      const [statsRes, issuesRes] = await Promise.all([getStats(), getIssues({ sort: 'newest', limit: 5 })])
      setStats(statsRes.data)
      setRecentIssues(issuesRes.data.items)
    } catch (err) {
      if (!silent) setError(err.error?.message || "Couldn't load the dashboard.")
    } finally {
      if (!silent) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  // Quick status buttons skip the note. Use the issue page when you want to write one.
  const handleQuickStatus = async (issue, nextStatus) => {
    setPendingIssueId(issue.id)
    try {
      await updateStatus(issue.id, nextStatus)
      toast.success(`Issue #${issue.id} is now ${nextStatus}.`)
      await loadDashboard({ silent: true })
    } catch (err) {
      toast.error(err.error?.message || 'Could not update the status.')
    } finally {
      setPendingIssueId(null)
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" />
        <ErrorState title="Couldn't load the dashboard" message={error} onRetry={() => loadDashboard()} />
      </div>
    )
  }

  const byStatus = stats?.byStatus
  const avgHours = stats?.avgResolutionHours

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Live numbers from all reported issues."
        actions={
          <Link
            to="/admin/locations"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <QrCode className="w-4 h-4" aria-hidden="true" />
            Location QR links
          </Link>
        }
      />

      {/* Numbers */}
      {isLoading || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonStat key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total reports" value={stats.total} icon={TrendingUp} variant="brand" />
          <StatCard label="Open" value={byStatus.Open} icon={AlertCircle} variant="brand" />
          <StatCard label="In progress" value={byStatus['In Progress']} icon={Clock} variant="warning" />
          <StatCard label="Resolved" value={byStatus.Resolved} icon={CheckCircle2} variant="success" />
          <StatCard
            label="Average resolution time"
            value={avgHours == null ? 'N/A' : `${avgHours} h`}
            description={avgHours == null ? 'Shown once an issue has been resolved' : 'From report to resolved'}
            icon={Timer}
            variant="accent"
          />
          <StatCard
            label="Resolved in the last 7 days"
            value={stats.resolvedLast7Days}
            icon={CalendarCheck}
            variant="success"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Issues by status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || !stats ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <StackedBar
                label="Issues by status"
                parts={[
                  { label: STATUSES.OPEN, value: byStatus.Open, className: 'bg-blue-600' },
                  { label: STATUSES.IN_PROGRESS, value: byStatus['In Progress'], className: 'bg-amber-600' },
                  { label: STATUSES.RESOLVED, value: byStatus.Resolved, className: 'bg-green-600' },
                ]}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Issues by category</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || !stats ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <BarList
                label="Issues by category"
                items={CATEGORIES.map((cat) => ({ label: cat.label, value: stats.byCategory[cat.label] ?? 0 }))}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top upvoted */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ChevronUp className="w-4 h-4 stroke-[3]" aria-hidden="true" />
              Most upvoted issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || !stats ? (
              <Skeleton className="h-32 w-full" />
            ) : stats.topUpvoted.length === 0 ? (
              <p className="text-sm text-slate-700 dark:text-slate-300">No upvotes yet.</p>
            ) : (
              <ol className="space-y-2">
                {stats.topUpvoted.map((issue, index) => (
                  <li key={issue.id}>
                    <Link
                      to={`/issues/${issue.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="w-6 text-sm font-bold text-slate-600 dark:text-slate-400 tabular-nums">{index + 1}.</span>
                      <span className="flex-1 min-w-0 text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {issue.title}
                      </span>
                      <span className="shrink-0 inline-flex items-center gap-0.5 text-sm font-bold text-brand-700 dark:text-brand-300 tabular-nums">
                        <ChevronUp className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                        {issue.upvoteCount}
                        <span className="sr-only"> upvotes</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* Hotspots */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
              Hotspot locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || !stats ? (
              <Skeleton className="h-32 w-full" />
            ) : stats.topLocations.length === 0 ? (
              <p className="text-sm text-slate-700 dark:text-slate-300">No reports yet.</p>
            ) : (
              <ul className="space-y-2">
                {stats.topLocations.map((spot) => (
                  <li key={spot.building}>
                    <Link
                      to={`/issues?location=${encodeURIComponent(spot.building)}`}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2 min-w-0 text-sm font-medium text-slate-900 dark:text-slate-100">
                        <MapPin className="w-4 h-4 shrink-0 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                        <span className="truncate">{spot.building}</span>
                      </span>
                      <span className="shrink-0 text-sm text-slate-700 dark:text-slate-300 tabular-nums">
                        {spot.count} {spot.count === 1 ? 'report' : 'reports'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest reports with quick status buttons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base font-bold">Latest reports</CardTitle>
          <Link
            to="/issues"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200 inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-5 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : recentIssues.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No reports yet" description="New reports from students will show up here." />
            </div>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {recentIssues.map((issue) => (
                <li
                  key={issue.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={issue.status} size="sm" />
                      <PriorityBadge upvotes={issue.upvoteCount} priority={issue.priority} size="sm" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">#{issue.id}</span>
                    </div>
                    <Link
                      to={`/issues/${issue.id}`}
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-brand-700 dark:hover:text-brand-300 truncate block"
                    >
                      {issue.title}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      <span className="truncate">{issue.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {issue.status === STATUSES.OPEN && (
                      <button
                        type="button"
                        disabled={pendingIssueId === issue.id}
                        onClick={() => handleQuickStatus(issue, STATUSES.IN_PROGRESS)}
                        className={`${quickButtonClass} bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-950/70`}
                      >
                        {pendingIssueId === issue.id ? 'Updating…' : 'In Progress'}
                      </button>
                    )}
                    {issue.status !== STATUSES.RESOLVED && (
                      <button
                        type="button"
                        disabled={pendingIssueId === issue.id}
                        onClick={() => handleQuickStatus(issue, STATUSES.RESOLVED)}
                        className={`${quickButtonClass} bg-green-50 text-green-800 border-green-200 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-950/70`}
                      >
                        {pendingIssueId === issue.id ? 'Updating…' : 'Resolve'}
                      </button>
                    )}
                    {issue.status === STATUSES.RESOLVED && (
                      <button
                        type="button"
                        disabled={pendingIssueId === issue.id}
                        onClick={() => handleQuickStatus(issue, STATUSES.OPEN)}
                        className={`${quickButtonClass} bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-950/70`}
                      >
                        {pendingIssueId === issue.id ? 'Updating…' : 'Reopen'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
