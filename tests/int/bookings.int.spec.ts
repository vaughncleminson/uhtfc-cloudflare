// @vitest-environment node
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload

const tag = `bookings-hook-${Date.now()}`

const createdIds = {
  bookings: [] as number[],
  catchReturns: [] as number[],
  users: [] as number[],
}

describe("Bookings beforeChange hook's outstanding Catch Return gate", () => {
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
        firstName: 'Hook',
        lastName: 'Tester',
        mobileNumber: '0000000000',
        password: 'password123!',
      },
    })
    createdIds.users.push(user.id)
    return user
  }

  const createBooking = async (options: { date: string; userId: number }) => {
    const booking = await payload.create({
      collection: 'bookings',
      // Fixture setup: bypass the gate being tested so historical Bookings can be seeded freely.
      context: { skipCatchReturnGate: true },
      data: {
        anglers: [{ fullName: 'Angler One' }],
        date: options.date,
        email: `${tag}@example.test`,
        firstName: 'Hook',
        lastName: 'Tester',
        productType: 'booking',
        publicId: crypto.randomUUID(),
        userId: options.userId,
      },
    })
    createdIds.bookings.push(booking.id)
    return booking
  }

  const createCatchReturn = async (options: {
    bookingId: number
    returnCompleted: boolean
    userId: number
  }) => {
    const catchReturn = await payload.create({
      collection: 'catchReturns',
      data: {
        booking: options.bookingId,
        publicId: crypto.randomUUID(),
        returnCompleted: options.returnCompleted,
        stats: { averageLength: 0, largeFish: 0, total: 0 },
        userId: options.userId,
      },
    })
    createdIds.catchReturns.push(catchReturn.id)
    return catchReturn
  }

  it('throws a 403 when the member has an outstanding Catch Return', async () => {
    const user = await createUser('blocked')
    const pastBooking = await createBooking({ date: '2020-01-01', userId: user.id })
    await createCatchReturn({ bookingId: pastBooking.id, returnCompleted: false, userId: user.id })

    await expect(
      payload.create({
        collection: 'bookings',
        data: {
          anglers: [{ fullName: 'Angler One' }],
          date: '2026-06-15',
          email: `${tag}@example.test`,
          firstName: 'Hook',
          lastName: 'Tester',
          productType: 'booking',
          publicId: crypto.randomUUID(),
          userId: user.id,
        },
      }),
    ).rejects.toThrow('Outstanding Catch Return must be completed before booking')
  })

  it("does not throw when the member's Most Recent Catch Return is completed", async () => {
    const user = await createUser('unblocked')
    const pastBooking = await createBooking({ date: '2020-01-01', userId: user.id })
    await createCatchReturn({ bookingId: pastBooking.id, returnCompleted: true, userId: user.id })

    const booking = await payload.create({
      collection: 'bookings',
      data: {
        anglers: [{ fullName: 'Angler One' }],
        date: '2026-06-15',
        email: `${tag}@example.test`,
        firstName: 'Hook',
        lastName: 'Tester',
        productType: 'booking',
        publicId: crypto.randomUUID(),
        userId: user.id,
      },
    })
    createdIds.bookings.push(booking.id)

    expect(booking.id).toBeDefined()
  })
})
