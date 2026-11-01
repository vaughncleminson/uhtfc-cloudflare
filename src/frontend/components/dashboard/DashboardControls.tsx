'use client'

import { DATE_PICKER_DISPLAY_FORMAT } from '@/utils/date'
import dayjs from 'dayjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react'

type DashboardControlsRodsAndCatchesProps = {
  endDate: string
  startDate: string
}

type DashboardControlsCatchReturnsProps = {
  showCaught: boolean
  showComments: boolean
}

function useReplaceDashboardParams() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  return (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([name, value]) => params.set(name, value))
    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
  }
}

export function DashboardControlsRodsAndCatches({
  endDate,
  startDate,
}: DashboardControlsRodsAndCatchesProps) {
  const replaceParams = useReplaceDashboardParams()
  const [selectedEndDate, setSelectedEndDate] = useState(() => new Date(`${endDate}T00:00:00`))
  const [selectedStartDate, setSelectedStartDate] = useState(
    () => new Date(`${startDate}T00:00:00`),
  )

  const applyDateRange = () => {
    if (selectedStartDate > selectedEndDate) return

    replaceParams({
      endDate: dayjs(selectedEndDate).format('YYYY-MM-DD'),
      startDate: dayjs(selectedStartDate).format('YYYY-MM-DD'),
    })
  }

  return (
    <span className="inline-flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm font-normal text-slate-300">
        <DatePicker
          aria-label="Start date"
          className="input"
          dateFormat={DATE_PICKER_DISPLAY_FORMAT}
          maxDate={selectedEndDate}
          onChange={(date: Date | null) => date && setSelectedStartDate(date)}
          selected={selectedStartDate}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-normal text-slate-300">
        <DatePicker
          aria-label="End date"
          className="input"
          dateFormat={DATE_PICKER_DISPLAY_FORMAT}
          minDate={selectedStartDate}
          onChange={(date: Date | null) => date && setSelectedEndDate(date)}
          selected={selectedEndDate}
        />
      </label>
      <button
        className="h-11 bg-teal-700 px-5 text-base font-normal text-white hover:bg-teal-600"
        onClick={applyDateRange}
        type="button"
      >
        Apply
      </button>
    </span>
  )
}

export function DashboardControlsCatchReturns({
  showCaught,
  showComments,
}: DashboardControlsCatchReturnsProps) {
  const replaceParams = useReplaceDashboardParams()
  const [caught, setCaught] = useState(showCaught)
  const [comments, setComments] = useState(showComments)

  return (
    <span className="inline-flex flex-wrap items-center gap-4 text-base font-normal text-white">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          checked={caught}
          className="h-4 w-4 accent-teal-600"
          onChange={(event) => setCaught(event.target.checked)}
          type="checkbox"
        />
        Caught
      </label>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          checked={comments}
          className="h-4 w-4 accent-teal-600"
          onChange={(event) => setComments(event.target.checked)}
          type="checkbox"
        />
        Comments
      </label>
      <button
        className="h-11 bg-teal-700 px-5 font-normal text-white hover:bg-teal-600"
        onClick={() => replaceParams({ caught: String(caught), comments: String(comments) })}
        type="button"
      >
        Apply
      </button>
    </span>
  )
}
