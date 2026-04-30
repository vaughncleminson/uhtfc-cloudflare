import { LineItem, YocoLineItem } from '@/frontend/schemas/lineItemSchema'

export interface CheckoutInitiate {
  amount: number
  currency: string
  cancelUrl: string
  successUrl: string
  failureUrl: string
  lineItems: YocoLineItem[]
}

export interface CheckoutResponse {
  success: boolean
  checkout: {
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
    lineItems: YocoLineItem[]
    externalId: null
    processingMode: string
    clientReferenceId: null
  }
}
