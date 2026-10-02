import { apiRequest, getAuthUser, USE_MOCK_API } from './client'
import { MOCK_ISSUES, MOCK_USERS } from '../data/mockData'
import { CATEGORIES } from '../lib/constants'

const normalizeIssue = (issue = {}) => ({
  ...issue,
  category: typeof issue.category === 'string' ? issue.category.toLowerCase() : issue.category,
  upvotes: Number(issue.upvotes ?? issue.upvoteCount ?? 0),
  commentsCount: Number(issue.commentsCount ?? issue.commentCount ?? issue.comments?.length ?? 0),
  imageUrl: issue.imageUrl ?? issue.photoUrl ?? null,
})

const normalizeIssueData = (response) => {
  const data = response.data || {}
  const items = data.items || data.issues || []
  return {
    ...response,
    data: {
      ...data,
      issues: items.map(normalizeIssue),
      total: data.total ?? items.length,
      page: data.page ?? 1,
      limit: data.limit ?? items.length,
      totalPages: data.totalPages ?? Math.max(1, Math.ceil((data.total ?? items.length) / ((data.limit ?? items.length) || 1))),
    },
  }
}

const toApiCategory = (category) =>
  CATEGORIES.find((item) => item.id === String(category).toLowerCase())?.label || category

const toApiStatus = (status) => {
  const normalized = String(status || '').toLowerCase()
  return { open: 'Open', 'in progress': 'In Progress', resolved: 'Resolved' }[normalized] || status
}

// In-memory issue store for realistic prototype interaction
let issuesStore = [...MOCK_ISSUES]

export async function getIssues(params = {}) {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 220))
    let filtered = [...issuesStore]

    const {
      search,
      category,
      status,
      location,
      sortBy = 'newest',
      page = 1,
      limit = 9,
    } = params

    // Search query matching title, description, or location
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q) ||
          issue.location.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (category && category !== 'all') {
      filtered = filtered.filter((issue) => issue.category === category.toLowerCase())
    }

    // Status filter
    if (status && status !== 'all') {
      filtered = filtered.filter((issue) => issue.status.toLowerCase() === status.toLowerCase())
    }

    // Location filter
    if (location && location !== 'all') {
      filtered = filtered.filter((issue) =>
        issue.location.toLowerCase().includes(location.toLowerCase().trim())
      )
    }

    // Sorting
    if (sortBy === 'upvotes') {
      filtered.sort((a, b) => b.upvotes - a.upvotes)
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'recently_updated') {
      filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    } else {
      // Default: newest first
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    const total = filtered.length
    const pageNum = Math.max(1, Number(page) || 1)
    const limitNum = Math.max(1, Number(limit) || 9)
    const totalPages = Math.ceil(total / limitNum) || 1
    const startIndex = (pageNum - 1) * limitNum
    const paginatedIssues = filtered.slice(startIndex, startIndex + limitNum)

    // Summary stats for the discovery hero bar
    const stats = {
      total: issuesStore.length,
      open: issuesStore.filter((i) => i.status === 'Open').length,
      inProgress: issuesStore.filter((i) => i.status === 'In Progress').length,
      resolved: issuesStore.filter((i) => i.status === 'Resolved').length,
    }

    return {
      success: true,
      data: {
        issues: paginatedIssues,
        total,
        page: pageNum,
        totalPages,
        limit: limitNum,
        stats,
      },
    }
  }

  const { search, sortBy, ...filters } = params
  const query = new URLSearchParams()
  if (search) query.set('q', search)
  if (filters.category && filters.category !== 'all') query.set('category', toApiCategory(filters.category))
  if (filters.status && filters.status !== 'all') query.set('status', toApiStatus(filters.status))
  if (filters.location && filters.location !== 'all') query.set('location', filters.location)
  query.set('sort', sortBy || 'newest')
  query.set('page', String(filters.page || 1))
  query.set('limit', String(filters.limit || 10))

  return normalizeIssueData(await apiRequest(`/issues?${query}`))
}

export async function getIssue(id) {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 180))
    const issue = issuesStore.find((i) => i.id === Number(id))
    if (!issue) {
      const err = new Error('Issue not found')
      err.error = { code: 'NOT_FOUND', message: 'The requested campus issue was not found' }
      throw err
    }
    return {
      success: true,
      data: { issue },
    }
  }

  const response = await apiRequest(`/issues/${id}`)
  const data = response.data || {}
  const issue = data.issue || data
  return { ...response, data: { ...data, issue: normalizeIssue(issue) } }
}

