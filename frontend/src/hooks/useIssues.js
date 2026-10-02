import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getIssues } from '../api/issues'
import { CATEGORIES, STATUSES } from '../lib/constants'

const PAGE_SIZE = 9
const SORTS = ['upvotes', 'newest', 'oldest']
const DEFAULT_SORT = 'newest'

// The Issues page state lives in the URL: /issues?q=fan&category=Electrical&status=Open&location=Library&sort=upvotes&page=2
// so a refresh, a shared link and the back button all give the same list.
// Missing or unknown values count as "not set" (an unknown category in a link is ignored, never an error).
export function useIssues() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = (searchParams.get('q') || '').trim()
  const rawCategory = searchParams.get('category') || ''
  const category = CATEGORIES.some((item) => item.label === rawCategory) ? rawCategory : ''
  const rawStatus = searchParams.get('status') || ''
  const status = Object.values(STATUSES).includes(rawStatus) ? rawStatus : ''
  const location = (searchParams.get('location') || '').trim()
  const rawSort = searchParams.get('sort') || ''
  const sort = SORTS.includes(rawSort) ? rawSort : DEFAULT_SORT
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)

  const [issues, setIssues] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  const query = useMemo(
    () => ({ q, category, status, location, sort, page, limit: PAGE_SIZE }),
    [q, category, status, location, sort, page]
  )

  useEffect(() => {
    let isCurrent = true // ignore the answer if the filters changed while we were waiting
    setIsLoading(true)
    setError(null)

    getIssues(query)
      .then((res) => {
        if (!isCurrent) return
        setIssues(res.data.items)
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
      })
      .catch((err) => {
        if (!isCurrent) return
        setError(err.error?.message || 'We could not load campus issues.')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [query, reloadCount])

  // Changes one URL parameter. Anything but a page change goes back to page 1.
  const updateParam = useCallback(
    (key, value, { keepPage = false } = {}) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        if (!keepPage) next.delete('page')
        return next
      })
    },
    [setSearchParams]
  )

  return {
    issues,
    total,
    totalPages,
    page,
    limit: PAGE_SIZE,
    isLoading,
    error,
    refetch: () => setReloadCount((count) => count + 1),
    // Active filters
    q,
    category,
    status,
    location,
    sort,
    // Updaters
    setCategory: (value) => updateParam('category', value),
    setStatus: (value) => updateParam('status', value),
    setLocation: (value) => updateParam('location', value),
    setSort: (value) => updateParam('sort', value === DEFAULT_SORT ? '' : value),
    setPage: (value) => updateParam('page', value > 1 ? String(value) : '', { keepPage: true }),
    clearSearch: () => updateParam('q', ''),
    // Removes every filter, the search text, the sort and the page
    resetFilters: () => setSearchParams(new URLSearchParams()),
  }
}
