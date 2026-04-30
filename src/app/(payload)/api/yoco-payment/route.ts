import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text() // ⚠️ important for signature
    const body = JSON.parse(rawBody)

    const headers = req.headers

    const id = headers.get('webhook-id') || ''
    const timestamp = headers.get('webhook-timestamp') || ''

    const signedContent = `${id}.${timestamp}.${rawBody}`

    const secret = process.env.YOCO_WEBHOOK_SECRET!
    const secretBytes = Buffer.from(secret.split('_')[1], 'base64')

    const expectedSignature = crypto
      .createHmac('sha256', secretBytes)
      .update(signedContent)
      .digest('base64')

    const signatureHeader = headers.get('webhook-signature') || ''
    const signature = signatureHeader.split(' ')[0]?.split(',')[1]

    if (
      !signature ||
      !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }
    console.log(body)
    // Only handle successful payments
    if (body?.payload?.status !== 'succeeded') {
      return NextResponse.json({ ok: true })
    }

    const checkoutId = body.payload.metadata.checkoutId

    const payload = await getPayload({ config })

    // 🔍 Find order
    const orders = await payload.find({
      collection: 'orders',
      where: {
        checkoutId: { equals: checkoutId },
      },
    })

    const order = orders.docs[0]
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // ✅ Update order
    // await payload.update({
    //   collection: 'orders',
    //   id: order.id,
    //   data: {
    //     status: 'Paid',
    //     createdAt: body.createdDate,
    //   },
    // })

    // // ✅ Create bookings
    // for (const booking of order.bookings || []) {
    //   await payload.create({
    //     collection: 'bookings',
    //     data: {
    //       ...booking,
    //       status: 'Booked',
    //     },
    //   })
    // }

    // ✅ Membership renewal

    // ✅ Save payment
    // await payload.create({
    //   collection: 'payments',
    //   data: {
    //     paymentId: order.,
    //     userName: order. ?? 'Unknown',
    //     product: order.product ?? 'Unknown',
    //     details: order.details ?? 'Unknown',
    //     amount: body.payload.amount,
    //     currency: body.payload.currency,
    //     type: body.payload.paymentMethodDetails.type,
    //     status: body.payload.status,
    //     mode: body.payload.mode,
    //     createdAt: body.createdDate,
    //   },
    // })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
