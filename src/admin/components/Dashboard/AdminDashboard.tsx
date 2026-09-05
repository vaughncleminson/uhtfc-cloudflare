import { sql } from '@payloadcms/db-d1-sqlite'
import type { Payload } from 'payload'

type AdminDashboardProps = {
  payload: Payload
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

export const AdminDashboard = async ({ payload }: AdminDashboardProps) => {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 30)

  const formattedEndDate = formatDashboardDate(endDate)
  const formattedStartDate = formatDashboardDate(startDate)

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
    </div>
  )
}
