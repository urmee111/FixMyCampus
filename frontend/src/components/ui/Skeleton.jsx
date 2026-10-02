import React from 'react'
import { cn } from '../../lib/utils'

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-md bg-slate-200/70 dark:bg-slate-800/80 skeleton-shimmer',
        className
      )}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 bg-white dark:bg-slate-900/80 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <Skeleton className="h-4 w-32" />
        <div className="ml-auto flex items-center gap-3">
          <Skeleton className="h-7 w-14 rounded-lg" />
          <Skeleton className="h-7 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonStat() {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 bg-white dark:bg-slate-900/80 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-36" />
    </div>
  )
}

export function SkeletonComment() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40">
      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}
