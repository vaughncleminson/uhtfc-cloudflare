import { atomWithStorage } from 'jotai/utils'
import { Order } from '../schemas/orderScema'

export const orderAtom = atomWithStorage('order', null as Order | null)
