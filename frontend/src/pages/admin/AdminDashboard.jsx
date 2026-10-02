import React, { useState, useEffect } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PriorityBadge } from '../../components/ui/PriorityBadge'
import { SkeletonStat } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { getStats } from '../../api/stats'
import { getIssues, updateStatus } from '../../api/issues'
import { useToast } from '../../hooks/useToast'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Flame,
  ArrowRight,
} from 'lucide-react'

export function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentIssues, setRecentIssues] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [pendingIssueId, setPendingIssueId] = useState(null)
  const [pendingStatus, setPendingStatus] = useState(null)
  const toast = useToast()

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true)
      setError(false)
      try {
        const [statsRes, issuesRes] = await Promise.all([getStats(), getIssues({ limit: 6 })])
        if (statsRes.data) setStats(statsRes.data)
        if (issuesRes.data) setRecentIssues(issuesRes.data.issues || [])
        } catch {
          setError(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboard()
  }, [loadAttempt])

  const handleQuickStatus = async (issueId, nextStatus) => {
    setPendingIssueId(issueId)
    setPendingStatus(nextStatus)
    try {
      await updateStatus(issueId, nextStatus)
      setRecentIssues((prev) =>
        prev.map((item) => (item.id === issueId ? { ...item, status: nextStatus } : item))
      )
      toast.success(`Issue #${issueId} status moved to ${nextStatus}.`)
    } catch {
      toast.error('Could not update status.')
    } finally {
      setPendingIssueId(null)
      setPendingStatus(null)
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Admin Operations" title="Facilities Maintenance Dashboard" />
        <ErrorState
          title="Couldn't load the dashboard"
          message="Statistics and recent reports are unavailable right now. Try again in a moment."
          onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Operations"
        title="Facilities Maintenance Dashboard"
        description="Monitor campus defect reports, dispatch contractors, track resolution SLAs, and identify recurring hotspot zones."
      />

      {/* Stats Grid */}
      {isLoading || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStat key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Reports"
            value={stats.totalIssues}
            description="Across all campus zones"
            icon={TrendingUp}
            variant="brand"
          />
          <StatCard
            label="Open Tickets"
            value={stats.openIssues}
            description="Require contractor dispatch"
            icon={AlertCircle}
            variant="danger"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgressIssues}
            description="Under active maintenance"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            label="Resolved"
            value={stats.resolvedIssues}
            description={stats.avgResolutionHours == null ? 'No resolution time data yet' : `Average resolution: ${stats.avgResolutionHours}h`}
            icon={CheckCircle2}
            variant="success"
            trend="+4.2% vs last month"
          />
        </div>
      )}

      {/* Main Grid: Triage list & Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Triage table / recent issues (2 cols) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Active Triage Queue</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Latest student reports sorted by urgency & priority
                </p>
              </div>
              <Link
                to="/issues"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentIssues.slice(0, 5).map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={issue.status} size="sm" />
                        <PriorityBadge upvotes={issue.upvotes} size="sm" />
                        <span className="text-[11px] text-slate-400">
                          #{issue.id}
                        </span>
                      </div>
                      <Link
                        to={`/issues/${issue.id}`}
                        className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-brand-600 truncate block"
                      >
                        {issue.title}
                      </Link>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{issue.location}</span>
                      </div>
                    </div>

                    {/* Quick status selector */}
                    <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                      {issue.status === 'Open' && (
                        <button
                          type="button"
                          disabled={pendingIssueId === issue.id}
                          onClick={() => handleQuickStatus(issue.id, 'In Progress')}
                          className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100"
                        >
                          {pendingIssueId === issue.id && pendingStatus === 'In Progress' ? 'Updating...' : 'In Progress'}
                        </button>
                      )}
                      {issue.status !== 'Resolved' && (
                        <button
                          type="button"
                          disabled={pendingIssueId === issue.id}
                          onClick={() => handleQuickStatus(issue.id, 'Resolved')}
                          className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                        >
                          {pendingIssueId === issue.id && pendingStatus === 'Resolved' ? 'Updating...' : 'Resolve'}
                        </button>
                      )}
                      {issue.status === 'Resolved' && (
                        <button
                          type="button"
                          disabled={pendingIssueId === issue.id}
                          onClick={() => handleQuickStatus(issue.id, 'Open')}
                          className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-100"
                        >
                          {pendingIssueId === issue.id && pendingStatus === 'Open' ? 'Updating...' : 'Reopen'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotspots & Breakdown (1 col) */}
        <div className="space-y-6">
          {/* Campus Hotspots */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Campus Hotspot Zones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats?.hotspots?.map((hotspot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {hotspot.location}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {hotspot.count} active reports
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    High Activity
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Category distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Issues by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats?.byCategory?.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {cat.label}
                    </span>
                    <span className="text-slate-500">{cat.count} ({cat.percentage}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
