import { BookingHistory, Location, Setting, User } from '@/payload-types'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { LocationOption } from '../types/locationOptions'
dayjs.extend(isBetween)

export type ValidateBookingProps = {
  date: Date
  locations: Location[]
  user: User
  bookingSettings: BookingHistory[]
  settings: Setting
  selectedLocationId?: number | null
}

export const validateBookingDates = (props: ValidateBookingProps): LocationOption[] => {
  const { date, locations, user, bookingSettings: bookingSettings, selectedLocationId } = props
  const locationOptions: LocationOption[] = []
  locations.forEach((location) => {
    const locationDetails = location.layout.find((layout) => layout.blockType == 'locationDetails')
    if (user && locationDetails) {
      const locationOption = {
        locationId: location.id,
        locationTitle: location.title,
        available: true,
        rodLimit: locationDetails?.rodLimit || 0,
        rodsAvailable: locationDetails?.rodLimit || 0,
        rodsBooked: 0,
      }

      if (!locationDetails.membersOnly && user.role == 'non-member') {
        locationOptions.push(locationOption)
      } else if (user.role != 'non-member') {
        locationOptions.push(locationOption)
      }
    }
  })

  // CHECK TEMPORARY CLOSURES AND USER SPECIFIC BOOKINGS
  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i]
    if (loc.temporarilyClosed) {
      const closureFrom = dayjs(loc.closureFromDate).startOf('day')
      const closureTo = dayjs(loc.closureToDate).endOf('day')
      const dateToCheck = dayjs(date).startOf('day')

      // Check if the date is within the range (inclusive)
      const isClosed =
        dateToCheck.isSame(closureFrom, 'day') ||
        dateToCheck.isSame(closureTo, 'day') ||
        (dateToCheck.isAfter(closureFrom) && dateToCheck.isBefore(closureTo))

      if (isClosed) {
        const locationIndex = locationOptions.findIndex(
          (location) => location.locationId === loc.id,
        )
        if (locationIndex !== -1) {
          locationOptions[locationIndex].available = false
          locationOptions[locationIndex].rodsAvailable = 0
          locationOptions[locationIndex].rodsBooked = 0
          if (loc.closureReason) {
            locationOptions[locationIndex].reason = loc.closureReason
          }
          if (locationOptions[locationIndex].locationId == selectedLocationId) {
            locationOptions[locationIndex].reason = loc.closureReason || 'Fully Booked'
          }
        }
      }
    }

    let userBookings = bookingSettings.filter(
      (booking) =>
        booking.userId === user.id &&
        booking.locationId === loc.id &&
        dayjs(date)
          .startOf('day')
          .isBetween(
            dayjs(booking.date).startOf('day'),
            dayjs(booking.date).startOf('day').add(1, 'week'),
          ),
    )
    if (userBookings.length >= props.settings.bookingRules.sameLocationBookingInWeek) {
      const locationIndex = locationOptions.findIndex((location) => location.locationId === loc.id)
      if (locationIndex !== -1) {
        locationOptions[locationIndex].available = false
        locationOptions[locationIndex].reason = 'Once a week quota reached'
      }
    }
    userBookings = bookingSettings.filter(
      (booking) =>
        booking.userId === user.id &&
        booking.locationId === loc.id &&
        dayjs(date)
          .startOf('day')
          .isBetween(
            dayjs(booking.date).startOf('day'),
            dayjs(booking.date).startOf('day').add(1, 'month'),
          ),
    )
    if (userBookings.length >= props.settings.bookingRules.sameLocationBookingInMonth) {
      const locationIndex = locationOptions.findIndex((location) => location.locationId === loc.id)
      if (locationIndex !== -1) {
        locationOptions[locationIndex].available = false
        locationOptions[locationIndex].reason = 'Twice a month quota reached'
      }
    }
  }

  for (let i = 0; i < bookingSettings.length; i++) {
    // CHECK FUTURE BOOKINGS AVAILABILITY
    const futureBooking = bookingSettings[i]
    if (dayjs(date).format('DD/MM/YYYY') === dayjs(futureBooking.date).format('DD/MM/YYYY')) {
      const location = locationOptions.find(
        (location) => location.locationId === futureBooking.locationId,
      )
      const locationIndex = locationOptions.findIndex(
        (location) => location.locationId === futureBooking.locationId,
      )
      if (location) {
        const updatedLocation = {
          ...location,
          available: futureBooking.rodsBooked < location.rodLimit,
          rodsBooked: futureBooking.rodsBooked,
          rodsAvailable: location.rodLimit - futureBooking.rodsBooked,
        }
        if (!updatedLocation.available) {
          updatedLocation.reason = 'Fully Booked'
        }
        locationOptions[locationIndex] = updatedLocation
      }
    }

    // CHECK USER SPECIFIC BOOKINGS
    // CONSECUTIVE BOOKINGS
    //GET USER BOOKINGS
    const userBookings = bookingSettings.filter((booking) => booking.userId === user.id)
    for (let i = 0; i < userBookings.length; i++) {
      const booking = userBookings[i]

      if (
        props.settings.bookingRules.sameLocationBookingConsecutiveDays &&
        dayjs(date).startOf('day').isSame(dayjs(booking.date).startOf('day'))
      ) {
        //can't make two bookings on the same day
        locationOptions.forEach((location, index) => {
          locationOptions[index].available = false
          locationOptions[index].reason = 'One booking per day - select another date'
        })
      }
    }

    //REMOVE LOCATIONS THAT ARE CLOSED FOR THE SEASON
    const riverClosureFrom = dayjs(props.settings.riversClosed.closeDate).startOf('day')
    const riverClosureTo = dayjs(props.settings.riversClosed.openDate).endOf('day')
    const damClosureFrom = dayjs(props.settings.damsClosed.closeDate).startOf('day')
    const damClosureTo = dayjs(props.settings.damsClosed.openDate).endOf('day')
    const dateToCheck = dayjs(date)
    for (let i = 0; i < locations.length; i++) {
      const loc = locations[i]
      let closureFrom
      let closureTo
      // Check if the date is within the range (inclusive)
      if (loc.type == 'river') {
        closureFrom = riverClosureFrom
        closureTo = riverClosureTo
      } else if (loc.type == 'stillwater') {
        closureFrom = damClosureFrom
        closureTo = damClosureTo
      }
      const isClosed =
        dateToCheck.isSame(closureFrom, 'day') ||
        (dateToCheck.isAfter(closureFrom) && dateToCheck.isBefore(closureTo?.subtract(1, 'day')))

      if (isClosed) {
        const locationIndex = locationOptions.findIndex(
          (location) => location.locationId === loc.id,
        )
        if (locationIndex !== -1) {
          locationOptions.splice(locationIndex, 1)
        }
      }
    }
  }

  return locationOptions
}
