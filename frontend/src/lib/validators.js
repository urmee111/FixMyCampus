import { MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_FORMATS, MAX_SPOT_LENGTH, LIMITS } from './constants'

// These checks are never stricter than the backend (zod) rules: the server has the last word,
// and its messages are shown under the matching input when it still says no.

// The issue form has: title, category, building (from the dropdown), spot (optional), description.
// Errors for the location dropdown are stored under "location" (the same key the backend uses).
export function validateIssueForm(formData) {
  const errors = {}

  const title = formData.title?.trim() || ''
  if (title.length === 0) {
    errors.title = 'Title is required'
  } else if (title.length < LIMITS.title.min) {
    errors.title = `Title must be at least ${LIMITS.title.min} characters`
  } else if (title.length > LIMITS.title.max) {
    errors.title = `Title must be at most ${LIMITS.title.max} characters`
  }

  const description = formData.description?.trim() || ''
  if (description.length === 0) {
    errors.description = 'Description is required'
  } else if (description.length < LIMITS.description.min) {
    errors.description = `Description must be at least ${LIMITS.description.min} characters`
  } else if (description.length > LIMITS.description.max) {
    errors.description = `Description must be at most ${LIMITS.description.max} characters`
  }

  if (!formData.category) {
    errors.category = 'Please select a category'
  }

  if (!formData.building) {
    errors.location = 'Please select a location'
  }

  if ((formData.spot || '').trim().length > MAX_SPOT_LENGTH) {
    errors.spot = `Spot / details must be at most ${MAX_SPOT_LENGTH} characters`
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateImageFile(file) {
  if (!file) return { isValid: true }

  if (!ALLOWED_IMAGE_FORMATS.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPG, PNG, or WEBP images are supported',
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'Image size must be 2 MB or smaller',
    }
  }

  return { isValid: true }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // any normal email address: no campus-domain rule

export function validateLoginForm(formData) {
  const errors = {}
  if (!formData.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  // Login only needs a password (the server compares it). The 6-character rule is for new accounts.
  if (!formData.password) {
    errors.password = 'Password is required'
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateSignupForm(formData) {
  const { errors } = validateLoginForm(formData)

  const name = formData.name?.trim() || ''
  if (name.length === 0) {
    errors.name = 'Name is required'
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!formData.password) {
    errors.password = 'Password is required'
  } else if (formData.password.length < LIMITS.password.min) {
    errors.password = `Password must be at least ${LIMITS.password.min} characters`
  } else if (formData.password.length > LIMITS.password.max) {
    errors.password = `Password must be at most ${LIMITS.password.max} characters`
  }

  if (formData.role === 'admin' && !formData.adminCode?.trim()) {
    errors.adminCode = 'Admin code is required to sign up as Staff / Admin'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
