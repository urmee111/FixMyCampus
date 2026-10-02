import React from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../navigation/ThemeToggle'
import { CheckCircle2 } from 'lucide-react'

const BULLETS = [
  'Report a problem in under a minute',
  'Upvote the issues that matter most',
  'Follow every status change',
]

function LogoMark({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
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

// Login and signup frame: two columns on desktop (logo + headline + 3 bullets | the form), one column on phones.
export function AuthShell({ children, subtitle = 'Sign in to continue' }) {
  return (
    <div className="min-h-screen w-full flex bg-surface-light-canvas dark:bg-surface-dark-canvas transition-colors duration-200">
      {/* Left column (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-800 text-white flex-col justify-between p-12">
        <Link to="/" className="inline-flex items-center gap-3 self-start rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <LogoMark />
          </div>
          <span className="text-xl font-bold tracking-tight">FixMyCampus</span>
        </Link>

        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Report it. Upvote it. Watch it get fixed.
          </h1>
          <ul className="space-y-3">
            {BULLETS.map((text) => (
              <li key={text} className="flex items-center gap-3 text-base text-white">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-white" aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <span aria-hidden="true" />
      </div>

      {/* Right column: the form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12">
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
          <Link to="/" className="flex items-center gap-2 lg:invisible rounded-xl">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <LogoMark className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              FixMy<span className="text-brand-600 dark:text-brand-400">Campus</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <section aria-label={subtitle} className="w-full max-w-md mx-auto my-auto animate-slide-up">
          {children}
        </section>
      </div>
    </div>
  )
}
