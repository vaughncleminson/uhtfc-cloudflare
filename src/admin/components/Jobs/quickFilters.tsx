'use client'

import { useMemo } from 'react'

export function JobsQuickFilters() {
  const basePath = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return window.location.pathname
  }, [])

  const taskFilter = 'where[taskSlug][equals]=emailCatchReturnLinks'

  const allRunsHref = `${basePath}?${taskFilter}&sort=-createdAt`
  const failedRunsHref = `${basePath}?${taskFilter}&where[hasError][equals]=true&sort=-createdAt`
  const latestRunsHref = `${basePath}?${taskFilter}&limit=20&sort=-createdAt`

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <a href={allRunsHref}>All emailCatchReturnLinks runs</a>
      <a href={failedRunsHref}>Failed runs</a>
      <a href={latestRunsHref}>Latest 20 runs</a>
    </div>
  )
}

export default JobsQuickFilters
