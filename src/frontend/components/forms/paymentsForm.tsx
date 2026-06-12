'use client'
import { Payment, User } from '@/payload-types'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useAuth } from '../ui/AuthProvider'
import { useConfirm } from '../ui/ModalProvider'

export default function PaymentsForm() {
  const [loading, setLoading] = useState(true)
  const { user } = useAuth() as { user: User | null }
  const [payments, setPayments] = useState<Payment[]>([])
  const confirm = useConfirm()

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/my-payments', {
          method: 'GET',
          credentials: 'include',
        })
        const data = (await res.json()) as Payment[]
        setPayments(data)
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [])

  return (
    <form
      className="relative min-h-[16rem] flex flex-col bg-slate-700 p-10 pt-8 w-full text-white"
      action=""
    >
      {!loading && payments.length === 0 && (
        <div className="flex h-[16rem] justify-center items-center uppercase">
          YOU HAVE NO PAYMENTS
        </div>
      )}
      {loading && (
        <div className="absolute top-0 bg-slate-700 left-0 w-full h-full flex justify-center items-center uppercase">
          Loading Payments...
        </div>
      )}
      {payments.length > 0 && (
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
              <div className="w-44">Date</div>
              <div className=" w-full">Details</div>
              <div className=" w-36">Amount</div>
              <div className=" w-44 text-left">Status</div>
            </div>
            {payments.length &&
              payments.map((payment, index) => (
                <div
                  key={index}
                  className={`flex w-full justify-between items-center border-b last:border-0 py-2 px-5 rounded-sm text-sm`}
                >
                  <div className="w-10">{index + 1}.</div>
                  <div className="w-44 truncate text-nowrap">
                    {dayjs(payment.date).format('DD-MM-YYYY')}
                  </div>
                  <div className="w-full truncate text-nowrap">{payment.summary}</div>
                  <div className=" w-36">{`R${payment.totalAmount}.00`}</div>
                  <div className=" w-44 bg-slate-800 text-white p-1 text-left rounded-sm">
                    {payment.status}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </form>
  )
}