export async function getMyIssues() {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 200))
    // Current student user ID is 1 (Tanjim Hossain)
    const currentUserId = getAuthUser()?.id
    const myIssues = issuesStore.filter((i) => i.reporter?.id === currentUserId)
    return {
      success: true,
      data: {
        issues: myIssues,
        total: myIssues.length,
      },
    }
  }

  return normalizeIssueData(await apiRequest('/my/issues'))
}

export async function createIssue(formData) {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 400))
    const newId = Math.max(...issuesStore.map((i) => i.id), 0) + 1
    const newIssue = {
      id: newId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      status: 'Open',
      upvotes: 0,
      hasUpvoted: false,
      imageUrl: formData.imageUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reporter: {
        id: getAuthUser()?.id ?? MOCK_USERS.student.id,
        name: getAuthUser()?.name ?? MOCK_USERS.student.name,
        role: getAuthUser()?.role ?? MOCK_USERS.student.role,
        avatar: getAuthUser()?.avatar ?? MOCK_USERS.student.avatar,
      },
      commentsCount: 0,
      comments: [],
      timeline: [
        {
          id: 1,
          status: 'Open',
          note: `Issue reported by ${MOCK_USERS.student.name}`,
          timestamp: new Date().toISOString(),
        },
      ],
    }
    issuesStore = [newIssue, ...issuesStore]
    return {
      success: true,
      data: { issue: newIssue },
    }
  }

  const body = new FormData()
  body.append('title', formData.title)
  body.append('description', formData.description)
  body.append('category', toApiCategory(formData.category))
  body.append('location', formData.location)
  if (formData.photo) body.append('photo', formData.photo)

  const response = await apiRequest('/issues', {
    method: 'POST',
    body,
  })
  const data = response.data || {}
  return { ...response, data: { ...data, issue: normalizeIssue(data.issue || data) } }
}

export async function updateIssue(id, updateData) {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 300))
    const index = issuesStore.findIndex((i) => i.id === Number(id))
    if (index === -1) throw new Error('Issue not found')

    issuesStore[index] = {
      ...issuesStore[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    return {
      success: true,
      data: { issue: issuesStore[index] },
    }
  }

  return apiRequest(`/issues/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...updateData, category: toApiCategory(updateData.category) }),
  })
}

export async function deleteIssue(id) {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 250))
    issuesStore = issuesStore.filter((i) => i.id !== Number(id))
    return {
      success: true,
      data: { id: Number(id) },
    }
  }

  return apiRequest(`/issues/${id}`, {
    method: 'DELETE',
  })
}

export async function toggleUpvote(id) {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 140))
    const index = issuesStore.findIndex((i) => i.id === Number(id))
    if (index === -1) throw new Error('Issue not found')

    const current = issuesStore[index]
    const hasUpvoted = !current.hasUpvoted
    const upvotes = hasUpvoted ? current.upvotes + 1 : Math.max(0, current.upvotes - 1)

    issuesStore[index] = {
      ...current,
      hasUpvoted,
      upvotes,
    }

    return {
      success: true,
      data: {
        id: Number(id),
        hasUpvoted,
        upvotes,
      },
    }
  }

  const response = await apiRequest(`/issues/${id}/upvote`, {
    method: 'POST',
  })
  return {
    ...response,
    data: {
      ...response.data,
      hasUpvoted: response.data?.upvoted ?? response.data?.hasUpvoted,
      upvotes: response.data?.upvoteCount ?? response.data?.upvotes,
    },
  }
}

export async function updateStatus(id, newStatus, note = '') {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 280))
    const index = issuesStore.findIndex((i) => i.id === Number(id))
    if (index === -1) throw new Error('Issue not found')

    const current = issuesStore[index]
    const timelineEntry = {
      id: (current.timeline?.length || 0) + 1,
      status: newStatus,
      note: note || `Status changed to ${newStatus} by Administrator`,
      timestamp: new Date().toISOString(),
    }

    issuesStore[index] = {
      ...current,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      timeline: [...(current.timeline || []), timelineEntry],
    }

    return {
      success: true,
      data: { issue: issuesStore[index] },
    }
  }

  const response = await apiRequest(`/issues/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus, note }),
  })
  const data = response.data || {}
  return { ...response, data: { ...data, issue: normalizeIssue(data.issue || data) } }
}
