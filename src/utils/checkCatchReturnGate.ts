import type { CatchReturnGateResult } from '@/bookings/getOutstandingCatchReturnGate'

// Courtesy check only; fails open so a network error never blocks the user here —
// the server-side hook (Bookings.ts's beforeChange) remains the authoritative gate.
export async function checkCatchReturnGate(): Promise<CatchReturnGateResult> {
  try {
    const response = await fetch('/api/catch-return-gate')
    return (await response.json()) as CatchReturnGateResult
  } catch {
    return { blocked: false }
  }
}
