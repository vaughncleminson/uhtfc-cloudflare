# CatchReturn.booking relationship is required, not optional

We're adding a rule that blocks new Bookings when a member's Most Recent Catch Return is
outstanding, which requires reliably ordering a member's Catch Returns by their linked Booking's
date. The `booking` relationship on `CatchReturns` was previously optional (no existing data relied
on it being null — 0 of 84 local rows have a null `booking_id`). We're making it `required: true`:
a Catch Return cannot exist without the Booking it reports on, so the relationship should never be
absent at creation time.

This enforces at the database layer too: Payload's D1/SQLite schema generator makes `booking_id`
`NOT NULL`, regardless of the FK's own `ON DELETE SET NULL` action, so a `Booking` can never
actually be nulled out of a linked `CatchReturn` after the fact — attempting to delete a `Booking`
that still has a linked `CatchReturn` fails with a DB constraint error instead. We accept that as
the intended behavior: deleting a `Booking` with a linked `CatchReturn` is blocked. Ordering and
eligibility logic always has a `booking` to read a date from, so no `createdAt` fallback is needed.
