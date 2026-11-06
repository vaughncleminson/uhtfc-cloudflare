import 'server-only'

import type { Payload } from 'payload'

export type LocationOption = {
  id: string
  label: string
}

// Historical reporting: deliberately includes locations regardless of `enabled`/
// `temporarilyClosed` status, unlike booking-availability pickers elsewhere.
export async function getLocationOptions(payload: Payload): Promise<LocationOption[]> {
  const { docs } = await payload.find({
    collection: 'locations',
    limit: 0,
  })

  return [...docs]
    .sort((a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title))
    .map((doc) => ({
      id: String(doc.id),
      label: `${doc.type} - ${doc.title}`,
    }))
}
