'use client'

import { Button } from '@payloadcms/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type CatchReturnFiltersProps = {
  requireCaughtOrComments: boolean
}

export function CatchReturnFilters({ requireCaughtOrComments }: CatchReturnFiltersProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [requireCaughtOrCommentsState, setRequireCaughtOrCommentsState] =
    useState(requireCaughtOrComments)

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('caughtOrComments', String(requireCaughtOrCommentsState))
    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
  }

  return (
    <div className="dashboard-summary__filters">
      <label>
        <input
          checked={requireCaughtOrCommentsState}
          onChange={(event) => setRequireCaughtOrCommentsState(event.target.checked)}
          type="checkbox"
        />
        Only Caught or Comments
      </label>
      <Button onClick={applyFilter}>Apply</Button>
    </div>
  )
}
