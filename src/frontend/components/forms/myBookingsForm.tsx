'use client'
import { Booking } from '@/frontend/schemas/bookingSchema'
import { User } from '@/payload-types'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useConfirm } from '../ui/ModalProvider'
import { useAuth } from '../ui/AuthProvider'

export default function MyBookingsForm() {
  const [loading, setLoading] = useState(true)
  const { user } = useAuth() as { user: User | null }
  const [bookings, setBookings] = useState<Booking[]>([])
  const confirm = useConfirm()

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/my-bookings', {
          method: 'GET',
          credentials: 'include',
        })
        const data = (await res.json()) as Booking[]
        setBookings(data)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const handleCancel = async (bookingId: number) => {
    const confirmed = await confirm({
      message: 'Are you sure you want to cancel this booking?',
      cancelTitle: 'CLOSE',
      confirmTitle: 'YES, CANCEL',
    })
    if (!confirmed) return
    setLoading(true)
    try {
      const res = await fetch(`/api/cancel-booking?bookingId=${bookingId}`, {
        method: 'GET',
      })

      if (res.ok) {
        // Remove the cancelled booking from the list
        setBookings((prev) => prev.filter((b) => b.id !== bookingId))
        setLoading(false)
      } else {
        alert('Failed to cancel booking')
      }
    } catch (error) {
      alert('An error occurred while cancelling the booking')
    }
  }

  return (
    <form
      className="relative min-h-[16rem] flex flex-col bg-slate-700 p-10 pt-8 w-full text-white"
      action=""
    >
      {!loading && bookings.length === 0 && (
        <div className="flex h-[16rem] justify-center items-center uppercase">
          YOU HAVE NO BOOKINGS
        </div>
      )}
      {loading && (
        <div className="absolute top-0 bg-slate-700 left-0 w-full h-full flex justify-center items-center uppercase">
          Loading Bookings...
        </div>
      )}
      {bookings.length > 0 && (
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
              <div className=" w-32 text-left">Actions</div>
            </div>
            {bookings.length &&
              bookings.map((booking, index) => (
                <div
                  key={index}
                  className={`flex w-full justify-between items-center border-b last:border-0 py-2 px-5 rounded-sm text-sm`}
                >
                  <div className="w-10">{index + 1}.</div>
                  <div className="w-44 truncate text-nowrap">
                    {dayjs(booking.date).format('DD-MM-YYYY')}
                  </div>
                  <div className="w-full truncate text-nowrap">
                    {booking.locationName} - {booking.firstName}
                  </div>
                  <div className=" w-36">{booking.lineItems.length}</div>
                  <div
                    onClick={() => handleCancel(booking.id)}
                    className=" w-32 bg-slate-800 text-white p-1 text-left rounded-sm"
                  >
                    Cancel
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </form>
  )
}
