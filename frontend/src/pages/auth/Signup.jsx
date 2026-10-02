import React, { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthShell } from '../../components/auth/AuthShell'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter'
import { RoleSelector } from '../../components/auth/RoleSelector'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { validateSignupForm } from '../../lib/validators'
import { LIMITS } from '../../lib/constants'
import { User, Mail, ShieldCheck } from 'lucide-react'

export function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    adminCode: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const inFlight = useRef(false) // blocks a second submit in the same instant

  const { signup } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // The page the student was heading to before being sent to log in (path + filters, for example /report?location=Library)
  const from = location.state?.from ? `${location.state.from.pathname}${location.state.from.search || ''}` : null

  const setField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (inFlight.current) return

    const validation = validateSignupForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    inFlight.current = true
    setIsLoading(true)
    try {
      const res = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        adminCode: formData.adminCode.trim(),
      })
      const user = res.data.user
      toast.success(`Welcome, ${user.name}! Your account is ready.`, 'Account created')
      navigate(user.role === 'admin' ? '/admin' : from || '/issues', { replace: true })
    } catch (err) {
      // Messages for single inputs (name, email, password, adminCode...) go under the matching input,
      // anything else (server down, too many attempts...) becomes a toast.
      const fieldErrors = err.error?.fields || {}
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors)
      } else {
        toast.error(err.error?.message || 'We could not create your account. Please try again.', 'Sign up failed')
      }
    } finally {
      inFlight.current = false
      setIsLoading(false)
    }
  }

  return (
    <AuthShell subtitle="Create your account">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create account</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1.5">It only takes a minute.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField id="name" label="Name" required error={errors.name}>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Your full name"
              maxLength={80}
              value={formData.name}
              disabled={isLoading}
              error={errors.name}
              onChange={(e) => setField('name', e.target.value)}
              leftIcon={<User className="w-4 h-4" aria-hidden="true" />}
            />
          </FormField>

          <FormField id="email" label="Email" required error={errors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              disabled={isLoading}
              error={errors.email}
              onChange={(e) => setField('email', e.target.value)}
              leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
            />
          </FormField>

          <FormField id="password" label="Password" required error={errors.password}>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder={`At least ${LIMITS.password.min} characters`}
              maxLength={LIMITS.password.max}
              value={formData.password}
              disabled={isLoading}
              error={errors.password}
              onChange={(e) => setField('password', e.target.value)}
            />
            <PasswordStrengthMeter password={formData.password} />
          </FormField>

          <RoleSelector
            role={formData.role}
            onChange={(role) => setField('role', role)}
            disabled={isLoading}
            error={errors.role}
          />

          {formData.role === 'admin' && (
            <FormField
              id="adminCode"
              label="Admin code"
              required
              error={errors.adminCode}
              helperText="Ask the campus team for the Staff / Admin sign-up code."
            >
              <Input
                id="adminCode"
                autoComplete="off"
                value={formData.adminCode}
                disabled={isLoading}
                error={errors.adminCode}
                onChange={(e) => setField('adminCode', e.target.value)}
                leftIcon={<ShieldCheck className="w-4 h-4" aria-hidden="true" />}
              />
            </FormField>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
            {isLoading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-700 dark:text-slate-300">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200 underline underline-offset-2"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
