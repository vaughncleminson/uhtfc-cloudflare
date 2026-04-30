'use client'
import { CheckoutResponse } from '@/admin/types/checkout'
import { orderAtom } from '@/frontend/atoms/orderAtom'
import { userAtom } from '@/frontend/atoms/userAtom'
import { LineItem } from '@/frontend/schemas/lineItemSchema'
import { User } from '@/payload-types'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from '../ui/Button'

export default function OrderForm() {
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useAtom(orderAtom)
  const [user, setUser] = useAtom<User | null>(userAtom)
  const router = useRouter()

  const submit = async () => {
    setLoading(true)
    console.log(order)
    try {
      const req = await fetch(`/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order }),
      })
      const data = (await req.json()) as CheckoutResponse
      console.log(data)
      router.push(data.checkout.redirectUrl)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = (index: number) => {
    order?.products.splice(index, 1)
    if (order?.products && order?.products.length > 0) {
      setOrder({ ...order! })
      calculateTotal()
    } else {
      clearCheckout()
    }
  }

  const calculateTotal = () => {
    let total = 0
    order!.products.forEach((item: any) => {
      total += item.totalAmount
    })
    order!.totalAmount = total
    setOrder({ ...order! })
  }

  const clearCheckout = () => {
    setOrder(null)
    router.replace('/')
  }

  const renderItems = () => {
    return order?.products.map((item: any, i: number) => {
      switch (item.productType) {
        case 'booking':
          return (
            <div key={i}>
              <div className="flex w-full justify-between items-center py-2 px-5 rounded-sm text-sm bg-slate-900">
                <div className="w-10"></div>
                <div className="text-nowrap w-full">
                  {item.locationName!} ({dayjs(item.date).format('DD-MM-YYYY')})
                </div>
                <div className=" w-1/2"></div>
                <div className="w-36 relative h-6">
                  <Button
                    className="absolute bottom-0 left-0"
                    onClick={() => {
                      removeItem(i)
                    }}
                    title="Remove"
                    size="small"
                  ></Button>
                </div>
              </div>
              {item.lineItems.map((lineItem: LineItem, index: number) => {
                return (
                  <div
                    key={`${i - index}`}
                    className="flex w-full justify-between py-2 px-5 rounded-sm text-sm"
                  >
                    <div className="w-10">{index + 1}.</div>
                    <div className="text-nowrap truncate w-full">{lineItem.displayName}</div>
                    <div className=" w-1/2">{lineItem.quantity}</div>
                    <div className=" w-36">{lineItem.price}.00</div>
                  </div>
                )
              })}
            </div>
          )
        case 'subs':
          return <></>
        case 'newMembership':
          return (
            <div key={i}>
              <div className="flex w-full justify-between items-center py-2 px-5 rounded-sm text-sm bg-slate-100">
                <div className="w-10"></div>
                <div className="text-nowrap w-full">Membership Application</div>
                <div className=" w-1/2"></div>
                <div className="w-36 relative h-6">
                  <Button
                    className="absolute bottom-0 left-0"
                    onClick={() => {
                      removeItem(i)
                    }}
                    title="Remove"
                    size="small"
                  ></Button>
                </div>
              </div>
              {item.lineItems.map((lineItem: LineItem, index: number) => {
                return (
                  <div
                    key={`${i - index}`}
                    className="flex w-full justify-between py-2 px-5 rounded-sm text-sm"
                  >
                    <div className="w-10">{index + 1}.</div>
                    <div className="text-nowrap truncate w-full">{lineItem.displayName}</div>
                    <div className=" w-1/2">{lineItem.quantity}</div>
                    <div className=" w-36">{lineItem.price}.00</div>
                  </div>
                )
              })}
            </div>
          )
        case 'festivalEntry':
          return <></>
      }
    })
  }

  return (
    <form className="flex flex-col bg-slate-700 p-10 pt-8 w-full text-white" action="">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <div>
              {user?.firstName} {user?.lastName}
            </div>
            <div>{user?.email}</div>
            <div>{user?.role}</div>
          </div>
          <div>{dayjs().format('DD-MM-YYYY')}</div>
        </div>
        <div className="w-full bg-slate-800">
          <div className="flex w-full justify-between border-b py-2 px-5 rounded-sm text-sm">
            <div className="w-10">#</div>
            <div className="overflow-hidden w-full">Description</div>
            <div className="w-1/2">Quantity</div>
            <div className=" w-36">Price</div>
          </div>
          {/* <div className="flex w-full justify-between py-2 px-5 rounded-sm text-sm bg-slate-100">
            <div className="w-10"></div>
            <div className="text-nowrap w-full">Subs 2026</div>
            <div className=" w-1/2"></div>
            <div className=" w-36"></div>
          </div>
          <div className="flex w-full justify-between py-2 px-5 rounded-sm text-sm">
            <div className="w-10">1.</div>
            <div className="overflow-hidden w-full">Family Membership</div>
            <div className=" w-1/2">1</div>
            <div className=" w-36">1400.00</div>
          </div> */}
          {renderItems()}
          <div className="flex w-full justify-between py-2 px-5 rounded-sm text-sm">
            <div className="w-10"></div>
            <div className="overflow-hidden w-full"></div>
            <div className=" w-1/2">TOTAL</div>
            <div className=" w-36">{order?.totalAmount}.00</div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-5">
        <Button
          onClick={submit}
          className="w-full"
          type="button"
          loading={loading}
          title={order.totalAmount > 0 ? 'Pay now' : 'Submit order'}
        />
        <Button
          type="button"
          onClick={() => clearCheckout()}
          className="w-full bg-slate-800"
          title="CLEAR CHECKOUT"
        />
      </div>
    </form>
  )
}
