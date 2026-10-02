import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getIssues } from '../api/issues'
import { useDebounce } from './useDebounce'

export function useIssues() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read state from URL query parameters
  const searchParam = searchParams.get('search') || ''
  const categoryParam = searchParams.get('category') || 'all'
  const statusParam = searchParams.get('status') || 'all'
  const locationParam = searchParams.get('location') || 'all'
  const sortParam = searchParams.get('sort') || 'newest'
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  // Local immediate search state for typing responsiveness
  const [searchInput, setSearchInput] = useState(searchParam)
  const debouncedSearch = useDebounce(searchInput, 300)

  // Data fetching state
  const [issues, setIssues] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sync debounced search to URL
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (debouncedSearch && debouncedSearch.trim()) {
        next.set('search', debouncedSearch.trim())
      } else {
        next.delete('search')
      }
      next.set('page', '1') // Reset to page 1 on new search
      return next
    }, { replace: true })
  }, [debouncedSearch, setSearchParams])

  // Sync external URL changes back to searchInput (e.g. back/forward navigation or clear)
  useEffect(() => {
    if (searchParam !== searchInput) {
      setSearchInput(searchParam)
    }
  }, [searchParam])

  // Centralized fetch query
  const query = useMemo(() => ({
    search: searchParam,
    category: categoryParam,
    status: statusParam,
    location: locationParam,
    sortBy: sortParam,
    page: pageParam,
    limit: 9,
  }), [searchParam, categoryParam, statusParam, locationParam, sortParam, pageParam])

  const fetchIssues = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getIssues(query)
      if (res.data) {
        setIssues(res.data.issues || [])
        setTotal(res.data.total || 0)
        setTotalPages(res.data.totalPages || 1)
        if (res.data.stats) {
          setStats(res.data.stats)
        }
      }
    } catch (err) {
      setError(err.message || 'We could not load campus issues.')
    } finally {
      setIsLoading(false)
    }
  }, [query])

  useEffect(() => {
    fetchIssues()
  }, [fetchIssues])

  // Helper mutators that update URL query params cleanly
  const updateQueryParam = useCallback((key, value, resetPage = true) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (!value || value === 'all' || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      if (resetPage) {
        next.set('page', '1')
      }
      return next
    })
  }, [setSearchParams])

  const setCategory = useCallback((cat) => updateQueryParam('category', cat), [updateQueryParam])
  const setStatus = useCallback((st) => updateQueryParam('status', st), [updateQueryParam])
  const setLocation = useCallback((loc) => updateQueryParam('location', loc), [updateQueryParam])
  const setSortBy = useCallback((sort) => updateQueryParam('sort', sort), [updateQueryParam])
  const setPage = useCallback((p) => updateQueryParam('page', String(p), false), [updateQueryParam])

  const resetFilters = useCallback(() => {
    setSearchInput('')
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  const clearSearch = useCallback(() => {
    setSearchInput('')
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('search')
      next.set('page', '1')
      return next
    })
  }, [setSearchParams])

  return {
    issues,
    total,
    totalPages,
    currentPage: pageParam,
    stats,
    isLoading,
    error,
    refetch: fetchIssues,
    // Active query states
    search: searchInput,
    category: categoryParam,
    status: statusParam,
    location: locationParam,
    sortBy: sortParam,
    // State updaters
    setSearch: setSearchInput,
    clearSearch,
    setCategory,
    setStatus,
    setLocation,
    setSortBy,
    setPage,
    resetFilters,
  }
}
