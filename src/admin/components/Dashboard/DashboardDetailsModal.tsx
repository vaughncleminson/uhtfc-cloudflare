'use client'

import { DATE_PICKER_DISPLAY_FORMAT } from '@/utils/date'
import dayjs from 'dayjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Button, Modal, useModal } from '@payloadcms/ui'
import './DashboardDetailsModal.scss'

type DashboardDetailsModalProps = {
  endDate: string
  startDate: string
}

export function DashboardDetailsModal({ endDate, startDate }: DashboardDetailsModalProps) {
  const { closeModal, openModal } = useModal()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [selectedStartDate, setSelectedStartDate] = useState(
    () => new Date(`${startDate}T00:00:00`),
  )
  const [selectedEndDate, setSelectedEndDate] = useState(() => new Date(`${endDate}T00:00:00`))

  const applyDateRange = () => {
    if (selectedStartDate > selectedEndDate) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set('startDate', dayjs(selectedStartDate).format('YYYY-MM-DD'))
    params.set('endDate', dayjs(selectedEndDate).format('YYYY-MM-DD'))
    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
    closeModal('dashboard-details')
  }

  return (
    <>
      <Button buttonStyle="secondary" onClick={() => openModal('dashboard-details')}>
        Select Dates
      </Button>

      <Modal className="dashboard-details-modal" slug="dashboard-details">
        <h2>Select Date Range</h2>
        <label htmlFor="dashboard-start-date">Start Date</label>
        <DatePicker
          dateFormat={DATE_PICKER_DISPLAY_FORMAT}
          id="dashboard-start-date"
          onChange={(date: Date | null) => date && setSelectedStartDate(date)}
          selected={selectedStartDate}
        />
        <br />
        <label htmlFor="dashboard-end-date">End Date</label>
        <DatePicker
          dateFormat={DATE_PICKER_DISPLAY_FORMAT}
          id="dashboard-end-date"
          onChange={(date: Date | null) => date && setSelectedEndDate(date)}
          selected={selectedEndDate}
        />
        <br />
        <Button onClick={applyDateRange}>Apply</Button>
      </Modal>
    </>
  )
}
