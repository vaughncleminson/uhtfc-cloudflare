// @vitest-environment node
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { getOutstandingCatchReturnGate } from '@/bookings/getOutstandingCatchReturnGate'

let payload: Payload

const tag = `gate-${Date.now()}`

const createdIds = {
  bookings: [] as number[],
  catchReturns: [] as number[],
  users: [] as number[],
}

describe('getOutstandingCatchReturnGate', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterAll(async () => {
    await Promise.all(
      createdIds.catchReturns.map((id) => payload.delete({ collection: 'catchReturns', id })),
    )
    await Promise.all(
      createdIds.bookings.map((id) => payload.delete({ collection: 'bookings', id })),
    )
    await Promise.all(createdIds.users.map((id) => payload.delete({ collection: 'users', id })))
  })

  const createUser = async (suffix: string) => {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: `${tag}-${suffix}@example.test`,
        firstName: 'Gate',
        lastName: 'Tester',
        mobileNumber: '0000000000',
        password: 'password123!',
      },
    })
    createdIds.users.push(user.id)
    return user
  }

  const createCatchReturn = async (options: {
    bookingDate: string
    returnCompleted: boolean
    userId: number
  }) => {
    const booking = await payload.create({
      collection: 'bookings',
      // Fixture setup creates multiple historical Bookings per test user, which would
      // otherwise trip the very gate this suite is testing.
      context: { skipCatchReturnGate: true },
      data: {
        anglers: [{ fullName: 'Angler One' }],
        date: options.bookingDate,
        email: `${tag}@example.test`,
        firstName: 'Gate',
        lastName: 'Tester',
        productType: 'booking',
        publicId: crypto.randomUUID(),
        userId: options.userId,
      },
    })
    createdIds.bookings.push(booking.id)

    const catchReturn = await payload.create({
      collection: 'catchReturns',
      data: {
        booking: booking.id,
        publicId: crypto.randomUUID(),
        returnCompleted: options.returnCompleted,
        stats: { averageLength: 0, largeFish: 0, total: 0 },
        userId: options.userId,
      },
    })
    createdIds.catchReturns.push(catchReturn.id)

    return catchReturn
  }

  it('is not blocked when the member has no Catch Returns at all', async () => {
    const user = await createUser('no-history')

    const result = await getOutstandingCatchReturnGate(payload, user.id, new Date('2000-01-01'))

    expect(result).toEqual({ blocked: false })
  })

  it("is not blocked when the member's only Catch Returns are tied to today's or future Bookings", async () => {
    const user = await createUser('future-only')
    const now = new Date('2026-06-15')

    await createCatchReturn({ bookingDate: '2026-06-15', returnCompleted: false, userId: user.id })
    await createCatchReturn({ bookingDate: '2026-06-20', returnCompleted: false, userId: user.id })

    const result = await getOutstandingCatchReturnGate(payload, user.id, now)

    expect(result).toEqual({ blocked: false })
  })

  it('is not blocked when the Most Recent Catch Return is already completed', async () => {
    const user = await createUser('most-recent-completed')
    const now = new Date('2026-06-15')

    await createCatchReturn({ bookingDate: '2026-06-01', returnCompleted: true, userId: user.id })

    const result = await getOutstandingCatchReturnGate(payload, user.id, now)

    expect(result).toEqual({ blocked: false })
  })

  it('is blocked with the correct publicId when the Most Recent Catch Return is outstanding', async () => {
    const user = await createUser('most-recent-outstanding')
    const now = new Date('2026-06-15')

    const outstanding = await createCatchReturn({
      bookingDate: '2026-06-01',
      returnCompleted: false,
      userId: user.id,
    })

    const result = await getOutstandingCatchReturnGate(payload, user.id, now)

    expect(result).toEqual({ blocked: true, publicId: outstanding.publicId })
  })

  it('is not blocked when an older Catch Return is outstanding but the Most Recent Catch Return is completed', async () => {
    const user = await createUser('older-outstanding')
    const now = new Date('2026-06-15')

    await createCatchReturn({ bookingDate: '2026-05-01', returnCompleted: false, userId: user.id })
    await createCatchReturn({ bookingDate: '2026-06-01', returnCompleted: true, userId: user.id })

    const result = await getOutstandingCatchReturnGate(payload, user.id, now)

    expect(result).toEqual({ blocked: false })
  })
})
