import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../../components/auth/AuthShell'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter'
import { RoleSelector } from '../../components/auth/RoleSelector'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { User, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react'
import { USE_MOCK_API } from '../../api/client'

export function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    adminCode: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signup } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (at least 2 characters).'
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Please enter your campus email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid university email address.'
    }

    if (!formData.password) {
      newErrors.password = 'Please create a password.'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role.'
    }
    if (formData.role === 'admin' && !USE_MOCK_API && !formData.adminCode.trim()) {
      newErrors.adminCode = 'Enter the facilities admin signup code.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    if (!validate()) return

    setIsLoading(true)
    try {
      const res = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        password: formData.password,
        adminCode: formData.adminCode.trim(),
      })

      const loggedUser = res.data?.user
      toast.success(`Account created! Welcome, ${loggedUser?.name || 'User'}!`, 'Registered')

      if (loggedUser?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/issues', { replace: true })
      }
    } catch (err) {
      setErrors(err.error?.fields || {})
      setApiError(
        err.error?.message || 'We could not create your account. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell subtitle="Create your campus account">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Register with your university profile to report campus defects and prioritize maintenance.
          </p>
        </div>

        {apiError && (
          <div
            role="alert"
            className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-slide-down"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <p className="font-medium leading-relaxed">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* Role selection */}
          <RoleSelector
            role={formData.role}
            onChange={(role) => setFormData({ ...formData, role })}
          />

          {formData.role === 'admin' && !USE_MOCK_API && (
            <FormField id="adminCode" label="Facilities admin signup code" required error={errors.adminCode}>
              <Input
                id="adminCode"
                autoComplete="off"
                value={formData.adminCode}
                disabled={isLoading}
                error={errors.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              />
            </FormField>
          )}

          <FormField
            id="name"
            label="Full Name"
            required
            error={errors.name}
          >
            <Input
              id="name"
              placeholder="e.g. Aisha Rahman"
              value={formData.name}
              disabled={isLoading}
              error={errors.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: null })
              }}
              leftIcon={<User className="w-4 h-4" />}
            />
          </FormField>

          <FormField
            id="email"
            label="Campus Email Address"
            required
            error={errors.email}
          >
            <Input
              id="email"
              type="email"
              placeholder="e.g. aisha.rahman@campus.edu"
              value={formData.email}
              disabled={isLoading}
              error={errors.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: null })
              }}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </FormField>

          <FormField
            id="password"
            label="Password"
            required
            error={errors.password}
          >
            <PasswordInput
              id="password"
              placeholder="Create a strong password"
              value={formData.password}
              disabled={isLoading}
              error={errors.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                if (errors.password) setErrors({ ...errors, password: null })
              }}
            />
            <PasswordStrengthMeter password={formData.password} />
          </FormField>

          <FormField
            id="confirmPassword"
            label="Confirm Password"
            required
            error={errors.confirmPassword}
          >
            <PasswordInput
              id="confirmPassword"
              placeholder="Re-type your password"
              value={formData.confirmPassword}
              disabled={isLoading}
              error={errors.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value })
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null })
              }}
            />
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            disabled={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  )
}
