import path from 'node:path'
import os from 'node:os'

export const seedFilePath = path.join(os.tmpdir(), 'uhtfc-e2e-dashboard-location-seed.json')

export type DashboardLocationSeed = {
  bookingAId: number
  bookingBId: number
  email: string
  locationAId: number
  locationALabel: string
  locationBId: number
  password: string
  userId: number
}
