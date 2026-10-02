import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardContent } from '../../components/ui/Card'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { DuplicateWarning } from '../../components/issues/DuplicateWarning'
import { createIssue } from '../../api/issues'
import { getSimilarIssues } from '../../api/similar'
import { validateIssueForm, validateImageFile } from '../../lib/validators'
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../lib/constants'
import { useToast } from '../../hooks/useToast'
import { Upload, X, Send } from 'lucide-react'

export function ReportIssue() {
  const navigate = useNavigate()
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Duplicate detection state
  const [similarIssue, setSimilarIssue] = useState(null)
  const [dismissDuplicate, setDismissDuplicate] = useState(false)

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  // Smart duplicate check debounce
  useEffect(() => {
    if (dismissDuplicate) return
    if (!formData.title || formData.title.length < 4) {
      setSimilarIssue(null)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await getSimilarIssues({
          title: formData.title,
          location: formData.location,
          category: formData.category,
        })
        if (res.data?.similar?.length > 0) {
          setSimilarIssue(res.data.similar[0])
        } else {
          setSimilarIssue(null)
        }
      } catch {
        setSimilarIssue(null)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [formData.title, formData.location, formData.category, dismissDuplicate])

  const processImageFile = (file) => {
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setImageError(validation.error)
      setSelectedFile(null)
      setImagePreview(null)
      return
    }

    setImageError(null)
    setSelectedFile(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  const handleImageChange = (e) => processImageFile(e.target.files?.[0])

  const handleImageDrop = (e) => {
    e.preventDefault()
    processImageFile(e.dataTransfer.files?.[0])
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setImageError(null)
  }

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
      const payload = {
        ...formData,
        imageUrl: imagePreview || null,
        photo: selectedFile,
      }
      const res = await createIssue(payload)
      toast.success('Your campus issue has been submitted for triage.')
      navigate(`/issues/${res.data.issue.id}`)
    } catch (error) {
      const fieldErrors = error.error?.fields || {}
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors)
      } else {
        toast.error(error.error?.message || "We couldn't submit your issue. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Campus Issues', href: '/issues' },
          { label: 'Report New Issue' },
        ]}
        title="Report a Campus Problem"
        description="Help university facilities resolve maintenance issues quickly by providing clear details and exact room or building locations."
      />

      {/* Duplicate warning soft alert */}
      {similarIssue && !dismissDuplicate && (
        <DuplicateWarning
          similarIssue={similarIssue}
          onDismiss={() => setDismissDuplicate(true)}
        />
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="title"
              label="Issue Title"
              required
              error={errors.title}
              helperText="Brief summary of the defect (e.g. 'Ceiling fan oscillating arm broken in Room 214')"
            >
              <Input
                id="title"
                placeholder="What needs fixing?"
                maxLength={120}
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
                      {c.label} — {c.description}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                id="location"
                label="Location"
                required
                error={errors.location}
                helperText="Specify building, floor, room number or landmark"
              >
                <Input
                  id="location"
                  list="campus-locations-list"
                  placeholder="e.g. Hall 2, Room 214"
                  maxLength={120}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <datalist id="campus-locations-list">
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </FormField>
            </div>

            <FormField
              id="description"
              label="Detailed Description"
              required
              error={errors.description}
              helperText="Describe symptoms, safety risks, or when the problem started."
            >
              <Textarea
                id="description"
                rows={5}
                maxLength={2000}
                placeholder="Provide as much context as possible to help dispatch the correct maintenance technician..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </FormField>

            {/* Photo dropzone */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                Attach Photo (Optional)
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 max-h-64">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageDrop}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Click or drag photo here
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    JPG, PNG or WEBP (Max 2 MB)
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              {imageError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {imageError}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/issues')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Issue Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
