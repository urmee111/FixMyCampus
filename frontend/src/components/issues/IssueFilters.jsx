import React, { useState } from 'react'
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../lib/constants'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export function IssueFilters({
  category = 'all',
  status = 'all',
  location = 'all',
  sortBy = 'newest',
  onCategoryChange,
  onStatusChange,
  onLocationChange,
  onSortChange,
  onResetFilters,
  className,
}) {
  const [mobileModalOpen, setMobileModalOpen] = useState(false)

  // Count active non-default filters
  const activeCount = [
    category !== 'all',
    status !== 'all',
    location !== 'all',
  ].filter(Boolean).length

  return (
    <div className={cn('space-y-3', className)}>
      {/* Desktop & Tablet Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all select-none',
              category === 'all'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = category.toLowerCase() === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all select-none',
                  isSelected
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Dropdown Filters (Desktop & Mobile toggle) */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
          {/* Mobile Filter Sheet Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant={activeCount > 0 ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setMobileModalOpen(true)}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            >
              <span>Filters</span>
              {activeCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-brand-600 dark:bg-slate-900 text-[10px] font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </Button>
          </div>

          {/* Desktop Select Dropdowns */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Status Select */}
            <select
              value={status}
              aria-label="Filter by Status"
              onChange={(e) => onStatusChange(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Location Select */}
            <select
              value={location}
              aria-label="Filter by Location"
              onChange={(e) => onLocationChange(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer max-w-[180px] truncate"
            >
              <option value="all">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector (visible on all breakpoints) */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              aria-label="Sort issues"
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="upvotes">Highest Upvotes</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active filters:
          </span>

          {category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <span>Category: <strong className="capitalize">{category}</strong></span>
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                aria-label="Remove category filter"
                className="hover:text-brand-900 dark:hover:text-white p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <span>Status: <strong className="capitalize">{status}</strong></span>
              <button
                type="button"
                onClick={() => onStatusChange('all')}
                aria-label="Remove status filter"
                className="hover:text-brand-900 dark:hover:text-white p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {location !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 max-w-[200px] truncate">
              <span className="truncate">Location: <strong>{location}</strong></span>
              <button
                type="button"
                onClick={() => onLocationChange('all')}
                aria-label="Remove location filter"
                className="hover:text-brand-900 dark:hover:text-white p-0.5 rounded-full shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline ml-2 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        </div>
      )}

      {/* Mobile Filters Drawer / Modal */}
      <Modal
        isOpen={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
        title="Filter Campus Issues"
        description="Filter issues by category, status, and campus building locations."
        maxWidth="max-w-md"
      >
        <div className="space-y-5 py-2">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                className={cn(
                  'p-2.5 rounded-xl text-xs font-semibold text-left border transition-colors flex items-center justify-between',
                  category === 'all'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                )}
              >
                <span>All Categories</span>
                {category === 'all' && <Check className="w-3.5 h-3.5" />}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={cn(
                    'p-2.5 rounded-xl text-xs font-semibold text-left border transition-colors flex items-center justify-between',
                    category.toLowerCase() === cat.id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  )}
                >
                  <span>{cat.label}</span>
                  {category.toLowerCase() === cat.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All Statuses' },
                { id: 'open', label: 'Open' },
                { id: 'in progress', label: 'In Progress' },
                { id: 'resolved', label: 'Resolved' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onStatusChange(st.id)}
                  className={cn(
                    'p-2.5 rounded-xl text-xs font-semibold text-left border transition-colors flex items-center justify-between',
                    status.toLowerCase() === st.id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  )}
                >
                  <span>{st.label}</span>
                  {status.toLowerCase() === st.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Campus Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                onResetFilters()
                setMobileModalOpen(false)
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="primary"
              className="flex-1"
              onClick={() => setMobileModalOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
