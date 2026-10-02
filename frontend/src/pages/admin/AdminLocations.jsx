import React from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { CAMPUS_LOCATIONS } from '../../lib/constants'
import { MapPin } from 'lucide-react'

export function AdminLocations() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Facilities Infrastructure"
        title="Campus Locations"
        description="Browse the locations currently available when students report an issue."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAMPUS_LOCATIONS.map((location) => (
          <Card key={location} className="p-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {location}
              </h2>
            </div>
            <p className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Available for issue reports
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
