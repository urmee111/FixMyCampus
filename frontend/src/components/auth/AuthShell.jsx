import React from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../navigation/ThemeToggle'
import { CheckCircle2, Zap, Clock } from 'lucide-react'

export function AuthShell({ children, subtitle = 'Sign in to continue' }) {
  return (
    <div className="min-h-screen w-full flex bg-surface-light-canvas dark:bg-surface-dark-canvas transition-colors duration-200">
      {/* Left Column: Editorial Campus Infrastructure Story (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
        {/* Background architectural grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Ambient subtle glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/issues" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/40 group-hover:scale-105 transition-transform duration-150">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <polyline points="9 9 11 11 15 7" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                FixMy<span className="text-brand-400">Campus</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Operations Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Narrative & Visual Story */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
            </span>
            Campus Operations Active
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            A better way to get campus problems fixed.
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Report infrastructure faults, track contractor updates transparently, and upvote urgent
            issues to keep our dorms, classrooms, and labs functioning at their best.
          </p>

          {/* Micro Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-brand-300 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Electrical • Room 214</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                In Progress
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium line-clamp-1">
              Ceiling fan oscillating arm replaced & calibrated by duty technician
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Response time: 45 mins
              </span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
          </div>

          {/* Features pills */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transparent issue timelines</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct facility dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Student upvote prioritization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Duplicate report detection</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-6">
          <span>University Facilities & Maintenance</span>
          <span>SLA Target: &lt; 28 Hours</span>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        {/* Top bar with Mobile Brand & Theme Toggle */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
          <Link to="/issues" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <polyline points="9 9 11 11 15 7" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              FixMy<span className="text-brand-600 dark:text-brand-400">Campus</span>
            </span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Center Auth Form */}
        <section aria-label={subtitle} className="w-full max-w-md mx-auto my-auto animate-slide-up">
          {children}
        </section>

        {/* Bottom copyright */}
        <div className="w-full max-w-md mx-auto text-center text-xs text-slate-400 dark:text-slate-500 mt-8 pt-4">
          FixMyCampus • Enterprise Campus Operations
        </div>
      </div>
    </div>
  )
}
