import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { IssueCard } from '../../components/issues/IssueCard'
import { Button } from '../../components/ui/Button'
import { Tabs } from '../../components/ui/Tabs'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { IssueSearch } from '../../components/issues/IssueSearch'
import { ErrorState } from '../../components/ui/ErrorState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { deleteIssue, getMyIssues } from '../../api/issues'
import { Plus, FileText, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '../../hooks/useToast'

export function MyReports() {
  const [issues, setIssues] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [issueToDelete, setIssueToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    async function fetchMyIssues() {
      setIsLoading(true)
      setError(false)
      try {
        const res = await getMyIssues()
        if (res.data?.issues) {
          setIssues(res.data.issues)
        }
      } catch {
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMyIssues()
  }, [loadAttempt])

  const filteredIssues = issues.filter((issue) => {
    const matchesTab = activeTab === 'all' || issue.status.toLowerCase() === activeTab
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [issue.title, issue.description, issue.location]
      .some((value) => value?.toLowerCase().includes(query))
    return matchesTab && matchesSearch
  })

  const handleDelete = async () => {
    if (!issueToDelete) return
    setIsDeleting(true)
    try {
      await deleteIssue(issueToDelete.id)
      setIssues((current) => current.filter((issue) => issue.id !== issueToDelete.id))
      toast.success('Your report was deleted.')
      setIssueToDelete(null)
    } catch {
      toast.error("We couldn't delete this report. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const tabs = [
    { id: 'all', label: 'All Reports', count: issues.length },
    { id: 'open', label: 'Open', count: issues.filter((i) => i.status === 'Open').length },
    { id: 'in progress', label: 'In Progress', count: issues.filter((i) => i.status === 'In Progress').length },
    { id: 'resolved', label: 'Resolved', count: issues.filter((i) => i.status === 'Resolved').length },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Activity"
        title="My Reported Issues"
        description="Track status milestones, responder updates, and resolution progress for issues you have submitted."
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/report')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Issue Report
          </Button>
        }
      />

      {/* Tabs */}
      <div>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="max-w-xl">
        <IssueSearch
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search your reports..."
        />
      </div>

      {/* Content */}
      {error ? (
        <ErrorState
          title="Couldn't load your reports"
          message="Your reports are still safe. Check your connection and try again."
          onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search ? 'No reports match your search' : "You haven't reported any issues in this category"}
          description={search ? 'Try another keyword or clear your search.' : 'Notice something broken around your dorm, lab, or campus classrooms? Submitting a report takes less than a minute.'}
          action={
            search ? (
              <Button variant="outline" size="sm" onClick={() => setSearch('')}>Clear search</Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/report')}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Report an Issue
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
                <Button variant="outline" size="sm" onClick={() => navigate(`/issues/${issue.id}`)}>
                  View
                </Button>
                {issue.status === 'Open' && (
                  <Button variant="outline" size="sm" onClick={() => navigate(`/issues/${issue.id}/edit`)} leftIcon={<Pencil className="w-3.5 h-3.5" />}>
                    Edit
                  </Button>
                )}
                <Button variant="danger" size="sm" onClick={() => setIssueToDelete(issue)} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
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
        description="This will permanently remove your issue report and its discussion."
        confirmText="Delete report"
      />
    </div>
  )
}
