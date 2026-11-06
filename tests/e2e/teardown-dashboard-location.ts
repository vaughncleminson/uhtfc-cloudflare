import fs from 'node:fs'
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { seedFilePath, type DashboardLocationSeed } from './dashboard-location-seed-path'

async function teardown() {
  if (!fs.existsSync(seedFilePath)) return

  const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf-8')) as DashboardLocationSeed

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  await payload.delete({ collection: 'bookings', id: seedData.bookingAId }).catch(() => {})
  await payload.delete({ collection: 'bookings', id: seedData.bookingBId }).catch(() => {})
  await payload
    .delete({
      collection: 'locations',
      context: { disableRevalidate: true },
      id: seedData.locationAId,
    })
    .catch(() => {})
  await payload
    .delete({
      collection: 'locations',
      context: { disableRevalidate: true },
      id: seedData.locationBId,
    })
    .catch(() => {})
  await payload.delete({ collection: 'users', id: seedData.userId }).catch(() => {})

  fs.unlinkSync(seedFilePath)
}

teardown()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
