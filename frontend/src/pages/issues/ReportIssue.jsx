import React, { useState, useEffect, useRef } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardContent } from '../../components/ui/Card'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { DuplicateWarning } from '../../components/issues/DuplicateWarning'
import { LocationFields } from '../../components/issues/LocationFields'
import { createIssue } from '../../api/issues'
import { getSimilarIssues } from '../../api/similar'
import { validateIssueForm, validateImageFile } from '../../lib/validators'
import { joinLocation, splitLocation } from '../../lib/formatters'
import { CATEGORIES, CAMPUS_LOCATIONS, LIMITS, MAX_SPOT_LENGTH } from '../../lib/constants'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../hooks/useAuth'
import { Upload, X, Send } from 'lucide-react'

const DUPLICATE_CHECK_DELAY_MS = 400

// ?location=Library or ?location=Library, 2nd floor (from a QR code) -> the dropdown and spot box start filled in.
// An unknown building is ignored, so a wrong link can never create a location outside the list.
function readLocationFromLink(searchParams) {
  const { building, spot } = splitLocation(searchParams.get('location') || '')
  const match = CAMPUS_LOCATIONS.find((name) => name.toLowerCase() === building.toLowerCase())
  return match ? { building: match, spot: spot.slice(0, MAX_SPOT_LENGTH) } : { building: '', spot: '' }
}

export function ReportIssue() {
  const navigate = useNavigate()
  const toast = useToast()
  const { isAdmin } = useAuth()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState(() => ({
    title: '',
    category: '',
    description: '',
    ...readLocationFromLink(searchParams),
  }))
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const inFlight = useRef(false) // blocks a second submit in the same instant

  // Duplicate warning: similar open issues in the same category and building
  const [similarIssues, setSimilarIssues] = useState([])
  const [warningDismissed, setWarningDismissed] = useState(false)

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  // Ask the backend for possible duplicates 400 ms after the last keystroke.
  // It needs a title of 5+ characters, a category and a building. Any change brings the warning back.
  const title = formData.title.trim()
  const { category, building } = formData
  useEffect(() => {
    setWarningDismissed(false)

    if (title.length < LIMITS.title.min || !category || !building) {
      setSimilarIssues([])
      return
    }

    let isCurrent = true
    const timer = setTimeout(async () => {
      try {
        const res = await getSimilarIssues({ title, category, building })
        if (isCurrent) setSimilarIssues(res.data)
      } catch {
        if (isCurrent) setSimilarIssues([]) // the warning is only a hint, so a failed check stays silent
      }
    }, DUPLICATE_CHECK_DELAY_MS)

    return () => {
      isCurrent = false
      clearTimeout(timer)
    }
  }, [title, category, building])

  // Admins do not report issues (the backend would accept it, the UI keeps the roles apart)
  if (isAdmin) return <Navigate to="/admin" replace />

  const setField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: null }))
  }

  const processImageFile = (file) => {
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setImageError(validation.error)
      setSelectedFile(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setImageError(null)
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
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
    if (fileInputRef.current) fileInputRef.current.value = '' // so the same file can be chosen again
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (inFlight.current) return

    const validation = validateIssueForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    inFlight.current = true
    setIsSubmitting(true)

    try {
      const res = await createIssue({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: joinLocation(formData.building, formData.spot),
        photo: selectedFile,
      })
      toast.success('Your issue has been reported.')
      navigate(`/issues/${res.data.id}`)
    } catch (error) {
      const fieldErrors = error.error?.fields || {}
      if (fieldErrors.photo) setImageError(fieldErrors.photo)
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors)
      } else {
        toast.error(error.error?.message || "We couldn't submit your issue. Please try again.")
      }
    } finally {
      inFlight.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Campus Issues', href: '/issues' },
          { label: 'Report an issue' },
        ]}
        title="Report an issue"
        description="Tell us what is broken and where, so it can be fixed quickly."
      />

      {/* Soft duplicate warning: it never stops you from reporting */}
      {!warningDismissed && (
        <DuplicateWarning issues={similarIssues} onDismiss={() => setWarningDismissed(true)} />
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField
              id="title"
              label="Title"
              required
              error={errors.title}
              helperText={`A short summary, ${LIMITS.title.min}-${LIMITS.title.max} characters.`}
            >
              <Input
                id="title"
                placeholder="What needs fixing?"
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
              onBuildingChange={(value) => {
                setField('building', value)
                setErrors((current) => ({ ...current, location: null })) // the dropdown's error is stored as "location"
              }}
              onSpotChange={(value) => setField('spot', value)}
              errors={errors}
              disabled={isSubmitting}
            />

            <FormField
              id="description"
              label="Description"
              required
              error={errors.description}
              helperText={`What is wrong, and how bad is it? At least ${LIMITS.description.min} characters.`}
            >
              <Textarea
                id="description"
                rows={5}
                maxLength={LIMITS.description.max}
                placeholder="Describe the problem…"
                value={formData.description}
                disabled={isSubmitting}
                error={errors.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </FormField>

            {/* Photo (optional) */}
            <div className="space-y-2 pt-1">
              <span id="photo-label" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Photo (optional)
              </span>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 max-h-64">
                  <img src={imagePreview} alt="Preview of the photo you selected" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                    aria-label="Remove photo"
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageDrop}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-900/40 transition-colors focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/40"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Click or drag a photo here
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    JPG, PNG or WEBP, up to 2 MB
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-labelledby="photo-label"
                    disabled={isSubmitting}
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              {imageError && (
                <p role="alert" className="text-xs text-red-700 dark:text-red-400 font-medium">
                  {imageError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => navigate('/issues')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" aria-hidden="true" />}
              >
                {isSubmitting ? 'Submitting…' : 'Submit report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
