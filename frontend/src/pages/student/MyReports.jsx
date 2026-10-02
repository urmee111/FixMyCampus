import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { IssueCard } from '../../components/issues/IssueCard'
import { IssueSummaryBar } from '../../components/issues/IssueSummaryBar'
import { Button } from '../../components/ui/Button'
import { Tabs } from '../../components/ui/Tabs'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { ErrorState } from '../../components/ui/ErrorState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { deleteIssue, getMyIssues } from '../../api/issues'
import { Plus, FileText, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../hooks/useAuth'

export function MyReports() {
  const [issues, setIssues] = useState([])
  const [counts, setCounts] = useState(null) // { Open, "In Progress", Resolved, total } from GET /my/issues
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [issueToDelete, setIssueToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteLock = useRef(false) // set at once, so a double click can never send two requests
  const navigate = useNavigate()
  const toast = useToast()
  const { isAdmin } = useAuth()

  const loadReports = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true)
      setError(null)
    }
    try {
      const res = await getMyIssues()
      setIssues(res.data.items)
      setCounts(res.data.counts)
    } catch (err) {
      if (!silent) setError(err.error?.message || "Couldn't load your reports.")
    } finally {
      if (!silent) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  // Admins have no reports of their own; their home is the dashboard
  if (isAdmin) return <Navigate to="/admin" replace />

  const filteredIssues = issues.filter((issue) => activeTab === 'all' || issue.status === activeTab)

  const handleDelete = async () => {
    if (!issueToDelete || deleteLock.current) return
    deleteLock.current = true
    setIsDeleting(true)
    try {
      await deleteIssue(issueToDelete.id)
      toast.success('Your report was deleted.')
      setIssueToDelete(null)
      await loadReports({ silent: true }) // the counts at the top change too
    } catch (err) {
      toast.error(err.error?.message || "We couldn't delete this report. Please try again.")
      setIssueToDelete(null)
    } finally {
      deleteLock.current = false
      setIsDeleting(false)
    }
  }

  const tabs = [
    { id: 'all', label: 'All', count: counts?.total ?? 0 },
    { id: 'Open', label: 'Open', count: counts?.Open ?? 0 },
    { id: 'In Progress', label: 'In Progress', count: counts?.['In Progress'] ?? 0 },
    { id: 'Resolved', label: 'Resolved', count: counts?.Resolved ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My reports"
        description="Follow the issues you reported, from Open to Resolved."
      />

      {!error && !isLoading && <IssueSummaryBar counts={counts} />}

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {error ? (
        <ErrorState title="Couldn't load your reports" message={error} onRetry={() => loadReports()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={activeTab === 'all' ? "You haven't reported any issues yet" : `No ${activeTab} reports`}
          description={
            activeTab === 'all'
              ? 'Noticed something broken on campus? Reporting it takes less than a minute.'
              : 'Reports with this status will show up here.'
          }
          action={
            activeTab === 'all' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/report')}
                leftIcon={<Plus className="w-4 h-4" aria-hidden="true" />}
              >
                Report an Issue
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setActiveTab('all')}>
                Show all reports
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="min-w-0">
              <IssueCard issue={issue} />
              <div className="flex items-center justify-end gap-2 mt-2">
                {issue.status === 'Open' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/issues/${issue.id}/edit`)}
                    leftIcon={<Pencil className="w-3.5 h-3.5" aria-hidden="true" />}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIssueToDelete(issue)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" aria-hidden="true" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(issueToDelete)}
        onClose={() => setIssueToDelete(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete this report?"
        description="This cannot be undone. Its comments, upvotes and status history will be deleted too."
        confirmText="Delete report"
      />
    </div>
  )
}
