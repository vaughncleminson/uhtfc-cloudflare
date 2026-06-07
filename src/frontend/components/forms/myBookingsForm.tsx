'use client'
import { userAtom } from '@/frontend/atoms/userAtom'
import { Booking } from '@/frontend/schemas/bookingSchema'
import { User } from '@/payload-types'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

export default function MyBookingsForm() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useAtom<User | null>(userAtom)
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/my-bookings')
        const data = (await res.json()) as Booking[]
        setBookings(data)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

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
            <div className="w-44">Date</div>
            <div className="w-full">Details</div>
            <div className=" w-36">Rods</div>
            <div className=" w-32">Actions</div>
          </div>
          {bookings.map((booking, index) => (
            <div
              key={index}
              className="flex w-full justify-between items-center border-b py-2 px-5 rounded-sm text-sm"
            >
              <div className="w-10">{index + 1}.</div>
              <div className="w-44 truncate text-nowrap">
                {dayjs(booking.date).format('DD-MM-YYYY')}
              </div>
              <div className="w-full truncate text-nowrap">
                {booking.locationName} - {booking.firstName} (Rods - {booking.lineItems.length} )
              </div>
              <div className=" w-36">4</div>
              <div className=" w-32 bg-slate-800 text-white p-1 text-center rounded-sm">Cancel</div>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}
