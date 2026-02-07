import { LineItem } from '@/frontend/schemas/lineItemSchema'

export interface CheckoutInitiate {
  amount: number
  currency: string
  cancelUrl: string
  successUrl: string
  failureUrl: string
  lineItems: LineItem[]
}

export interface CheckoutResponse {
  id: string
  redirectUrl: string
  status: string
  amount: number
  currency: string
  paymentId: null
  successUrl: string
  cancelUrl: string
  failureUrl: string
  metadata: {
    checkoutId: string
    paymentFacilitator: string
    domain: string
  }
  merchantId: string
  totalDiscount: null
  totalTaxAmount: null
  subtotalAmount: null
  lineItems: LineItem[]
  externalId: null
  processingMode: string
  clientReferenceId: null
}
