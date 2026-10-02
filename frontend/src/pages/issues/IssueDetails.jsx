import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PriorityBadge } from '../../components/ui/PriorityBadge'
import { IssueCategoryIcon } from '../../components/issues/IssueCategoryIcon'
import { IssueUpvoteButton } from '../../components/issues/IssueUpvoteButton'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { SkeletonDetail } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { getIssue, deleteIssue, updateStatus } from '../../api/issues'
import { addComment } from '../../api/comments'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { formatRelativeTime, formatFullDate } from '../../lib/formatters'
import { LIMITS, STATUSES } from '../../lib/constants'
import { MapPin, Calendar, MessageSquare, Trash2, Edit3, Send, ShieldCheck } from 'lucide-react'

// Same transitions as the backend: Open -> In Progress / Resolved, In Progress -> Resolved, Resolved -> Open (reopen)
const NEXT_STATUSES = {
  [STATUSES.OPEN]: [STATUSES.IN_PROGRESS, STATUSES.RESOLVED],
  [STATUSES.IN_PROGRESS]: [STATUSES.RESOLVED],
  [STATUSES.RESOLVED]: [STATUSES.OPEN],
}

export function IssueDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hash } = useLocation()
  const { user, isAdmin } = useAuth()
  const toast = useToast()

  const [issue, setIssue] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Comments
  const [commentText, setCommentText] = useState('')
  const [commentError, setCommentError] = useState(null)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Admin status change
  const [nextStatus, setNextStatus] = useState('')
  const [statusNote, setStatusNote] = useState('')
  const [statusErrors, setStatusErrors] = useState({})
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // silent = reload after a change without replacing the page with a skeleton
  const loadIssue = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setIsLoading(true)
        setError(null)
      }
      try {
        const res = await getIssue(id)
        setIssue(res.data)
      } catch (err) {
        if (!silent) setError(err.error?.message || 'Issue not found')
      } finally {
        if (!silent) setIsLoading(false)
      }
    },
    [id]
  )

  useEffect(() => {
    loadIssue()
  }, [loadIssue])

  // Links like /issues/5#comments (the comment icon on a card) scroll to the discussion once the page is there
  useEffect(() => {
    if (!isLoading && issue && hash === '#comments') {
      document.getElementById('comments')?.scrollIntoView({ block: 'start' })
    }
  }, [isLoading, issue, hash])

  // The status list changes after every status change: select the first allowed one again
  const allowedStatuses = issue ? NEXT_STATUSES[issue.status] || [] : []
  const currentStatus = issue?.status
  useEffect(() => {
    setNextStatus((NEXT_STATUSES[currentStatus] || [])[0] || '')
  }, [currentStatus])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteIssue(issue.id)
      toast.success('Issue deleted.')
      navigate('/issues')
    } catch (err) {
      toast.error(err.error?.message || 'Failed to delete the issue.')
      setIsDeleteOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (isSubmittingComment) return

    // An empty comment is sent on purpose: the server's own message ("Comment cannot be empty") is shown under the box
    setCommentError(null)
    setIsSubmittingComment(true)
    try {
      const res = await addComment(issue.id, commentText)
      setIssue((current) => ({
        ...current,
        commentCount: current.commentCount + 1,
        comments: [...current.comments, res.data],
      }))
      setCommentText('')
      toast.success('Comment posted.')
    } catch (err) {
      const fieldMessage = err.error?.fields?.text
      if (fieldMessage || err.response?.status === 400) {
        setCommentError(fieldMessage || err.error.message)
      } else {
        toast.error(err.error?.message || 'Could not post your comment.')
      }
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    if (isUpdatingStatus || !nextStatus) return

    setStatusErrors({})
    setIsUpdatingStatus(true)
    try {
      await updateStatus(issue.id, nextStatus, statusNote)
      toast.success(`Status changed to ${nextStatus}.`)
      setStatusNote('')
      await loadIssue({ silent: true }) // the timeline and the official comment come from the full issue
    } catch (err) {
      const fields = err.error?.fields || {}
      if (Object.keys(fields).length) {
        setStatusErrors(fields)
      } else {
        toast.error(err.error?.message || 'Failed to update the status.')
      }
      if (err.response?.status === 409) await loadIssue({ silent: true }) // someone else changed it first
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
        title="Issue not found"
        message={error || 'This issue may have been removed or does not exist.'}
        onRetry={() => loadIssue()}
        action={
          <Button variant="primary" size="sm" onClick={() => navigate('/issues')}>
            Back to Issues
          </Button>
        }
      />
    )
  }

  const isOwner = Boolean(user) && issue.createdBy.id === user.id
  const canEdit = isOwner && issue.status === STATUSES.OPEN // the backend only lets the owner edit an Open issue
  const canDelete = isOwner || isAdmin

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        breadcrumbs={[
          { label: 'Campus Issues', href: '/issues' },
          { label: `Issue #${issue.id}` },
        ]}
        actions={
          (canEdit || canDelete) && (
            <div className="flex items-center gap-2">
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/issues/${issue.id}/edit`)}
                  leftIcon={<Edit3 className="w-3.5 h-3.5" aria-hidden="true" />}
                >
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" aria-hidden="true" />}
                >
                  Delete
                </Button>
              )}
            </div>
          )
        }
      />

      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <IssueCategoryIcon category={issue.category} size="md" showLabel />
              <StatusBadge status={issue.status} size="md" />
              <PriorityBadge upvotes={issue.upvoteCount} size="md" />
            </div>

            <IssueUpvoteButton
              issue={issue}
              onUpvoteChange={(upvoteCount, hasUpvoted) =>
                setIssue((current) => ({ ...current, upvoteCount, hasUpvoted }))
              }
              size="md"
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 break-words">
              {issue.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{issue.location}</span>
              </div>
              <div className="flex items-center gap-1.5" title={formatFullDate(issue.createdAt)}>
                <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Reported {formatRelativeTime(issue.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed border-t border-b border-slate-200 dark:border-slate-800 py-4">
            <p className="whitespace-pre-line break-words">{issue.description}</p>
          </div>

          {issue.photoUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <img
                src={issue.photoUrl}
                alt={`Photo attached to the issue “${issue.title}”`}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
            <Avatar name={issue.createdBy.name} size="sm" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{issue.createdBy.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Reporter</p>
            </div>
          </div>

          {/* Status control (Staff / Admin only; the backend checks the role as well) */}
          {isAdmin && (
            <form
              onSubmit={handleStatusSubmit}
              noValidate
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                Change status
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3">
                <FormField id="next-status" label="New status" error={statusErrors.status}>
                  <Select
                    id="next-status"
                    value={nextStatus}
                    disabled={isUpdatingStatus}
                    error={statusErrors.status}
                    onChange={(e) => setNextStatus(e.target.value)}
                  >
                    {allowedStatuses.map((name) => (
                      <option key={name} value={name}>
                        {name === STATUSES.OPEN ? 'Open (reopen)' : name}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField
                  id="status-note"
                  label="Note (optional)"
                  error={statusErrors.note}
                  helperText={`Students see it in the timeline and as an official comment. ${statusNote.length}/${LIMITS.note.max}`}
                >
                  <Textarea
                    id="status-note"
                    rows={2}
                    maxLength={LIMITS.note.max}
                    placeholder="e.g. Electrician assigned for tomorrow"
                    value={statusNote}
                    disabled={isUpdatingStatus}
                    error={statusErrors.note}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </FormField>
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="sm" isLoading={isUpdatingStatus} disabled={!nextStatus}>
                  {isUpdatingStatus ? 'Updating…' : 'Update status'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Status timeline (from status_history) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Status timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-5 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
            {issue.history.map((step) => (
              <li key={step.id} className="relative pl-8">
                <span
                  className="absolute left-0 top-1 w-4 h-4 rounded-full bg-brand-600 ring-4 ring-white dark:ring-slate-900"
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {step.oldStatus ? `${step.oldStatus} → ${step.newStatus}` : `Reported (${step.newStatus})`}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400" title={formatFullDate(step.changedAt)}>
                    {formatRelativeTime(step.changedAt)} · {step.changedBy.name}
                  </span>
                </div>
                {step.note && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 break-words">{step.note}</p>
                )}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card id="comments" className="scroll-mt-20">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            <span>Comments ({issue.commentCount})</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleCommentSubmit} noValidate className="flex gap-3">
            <Avatar name={user?.name || 'Me'} size="sm" className="hidden sm:inline-flex mt-1" />
            <div className="flex-1 space-y-2">
              <FormField
                id="new-comment"
                label="Add a comment"
                error={commentError}
                helperText={`${commentText.length}/${LIMITS.comment.max}`}
              >
                <Textarea
                  id="new-comment"
                  rows={2}
                  maxLength={LIMITS.comment.max}
                  placeholder="Write a comment or an update…"
                  value={commentText}
                  disabled={isSubmittingComment}
                  error={commentError}
                  onChange={(e) => {
                    setCommentText(e.target.value)
                    if (commentError) setCommentError(null)
                  }}
                />
              </FormField>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={isSubmittingComment}
                  leftIcon={<Send className="w-3.5 h-3.5" aria-hidden="true" />}
                >
                  {isSubmittingComment ? 'Posting…' : 'Post comment'}
                </Button>
              </div>
            </div>
          </form>

          {issue.comments.length > 0 ? (
            <ul className="space-y-3 pt-2">
              {issue.comments.map((comment) => (
                <li
                  key={comment.id}
                  className={
                    comment.user.role === 'admin'
                      ? 'flex items-start gap-3 p-3 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800'
                      : 'flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
                  }
                >
                  <Avatar name={comment.user.name} size="xs" className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {comment.user.name}
                      </span>
                      {comment.user.role === 'admin' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-brand-600 text-white">
                          <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                          Official
                        </span>
                      )}
                      <span className="text-xs text-slate-600 dark:text-slate-400" title={formatFullDate(comment.createdAt)}>
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 whitespace-pre-line break-words">
                      {comment.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-300 text-center py-4">
              No comments yet. Be the first to add one.
            </p>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete this issue?"
        description="This cannot be undone. Its comments, upvotes and status history will be deleted too."
        confirmText="Delete issue"
        isDestructive
      />
    </div>
  )
}
