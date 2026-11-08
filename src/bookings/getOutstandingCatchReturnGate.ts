import 'server-only'

import type { Booking, CatchReturn } from '@/payload-types'
import type { Payload, PayloadRequest } from 'payload'

export type CatchReturnGateResult = { blocked: false } | { blocked: true; publicId: string }

const getBookingDate = (catchReturn: CatchReturn): Date => {
  const booking = catchReturn.booking as Booking
  return new Date(booking.date ?? catchReturn.createdAt)
}

export async function getOutstandingCatchReturnGate(
  payload: Payload,
  userId: number,
  now: Date,
  req?: PayloadRequest,
): Promise<CatchReturnGateResult> {
  const catchReturns = await payload.find({
    collection: 'catchReturns',
    depth: 1,
    limit: 0,
    req,
    where: { userId: { equals: userId } },
  })

  const mostRecentEligible = catchReturns.docs
    .map((catchReturn) => ({ bookingDate: getBookingDate(catchReturn), catchReturn }))
    .filter(({ bookingDate }) => bookingDate < now)
    .sort((a, b) => b.bookingDate.getTime() - a.bookingDate.getTime())[0]?.catchReturn

  if (!mostRecentEligible || mostRecentEligible.returnCompleted) {
    return { blocked: false }
  }

  return { blocked: true, publicId: mostRecentEligible.publicId }
}
