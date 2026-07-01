'use client'
import { Booking, CatchReturn, User } from '@/payload-types'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '../ui/AuthProvider'
import { useConfirm } from '../ui/ModalProvider'

export default function MyCatchReturnsForm() {
  const [loading, setLoading] = useState(true)
  const { user } = useAuth() as { user: User | null }
  const [catchReturns, setCatchReturns] = useState<CatchReturn[]>([])
  const [booking, setBooking] = useState<Booking>(null)
  const confirm = useConfirm()

  useEffect(() => {
    const loadCatchReturns = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/my-catch-returns', {
          method: 'GET',
          credentials: 'include',
        })
        const data = (await res.json()) as CatchReturn[]
        setCatchReturns(data)
      } finally {
        setLoading(false)
      }
    }

    loadCatchReturns()
  }, [])

  return (
    <form
      className="relative min-h-[16rem] flex flex-col bg-slate-700 p-10 pt-8 w-full text-white"
      action=""
    >
      {!loading && catchReturns.length === 0 && (
        <div className="flex h-[16rem] justify-center items-center uppercase">
          YOU HAVE NO NEW CATCH RETURNS
        </div>
      )}
      {loading && (
        <div className="absolute top-0 bg-slate-700 left-0 w-full h-full flex justify-center items-center uppercase">
          Loading Catch Returns...
        </div>
      )}
      {catchReturns.length > 0 && (
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
              <div className="w-44">Location</div>
              <div className=" w-32 text-left">Actions</div>
            </div>
            {catchReturns.length &&
              catchReturns.map((catchReturn, index) => (
                <div
                  key={index}
                  className={`flex w-full justify-between items-center border-b last:border-0 py-2 px-5 rounded-sm text-sm`}
                >
                  <div className="w-10">{index + 1}.</div>
                  <div className="w-44 truncate text-nowrap">
                    {dayjs(
                      typeof catchReturn.booking === 'object'
                        ? catchReturn.booking.date
                        : catchReturn.createdAt,
                    ).format('DD-MM-YYYY')}
                  </div>
                  <div className="w-44 truncate text-nowrap">{catchReturn.locationName}</div>
                  <Link
                    href={`/catch-return/?publicId=${catchReturn.publicId}`}
                    className=" w-32 bg-slate-800 text-white p-1 text-left rounded-sm"
                  >
                    View
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </form>
  )
}
