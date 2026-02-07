import { User } from '@/payload-types'
import { atomWithStorage } from 'jotai/utils'

export const userAtom = atomWithStorage('user', null as User | null)
