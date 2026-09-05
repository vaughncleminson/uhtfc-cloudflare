import { sql } from '@payloadcms/db-d1-sqlite'
import type { Params, Payload } from 'payload'
import { DashboardDetailsModal } from './DashboardDetailsModal'

type AdminDashboardProps = {
  payload: Payload
  searchParams?: Params
}

type BookingSummary = {
  CountOfRods: number
  LocationType: string
}

type CatchReturnSummary = {
  AvgLength: number | null
  LocationType: string
  MaxLargeFish: number | null
  TotalCatches: number | null
}

const formatDashboardDate = (date: Date) => date.toISOString().slice(0, 10)
const formatFriendlyDashboardDate = (date: Date) =>
  date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const getSelectedDate = (value: string | string[] | undefined, fallback: Date) => {
  const date = Array.isArray(value) ? value[0] : value

  return typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? date
    : formatDashboardDate(fallback)
}

export const AdminDashboard = async ({ payload, searchParams }: AdminDashboardProps) => {
  const defaultEndDate = new Date()
  const defaultStartDate = new Date(defaultEndDate)
  defaultStartDate.setDate(defaultStartDate.getDate() - 30)

  const formattedEndDate = getSelectedDate(searchParams?.endDate, defaultEndDate)
  const formattedStartDate = getSelectedDate(searchParams?.startDate, defaultStartDate)
  const endDate = new Date(`${formattedEndDate}T00:00:00`)
  const startDate = new Date(`${formattedStartDate}T00:00:00`)

  const [bookingSummaries, catchReturnSummaries] = await Promise.all([
    payload.db.drizzle.all<BookingSummary>(sql`
      SELECT
        locations.type AS LocationType,
        COUNT(bookings_anglers.id) AS CountOfRods
      FROM bookings
      INNER JOIN locations ON locations.id = bookings.location_id
      INNER JOIN bookings_anglers ON bookings_anglers._parent_id = bookings.id
      WHERE DATE(bookings.date) >= DATE(${formattedStartDate})
        AND DATE(bookings.date) <= DATE(${formattedEndDate})
      GROUP BY locations.type
    `),
    payload.db.drizzle.all<CatchReturnSummary>(sql`
      SELECT
        locations.type AS LocationType,
        SUM(catch_returns.stats_total) AS TotalCatches,
        CAST(ROUND(AVG(catch_returns.stats_average_length), 0) AS INTEGER) AS AvgLength,
        MAX(catch_returns.stats_large_fish) AS MaxLargeFish
      FROM bookings
      INNER JOIN locations ON locations.id = bookings.location_id
      INNER JOIN bookings_anglers ON bookings_anglers._parent_id = bookings.id
      LEFT JOIN catch_returns ON catch_returns.booking_id = bookings.id
      WHERE DATE(bookings.date) >= DATE(${formattedStartDate})
        AND DATE(bookings.date) <= DATE(${formattedEndDate})
      GROUP BY locations.type
    `),
  ])

  return (
    <div>
      <h1>
        Dashboard for {formatFriendlyDashboardDate(startDate)} to{' '}
        {formatFriendlyDashboardDate(endDate)}
      </h1>
      <section
        aria-label="Bookings"
        style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'minmax(140px, 1fr) 3fr' }}
        className="card"
      >
        <h2>Bookings</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th>Location Type</th>
                <th>Count of Rods</th>
              </tr>
            </thead>
            <tbody>
              {bookingSummaries.map((summary) => (
                <tr key={summary.LocationType}>
                  <td>{summary.LocationType}</td>
                  <td align="right">{summary.CountOfRods}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section
        aria-label="Catch Returns"
        style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'minmax(140px, 1fr) 3fr' }}
        className="card"
      >
        <h2>Catch Returns</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th>Location Type</th>
                <th>Total Catches</th>
                <th>Average Length</th>
                <th>Largest Fish</th>
              </tr>
            </thead>
            <tbody>
              {catchReturnSummaries.map((summary) => (
                <tr key={summary.LocationType}>
                  <td>{summary.LocationType}</td>
                  <td align="right">{summary.TotalCatches ?? 0}</td>
                  <td align="right">{summary.AvgLength ?? 0}</td>
                  <td align="right">{summary.MaxLargeFish ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <DashboardDetailsModal endDate={formattedEndDate} startDate={formattedStartDate} />
    </div>
  )
}
