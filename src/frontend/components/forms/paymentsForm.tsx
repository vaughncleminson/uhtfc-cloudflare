'use client'
import { FormEvent, useState } from 'react'

export default function PaymentsForm() {
  const [loading, setLoading] = useState(false)
  const submit = async (e: FormEvent) => {}
  return (
    <form className="flex flex-col bg-white p-10 pt-8 border rounded shadow-lg w-full" action="">
      <div className="flex justify-between items-center">
        <div></div>
        <div>01-06-2025</div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="text-sm">
          <div>Chris Green</div>
          <div>chris@owenco.agency</div>
          <div>Member</div>
        </div>

        <div className="w-full border rounded-sm shadow">
          <div className="flex w-full justify-between border-b py-2 px-5 rounded-sm text-sm">
            <div className="w-10">#</div>
            <div className="overflow-hidden w-1/2">Date</div>
            <div className="w-full">Description</div>
            <div className=" w-36">Paid</div>
            <div className=" w-36"></div>
          </div>
          <div className="flex items-center w-full justify-between py-2 px-5 rounded-sm text-sm">
            <div className="w-10">1.</div>
            <div className=" truncate text-nowrap w-1/2">02-04-2025</div>
            <div className=" w-full truncate text-nowrap">
              Booking - Lake Isabella, Subs - Ordinary membership
            </div>
            <div className=" w-36">1400.00</div>
            <div className=" w-36">
              <div className="bg-slate-800 px-3 py-1 rounded-sm text-white text-center">View</div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
