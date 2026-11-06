'use client'

import type { LocationOption } from '@/dashboard/getLocationOptions'
import { Button, SelectInput } from '@payloadcms/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type LocationFilterProps = {
  locationId?: string
  locationOptions: LocationOption[]
}

export function LocationFilter({ locationId, locationOptions }: LocationFilterProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedLocationId, setSelectedLocationId] = useState(locationId ?? '')

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedLocationId) {
      params.set('locationId', selectedLocationId)
    } else {
      params.delete('locationId')
    }

    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
  }

  return (
    <div className="dashboard-summary__location-filter">
      <SelectInput
        aria-label="Location"
        name="locationId"
        onChange={(option) => setSelectedLocationId(String(option?.value ?? ''))}
        options={[
          { label: 'All Locations', value: '' },
          ...locationOptions.map((option) => ({ label: option.label, value: option.id })),
        ]}
        path="locationId"
        value={selectedLocationId}
      />
      <Button onClick={applyFilter}>Apply</Button>
    </div>
  )
}
