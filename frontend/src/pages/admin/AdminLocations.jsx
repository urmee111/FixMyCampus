import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { FormField } from '../../components/ui/FormField'
import { Select } from '../../components/ui/Select'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { CAMPUS_LOCATIONS, MAX_SPOT_LENGTH } from '../../lib/constants'
import { joinLocation } from '../../lib/formatters'
import { useToast } from '../../hooks/useToast'
import { MapPin, Copy, ExternalLink, Link2 } from 'lucide-react'

// The link a QR code on the wall should open: the report form with the location already selected.
function reportLink(location) {
  return `${window.location.origin}/report?location=${encodeURIComponent(location)}`
}

export function AdminLocations() {
  const toast = useToast()
  const [building, setBuilding] = useState(CAMPUS_LOCATIONS[0])
  const [spot, setSpot] = useState('')

  const link = reportLink(joinLocation(building, spot))

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Link copied.')
    } catch {
      toast.error('Could not copy automatically. Select the link and copy it by hand.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Locations & QR links"
        description="Make a link that opens the report form with a location already selected. Turn it into a QR code, print it and stick it on the wall: anyone who scans it can report a problem right there."
      />

      {/* Link generator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Link2 className="w-4 h-4" aria-hidden="true" />
            Create a report link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="qr-location" label="Location">
              <Select id="qr-location" value={building} onChange={(e) => setBuilding(e.target.value)}>
                {CAMPUS_LOCATIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="qr-spot" label="Spot / details (optional)">
              <Input
                id="qr-spot"
                placeholder="e.g. 2nd floor"
                maxLength={MAX_SPOT_LENGTH}
                value={spot}
                onChange={(e) => setSpot(e.target.value)}
              />
            </FormField>
          </div>

          <FormField id="qr-link" label="Report link">
            <Input
              id="qr-link"
              readOnly
              value={link}
              onFocus={(e) => e.target.select()}
              className="font-mono text-xs"
            />
          </FormField>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => copy(link)}
              leftIcon={<Copy className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Copy link
            </Button>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              Open link
              <span className="sr-only"> (new tab)</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* One ready-made link per location */}
      <section aria-labelledby="all-locations">
        <h2 id="all-locations" className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
          All locations
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAMPUS_LOCATIONS.map((name) => (
            <li key={name}>
              <Card className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shrink-0">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copy(reportLink(name))}
                    leftIcon={<Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                  >
                    <span aria-hidden="true">Copy link</span>
                    <span className="sr-only">Copy report link for {name}</span>
                  </Button>
                  <Link
                    to={`/issues?location=${encodeURIComponent(name)}`}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-700 dark:text-brand-300 hover:underline"
                  >
                    Issues<span className="sr-only"> in {name}</span>
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
