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
import { getIssue, updateIssue } from '../../api/issues'
import { validateIssueForm } from '../../lib/validators'
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../lib/constants'
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
    location: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isForbidden, setIsForbidden] = useState(false)

  useEffect(() => {
    async function fetchIssue() {
      setIsLoading(true)
      try {
        const res = await getIssue(id)
        if (res.data?.issue) {
          const issue = res.data.issue
          if (String(issue.reporter?.id) !== String(user?.id)) {
            setIsForbidden(true)
            return
          }
          const { title, description, category, location } = issue
          setFormData({ title, description, category, location })
        }
      } catch {
        toast.error('Failed to load issue.')
        navigate('/issues')
      } finally {
        setIsLoading(false)
      }
    }
    fetchIssue()
  }, [id, navigate, toast, user?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validateIssueForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      await updateIssue(id, formData)
      toast.success('Issue updated successfully.')
      navigate(`/issues/${id}`)
    } catch {
      toast.error('Failed to update issue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <SkeletonDetail />
  }

  if (isForbidden) {
    return (
      <ErrorState
        type="forbidden"
        title="Only the reporter can edit this issue"
        message="You can still view the report and follow its progress."
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
        title="Edit Campus Issue"
        description="Update details or correct location data for this maintenance ticket."
      />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField id="title" label="Issue Title" required error={errors.title}>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField id="category" label="Category" required error={errors.category}>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField id="location" label="Location" required error={errors.location}>
                <Input
                  id="location"
                  list="location-options"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <datalist id="location-options">
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </FormField>
            </div>

            <FormField id="description" label="Description" required error={errors.description}>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </FormField>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/issues/${id}`)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
