import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthShell } from '../../components/auth/AuthShell'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { validateLoginForm } from '../../lib/validators'
import { Mail } from 'lucide-react'

export function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // Where the user was heading before being sent to the login page (path + filters, for example /issues?q=fan)
  const from = location.state?.from ? `${location.state.from.pathname}${location.state.from.search || ''}` : null

  const setField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLoading) return

    const validation = validateLoginForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    setIsLoading(true)
    try {
      const res = await login({ email: formData.email.trim(), password: formData.password })
      const user = res.data.user
      toast.success(`Welcome back, ${user.name}!`, 'Signed in')

      if (from) {
        navigate(from, { replace: true })
      } else {
        navigate(user.role === 'admin' ? '/admin' : '/issues', { replace: true })
      }
    } catch (err) {
      const fieldErrors = err.error?.fields || {}
      if (Object.keys(fieldErrors).length) setErrors(fieldErrors)
      toast.error(err.error?.message || "We couldn't sign you in. Please try again.", 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell subtitle="Log in">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Log in</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1.5">
            Welcome back. Enter your details to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              autoComplete="current-password"
              placeholder="Your password"
              value={formData.password}
              disabled={isLoading}
              error={errors.password}
              onChange={(e) => setField('password', e.target.value)}
            />
          </FormField>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-700 dark:text-slate-300">
          New here?{' '}
          <Link
            to="/signup"
            className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200 underline underline-offset-2"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
