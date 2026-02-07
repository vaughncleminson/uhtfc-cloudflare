'use client'

import { useRowLabel } from '@payloadcms/ui'

export const ArrayRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string; link?: { label: string } }>()
  let customLabel = 'Item'
  if (data.title) {
    customLabel = data.title
  } else if (data.link) {
    customLabel = data.link.label
  }
  return (
    <div>
      {rowNumber! > -1 ? rowNumber! + 1 + '.' : ''} {customLabel}
    </div>
  )
}
