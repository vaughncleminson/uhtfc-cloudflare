import { CheckoutInitiate, CheckoutResponse } from '@/admin/types/checkout'
import { LocationOption } from '@/admin/types/locationOptions'
import { validateBookingDates } from '@/admin/utils/validateBookingDates'
import { Booking } from '@/frontend/schemas/bookingSchema'
import { LineItem } from '@/frontend/schemas/lineItemSchema'
import { Membership } from '@/frontend/schemas/membershipSchema'
import { Order } from '@/frontend/schemas/orderScema'
import { BookingHistory, Location, Setting } from '@/payload-types'
import config from '@payload-config'
import dayjs from 'dayjs'
import { getPayload } from 'payload'

export async function POST(request: Request) {
  const data = await request.json()
  const payload = await getPayload({ config })
  const order = data.order as Order
  const user = await payload.findByID({
    collection: 'users',
    id: order.userId,
  })

  // Get booking history so we can validate the booking
  const bookingHistorySettings = (await getBookingSettings()) || []
  const bookingsInOrder = checkCartBookings(order)
  const locations = await getLocations()
  const settings = await getSettings()
  console.log(bookingsInOrder)

  if (locations && settings && user) {
    for (let booking of bookingsInOrder) {
      const validation = validateBookingDates({
        date: dayjs(booking.date).toDate(),
        locations: locations,
        user: user,
        bookingSettings: [...bookingHistorySettings],
        selectedLocationId: booking.location,
        settings: settings,
      })
      const v = validation.find((v) => v.locationId === booking.location) as LocationOption
      if (v) {
        if (v.available) {
          //check the rod limit
          if (v.rodsAvailable && booking.anglers.length > v.rodsAvailable) {
            v.reason = 'No more rods available'
            return Response.json(v)
          } else {
            console.log('Booking valid')
          }
        } else {
          return Response.json(v)
        }
      } else {
        return Response.json({
          locationId: booking.location,
          locationTitle: booking.locationName,
          available: false,
          rodLimit: 0,
          rodsAvailable: 0,
          rodsBooked: 0,
          reason: 'Location is unavailable',
        } as LocationOption)
      }
    }
  }
  const checkout = await createYocoCheckout(order)
  if (checkout) {
    return Response.json({ success: true, checkout })
  } else {
    return Response.json({ success: false, message: 'Failed to create checkout' })
  }
}

async function getBookingSettings(): Promise<BookingHistory[] | undefined> {
  const payload = await getPayload({ config })
  try {
    const bookingSettings = await payload.find({
      collection: 'bookingHistory',
      limit: 0,
    })
    return bookingSettings.docs
  } catch (e) {
    console.log(e)
  }
}
const checkCartBookings = (order: Order): Booking[] => {
  const cBookings = order?.products.filter(
    (product: Booking | Membership) => product.productType === 'booking',
  ) as Booking[]
  return cBookings
}

async function getLocations(): Promise<Location[] | undefined> {
  const payload = await getPayload({ config })
  try {
    const locations = await payload.find({
      collection: 'locations',
      limit: 0,
      where: {
        enabled: {
          equals: true,
        },
      },
    })
    return locations.docs
  } catch (e) {
    console.log(e)
  }
}
async function getSettings(): Promise<Setting | undefined> {
  const payload = await getPayload({ config })
  try {
    const settings = await payload.findGlobal({
      slug: 'settings',
    })
    return settings
  } catch (e) {
    console.log(e)
  }
}

async function createYocoCheckout(order: Order): Promise<CheckoutResponse | null> {
  const lineItems: LineItem[] = order.lineItems.map((item: LineItem) => {
    item.pricingDetails.price = item.pricingDetails.price * 100
    return item
  })

  const checkout: CheckoutInitiate = {
    amount: order.totalAmount * 100,
    currency: 'ZAR',
    successUrl: 'https://your-success-url.com',
    cancelUrl: 'https://your-cancel-url.com',
    failureUrl: 'https://your-failure-url.com',
    lineItems: lineItems,
  }

  try {
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        // Authorization: 'Bearer sk_live_4acbf8b1prnV51R42614cc9ac18b',
        Authorization: 'Bearer sk_test_88a4704eprnV51R62a043519abd5',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkout),
    })

    const data = await response.json()
    return data as CheckoutResponse
  } catch (error) {
    console.error(error)
  }
  return null
}
