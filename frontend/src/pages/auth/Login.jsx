import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthShell } from '../../components/auth/AuthShell'
import { FormField } from '../../components/ui/FormField'
import { Input } from '../../components/ui/Input'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react'

export function Login() {
  const [formData, setFormData] = useState({
    email: 'tanjim@campus.edu',
    password: 'password123',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || null

  const validate = () => {
    const newErrors = {}
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password.'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
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
      const res = await login({
        email: formData.email.trim(),
        password: formData.password,
      })

      const loggedUser = res.data?.user
      toast.success(`Welcome back, ${loggedUser?.name || 'User'}!`, 'Signed In')

      // Role-based redirection
      if (from) {
        navigate(from, { replace: true })
      } else if (loggedUser?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/issues', { replace: true })
      }
    } catch (err) {
      setApiError(
        err.error?.message ||
          "We couldn't sign you in. Please check your campus email and password."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickDemo = (email) => {
    setFormData({ email, password: 'password123' })
    setErrors({})
    setApiError('')
  }

  return (
    <AuthShell subtitle="Sign in to continue">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Sign in with your university credentials to track maintenance tickets or report new defects.
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

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField
            id="email"
            label="Campus Email Address"
            required
            error={errors.email}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. tanjim@campus.edu"
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
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              disabled={isLoading}
              error={errors.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                if (errors.password) setErrors({ ...errors, password: null })
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Quick Demo Credentials Panel */}
          <div className="pt-5 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Accounts
              </span>
              <span className="text-[10px] text-slate-400">Ready to test</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('tanjim@campus.edu')}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    Student Demo
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">tanjim@campus.edu</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin.estate@campus.edu')}
                className="flex items-center gap-2 p-2 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-amber-900 dark:text-amber-200 truncate">
                    Admin Demo
                  </p>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 truncate">
                    admin.estate@...
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
            Don't have a campus account?{' '}
            <Link
              to="/signup"
              className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  )
}
