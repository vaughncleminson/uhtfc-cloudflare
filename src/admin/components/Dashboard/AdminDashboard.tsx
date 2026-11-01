import type { Params, Payload } from 'payload'
import { formatAdminURL } from 'payload/shared'
import { getDashboardData } from '@/dashboard/getDashboardData'
import { formatDisplayDate } from '@/utils/date'
import { CaughtCell } from '../CatchReturns/CaughtCell'
import { UserNameCell } from '../CatchReturns/UserNameCell'
import { CatchReturnFilters } from './CatchReturnFilters'
import { DashboardDetailsModal } from './DashboardDetailsModal'
import './AdminDashboard.scss'

type AdminDashboardProps = {
  payload: Payload
  searchParams?: Params
}

export const AdminDashboard = async ({ payload, searchParams }: AdminDashboardProps) => {
  const {
    bookingSummaries,
    endDate,
    recentCatchReturns: recentCatchReturnsResult,
    showCaught,
    showComments,
    startDate,
  } = await getDashboardData(payload, searchParams)

  const formattedEndDate = endDate
  const formattedStartDate = startDate

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
          <h2>Last Catch Returns</h2>
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
