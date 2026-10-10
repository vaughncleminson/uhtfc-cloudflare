import type { DefaultServerCellComponentProps } from 'payload'
import { formatDisplayDate } from '@/utils/date'

export async function BookingDateCell({ cellData, payload }: DefaultServerCellComponentProps) {
  if (typeof cellData !== 'number') {
    return <span>-</span>
  }

  try {
    const booking = await payload.findByID({
      collection: 'bookings',
      id: cellData,
      depth: 0,
      select: {
        date: true,
      },
    })

    return <span>{booking.date ? formatDisplayDate(booking.date) : '-'}</span>
  } catch {
    return <span>-</span>
  }
}

export default BookingDateCell
