import { Setting } from '@/payload-types'
import { atomWithStorage } from 'jotai/utils'

export const settingsAtom = atomWithStorage('settings', null as Setting | null)
