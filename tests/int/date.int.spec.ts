import { DATE_PICKER_DISPLAY_FORMAT, formatDisplayDate } from '@/utils/date'
import { describe, expect, it } from 'vitest'

describe('date display formatting', () => {
  it('formats dates as dd MMM yyyy', () => {
    expect(formatDisplayDate('2026-09-01')).toBe('01 Sep 2026')
    expect(DATE_PICKER_DISPLAY_FORMAT).toBe('dd MMM yyyy')
  })
})
