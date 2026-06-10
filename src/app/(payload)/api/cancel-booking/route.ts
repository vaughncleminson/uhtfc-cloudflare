import config from '@payload-config'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  const bookingId = request.nextUrl.searchParams.get('bookingId')

  if (!bookingId) {
    return NextResponse.json({ error: 'bookingId is required' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: await headers(),
  })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
          id: {
            equals: bookingId,
          },
        },
      ],
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
          bookingId: {
            equals: bookingId,
          },
        },
      ],
    },
  })

  return NextResponse.json(bookingHistoryResult)
}
