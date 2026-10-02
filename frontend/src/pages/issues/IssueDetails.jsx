import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PriorityBadge } from '../../components/ui/PriorityBadge'
import { IssueCategoryIcon } from '../../components/issues/IssueCategoryIcon'
import { IssueUpvoteButton } from '../../components/issues/IssueUpvoteButton'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { SkeletonDetail } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { getIssue, deleteIssue, updateStatus } from '../../api/issues'
import { addComment } from '../../api/comments'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { formatRelativeTime, formatFullDate } from '../../lib/formatters'
import { MapPin, Calendar, MessageSquare, Trash2, Edit3, Send } from 'lucide-react'

export function IssueDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const toast = useToast()

  const [issue, setIssue] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Comments state
  const [newCommentText, setNewCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Admin status update state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    async function fetchIssue() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getIssue(id)
        if (res.data?.issue) {
          setIssue(res.data.issue)
        }
      } catch (err) {
        setError(err.message || 'Issue not found')
      } finally {
        setIsLoading(false)
      }
    }
    fetchIssue()
  }, [id])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteIssue(issue.id)
      toast.success('Campus issue removed successfully.')
      navigate('/issues')
    } catch {
      toast.error('Failed to delete issue.')
    } finally {
      setIsDeleting(false)
      setIsDeleteOpen(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newCommentText.trim()) return

    setIsSubmittingComment(true)
    try {
      const res = await addComment(issue.id, newCommentText.trim(), user)
      if (res.data?.comment) {
        setIssue((prev) => ({
          ...prev,
          commentsCount: (prev.commentsCount || 0) + 1,
          comments: [...(prev.comments || []), res.data.comment],
        }))
        setNewCommentText('')
        toast.success('Comment posted.')
      }
    } catch {
      toast.error('Could not post comment.')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleAdminStatusChange = async (nextStatus) => {
    setIsUpdatingStatus(true)
    try {
      const res = await updateStatus(issue.id, nextStatus)
      if (res.data?.issue) {
        setIssue(res.data.issue)
        toast.success(`Status updated to ${nextStatus}.`)
      }
    } catch {
      toast.error('Failed to update status.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (isLoading) {
    return <SkeletonDetail />
  }

  if (error || !issue) {
    return (
      <ErrorState
        type="404"
        title="Campus Issue Not Found"
        message={error || 'This issue may have been removed or does not exist.'}
        action={
          <Button variant="primary" size="sm" onClick={() => navigate('/issues')}>
            Back to Issues
          </Button>
        }
      />
    )
  }

  const isOwner = user && issue.reporter?.id === user.id
  const canDelete = isOwner || isAdmin
  const nextStatuses = issue.status === 'Open'
    ? ['In Progress', 'Resolved']
    : issue.status === 'In Progress'
      ? ['Resolved']
      : ['Open']

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        breadcrumbs={[
          { label: 'Campus Issues', href: '/issues' },
          { label: `Issue #${issue.id}` },
        ]}
        actions={
          (isOwner || canDelete) && (
            <div className="flex items-center gap-2">
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/issues/${issue.id}/edit`)}
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Delete
                </Button>
              )}
            </div>
          )
        }
      />

      {/* Main Issue Card */}
      <Card className="shadow-xs">
        <CardContent className="space-y-6">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <IssueCategoryIcon category={issue.category} size="md" showLabel />
              <StatusBadge status={issue.status} size="md" />
              <PriorityBadge upvotes={issue.upvotes} size="md" />
            </div>

            <div className="flex items-center gap-2">
              <IssueUpvoteButton
                issueId={issue.id}
                initialUpvotes={issue.upvotes}
                initialHasUpvoted={issue.hasUpvoted}
                onUpvoteChange={(upvotes, hasUpvoted) => setIssue((current) => ({ ...current, upvotes, hasUpvoted }))}
                size="md"
              />
            </div>
          </div>

          {/* Title & Location */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {issue.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{issue.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Reported {formatRelativeTime(issue.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-b border-slate-100 dark:border-slate-800/80 py-4">
            <p className="whitespace-pre-line">{issue.description}</p>
          </div>

          {/* Photo Preview if attached */}
          {issue.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          {/* Reporter Profile */}
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <Avatar src={issue.reporter?.avatar} name={issue.reporter?.name} size="sm" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {issue.reporter?.name || 'Anonymous Student'}
              </p>
              <p className="text-[11px] text-slate-400">Campus Reporter</p>
            </div>
          </div>

          {/* Admin Fast Status Triage Controller */}
          {isAdmin && (
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Admin Operational Status Triage
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  Update the status to notify the student body of maintenance progress.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {nextStatuses.map((nextStatus) => (
                  <Button
                    key={nextStatus}
                    size="sm"
                    variant="outline"
                    disabled={isUpdatingStatus}
                    onClick={() => handleAdminStatusChange(nextStatus)}
                  >
                    {isUpdatingStatus ? 'Updating...' : nextStatus === 'Open' ? 'Reopen' : nextStatus}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Resolution Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {issue.timeline?.map((step, idx) => (
              <div key={step.id || idx} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1.5 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-brand-600 ring-4 ring-white dark:ring-slate-900" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {step.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatFullDate(step.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {step.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card id="comments">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>Updates & Discussion ({issue.commentsCount || 0})</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Comment composer */}
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <Avatar src={user?.avatar} name={user?.name || 'Me'} size="sm" />
            <div className="flex-1 flex gap-2">
              <label className="sr-only" htmlFor="newComment">Add a useful update</label>
              <input
                id="newComment"
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment or campus update..."
                maxLength={500}
                className="flex-1 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                isLoading={isSubmittingComment}
                disabled={!newCommentText.trim()}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Post
              </Button>
            </div>
          </form>

          {/* Comments list */}
          {issue.comments?.length > 0 ? (
            <div className="space-y-3 pt-2">
              {issue.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <Avatar
                    src={comment.author?.avatar}
                    name={comment.author?.name}
                    size="xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {comment.author?.name}
                      </span>
                      {comment.author?.role === 'admin' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
                          Staff
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">
              No comments yet. Be the first to share an update about this issue.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete this campus issue?"
        description="This action cannot be undone. All comments and upvotes associated with this issue will also be removed."
        confirmText="Delete Issue"
        isDestructive
      />
    </div>
  )
}
