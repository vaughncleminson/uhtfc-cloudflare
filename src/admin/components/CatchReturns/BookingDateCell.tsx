import type { DefaultServerCellComponentProps } from 'payload'
import { formatAdminURL } from 'payload/shared'
import { formatDisplayDate } from '@/utils/date'

export async function BookingDateCell({
  cellData,
  collectionSlug,
  link,
  linkURL,
  payload,
  rowData,
  viewType,
}: DefaultServerCellComponentProps) {
  let value = '-'

  if (typeof cellData === 'number') {
    try {
      const booking = await payload.findByID({
        collection: 'bookings',
        id: cellData,
        depth: 0,
        select: {
          date: true,
        },
      })

      value = booking.date ? formatDisplayDate(booking.date) : '-'
    } catch {
      value = '-'
    }
  }

  if (!link) return <span>{value}</span>

  const href =
    linkURL ||
    formatAdminURL({
      adminRoute: payload.config.routes.admin,
      path: `/collections/${collectionSlug}${viewType === 'trash' ? '/trash' : ''}/${encodeURIComponent(String(rowData.id))}`,
    })

  return <a href={href}>{value}</a>
}

export default BookingDateCell
