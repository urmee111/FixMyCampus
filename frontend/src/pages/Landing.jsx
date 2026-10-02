import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Zap,
  Droplets,
  Sparkles,
  Armchair,
  Wifi,
  Wrench,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  PlusCircle,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PriorityBadge } from '../components/ui/PriorityBadge'
import { useAuth } from '../hooks/useAuth'

export function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const categories = [
    { id: 'electrical', label: 'Electrical', icon: Zap, count: '6 active', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
    { id: 'water', label: 'Water & Plumbing', icon: Droplets, count: '3 active', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800' },
    { id: 'cleanliness', label: 'Cleanliness', icon: Sparkles, count: '2 active', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
    { id: 'furniture', label: 'Furniture', icon: Armchair, count: '2 active', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' },
    { id: 'internet', label: 'Wi-Fi & Network', icon: Wifi, count: '2 active', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
    { id: 'other', label: 'Facility Defects', icon: Wrench, count: '3 active', color: 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
  ]

  const workflowSteps = [
    {
      step: '01',
      title: 'Report with Details',
      desc: 'Spot a broken fan, leak, or damaged desk? Submit location, description, and an optional photo in 30 seconds.',
    },
    {
      step: '02',
      title: 'Community Prioritization',
      desc: 'Fellow students upvote urgent issues. Reports with 10+ upvotes escalate automatically to High Priority.',
    },
    {
      step: '03',
      title: 'Transparent Resolution',
      desc: 'Facilities teams dispatch contractors and update progress in real time across the live status timeline.',
    },
  ]

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative text-center max-w-3xl mx-auto space-y-6 pt-4">
        {/* Live operational badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
          </span>
          <span>Campus Maintenance Platform • Live Triage Active</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          See the problem. <br className="hidden sm:inline" />
          <span className="text-brand-600 dark:text-brand-400">Raise your voice.</span> <br />
          Track the fix.
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          FixMyCampus bridges students and campus facilities. Report broken fixtures, upvote urgent
          defects, and track contractor repairs until verified complete.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/report')}
            leftIcon={<PlusCircle className="w-5 h-5" />}
            className="w-full sm:w-auto shadow-md shadow-brand-600/25"
          >
            Report an Issue
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/issues')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Browse Campus Issues
          </Button>
        </div>

        {/* Live Stats summary pill strip */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">18</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active Reports</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">9</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Open Tickets</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">5</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">In Progress</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">74.5%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Resolution Rate</p>
          </div>
        </div>
      </section>

      {/* Interactive Micro Showcase Card */}
      <section className="max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Live Defect Ticket Preview
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Ceiling fan oscillating arm broken in Room 214
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hall 2 • Reported 2 hours ago by Tanjim Hossain
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status="Open" size="md" />
              <PriorityBadge upvotes={42} size="md" />
            </div>
          </div>

          <div className="py-4 space-y-3">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              "The ceiling fan directly above the second row has a bent bracket. It makes loud clicking
              noises and wobbles violently when set to speed 3. Poses a direct safety hazard for students
              sitting underneath."
            </p>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                Staff Assigned: Electrical technician team dispatched for 2:30 PM inspection
              </span>
              <span className="font-bold text-[11px] uppercase tracking-wider text-amber-700">Ticket #EL-409</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>42 students upvoted this ticket</span>
            </div>
            <Link
              to="/issues/1"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Inspect full ticket</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Defect Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Dedicated triage routing ensures issues reach the exact maintenance department responsible.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <Link
                key={idx}
                to={`/issues?category=${cat.id}`}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-card-hover transition-all group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {cat.count}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {cat.label}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Click to browse active reports
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* How it works 3-step section */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Engineered Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            From Defect to Verified Fix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((w, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3 relative"
            >
              <span className="text-3xl font-black text-brand-600/30 dark:text-brand-400/20 font-mono">
                {w.step}
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {w.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden border border-slate-800 shadow-xl space-y-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight relative z-10">
          Ready to improve your campus infrastructure?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto relative z-10 leading-relaxed">
          Sign in with your campus identity or test the platform immediately using the pre-loaded 1-click
          demo accounts.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/issues')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Issues Registry
          </Button>
          {!isAuthenticated && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="text-white border-slate-700 hover:bg-slate-800"
            >
              Sign In to Your Account
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
