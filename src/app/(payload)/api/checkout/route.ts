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

const getLocationNotificationEmail = (location: Location): string | null => {
  for (const block of location.layout) {
    if (block.blockType !== 'locationDetails') {
      continue
    }

    if (block.sendLandownerEmail && block.landownerEmail) {
      return block.landownerEmail
    }
  }

  return null
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
  // if there is no amount to pay (member bookings are free)
  // and there are bookings in the order, we can skip the checkout
  // and just create the order entries and return a success response
  if (
    order.totalAmount === 0 &&
    order.products.filter((p) => p.productType === 'booking').length > 0
  ) {
    order.paymentStatus = 'not-required'
    const newOrder = await createOrderEntries(order)
    // call function to send booking emails
    // we email the user a booking confirmation email
    // and we email the location owner/contact a new booking notification email
    // we must await this function to ensure the emails are sent before we return the response and end the function execution
    await sendBookingEmails(newOrder)
    return Response.json({
      success: true,
      checkout: {
        redirectUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout?status=success&orderId=${newOrder.id}`,
      },
    })
  }

  //if checkout is created successfully, create the order entries and return success true and the checkout response

  const newOrder = await createOrderEntries(order)
  newOrder.paymentStatus = 'payment-pending'
  const checkout = await createYocoCheckout(newOrder)
  // call function to send booking emails
  // we email the user a booking confirmation email
  // and we email the location owner/contact a new booking notification email
  // we must await this function to ensure the emails are sent before we return the response and end the function execution

  if (checkout) {
    await sendBookingEmails(order)
    return Response.json({ success: true, checkout })
  } else {
    //if checkout creation failed, return success false and a redirect url to the checkout page with success false
    return Response.json({
      success: false,
      checkout: {
        redirectUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout?status=failure&orderId=${order.id}`,
      },
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
    successUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout?status=success&orderId=${order.id}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout?status=cancel&orderId=${order.id}`,
    failureUrl: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/checkout?status=failure&orderId=${order.id}`,
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
    // create payment
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'payments',
      data: {
        date: dayjs().toISOString(),
        firstName: order.firstName,
        lastName: order.lastName,
        summary: order.lineItems
          .map((item) => `${item.displayName} - ${item.description}`)
          .join(', '),
        totalAmount: order.totalAmount,
        status: 'pending',
        lineItems: (order.lineItems ?? []).map((item) => ({
          displayName: item.displayName ?? '',
          description: item.description ?? '',
          quantity: item.quantity ?? 0,
          price: item.price ?? 0,
        })),
        orderId: order.id as number,
      },
    })
    return data as CheckoutResponse
  } catch (error) {
    console.error(error)
  }
  return null
}

const createOrderEntries = async (order: Order): Promise<Order> => {
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
  if (order.totalAmount > 0) {
    order.paymentStatus = 'payment-pending'
  }
  const newOrder = await payload.create({
    collection: 'orders',
    data: {
      userId: order.userId,
      firstName: order.firstName ?? '',
      lastName: order.lastName ?? '',
      email: order.email ?? '',
      role: order.role ?? 'non-member',
      paymentStatus: order.paymentStatus ?? 'not-required',
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
        //create a booking entry for each booking in the order
        //also create a booking history entry for each booking in the order
        for (let booking of order.products.filter(
          (p) => p.productType === 'booking',
        ) as Booking[]) {
          if (order.paymentStatus == 'not-required') {
            booking.active = true
          } else {
            booking.active = false
          }
          booking.orderId = newOrder.id as number
          const newBooking = await payload.create({
            collection: 'bookings',
            data: booking as any,
          })

          await payload.create({
            collection: 'bookingHistory',
            data: {
              bookingId: newBooking.id,
              locationId: booking.location,
              firstName: booking.firstName,
              lastName: booking.lastName,
              email: booking.email,
              userId: booking.userId,
              orderId: newOrder.id as number,
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
            orderId: newOrder.id as number,
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
  return newOrder as Order
}

// function to send booking confirmation email to user and booking notification email to location owner/contact
const sendBookingEmails = async (order: Order) => {
  const payload = await getPayload({ config })
  const products = order.products as (Booking | Membership)[]
  const bookings = products.filter((p) => p.productType === 'booking') as Booking[]
  for (let booking of bookings) {
    // send email to user
    await payload.sendEmail({
      to: order.email,
      subject: `Booking Confirmation - ${booking.locationName} on ${dayjs(booking.date).format('MMMM D, YYYY')}`,
      html: `<p>Hi ${order.firstName},</p>
      <p>Thank you for your booking at ${booking.locationName} on ${dayjs(booking.date).format('MMMM D, YYYY')}.</p>
      <p>Your booking details:</p>
      <ul>
        <li>Location: ${booking.locationName}</li>
        <li>Date: ${dayjs(booking.date).format('MMMM D, YYYY')}</li>
        <li>Anglers: ${booking.anglers.map((a) => a.fullName).join(', ')}</li>
      </ul>
      <p>Tight lines!</p>
      <p>Best regards,</p>
      <p>The UHTFC Team</p>`,
    })

    // send email to location owner/contact
    // first we need to get the location details to get the contact email
    const location = await payload.findByID({
      collection: 'locations',
      id: booking.location,
    })
    const locationNotificationEmail = location ? getLocationNotificationEmail(location) : null

    if (locationNotificationEmail) {
      await payload.sendEmail({
        to: locationNotificationEmail,
        subject: `New Booking - ${booking.locationName} on ${dayjs(booking.date).format('MMMM D, YYYY')}`,
        html: `<p>Hi Location Owner/Contact,</p>
        <p>A new booking has been made for ${booking.locationName} on ${dayjs(booking.date).format('MMMM D, YYYY')}.</p>
        <p>Booking details:</p>
        <ul>
          <li>Name: ${booking.firstName} ${booking.lastName}</li>
          <li>Email: ${booking.email}</li>
          <li>Anglers: ${booking.anglers.map((a) => a.fullName).join(', ')}</li>
        </ul>        
        <p>Best regards,</p>
        <p>The UHTFC Team</p>`,
      })
    }
  }
}
// npx wrangler versions upload
