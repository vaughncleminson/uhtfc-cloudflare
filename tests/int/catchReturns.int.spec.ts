// @vitest-environment node
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload

const tag = `catchret-${Date.now()}`

const createdIds = {
  bookings: [] as number[],
  catchReturns: [] as number[],
  users: [] as number[],
}

describe('CatchReturns.booking required field', () => {
  let userId: number
  let userEmail: string
  let bookingId: number

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const user = await payload.create({
      collection: 'users',
      data: {
        email: `${tag}@example.test`,
        firstName: 'Catch',
        lastName: 'Tester',
        mobileNumber: '0000000000',
        password: 'password123!',
      },
    })
    createdIds.users.push(user.id)
    userId = user.id
    userEmail = user.email as string

    const booking = await payload.create({
      collection: 'bookings',
      data: {
        anglers: [{ fullName: 'Angler One' }],
        date: '1999-06-15',
        email: userEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        productType: 'booking',
        publicId: crypto.randomUUID(),
        userId,
      },
    })
    createdIds.bookings.push(booking.id)
    bookingId = booking.id
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

  it('rejects creating a catch return without a booking', async () => {
    await expect(
      // @ts-expect-error intentionally omitting required `booking` to assert runtime validation
      payload.create({
        collection: 'catchReturns',
        data: {
          publicId: crypto.randomUUID(),
          returnCompleted: false,
          stats: { averageLength: 0, largeFish: 0, total: 0 },
          userId,
        },
      }),
    ).rejects.toThrow()
  })

  it('allows creating a catch return with a valid booking', async () => {
    const catchReturn = await payload.create({
      collection: 'catchReturns',
      data: {
        booking: bookingId,
        publicId: crypto.randomUUID(),
        returnCompleted: false,
        stats: { averageLength: 0, largeFish: 0, total: 0 },
        userId,
      },
    })
    createdIds.catchReturns.push(catchReturn.id)

    const booking = catchReturn.booking as { id: number } | number | null
    expect(typeof booking === 'object' ? booking?.id : booking).toBe(bookingId)
  })
})
