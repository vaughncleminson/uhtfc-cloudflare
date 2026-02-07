'use client'

import { validateBookingDates, ValidateBookingProps } from '@/admin/utils/validateBookingDates'
import { orderAtom } from '@/frontend/atoms/orderAtom'
import { userAtom } from '@/frontend/atoms/userAtom'
import { Booking, bookingSchema } from '@/frontend/schemas/bookingSchema'
import { LineItem } from '@/frontend/schemas/lineItemSchema'
import { Membership } from '@/frontend/schemas/membershipSchema'
import { Order } from '@/frontend/schemas/orderScema'
import { BookingHistory, Location, Setting, User } from '@/payload-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useAtom } from 'jotai'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Button from '../ui/Button'
import { useToast } from '../ui/ToastProvider'
dayjs.extend(isBetween)

type BookingFormProps = {
  bookingSettings: BookingHistory[]
  locations: Location[]
  selectedLocation?: Location | null
  settings: Setting
}

type LocationOption = {
  locationId: number
  locationTitle: string
  available: boolean
  reason?: string
  rodLimit: number
  rodsAvailable: number
  rodsBooked: number
}

type Angler = {
  userId?: number | null | undefined
  fullName?: string | null | undefined
  firstName?: string | null | undefined
  lastName?: string | null | undefined
  email?: string | null | undefined
  role?: 'non-member' | 'member' | 'member-guest' | 'corporate-guest' | 'admin' | null | undefined
}

