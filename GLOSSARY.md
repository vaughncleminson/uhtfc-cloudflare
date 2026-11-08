# UHTFC Bookings & Catch Returns

Domain for club members booking fishing visits to club water, and reporting what they caught
afterward.

## Language

**Catch Return**:
The mandatory post-visit report a member files for a single Booking, recording what (if anything)
was caught. Exactly one Catch Return exists per Booking, created automatically on the booking's
date; it belongs to the Booking's owner, not to individual anglers on a shared booking.
_Avoid_: Return, report, catch log.

**Completed Catch Return**:
A Catch Return the member has filled in and submitted, regardless of whether anything was caught
(a Nil Return still counts as completed). The opposite is an *outstanding* Catch Return.
_Avoid_: Submitted, filed.

**Eligible Catch Return**:
A Catch Return whose Booking date falls strictly before today. Catch Returns for today's or future
bookings are not yet eligible to be judged complete or outstanding, since the visit hasn't happened
(or hasn't finished) yet.
_Avoid_: Past catch return, due catch return.

**Most Recent Catch Return**:
Among a member's Eligible Catch Returns, the one whose Booking date is closest to today. This is
the record whose completion status gates whether the member can make a new Booking.
_Avoid_: Last catch return, latest return.

**Booking**:
A reservation made by a member to fish a specific Location on a specific date. Creates exactly one
Catch Return once that date arrives.
_Avoid_: Reservation, trip.
