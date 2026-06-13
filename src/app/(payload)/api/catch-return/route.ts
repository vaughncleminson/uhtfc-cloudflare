import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { CatchReturn } from '@/payload-types'
import { catchReturnSchema } from '@/frontend/schemas/catchReturnSchema'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = catchReturnSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Invalid catch return payload',
          errors: validationResult.error.flatten(),
        },
        { status: 400 },
      )
    }

    const data = validationResult.data
    const payload = await getPayload({ config })

    const catchReturnResult = await payload.find({
      collection: 'catchReturns',
      where: {
        publicId: {
          equals: data.publicId,
        },
      },
      limit: 1,
    })

    if (catchReturnResult.totalDocs === 0) {
      return NextResponse.json({ message: 'Catch return not found' }, { status: 404 })
    }

    // Normalize the returns by filtering out any items with quantity or length of 0
    const normalizedReturns = data.nilReturn
      ? []
      : data.returns.filter((item) => item.quantity > 0 && item.length > 0)

    // Calculate statistics based on the normalized returns
    const total = normalizedReturns.reduce((sum, item) => sum + item.quantity, 0)
    const totalLength = normalizedReturns.reduce(
      (sum, item) => sum + item.length * item.quantity,
      0,
    )
    const averageLength = total > 0 ? Number((totalLength / total).toFixed(2)) : 0
    const largeFish = normalizedReturns.reduce(
      (max, item) => (item.length > max ? item.length : max),
      0,
    )
    //save the updated catch return data back to the database
    //set returnCompleted to true, update the returns and stats fields, and set nilReturn based on the submitted data
    const updatedCatchReturn = await payload.update({
      collection: 'catchReturns',
      id: catchReturnResult.docs[0].id,
      data: {
        booking: data.booking ?? null,
        returnCompleted: true,
        nilReturn: data.nilReturn,
        returns: normalizedReturns,
        stats: {
          total,
          averageLength,
          largeFish,
        },
      },
    })

    return NextResponse.json({
      message: 'Catch return submitted successfully',
      catchReturn: updatedCatchReturn,
    })
  } catch (error) {
    console.error('Error submitting catch return:', error)
    return NextResponse.json({ message: 'Failed to submit catch return' }, { status: 500 })
  }
}
