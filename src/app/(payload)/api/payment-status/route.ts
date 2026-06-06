import { CheckoutInitiate, CheckoutResponse } from '@/admin/types/checkout'
import { LocationOption } from '@/admin/types/locationOptions'
import { validateBookingDates } from '@/admin/utils/validateBookingDates'
import { Booking } from '@/frontend/schemas/bookingSchema'
import { LineItem, YocoLineItem } from '@/frontend/schemas/lineItemSchema'
import { Membership } from '@/frontend/schemas/membershipSchema'
import { Order } from '@/frontend/schemas/orderSchema'
import { BookingHistory, Location, Setting } from '@/payload-types'
import config from '@payload-config'
import dayjs from 'dayjs'
import { getPayload } from 'payload'

type RequestBody = {
  order: Order
}

export async function POST(request: Request) {
  const data = (await request.json()) as RequestBody
  const payload = await getPayload({ config })
  const order = data.order as Order
  const user = await payload.findByID({
    collection: 'users',
    id: order.userId,
  })
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
  }
  //Update booking
}
