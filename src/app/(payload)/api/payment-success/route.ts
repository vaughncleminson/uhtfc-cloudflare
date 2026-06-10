import { Booking } from '@/payload-types'
import config from '@payload-config'
import { getPayload, PaginatedDocs } from 'payload'

type RequestBody = {
  orderId: number
  userId: number
}

export async function POST(request: Request) {
  const data = (await request.json()) as RequestBody
  const payload = await getPayload({ config })
  const user = await payload.findByID({
    collection: 'users',
    id: data.userId,
  })
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
  }

  const order = await payload.findByID({
    collection: 'orders',
    id: data.orderId,
  })
  if (!order) {
    return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })
  }
  if (order.paymentStatus == 'payment-pending') {
    order.paymentStatus = 'payment-received'
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: order,
    })
  }
  const bookings: PaginatedDocs<Booking> = await payload.find({
    collection: 'bookings',
    where: {
      orderId: {
        equals: data.orderId,
      },
    },
  })

  for (const booking of bookings.docs) {
    booking.active = true
    await payload.update({
      collection: 'bookings',
      id: booking.id,
      data: booking,
    })
  }
  const payment = await payload.find({
    collection: 'payments',
    where: {
      orderId: {
        equals: data.orderId,
      },
    },
  })
  await payload.update({
    collection: 'payments',
    id: payment?.docs[0]?.id,
    data: {
      status: 'payment-received',
    },
  })
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
