import 'server-only'

import { sql } from '@payloadcms/db-d1-sqlite'
import type { Params, Payload } from 'payload'

export type BookingSummary = {
  AvgLength: number | null
  CountOfRods: number
  LocationType: string
  MaxLargeFish: number | null
  TotalCatches: number | null
}

export type RecentCatchReturn = {
  comments: string | null
  created_at: string
  id: number
  location_name: string | null
  nil_return: number | null
  return_completed: number
  stats_large_fish: number
  stats_total: number
  userId: number | null
  userName: string
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

export async function getDashboardData(payload: Payload, searchParams?: Params) {
  const defaultEndDate = new Date()
  const defaultStartDate = new Date(defaultEndDate)
  defaultStartDate.setDate(defaultStartDate.getDate() - 30)

  const endDate = getSelectedDate(searchParams?.endDate, defaultEndDate)
  const startDate = getSelectedDate(searchParams?.startDate, defaultStartDate)
  const showCaught = getSelectedBoolean(searchParams?.caught)
  const showComments = getSelectedBoolean(searchParams?.comments)

  const [bookingSummaries, recentCatchReturns] = await Promise.all([
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
      WHERE DATE(bookings.date) >= DATE(${startDate})
        AND DATE(bookings.date) <= DATE(${endDate})
      GROUP BY locations.type
    `),
    payload.db.drizzle.all<RecentCatchReturn>(sql`
      SELECT
        catch_returns.id,
        catch_returns.return_completed,
        catch_returns.created_at,
        catch_returns.nil_return,
        catch_returns.location_name,
        catch_returns.comments,
        catch_returns.user_id AS userId,
        catch_returns.stats_total,
        catch_returns.stats_large_fish,
        TRIM(COALESCE(users.first_name, '') || ' ' || COALESCE(users.last_name, '')) AS userName
      FROM catch_returns
      LEFT JOIN users ON users.id = catch_returns.user_id
      WHERE catch_returns.return_completed = 1
        AND (
          (${showCaught ? 1 : 0} = 1 AND catch_returns.nil_return = 0)
          OR (${showComments ? 1 : 0} = 1 AND catch_returns.comments <> '')
        )
      ORDER BY catch_returns.created_at DESC
      LIMIT 7
    `),
  ])

  return {
    bookingSummaries,
    endDate,
    recentCatchReturns,
    showCaught,
    showComments,
    startDate,
  }
}
