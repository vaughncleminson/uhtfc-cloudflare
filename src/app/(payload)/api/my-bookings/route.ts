import config from '@payload-config'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET() {
  const payload = await getPayload({ config })
  const h = await headers()

  const result = await payload.auth({ headers: h })

  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookings = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        {
          userId: {
            equals: user.id,
          },
        },
        {
          active: {
            equals: true,
          },
        },
      ],
    },
    sort: 'date',
  })
  console.log(bookings)

  return NextResponse.json(bookings.docs)
}
