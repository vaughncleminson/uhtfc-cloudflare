import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return Response.json({ user: null }, { status: 401 })
  }

  if (user.collection !== 'users') {
    return Response.json({ user })
  }

  const currentUser = await payload.findByID({
    collection: 'users',
    id: user.id,
    depth: 0,
  })

  return Response.json(
    { user: currentUser },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  )
}
