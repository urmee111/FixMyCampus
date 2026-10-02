import React from 'react'
import { Link } from 'react-router-dom'
import {
  Zap,
  Droplets,
  Sparkles,
  Armchair,
  Wifi,
  Wrench,
  ArrowRight,
  PlusCircle,
  Camera,
  ChevronUp,
  ListChecks,
} from 'lucide-react'
import { ButtonLink } from '../components/ui/Button'
import { ThemeToggle } from '../components/navigation/ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES } from '../lib/constants'

const CATEGORY_ICONS = {
  electrical: Zap,
  water: Droplets,
  cleanliness: Sparkles,
  furniture: Armchair,
  internet: Wifi,
  other: Wrench,
}

const STEPS = [
  {
    icon: Camera,
    title: 'Report it',
    text: 'Say what is broken, pick the location and add a photo if you like.',
  },
  {
    icon: ChevronUp,
    title: 'Upvote it',
    text: 'Students upvote what affects them. 5 upvotes make an issue Medium priority, 10 make it High.',
  },
  {
    icon: ListChecks,
    title: 'Follow it',
    text: 'Staff update the status and leave notes. You see every change on the timeline.',
  },
]

function LogoMark() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <polyline points="9 9 11 11 15 7" />
    </svg>
  )
}

export function Landing() {
  const { isAuthenticated, isAdmin } = useAuth()

  // Where each button goes. Logged out: everything that needs an account goes to the login page first
  // (after logging in you come back to where you wanted to go).
  const reportTo = isAuthenticated ? '/report' : '/login'
  const browseTo = isAuthenticated ? '/issues' : '/login'
  const afterLogin = (pathname) => (isAuthenticated ? undefined : { from: { pathname, search: '' } })
  const homeTo = isAdmin ? '/admin' : '/issues'

  return (
    <div className="min-h-screen bg-surface-light-canvas dark:bg-surface-dark-canvas">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 rounded-xl">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <LogoMark />
            </div>
            <span className="hidden min-[420px]:inline text-base font-bold tracking-tight text-slate-900 dark:text-white">
              FixMy<span className="text-brand-600 dark:text-brand-400">Campus</span>
            </span>
            <span className="sr-only min-[420px]:hidden">FixMyCampus home</span>
          </Link>

          <nav aria-label="Account" className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <ButtonLink to={homeTo} size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}>
                {isAdmin ? 'Dashboard' : 'Open app'}
              </ButtonLink>
            ) : (
              <>
                <ButtonLink to="/login" variant="outline" size="sm">
                  Log in
                </ButtonLink>
                <ButtonLink to="/signup" size="sm">
                  Get started
                </ButtonLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Report campus problems.{' '}
            <span className="text-brand-600 dark:text-brand-400">Watch them get fixed.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            FixMyCampus connects students and campus staff. Report an issue, upvote the ones that matter,
            and follow every step until it is resolved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isAdmin ? (
              <ButtonLink
                to="/admin"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              >
                Open dashboard
              </ButtonLink>
            ) : (
              <>
                <ButtonLink
                  to={reportTo}
                  state={afterLogin('/report')}
                  size="lg"
                  className="w-full sm:w-auto"
                  leftIcon={<PlusCircle className="w-5 h-5" aria-hidden="true" />}
                >
                  Report an issue
                </ButtonLink>
                <ButtonLink
                  to={browseTo}
                  state={afterLogin('/issues')}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                >
                  Browse issues
                </ButtonLink>
              </>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 space-y-8" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-white">
            How it works
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <li
                  key={step.title}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Step {index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{step.text}</p>
                </li>
              )
            })}
          </ol>
        </section>

        {/* Categories */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 space-y-6" aria-labelledby="categories-heading">
          <div className="text-center space-y-2">
            <h2 id="categories-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              What can you report?
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">Pick a category to see its issues.</p>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id]
              return (
                <li key={cat.id}>
                  <Link
                    to={isAuthenticated ? `/issues?category=${encodeURIComponent(cat.label)}` : '/login'}
                    state={isAuthenticated ? undefined : { from: { pathname: '/issues', search: `?category=${encodeURIComponent(cat.label)}` } }}
                    className="h-full flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-card-hover transition-all group"
                  >
                    <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center group-hover:bg-brand-50 dark:group-hover:bg-brand-950/60 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-base font-bold text-slate-900 dark:text-white">{cat.label}</span>
                      <span className="block text-sm text-slate-700 dark:text-slate-300 mt-0.5">{cat.description}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Final call to action */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-3xl bg-brand-800 text-white text-center p-8 sm:p-12 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isAuthenticated ? 'Welcome back' : 'Ready to get your campus fixed?'}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAuthenticated ? (
                <ButtonLink
                  to={homeTo}
                  size="lg"
                  className="w-full sm:w-auto bg-white text-brand-800 hover:bg-slate-100 active:bg-slate-200"
                  rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                >
                  {isAdmin ? 'Open dashboard' : 'Open app'}
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink
                    to="/signup"
                    size="lg"
                    className="w-full sm:w-auto bg-white text-brand-800 hover:bg-slate-100 active:bg-slate-200"
                  >
                    Get started
                  </ButtonLink>
                  <ButtonLink
                    to="/login"
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-white border-white/70 hover:bg-white/10 active:bg-white/20"
                  >
                    Log in
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
        FixMyCampus
      </footer>
    </div>
  )
}
