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

  const catchReturns = await payload.find({
    collection: 'catchReturns',
    where: {
      and: [
        {
          booking: {
            equals: user.id,
          },
        },
        {
          returnCompleted: {
            equals: false,
          },
        },
      ],
    },
    sort: 'date',
  })
  console.log(catchReturns)

  return NextResponse.json(catchReturns.docs)
}
