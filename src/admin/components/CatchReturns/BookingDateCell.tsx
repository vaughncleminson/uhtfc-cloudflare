import type { DefaultServerCellComponentProps } from 'payload'
import dayjs from 'dayjs'

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

    return <span>{booking.date ? dayjs(booking.date).format('DD-MM-YYYY') : '-'}</span>
  } catch {
    return <span>-</span>
  }
}

export default BookingDateCell
