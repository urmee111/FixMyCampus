import { MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_FORMATS } from './constants'

export function validateIssueForm(formData) {
  const errors = {}

  if (!formData.title || formData.title.trim().length === 0) {
    errors.title = 'Title is required'
  } else if (formData.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long'
  } else if (formData.title.trim().length > 120) {
    errors.title = 'Title cannot exceed 120 characters'
  }

  if (!formData.description || formData.description.trim().length === 0) {
    errors.description = 'Description is required'
  } else if (formData.description.trim().length < 10) {
    errors.description = 'Please provide more detail (at least 10 characters)'
  }

  if (!formData.category) {
    errors.category = 'Please select a category'
  }

  if (!formData.location || formData.location.trim().length === 0) {
    errors.location = 'Location is required'
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
      error: 'Image size must be less than 2 MB',
    }
  }

  return { isValid: true }
}

export function validateLoginForm(formData) {
  const errors = {}
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid campus email address'
  }
  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateSignupForm(formData) {
  const { errors } = validateLoginForm(formData)
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Full name is required (at least 2 characters)'
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
