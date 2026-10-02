import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { IssueCard } from '../../components/issues/IssueCard'
import { IssueFilters } from '../../components/issues/IssueFilters'
import { IssuePagination } from '../../components/issues/IssuePagination'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useIssues } from '../../hooks/useIssues'
import { useAuth } from '../../hooks/useAuth'
import { Plus, SearchX, Inbox } from 'lucide-react'

export function Issues() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const {
    issues,
    total,
    totalPages,
    page,
    limit,
    isLoading,
    error,
    refetch,
    q,
    category,
    status,
    location,
    sort,
    setCategory,
    setStatus,
    setLocation,
    setSort,
    setPage,
    clearSearch,
    resetFilters,
  } = useIssues()

  const hasActiveFilters = Boolean(q || category || status || location)

  // A page number past the end (for example after issues were deleted) goes back to the last page
  useEffect(() => {
    if (!isLoading && !error && total > 0 && page > totalPages) setPage(totalPages)
  }, [isLoading, error, total, page, totalPages, setPage])

  const resultsLabel = isLoading
    ? 'Loading issues…'
    : `${total} ${total === 1 ? 'issue' : 'issues'}${hasActiveFilters ? ' found' : ''}`

  return (
    <div className="space-y-6 sm:space-y-7">
      <PageHeader
        title="Campus issues"
        description="Browse what has been reported. Upvote the problems that affect you so they get fixed sooner."
      />

      {/* Filters. The search box is in the top bar and writes the same ?q= you see here. */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <IssueFilters
          category={category}
          status={status}
          location={location}
          sort={sort}
          query={q}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
          onLocationChange={setLocation}
          onSortChange={setSort}
          onClearSearch={clearSearch}
          onResetFilters={resetFilters}
        />
      </div>

      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1" aria-live="polite">
        {resultsLabel}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Failed to load campus issues" message={error} onRetry={refetch} />
      ) : issues.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={SearchX}
            title="No issues found."
            description="Try another search or filter."
            action={
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Inbox}
            title="No issues have been reported yet"
            description={isAdmin ? 'New reports from students will show up here.' : 'Noticed something broken on campus? Be the first to report it.'}
            action={
              !isAdmin && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/report')}
                  leftIcon={<Plus className="w-4 h-4" aria-hidden="true" />}
                >
                  Report an Issue
                </Button>
              )
            }
          />
        )
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>

          <IssuePagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
