import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { IssueCard } from '../../components/issues/IssueCard'
import { IssueSearch } from '../../components/issues/IssueSearch'
import { IssueFilters } from '../../components/issues/IssueFilters'
import { IssueSummaryBar } from '../../components/issues/IssueSummaryBar'
import { IssuePagination } from '../../components/issues/IssuePagination'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useIssues } from '../../hooks/useIssues'
import { Plus, SearchX, Inbox } from 'lucide-react'

export function Issues() {
  const navigate = useNavigate()
  const {
    issues,
    total,
    totalPages,
    currentPage,
    stats,
    isLoading,
    error,
    refetch,
    search,
    category,
    status,
    location,
    sortBy,
    setSearch,
    clearSearch,
    setCategory,
    setStatus,
    setLocation,
    setSortBy,
    setPage,
    resetFilters,
  } = useIssues()

  const hasActiveFilters = Boolean(
    (search && search.trim()) ||
    category !== 'all' ||
    status !== 'all' ||
    location !== 'all'
  )

  // Construct readable contextual result heading
  const getResultsCountLabel = () => {
    if (isLoading) return 'Loading issues...'
    if (!hasActiveFilters) {
      return `${total} campus ${total === 1 ? 'issue' : 'issues'}`
    }

    const parts = []
    if (category !== 'all') parts.push(category)
    if (status !== 'all') parts.push(status)
    const categoryPart = parts.length > 0 ? parts.join(' • ') : 'campus'

    return `${total} ${categoryPart} ${total === 1 ? 'issue' : 'issues'}${location !== 'all' ? ` in ${location}` : ''}`
  }

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        eyebrow="Campus Defect Registry"
        title="What's happening on campus?"
        description="Browse reported problems across academic buildings, hostels, and sports grounds. Upvote urgent defects to escalate maintenance prioritization."
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/report')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Report an Issue
          </Button>
        }
      />

      {/* Summary Metrics Bar */}
      <IssueSummaryBar stats={stats} />

      {/* Controls Container: Search & Filters */}
      <div className="space-y-3.5 bg-white dark:bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
        <IssueSearch
          value={search}
          onChange={setSearch}
          onClear={clearSearch}
        />

        <IssueFilters
          category={category}
          status={status}
          location={location}
          sortBy={sortBy}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
          onLocationChange={setLocation}
          onSortChange={setSortBy}
          onResetFilters={resetFilters}
        />
      </div>

      {/* Results Header: Result Count */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 capitalize">
          {getResultsCountLabel()}
        </h2>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Issues Grid / State Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to load campus issues"
          message={error}
          onRetry={refetch}
        />
      ) : issues.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={SearchX}
            title="No issues match your search"
            description="We couldn't find any campus reports matching your keywords and filters. Try clearing some filters or searching for a different room or defect."
            action={
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Inbox}
            title="No campus issues reported yet"
            description="Everything looks clear and operational across university facilities! Notice something broken in your lab or dorm?"
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/report')}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Report First Issue
              </Button>
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

          {/* Pagination */}
          <IssuePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            limit={9}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
