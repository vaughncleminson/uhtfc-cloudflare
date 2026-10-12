import { sql } from '@payloadcms/db-d1-sqlite'
import type { Params, Payload } from 'payload'
import { formatAdminURL } from 'payload/shared'
import { formatDisplayDate } from '@/utils/date'
import { CaughtCell } from '../CatchReturns/CaughtCell'
import { UserNameCell } from '../CatchReturns/UserNameCell'
import { DashboardDetailsModal } from './DashboardDetailsModal'
import './AdminDashboard.scss'

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

  const [bookingSummaries, catchReturnSummaries, recentCatchReturnsResult] = await Promise.all([
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
        COALESCE(SUM(catch_returns_returns.quantity), 0) AS TotalCatches,
        CAST(ROUND(COALESCE(
          SUM(catch_returns_returns.length * catch_returns_returns.quantity)
            / NULLIF(SUM(catch_returns_returns.quantity), 0),
          0
        ), 0) AS INTEGER) AS AvgLength,
        COALESCE(MAX(catch_returns_returns.length), 0) AS MaxLargeFish
      FROM bookings
      INNER JOIN locations ON locations.id = bookings.location_id
      LEFT JOIN catch_returns ON catch_returns.booking_id = bookings.id
      LEFT JOIN catch_returns_returns ON catch_returns_returns._parent_id = catch_returns.id
      WHERE DATE(bookings.date) >= DATE(${formattedStartDate})
        AND DATE(bookings.date) <= DATE(${formattedEndDate})
      GROUP BY locations.type
    `),
    payload.find({
      collection: 'catchReturns',
      where: {
        returnCompleted: {
          equals: true,
        },
      },
      depth: 0,
      limit: 5,
      sort: '-updatedAt',
      select: {
        updatedAt: true,
        userId: true,
        locationName: true,
        stats: true,
        comments: true,
      },
    }),
  ])

  return (
    <div>
      <h1>
        Dashboard - {formatDisplayDate(startDate)} to {formatDisplayDate(endDate)}
      </h1>
      <section aria-label="Bookings" className="card dashboard-summary">
        <h2>Bookings</h2>
        <div className="dashboard-summary__table-wrap">
          <table className="dashboard-summary__table">
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
                  <td className="dashboard-summary__text">{summary.CountOfRods}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section aria-label="Catch Returns" className="card dashboard-summary">
        <h2>Catch Returns</h2>
        <div className="dashboard-summary__table-wrap">
          <table className="dashboard-summary__table">
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
                  <td className="dashboard-summary__text">{summary.TotalCatches ?? 0}</td>
                  <td className="dashboard-summary__text">{summary.AvgLength ?? 0}</td>
                  <td className="dashboard-summary__text">{summary.MaxLargeFish ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section aria-label="Latest completed catch returns" className="card dashboard-summary">
        <h2>Latest Completed Catch Returns</h2>
        <div className="dashboard-summary__table-wrap">
          <table className="dashboard-summary__table">
            <thead>
              <tr>
                <th>Updated</th>
                <th>User</th>
                <th>Location</th>
                <th>Caught</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {recentCatchReturnsResult.docs.map((catchReturn) => (
                <tr key={catchReturn.id}>
                  <td>
                    <a
                      href={formatAdminURL({
                        adminRoute: payload.config.routes.admin,
                        path: `/collections/catchReturns/${encodeURIComponent(String(catchReturn.id))}`,
                      })}
                    >
                      {formatDisplayDate(catchReturn.updatedAt)}
                    </a>
                  </td>
                  <td>
                    <UserNameCell cellData={catchReturn.userId} payload={payload} />
                  </td>
                  <td>{catchReturn.locationName}</td>
                  <td>
                    <CaughtCell rowData={catchReturn} />
                  </td>
                  <td>{catchReturn.comments || ''}</td>
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
