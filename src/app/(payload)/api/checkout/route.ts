import { CheckoutInitiate, CheckoutResponse } from '@/admin/types/checkout'
import { LocationOption } from '@/admin/types/locationOptions'
import { validateBookingDates } from '@/admin/utils/validateBookingDates'
import { Booking } from '@/frontend/schemas/bookingSchema'
import { LineItem, YocoLineItem } from '@/frontend/schemas/lineItemSchema'
import { Membership } from '@/frontend/schemas/membershipSchema'
import { Order } from '@/frontend/schemas/orderScema'
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
  if (
    order.totalAmount === 0 &&
    order.products.filter((p) => p.productType === 'booking').length > 0
  ) {
    createOrderEntries(order)

    return Response.json({
      success: true,
      checkout: { redirectUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout?success=true` },
    })
  }

  const checkout = await createYocoCheckout(order)
  if (checkout) {
    createOrderEntries(order)
    return Response.json({ success: true, checkout })
  } else {
    return Response.json({
      success: false,
      checkout: { redirectUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout?success=false` },
    })
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
  const lineItems: YocoLineItem[] = order.lineItems.map((item: LineItem) => ({
    displayName: item.displayName,
    description: item.description,
    quantity: item.quantity,
    pricingDetails: {
      price: item.price * 100,
    },
  }))

  const checkout: CheckoutInitiate = {
    amount: order.totalAmount * 100,
    currency: 'ZAR',
    successUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout`,
    cancelUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout`,
    failureUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout`,
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

const createOrderEntries = async (order: Order) => {
  const payload = await getPayload({ config })
  if (!order.userId) {
    throw new Error('userId is required')
  }
  const lineItems = (order.lineItems ?? []).map((item) => ({
    displayName: item.displayName ?? '',
    description: item.description ?? '',
    quantity: item.quantity ?? 1,
    price: item.price ?? 0,
  }))
  await payload.create({
    collection: 'orders',
    data: {
      userId: order.userId,
      firstName: order.firstName ?? '',
      lastName: order.lastName ?? '',
      email: order.email ?? '',
      role: order.role ?? 'non-member',
      paymentStatus: 'not-required',
      products: order.products ?? {},
      checkoutId: order.checkoutId ?? null,
      totalAmount: order.totalAmount ?? 0,
      lineItems: lineItems,
    },
  })

  const products = order.products as (Booking | Membership)[]
  for (let product of products) {
    switch (product.productType) {
      case 'booking':
        for (let booking of order.products.filter(
          (p) => p.productType === 'booking',
        ) as Booking[]) {
          await payload.create({
            collection: 'bookings',
            data: booking as any,
          })
          await payload.create({
            collection: 'bookingHistory',
            data: {
              locationId: booking.location,
              firstName: booking.firstName,
              lastName: booking.lastName,
              email: booking.email,
              userId: booking.userId,
              members: booking.anglers.filter((a) => a.role == 'member').length,
              memberGuests: booking.anglers.filter((a) => a.role == 'member-guest').length,
              nonMembers: booking.anglers.filter((a) => a.role == 'non-member').length,
              date: booking.date,
              rodsBooked: booking.anglers.length,
            },
          })
        }
        break
      case 'newMembership':
        const prod = product as Membership
        const lineItems = (order.lineItems ?? []).map((item) => ({
          displayName: item.displayName ?? '',
          description: item.description ?? '',
          quantity: item.quantity ?? 1,
          price: item.price ?? 0,
        }))
        await payload.create({
          collection: 'newMemberships',
          data: {
            productType: 'newMembership',
            userId: order.userId,
            membershipType: prod.membershipType,
            firstName: prod.firstName,
            lastName: prod.lastName,
            idNumber: prod.idNumber,
            email: prod.email,
            mobileNumber: prod.mobileNumber,
            street: prod.street,
            city: prod.city,
            province: prod.province,
            postalCode: prod.postalCode,
            country: prod.country,
            otherMemberships: prod.otherMemberships || '',
            howDidYouHearAboutUs: prod.howDidYouHearAboutUs || '',
            totalAmount: prod.totalAmount,
            acceptTerms: prod.acceptTerms,
            lineItems: prod.lineItems,
          } as any,
        })
        break
      default:
        break
    }
  }
}
