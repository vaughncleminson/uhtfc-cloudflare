import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import type { Params } from 'payload'
import { getPayload } from 'payload'

import { CaughtCell } from '@/admin/components/CatchReturns/CaughtCell'
import { getDashboardData } from '@/dashboard/getDashboardData'
import { getLocationOptions } from '@/dashboard/getLocationOptions'
import {
  DashboardControlsCatchReturns,
  DashboardControlsRodsAndCatches,
} from '@/frontend/components/dashboard/DashboardControls'
import { formatDisplayDate } from '@/utils/date'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Committee Dashboard',
}

type DashboardPageProps = {
  searchParams: Promise<Params>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user || user.collection !== 'users') {
    redirect('/?auth=false')
  }

  const currentUser = await payload.findByID({
    collection: 'users',
    depth: 0,
    id: user.id,
  })

  if (currentUser.committeeMember !== true) {
    notFound()
  }

  const {
    bookingSummaries,
    endDate,
    locationId,
    recentCatchReturns,
    requireCaughtOrComments,
    startDate,
  } = await getDashboardData(payload, await searchParams)
  const locationOptions = await getLocationOptions(payload)

  return (
    <main className="min-h-screen bg-slate-800 px-5 pb-24 pt-[120px] text-white lg:px-40">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-4xl text-white">Fishing Dashboard</h1>
        </header>

        <section aria-labelledby="rods-catches-heading" className="flex flex-col gap-4">
          <h2 className="flex flex-wrap items-end gap-4" id="rods-catches-heading">
            <span>Rods and Catches</span>
            <DashboardControlsRodsAndCatches
              endDate={endDate}
              locationId={locationId}
              locationOptions={locationOptions}
              startDate={startDate}
            />
          </h2>
          <div className="overflow-x-auto border border-slate-600">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-slate-900 text-sm text-slate-300">
                <tr>
                  <th className="p-3">Location Type</th>
                  <th className="p-3">Count of Rods</th>
                  <th className="p-3">Total Catches</th>
                  <th className="p-3">Average Length</th>
                  <th className="p-3">Largest Fish</th>
                </tr>
              </thead>
              <tbody>
                {bookingSummaries.map((summary) => (
                  <tr className="border-t border-slate-600" key={summary.LocationType}>
                    <td className="p-3">{summary.LocationType}</td>
                    <td className="p-3">{summary.CountOfRods}</td>
                    <td className="p-3">{summary.TotalCatches ?? 0}</td>
                    <td className="p-3">{summary.AvgLength ?? 0}</td>
                    <td className="p-3">{summary.MaxLargeFish ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="catch-returns-heading" className="flex flex-col gap-4">
          <h2 className="flex flex-wrap items-center gap-4" id="catch-returns-heading">
            <span>Last Catch Returns</span>
            <DashboardControlsCatchReturns requireCaughtOrComments={requireCaughtOrComments} />
          </h2>
          <div className="overflow-x-auto border border-slate-600">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-slate-900 text-sm text-slate-300">
                <tr>
                  <th className="p-3">Booking</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Caught</th>
                  <th className="p-3">Comments</th>
                </tr>
              </thead>
              <tbody>
                {recentCatchReturns.map((catchReturn) => (
                  <tr className="border-t border-slate-600 align-top" key={catchReturn.id}>
                    <td className="whitespace-nowrap p-3">
                      {formatDisplayDate(catchReturn.created_at)}
                    </td>
                    <td className="p-3">{catchReturn.location_name}</td>
                    <td className="p-3">{catchReturn.userName || '-'}</td>
                    <td className="whitespace-nowrap p-3">
                      <CaughtCell rowData={catchReturn} />
                    </td>
                    <td className="p-3">{catchReturn.comments || ''}</td>
                  </tr>
                ))}
                {recentCatchReturns.length === 0 && (
                  <tr className="border-t border-slate-600">
                    <td className="p-5 text-center text-slate-400" colSpan={5}>
                      No matching catch returns
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
