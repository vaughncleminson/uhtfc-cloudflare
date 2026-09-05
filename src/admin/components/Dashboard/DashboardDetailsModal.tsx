'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'
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
  const startDateInput = useRef<HTMLInputElement>(null)
  const endDateInput = useRef<HTMLInputElement>(null)

  const applyDateRange = () => {
    const selectedStartDate = startDateInput.current?.value
    const selectedEndDate = endDateInput.current?.value

    if (!selectedStartDate || !selectedEndDate || selectedStartDate > selectedEndDate) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set('startDate', selectedStartDate)
    params.set('endDate', selectedEndDate)
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
        Start Date
        <input defaultValue={startDate} ref={startDateInput} type="date" />
        End Date
        <input defaultValue={endDate} ref={endDateInput} type="date" />
        <Button onClick={applyDateRange}>Apply</Button>
      </Modal>
    </>
  )
}
