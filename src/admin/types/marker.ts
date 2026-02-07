export type Marker = {
  id?: number
  slug?: string
  type?: 'stillwater' | 'river' | 'parking' | 'no-entry' | 'boundry' | null
  coords?: [number, number]
  description?: string
  directions?: boolean
}
