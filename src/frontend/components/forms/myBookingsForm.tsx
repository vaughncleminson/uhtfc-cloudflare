'use client'
import { FormEvent, useState } from 'react'

export default function MyBookingsForm() {
  const [loading, setLoading] = useState(false)
  const submit = async (e: FormEvent) => {}
  return (
    <div className="flex flex-col bg-white p-10 pt-8 border rounded shadow-lg w-full">
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
            <div className="w-44">Date</div>
            <div className="w-full">Details</div>
            <div className=" w-36">Rods</div>
            <div className=" w-32">Actions</div>
          </div>
          <div className="flex w-full justify-between items-center border-b py-2 px-5 rounded-sm text-sm">
            <div className="w-10">1.</div>
            <div className="w-44 truncate text-nowrap">02-06-2025</div>
            <div className="w-full truncate text-nowrap">
              Lake Isabella (2 members, 2 member guests)
            </div>
            <div className=" w-36">4</div>
            <div className=" w-32 bg-slate-800 text-white p-1 text-center rounded-sm">Cancel</div>
          </div>
        </div>
      </div>
    </div>
  )
}
