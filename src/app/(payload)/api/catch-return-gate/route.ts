import config from '@payload-config'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { getOutstandingCatchReturnGate } from '@/bookings/getOutstandingCatchReturnGate'

export const dynamic = 'force-dynamic'

// Courtesy check only: the authoritative gate is Bookings.ts's beforeChange hook.
export async function GET() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user || user.collection !== 'users') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await getOutstandingCatchReturnGate(payload, user.id, new Date())

  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
}
