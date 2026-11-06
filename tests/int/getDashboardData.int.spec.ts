// @vitest-environment node
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { getDashboardData } from '@/dashboard/getDashboardData'
import { getLocationOptions } from '@/dashboard/getLocationOptions'

let payload: Payload

const tag = `dashloc-${Date.now()}`

const createdIds = {
  bookings: [] as number[],
  locations: [] as number[],
  users: [] as number[],
}

const testDateRange = { endDate: '1999-06-30', startDate: '1999-06-01' }
const bookingDate = '1999-06-15'

describe('dashboard location filtering', () => {
  let riverLocationId: number
  let stillwaterLocationId: number

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const user = await payload.create({
      collection: 'users',
      data: {
        email: `${tag}@example.test`,
        firstName: 'Dash',
        lastName: 'Tester',
        mobileNumber: '0000000000',
        password: 'password123!',
      },
    })
    createdIds.users.push(user.id)

    const stillwater = await payload.create({
      collection: 'locations',
      data: {
        enabled: true,
        layout: [{ blockType: 'locationHero' }],
        title: `${tag}-Aaa Stillwater`,
        topic: ['trout'],
        type: 'stillwater',
      },
    })
    createdIds.locations.push(stillwater.id)
    stillwaterLocationId = stillwater.id

    const river = await payload.create({
      collection: 'locations',
      data: {
        enabled: false,
        layout: [{ blockType: 'locationHero' }],
        temporarilyClosed: true,
        title: `${tag}-Bbb River`,
        topic: ['trout'],
        type: 'river',
      },
    })
    createdIds.locations.push(river.id)
    riverLocationId = river.id

    const riverBooking = await payload.create({
      collection: 'bookings',
      data: {
        anglers: [{ fullName: 'Angler One' }, { fullName: 'Angler Two' }],
        date: bookingDate,
        email: user.email as string,
        firstName: user.firstName,
        lastName: user.lastName,
        location: riverLocationId,
        productType: 'booking',
        publicId: crypto.randomUUID(),
        userId: user.id,
      },
    })
    createdIds.bookings.push(riverBooking.id)

    const stillwaterBooking = await payload.create({
      collection: 'bookings',
      data: {
        anglers: [{ fullName: 'Angler Three' }],
        date: bookingDate,
        email: user.email as string,
        firstName: user.firstName,
        lastName: user.lastName,
        location: stillwaterLocationId,
        productType: 'booking',
        publicId: crypto.randomUUID(),
        userId: user.id,
      },
    })
    createdIds.bookings.push(stillwaterBooking.id)
  })

  afterAll(async () => {
    await Promise.all(
      createdIds.bookings.map((id) => payload.delete({ collection: 'bookings', id })),
    )
    await Promise.all(
      createdIds.locations.map((id) =>
        payload.delete({
          collection: 'locations',
          context: { disableRevalidate: true },
          id,
        }),
      ),
    )
    await Promise.all(createdIds.users.map((id) => payload.delete({ collection: 'users', id })))
  })

  it('applies only the date-range filter when locationId is absent (baseline)', async () => {
    const result = await getDashboardData(payload, testDateRange)

    expect(result.locationId).toBeUndefined()

    const riverRow = result.bookingSummaries.find((summary) => summary.LocationType === 'river')
    const stillwaterRow = result.bookingSummaries.find(
      (summary) => summary.LocationType === 'stillwater',
    )

    expect(riverRow?.CountOfRods).toBe(2)
    expect(stillwaterRow?.CountOfRods).toBe(1)
  })

  it('filters to a single river location when locationId is set', async () => {
    const result = await getDashboardData(payload, {
      ...testDateRange,
      locationId: String(riverLocationId),
    })

    expect(result.locationId).toBe(String(riverLocationId))
    expect(result.bookingSummaries).toHaveLength(1)
    expect(result.bookingSummaries[0].LocationType).toBe('river')
    expect(result.bookingSummaries[0].CountOfRods).toBe(2)
  })

  it('filters to a single stillwater location when locationId is set', async () => {
    const result = await getDashboardData(payload, {
      ...testDateRange,
      locationId: String(stillwaterLocationId),
    })

    expect(result.bookingSummaries).toHaveLength(1)
    expect(result.bookingSummaries[0].LocationType).toBe('stillwater')
    expect(result.bookingSummaries[0].CountOfRods).toBe(1)
  })

  it('combines locationId with a date range that excludes the matching booking', async () => {
    const result = await getDashboardData(payload, {
      endDate: '1999-07-31',
      locationId: String(riverLocationId),
      startDate: '1999-07-01',
    })

    expect(result.bookingSummaries).toHaveLength(0)
  })

  it('ignores a non-numeric locationId value', async () => {
    const result = await getDashboardData(payload, {
      ...testDateRange,
      locationId: 'not-a-valid-id',
    })

    expect(result.locationId).toBeUndefined()
    expect(result.bookingSummaries.length).toBeGreaterThanOrEqual(2)
  })

  describe('getLocationOptions', () => {
    it('returns options sorted by type then title, labeled <type> - <title>, including disabled/closed locations', async () => {
      const options = await getLocationOptions(payload)
      const testOptions = options.filter((option) => option.label.includes(tag))

      expect(testOptions).toEqual([
        { id: String(riverLocationId), label: `river - ${tag}-Bbb River` },
        { id: String(stillwaterLocationId), label: `stillwater - ${tag}-Aaa Stillwater` },
      ])
    })
  })
})
