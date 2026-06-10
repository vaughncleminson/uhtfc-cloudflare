import config from '@payload-config'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  const orderId: number = parseInt(request.nextUrl.searchParams.get('orderId'))

  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: await headers(),
  })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await payload.delete({
    collection: 'orders',
    where: {
      and: [
        {
          userId: {
            equals: user.id,
          },
        },
        {
          id: {
            equals: orderId,
          },
        },
      ],
    },
  })

  await payload.delete({
    collection: 'bookings',
    where: {
      and: [
        {
          userId: {
            equals: user.id,
          },
        },
        {
          orderId: {
            equals: orderId,
          },
        },
      ],
    },
  })

  await payload.delete({
    collection: 'payments',
    where: {
      orderId: {
        equals: orderId,
      },
    },
  })

  const bookingHistoryResult = await payload.delete({
    collection: 'bookingHistory',
    where: {
      and: [
        {
          userId: {
            equals: user.id,
          },
        },
        {
          orderId: {
            equals: orderId,
          },
        },
      ],
    },
  })

  return NextResponse.json(bookingHistoryResult)
}
