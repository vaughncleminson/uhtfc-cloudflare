import { sql } from '@payloadcms/db-d1-sqlite'
import type { Params, Payload } from 'payload'
import { formatAdminURL } from 'payload/shared'
import { formatDisplayDate } from '@/utils/date'
import { CaughtCell } from '../CatchReturns/CaughtCell'
import { UserNameCell } from '../CatchReturns/UserNameCell'
import { CatchReturnFilters } from './CatchReturnFilters'
import { DashboardDetailsModal } from './DashboardDetailsModal'
import './AdminDashboard.scss'
import { SQLiteAsyncDialect } from 'drizzle-orm/sqlite-core'

type AdminDashboardProps = {
  payload: Payload
  searchParams?: Params
}

type BookingSummary = {
  CountOfRods: number
  LocationType: string
  AvgLength: number | null
  MaxLargeFish: number | null
  TotalCatches: number | null
}

type RecentCatchReturn = {
  comments: string | null
  id: number
  location_name: string | null
  nil_return: number | null
  return_completed: number
  stats_large_fish: number
  stats_total: number
  created_at: string
  userId: number | null
}

const formatDashboardDate = (date: Date) => date.toISOString().slice(0, 10)

const getSelectedBoolean = (value: string | string[] | undefined) => {
  const selectedValue = Array.isArray(value) ? value[0] : value
  return selectedValue !== 'false'
}

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
  const showCaught = getSelectedBoolean(searchParams?.caught)
  const showComments = getSelectedBoolean(searchParams?.comments)
  const endDate = new Date(`${formattedEndDate}T00:00:00`)
  const startDate = new Date(`${formattedStartDate}T00:00:00`)

  const recentCatchReturnsQuery = sql`
    SELECT
      id,
      return_completed,
      created_at,
      nil_return,
      location_name,
      comments,
      user_id AS userId,
      stats_total,
      stats_large_fish
    FROM catch_returns
    WHERE return_completed = 1
      AND (
        (${showCaught ? 1 : 0} = 1 AND nil_return = 0)
        OR (${showComments ? 1 : 0} = 1 AND comments <> '')
      )
    ORDER BY created_at DESC
    LIMIT 7
  `

  const dialect = new SQLiteAsyncDialect()
  const compiledQuery = dialect.sqlToQuery(recentCatchReturnsQuery)

  console.log('SQL:', compiledQuery.sql)
  console.log('Params:', compiledQuery.params)

  console.log('RecentCatchReturn SQL:', recentCatchReturnsQuery, {
    showCaught,
    showComments,
  })

  const [bookingSummaries, recentCatchReturnsResult] = await Promise.all([
    payload.db.drizzle.all<BookingSummary>(sql`
      SELECT
        locations.type AS LocationType,
        COUNT(bookings_anglers.id) AS CountOfRods,
        COALESCE(SUM(catch_returns_returns.quantity), 0) AS TotalCatches,
        CAST(ROUND(COALESCE(
          SUM(catch_returns_returns.length * catch_returns_returns.quantity)
            / NULLIF(SUM(catch_returns_returns.quantity), 0),
          0
        ), 0) AS INTEGER) AS AvgLength,
        COALESCE(MAX(catch_returns_returns.length), 0) AS MaxLargeFish
      FROM bookings
      INNER JOIN locations ON locations.id = bookings.location_id
      INNER JOIN bookings_anglers ON bookings_anglers._parent_id = bookings.id
      LEFT JOIN catch_returns ON catch_returns.booking_id = bookings.id
      LEFT JOIN catch_returns_returns ON catch_returns_returns._parent_id = catch_returns.id
      WHERE DATE(bookings.date) >= DATE(${formattedStartDate})
        AND DATE(bookings.date) <= DATE(${formattedEndDate})
      GROUP BY locations.type
    `),
    payload.db.drizzle.all<RecentCatchReturn>(recentCatchReturnsQuery),
  ])

  return (
    <div>
      <section aria-label="Bookings" className="card dashboard-summary">
        <h2>
          Rods and Catches - {formatDisplayDate(startDate)} to {formatDisplayDate(endDate)}
          <DashboardDetailsModal endDate={formattedEndDate} startDate={formattedStartDate} />
        </h2>

        <div className="dashboard-summary__table-wrap">
          <table className="dashboard-summary__table">
            <thead>
              <tr>
                <th>Location Type</th>
                <th>Count of Rods</th>
                <th>Total Catches</th>
                <th>Average Length</th>
                <th>Largest Fish</th>
              </tr>
            </thead>
            <tbody>
              {bookingSummaries.map((summary) => (
                <tr key={summary.LocationType}>
                  <td>{summary.LocationType}</td>
                  <td className="dashboard-summary__text">{summary.CountOfRods}</td>
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
        <div className="dashboard-summary__heading">
          <h2>Catch Returns</h2>
          <CatchReturnFilters showCaught={showCaught} showComments={showComments} />
        </div>
        <div className="dashboard-summary__table-wrap">
          <table className="dashboard-summary__table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Location</th>
                <th>User</th>
                <th>Caught</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {recentCatchReturnsResult.map((catchReturn) => (
                <tr key={catchReturn.id}>
                  <td>
                    <a
                      href={formatAdminURL({
                        adminRoute: payload.config.routes.admin,
                        path: `/collections/catchReturns/${encodeURIComponent(String(catchReturn.id))}`,
                      })}
                    >
                      {formatDisplayDate(catchReturn.created_at)}
                    </a>
                  </td>
                  <td>{catchReturn.location_name}</td>
                  <td>
                    <UserNameCell cellData={catchReturn.userId} payload={payload} />
                  </td>
                  <td className="dashboard-summary__nowrap">
                    <CaughtCell rowData={catchReturn} />
                  </td>
                  <td>{catchReturn.comments || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
