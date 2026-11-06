import fs from 'node:fs'
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { seedFilePath, type DashboardLocationSeed } from './dashboard-location-seed-path'

async function seed() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const tag = `e2eloc-${Date.now()}`
  const email = `${tag}@example.test`
  const password = 'password123!'
  const today = new Date().toISOString().slice(0, 10)

  const user = await payload.create({
    collection: 'users',
    data: {
      committeeMember: true,
      email,
      firstName: 'E2E',
      lastName: 'Committee',
      mobileNumber: '0000000000',
      password,
      role: 'member',
    },
  })

  const locationA = await payload.create({
    collection: 'locations',
    data: {
      enabled: true,
      layout: [{ blockType: 'locationHero' }],
      title: `${tag}-A River`,
      topic: ['trout'],
      type: 'river',
    },
  })

  const locationB = await payload.create({
    collection: 'locations',
    data: {
      enabled: true,
      layout: [{ blockType: 'locationHero' }],
      title: `${tag}-B River`,
      topic: ['trout'],
      type: 'river',
    },
  })

  const bookingA = await payload.create({
    collection: 'bookings',
    data: {
      anglers: [
        { fullName: 'E2E Angler A1' },
        { fullName: 'E2E Angler A2' },
        { fullName: 'E2E Angler A3' },
      ],
      date: today,
      email,
      firstName: 'E2E',
      lastName: 'Committee',
      location: locationA.id,
      productType: 'booking',
      publicId: crypto.randomUUID(),
      userId: user.id,
    },
  })

  const bookingB = await payload.create({
    collection: 'bookings',
    data: {
      anglers: [
        { fullName: 'E2E Angler B1' },
        { fullName: 'E2E Angler B2' },
        { fullName: 'E2E Angler B3' },
        { fullName: 'E2E Angler B4' },
      ],
      date: today,
      email,
      firstName: 'E2E',
      lastName: 'Committee',
      location: locationB.id,
      productType: 'booking',
      publicId: crypto.randomUUID(),
      userId: user.id,
    },
  })

  const seedData: DashboardLocationSeed = {
    bookingAId: bookingA.id,
    bookingBId: bookingB.id,
    email,
    locationAId: locationA.id,
    locationALabel: `river-${tag}-A River`,
    locationBId: locationB.id,
    password,
    userId: user.id,
  }

  fs.writeFileSync(seedFilePath, JSON.stringify(seedData), 'utf-8')
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
