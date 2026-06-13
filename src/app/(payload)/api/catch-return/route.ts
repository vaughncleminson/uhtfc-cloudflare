import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { CatchReturn } from '@/payload-types'

// This API route is used to get the catch return details for a given publicId.
// The related booking is available under catchReturn.booking when populated.
export async function GET(request: NextRequest) {
  const publicId = request.nextUrl.searchParams.get('publicId')

  if (!publicId) {
    return NextResponse.json({ error: 'publicId is required' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const catchReturnResult = await payload.find({
    collection: 'catchReturns',
    where: {
      publicId: {
        equals: publicId,
      },
    },
  })

  if (catchReturnResult.totalDocs === 0) {
    return NextResponse.json({ error: 'Catch return not found' }, { status: 404 })
  }

  const catchReturn = catchReturnResult.docs[0] as CatchReturn

  return NextResponse.json({ catchReturn })
}
