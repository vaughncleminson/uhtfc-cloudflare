import { atomWithStorage } from 'jotai/utils'
import { Order } from '../schemas/orderSchema'

export const orderAtom = atomWithStorage('order', null as Order | null)
