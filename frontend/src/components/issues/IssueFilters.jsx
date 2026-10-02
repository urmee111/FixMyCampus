import React, { useState } from 'react'
import { CATEGORIES, CAMPUS_LOCATIONS, STATUSES } from '../../lib/constants'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

// Category and status values are the exact words the backend expects ("Electrical", "In Progress").
// "" means "all" (the filter is then not sent at all).
const STATUS_LIST = Object.values(STATUSES)

const selectClass =
  'text-sm font-medium px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 cursor-pointer'

const pillClass = (selected) =>
  cn(
    'px-3 py-1.5 rounded-xl text-sm font-semibold shrink-0 transition-colors select-none',
    selected
      ? 'bg-brand-600 text-white'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
  )

const optionButtonClass = (selected) =>
  cn(
    'p-2.5 rounded-xl text-sm font-semibold text-left border transition-colors flex items-center justify-between',
    selected
      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300'
      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
  )

export function IssueFilters({
  category = '',
  status = '',
  location = '',
  sort = 'newest',
  query = '',
  onCategoryChange,
  onStatusChange,
  onLocationChange,
  onSortChange,
  onClearSearch,
  onResetFilters,
  className,
}) {
  const [mobileModalOpen, setMobileModalOpen] = useState(false)

  // A location from the URL that is not in the list (old link) is still shown, so the dropdown never lies
  const locationOptions =
    location && !CAMPUS_LOCATIONS.includes(location) ? [location, ...CAMPUS_LOCATIONS] : CAMPUS_LOCATIONS

  const activeCount = [category, status, location, query].filter(Boolean).length

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category pills (desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            aria-pressed={category === ''}
            className={pillClass(category === '')}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.label)}
              aria-pressed={category === cat.label}
              className={pillClass(category === cat.label)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
          {/* Mobile filter sheet trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant={activeCount > 0 ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMobileModalOpen(true)}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Filters{activeCount > 0 ? ` (${activeCount})` : ''}
            </Button>
          </div>

          {/* Desktop selects */}
          <div className="hidden lg:flex items-center gap-2">
            <select
              value={status}
              aria-label="Filter by status"
              onChange={(e) => onStatusChange(e.target.value)}
              className={selectClass}
            >
              <option value="">All statuses</option>
              {STATUS_LIST.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={location}
              aria-label="Filter by location"
              onChange={(e) => onLocationChange(e.target.value)}
              className={cn(selectClass, 'max-w-[180px]')}
            >
              <option value="">All locations</option>
              {locationOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort (all screen sizes) */}
          <div className="flex items-center gap-1.5 ml-auto">
            <label htmlFor="issue-sort" className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
              Sort:
            </label>
            <select
              id="issue-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className={selectClass}
            >
              <option value="newest">Newest first</option>
              <option value="upvotes">Most upvoted</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Active filters:
          </span>

          {[
            { key: 'q', label: 'Search', value: query, clear: onClearSearch },
            { key: 'category', label: 'Category', value: category, clear: () => onCategoryChange('') },
            { key: 'status', label: 'Status', value: status, clear: () => onStatusChange('') },
            { key: 'location', label: 'Location', value: location, clear: () => onLocationChange('') },
          ]
            .filter((chip) => chip.value)
            .map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 max-w-[220px]"
              >
                <span className="truncate">
                  {chip.label}: <strong>{chip.value}</strong>
                </span>
                <button
                  type="button"
                  onClick={chip.clear}
                  aria-label={`Remove ${chip.label.toLowerCase()} filter`}
                  className="p-1 rounded-full hover:bg-brand-100 dark:hover:bg-brand-900 shrink-0"
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              </span>
            ))}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline ml-1 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Clear filters</span>
          </button>
        </div>
      )}

      {/* Mobile filters sheet */}
      <Modal
        isOpen={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
        title="Filter issues"
        description="Pick a category, status or location."
        maxWidth="max-w-md"
      >
        <div className="space-y-5 py-2">
          <fieldset className="space-y-2">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Category
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onCategoryChange('')}
                aria-pressed={category === ''}
                className={optionButtonClass(category === '')}
              >
                <span>All Categories</span>
                {category === '' && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.label)}
                  aria-pressed={category === cat.label}
                  className={optionButtonClass(category === cat.label)}
                >
                  <span>{cat.label}</span>
                  {category === cat.label && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Status
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {['', ...STATUS_LIST].map((name) => (
                <button
                  key={name || 'all'}
                  type="button"
                  onClick={() => onStatusChange(name)}
                  aria-pressed={status === name}
                  className={optionButtonClass(status === name)}
                >
                  <span>{name || 'All statuses'}</span>
                  {status === name && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label
              htmlFor="mobile-location"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Location
            </label>
            <select
              id="mobile-location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className={cn(selectClass, 'w-full')}
            >
              <option value="">All locations</option>
              {locationOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                onResetFilters()
                setMobileModalOpen(false)
              }}
            >
              Clear filters
            </Button>
            <Button
              type="button"
              variant="primary"
              className="flex-1"
              onClick={() => setMobileModalOpen(false)}
            >
              Show results
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
