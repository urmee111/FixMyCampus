import React from 'react'
import { CAMPUS_LOCATIONS, MAX_SPOT_LENGTH } from '../../lib/constants'
import { FormField } from '../ui/FormField'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'

// The location part of the report and edit forms: a required Location dropdown + an optional "Spot / details" box.
// The page stores them as building + spot and joins them with joinLocation() ("Library, 2nd floor").
// `extraBuilding` keeps an old saved building (one that is no longer in the list) selectable, so editing never breaks.
export function LocationFields({
  building,
  spot,
  onBuildingChange,
  onSpotChange,
  errors = {},
  disabled = false,
  extraBuilding = '',
}) {
  const showExtra = extraBuilding && !CAMPUS_LOCATIONS.includes(extraBuilding)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField id="location" label="Location" required error={errors.location}>
        <Select
          id="location"
          value={building}
          disabled={disabled}
          error={errors.location}
          onChange={(e) => onBuildingChange(e.target.value)}
        >
          <option value="">Select location</option>
          {showExtra && <option value={extraBuilding}>{extraBuilding}</option>}
          {CAMPUS_LOCATIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField id="spot" label="Spot / details (optional)" error={errors.spot}>
        <Input
          id="spot"
          placeholder="e.g. 2nd floor, near the stairs"
          maxLength={MAX_SPOT_LENGTH}
          value={spot}
          disabled={disabled}
          error={errors.spot}
          onChange={(e) => onSpotChange(e.target.value)}
        />
      </FormField>
    </div>
  )
}
