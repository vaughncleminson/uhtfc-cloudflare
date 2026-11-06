import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { CaughtCell } from '@/admin/components/CatchReturns/CaughtCell'

describe('CaughtCell', () => {
  it('renders nil for a flat dashboard row with a zero total', () => {
    const markup = renderToStaticMarkup(
      createElement(CaughtCell, { rowData: { stats_large_fish: 0, stats_total: 0 } }),
    )

    expect(markup).toBe('<span>nil</span>')
  })
})