export default function BookingForm(props: BookingFormProps) {
  const searchParams = useSearchParams()
  const toast = useToast()
  const selectedLocationId = parseInt(searchParams.get('location')!)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [user, setUser] = useAtom<User | null>(userAtom)
  const [order, setOrder] = useAtom<Order | null>(orderAtom)
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<Booking>()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [hoveredString, setHoveredString] = useState<{ title: string; class: string } | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null)
  const locationOptions = useRef<LocationOption[]>([])
  const [anglers, setAnglers] = useState<Angler[]>([])
  const [angler, setAngler] = useState<Angler>()
  const hasShown = useRef(false)
  const [mainContact, setMainContact] = useState<Angler>()
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()
  const [cartBookings, setCartBookings] = useState<BookingHistory[]>([])

  useEffect(() => {
    if (user && props.locations) {
      let cartBookingHistory: BookingHistory[] = checkCartBookings()
      const initAnglers: Angler[] = []

      const mainContact: Angler = {
        userId: user.id || 0,
        fullName: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }
      setMainContact(mainContact)
      if (user.role != 'admin') {
        initAnglers.push(mainContact)
      }
      setAnglers(initAnglers)
      if (props.locations) {
        console.log(selectedDate)
        console.log(props.locations)
        console.log(user)
        console.log(props.bookingSettings)
        console.log(selectedLocationId)
        const locationOps = validateBookingDates({
          date: selectedDate,
          locations: props.locations,
          user: user,
          bookingSettings: [...props.bookingSettings, ...cartBookingHistory],
          selectedLocationId: selectedLocationId,
          settings: props.settings,
        } as ValidateBookingProps)
        locationOptions.current = locationOps
      }

      if (selectedLocationId) {
        const selectedLocation = locationOptions.current.find(
          (location) => location.locationId === selectedLocationId,
        )
        if (selectedLocation?.available) {
          setSelectedLocation(selectedLocation || null)
        }
      }
    }
  }, [user, props.locations])

  //Add the current cart bookings to the validation to avoid booking same day or same week etc
  const checkCartBookings = (): BookingHistory[] => {
    let cartBookingHistory: BookingHistory[] = []
    const cBookings = order?.products.filter(
      (product: Booking | Membership) => product.productType === 'booking',
    ) as Booking[]
    if (cBookings && cBookings!.length > 0) {
      for (let b of cBookings!) {
        const bookingHistory: BookingHistory = {
          id: 0,
          locationId: b.location,
          firstName: b.firstName,
          lastName: b.lastName,
          email: b.email,
          userId: b.userId,
          members: 0,
          nonMembers: 0,
          corporateGuests: 0,
          date: b.date,
          rodsBooked: 0,
          updatedAt: b.date,
          createdAt: b.date,
        }
        cartBookingHistory.push(bookingHistory)
      }
    }
    setCartBookings(cartBookingHistory)
    return cartBookingHistory
  }

  const submit = async () => {
    const bookingObject: Booking = {
      productType: 'booking',
      userId: mainContact!.userId || 0,
      firstName: mainContact!.firstName || '',
      lastName: mainContact!.lastName || '',
      email: mainContact!.email || '',
      role: mainContact!.role || 'non-member',
      location: selectedLocation?.locationId || -1,
      locationName: selectedLocation?.locationTitle || '',
      date: selectedDate.toISOString(),
      anglers: anglers,
      totalAmount: 0,
      lineItems: [
        {
          displayName: '',
          description: '',
          quantity: 0,
          pricingDetails: { price: 0 },
        },
      ],
      acceptTerms: acceptTerms,
    }

    const result = bookingSchema.safeParse(bookingObject)

    if (!result.success) {
      result.error.errors.forEach((err) => {
        toast.error(err.message)
      })
    } else {
      setErrors({})
      try {
        setLoading(true)

        const { totalAmount, lineItems } = calculateLineItems(anglers)
        bookingObject.totalAmount = totalAmount
        bookingObject.lineItems = lineItems
        if (!order) {
          setOrder({
            userId: mainContact!.userId || 0,
            firstName: mainContact!.firstName || '',
            lastName: mainContact!.lastName || '',
            email: mainContact!.email || '',
            role: mainContact!.role || 'non-member',
            paymentStatus: 'not-required',
            totalAmount: bookingObject.totalAmount,
            products: [bookingObject],
            lineItems: [
              {
                displayName: 'Permit fees',
                description: `${bookingObject.locationName} (${bookingObject.date})`,
                quantity: 1,
                pricingDetails: { price: bookingObject.totalAmount },
              },
            ],
          })
        } else {
          order.products.push(bookingObject)
          order.totalAmount += bookingObject.totalAmount
          order.lineItems.push({
            displayName: 'Permit fees',
            description: `${bookingObject.locationName} (${bookingObject.date})`,
            quantity: 1,
            pricingDetails: { price: bookingObject.totalAmount },
          })
          setOrder(order)
        }
        router.push('/checkout')
        // Add to order
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
  }

  const calculateLineItems = (
    anglers: Angler[],
  ): { totalAmount: number; lineItems: LineItem[] } => {
    let totalAmount = 0
    const lineItems: LineItem[] = []

    anglers.forEach((angler) => {
      let fees = 0
      if (angler.role === 'member-guest') {
        fees = props.settings.fishingFees['memberGuest']
      } else if (angler.role === 'non-member') {
        fees = props.settings.fishingFees['nonMember']
      } else {
        fees = 0
      }
      if (angler.role) {
        const lineItem: LineItem = {
          displayName: `Day fishing permit for ${angler.role}`,
          description: 'Booking fees',
          quantity: 1,
          pricingDetails: { price: fees },
        }
        totalAmount += lineItem.pricingDetails.price
        lineItems.push(lineItem)
      }
    })

    return { totalAmount, lineItems }
  }

  const highlightFutureDates = (date: Date): string => {
    const today = dayjs()
    const twoWeeksLater = today.add(props.settings.bookingRules.allowedFutureBookingDays, 'days')

    if (
      dayjs(date).isAfter(today.subtract(1, 'day'), 'day') &&
      dayjs(date).isBefore(twoWeeksLater, 'day')
    ) {
      return 'future-available-date'
    }

    return ''
  }

  const maxDate = () => {
    const today = dayjs()
    const twoWeeksLater = today.add(
      props.settings.bookingRules.allowedFutureBookingDays - 1,
      'days',
    )
    return user && user.role == 'admin' ? undefined : twoWeeksLater.toDate()
  }

  const onDateChange = (date: Date) => {
    setSelectedDate(date as Date)
    const bookingOpts = validateBookingDates({
      date: date,
      locations: props.locations,
      user: user,
      settings: props.settings,
      bookingSettings: [...props.bookingSettings, ...cartBookings],
      selectedLocationId: selectedLocationId,
    } as ValidateBookingProps)
    locationOptions.current = bookingOpts
  }

  const handleDayMouseLeave = () => {
    setHoveredString(null) // Clear the hovered date
  }

  const getLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationOpt = locationOptions.current.find(
      (location) => location.locationId === parseInt(e.target.value),
    )
    setSelectedLocation(locationOpt || null)
  }

  const addAngler = () => {
    if (anglers.length == 0) {
      if (!angler || !angler.firstName || !angler.lastName || !angler.role || !angler.email) {
        toast.error('Please add all the required main contact details.')
        return
      }
      setMainContact(angler)
    }
    setAnglers((prev) => [...prev, angler!])
  }

  const removeAngler = (index: number) => {
    setAnglers((prev) => prev.filter((_, i) => i !== index))
  }

  const locationOptionText = (location: LocationOption) => {
    if (location.available) {
      return `${location.locationTitle} (${location.rodsAvailable} rod${location.rodsAvailable == 1 ? '' : 's'} available${location.rodsBooked == 0 ? ')' : `, ${location.rodsBooked} booked)`}`
    } else {
      return `${location.locationTitle} ${location.reason ? `(${location.reason})` : '(Fully Booked)'}`
    }
  }

  const adminBooking = () => {
    if (user && user.role == 'admin') {
      return (
        <>
          <label className="label" htmlFor="fullName">
            First name
          </label>
          <input
            id="firstName"
            onChange={(e) =>
              setAngler((prev) => ({
                ...prev!,
                firstName: e.target.value,
              }))
            }
            type="text"
            value={angler?.firstName || ''}
            className="input"
            placeholder={`First name`}
          />

          <label className="label" htmlFor="lastName">
            Last name
          </label>
          <input
            id="lastName"
            onChange={(e) =>
              setAngler((prev) => ({
                ...prev!,
                lastName: e.target.value,
              }))
            }
            type="text"
            value={angler?.lastName || ''}
            className="input"
            placeholder={`Last name`}
          />

          <>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              onChange={(e) =>
                setAngler((prev) => ({
                  ...prev!,
                  email: e.target.value,
                }))
              }
              value={angler?.email || ''}
              type="email"
              className="input"
              placeholder="Email"
            />
            <label className="label" htmlFor="role">
              Status
            </label>
            <select
              id="role"
              onChange={(e) =>
                setAngler((prev) => ({
                  ...prev!,
                  role: e.target.value as User['role'],
                }))
              }
              className={`select w-full`}
              value={angler?.role || 'select'}
            >
              <option disabled value="select">
                SELECT STATUS
              </option>
              <option value="member">Club Member</option>
              <option value="member-guest">Club Member guest</option>
              <option value="non-member">Non-member</option>
              <option value="corporate-guest">Corporate member guest</option>
            </select>
          </>

          <Button onClick={() => addAngler()} title={`ADD MAIN CONTACT`} loading={loading} />
        </>
      )
    }
  }

  const showOptionsPerRole = (userRole: User['role'], role: User['role']) => {
    if (
      userRole == 'admin' &&
      (role == 'member' ||
        role == 'non-member' ||
        role == 'corporate-guest' ||
        role == 'member-guest')
    ) {
      return true
    } else if (userRole == 'member' && (role == 'member' || role == 'member-guest')) {
      return true
    } else if (userRole == 'non-member' && role == 'non-member') {
      return true
    } else if (userRole == 'corporate-guest' && role == 'corporate-guest') {
      return true
    }
    return false
  }

  return (
    <div
      id="booking"
      className="relative flex flex-col bg-white p-10 pt-8 gap-2 border rounded shadow-lg"
    >
      <div className="flex gap-2">
        <h1 className="text-2xl mb-2">BOOK WATER</h1>
      </div>
      <div className="relative flex flex-col">
        <label className="label" htmlFor="date">
          DATE
        </label>

        <DatePicker
          id="date"
          className="input z-50"
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          maxDate={maxDate()}
          selected={selectedDate}
          onChange={(date) => onDateChange(date as Date)}
          dayClassName={highlightFutureDates}
          onMonthMouseLeave={handleDayMouseLeave}
        />
        {hoveredString && (
          <div className={`tooltip ${hoveredString.class}`}>
            <p>{hoveredString.title}</p>
          </div>
        )}
      </div>
      <label className="label" htmlFor="location">
        LOCATION
      </label>
      <select
        id="location"
        onChange={getLocation}
        value={selectedLocation ? selectedLocation.locationId : 'select'}
        className={`select`}
      >
        <option disabled value="select">
          SELECT LOCATION
        </option>
        {locationOptions.current.map((location) => {
          return (
            <option
              className="flex justify-between items-center"
              key={location.locationId}
              value={location.locationId}
              disabled={!location.available}
            >
              {locationOptionText(location)}
            </option>
          )
        })}
      </select>
      {user && user.role == 'admin' && anglers.length == 0 && adminBooking()}
      {anglers.length > 0 && (
        <>
          <label className="label" htmlFor="anglers">
            ANGLERS
          </label>
          <div className="flex flex-col border rounded overflow-hidden text-sm">
            {anglers.map((angler, index) => {
              return (
                <div key={index} className={`flex ${index == 0 ? 'bg-slate-100' : ''}`}>
                  <div key={index} className="w-full px-4 py-3">
                    {angler.firstName &&
                      `${index + 1}. ${angler.firstName ?? ''} ${angler.lastName ?? ''} ${index > 0 ? '' : `(${angler.role})`}`}
                    {index > 0 && <>{`${index + 1}. ${angler.role}`}</>}
                  </div>
                  {user && user!.role == 'admin' && index == 0 && (
                    <div className="flex pr-5 items-center justify-end gap-2">
                      <div
                        onClick={() => removeAngler(index)}
                        className="flex cursor-pointer border w-6 bg-white h-6 justify-center items-center"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </div>
                    </div>
                  )}
                  {index > 0 && (
                    <div className="flex pr-5 items-center justify-end gap-2">
                      <div
                        onClick={() => removeAngler(index)}
                        className="flex cursor-pointer border w-6 bg-white h-6 justify-center items-center"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {user && (
              <div className="flex overflow-hidden rounded-b">
                <select
                  disabled={!selectedLocation || anglers.length >= selectedLocation!.rodsAvailable}
                  onChange={(e) => {
                    setAnglers((prev) => [
                      ...prev,
                      {
                        role: e.target.value as User['role'],
                      },
                    ])
                    setTimeout(() => {
                      e.target.value = 'add'
                    }, 100)
                  }}
                  className={`select text-white w-full border-0 outline-0 bg-slate-700 bg-opacity-50`}
                >
                  <option value="add">
                    {selectedLocation && anglers.length >= selectedLocation!.rodsAvailable
                      ? 'MAX RODS ADDED'
                      : 'ADD ANGLER'}
                  </option>
                  {showOptionsPerRole(user!.role, 'member') && (
                    <option value="member">Club Member</option>
                  )}
                  {showOptionsPerRole(user!.role, 'member-guest') && (
                    <option value="member-guest">Club Member guest</option>
                  )}
                  {showOptionsPerRole(user!.role, 'non-member') && (
                    <option value="non-member">Non-member</option>
                  )}
                  {showOptionsPerRole(user!.role, 'corporate-guest') && (
                    <option value="corporate-guest">Corporate member guest</option>
                  )}
                </select>
              </div>
            )}
          </div>
        </>
      )}
      {anglers.length > 0 && (
        <div>
          <label>
            <input
              onChange={(e) => setAcceptTerms(e.target.checked)}
              checked={acceptTerms}
              type="checkbox"
            />{' '}
            I accept the terms and conditions of this booking.
          </label>
          <Button className="w-full" onClick={() => submit()} title="BOOK NOW" loading={loading} />
        </div>
      )}
    </div>
  )
}
