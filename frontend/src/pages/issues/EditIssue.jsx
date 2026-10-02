import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardContent } from '../../components/ui/Card'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { ErrorState } from '../../components/ui/ErrorState'
import { SkeletonDetail } from '../../components/ui/Skeleton'
import { LocationFields } from '../../components/issues/LocationFields'
import { getIssue, updateIssue } from '../../api/issues'
import { validateIssueForm } from '../../lib/validators'
import { joinLocation, splitLocation } from '../../lib/formatters'
import { CATEGORIES, LIMITS } from '../../lib/constants'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../hooks/useAuth'
import { Save, ArrowLeft } from 'lucide-react'

export function EditIssue() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    building: '',
    spot: '',
  })
  const [savedBuilding, setSavedBuilding] = useState('') // the building as saved (may be an old one that is not in the list)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [blocked, setBlocked] = useState(null) // { title, message } when this user may not edit this issue
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let isCurrent = true
    setIsLoading(true)
    setLoadError(null)
    setBlocked(null)

    getIssue(id)
      .then((res) => {
        if (!isCurrent) return
        const issue = res.data
        // Same rules as the backend: only the reporter, and only while the issue is Open
        if (issue.createdBy.id !== user?.id) {
          setBlocked({
            title: 'Only the reporter can edit this issue',
            message: 'You can still view the report and follow its progress.',
          })
          return
        }
        if (issue.status !== 'Open') {
          setBlocked({
            title: 'This issue can no longer be edited',
            message: `Only open issues can be edited. This one is ${issue.status}.`,
          })
          return
        }
        const { building, spot } = splitLocation(issue.location)
        setSavedBuilding(building)
        setFormData({
          title: issue.title,
          description: issue.description,
          category: issue.category,
          building,
          spot,
        })
      })
      .catch((err) => {
        if (isCurrent) setLoadError(err.error?.message || 'Failed to load this issue.')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [id, user?.id])

  const setField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    const validation = validateIssueForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      await updateIssue(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: joinLocation(formData.building, formData.spot),
      })
      toast.success('Issue updated.')
      navigate(`/issues/${id}`)
    } catch (err) {
      const fieldErrors = err.error?.fields || {}
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors)
      } else {
        toast.error(err.error?.message || 'Failed to update the issue.')
        // 403 / 409: the issue is no longer yours or no longer Open, so there is nothing left to edit here
        if (err.response?.status === 403 || err.response?.status === 409) navigate(`/issues/${id}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <SkeletonDetail />
  }

  if (loadError) {
    return (
      <ErrorState
        type="404"
        title="Could not open this issue"
        message={loadError}
        action={<Button size="sm" onClick={() => navigate('/issues')}>Back to Issues</Button>}
      />
    )
  }

  if (blocked) {
    return (
      <ErrorState
        type="forbidden"
        title={blocked.title}
        message={blocked.message}
        action={<Button size="sm" onClick={() => navigate(`/issues/${id}`)}>Back to Issue</Button>}
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Campus Issues', href: '/issues' },
          { label: `Issue #${id}`, href: `/issues/${id}` },
          { label: 'Edit' },
        ]}
        title="Edit issue"
        description="You can edit your report while it is still Open."
      />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField id="title" label="Title" required error={errors.title}>
              <Input
                id="title"
                maxLength={LIMITS.title.max}
                value={formData.title}
                disabled={isSubmitting}
                error={errors.title}
                onChange={(e) => setField('title', e.target.value)}
              />
            </FormField>

            <FormField id="category" label="Category" required error={errors.category}>
              <Select
                id="category"
                value={formData.category}
                disabled={isSubmitting}
                error={errors.category}
                onChange={(e) => setField('category', e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <LocationFields
              building={formData.building}
              spot={formData.spot}
              extraBuilding={savedBuilding}
              onBuildingChange={(value) => {
                setField('building', value)
                setErrors((current) => ({ ...current, location: null })) // the dropdown's error is stored as "location"
              }}
              onSpotChange={(value) => setField('spot', value)}
              errors={errors}
              disabled={isSubmitting}
            />

            <FormField id="description" label="Description" required error={errors.description}>
              <Textarea
                id="description"
                rows={5}
                maxLength={LIMITS.description.max}
                value={formData.description}
                disabled={isSubmitting}
                error={errors.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </FormField>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => navigate(`/issues/${id}`)}
                leftIcon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                leftIcon={<Save className="w-4 h-4" aria-hidden="true" />}
              >
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
