'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type CatchReturnFiltersProps = {
  showCaught: boolean
  showComments: boolean
}

export function CatchReturnFilters({ showCaught, showComments }: CatchReturnFiltersProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [caught, setCaught] = useState(showCaught)
  const [comments, setComments] = useState(showComments)

  const updateFilter = (name: 'caught' | 'comments', checked: boolean) => {
    if (name === 'caught') setCaught(checked)
    if (name === 'comments') setComments(checked)

    const params = new URLSearchParams(searchParams.toString())
    params.set(name, String(checked))
    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
  }

  return (
    <div className="dashboard-summary__filters">
      <label>
        <input
          checked={caught}
          onChange={(event) => updateFilter('caught', event.target.checked)}
          type="checkbox"
        />
        Caught
      </label>
      <label>
        <input
          checked={comments}
          onChange={(event) => updateFilter('comments', event.target.checked)}
          type="checkbox"
        />
        Comments
      </label>
    </div>
  )
}
