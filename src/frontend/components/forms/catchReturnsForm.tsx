'use client'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormEvent, useState } from 'react'
import Button from '../ui/Button'

export default function CatchReturnsForm() {
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
            <div className=" w-32"></div>
          </div>
          <div className="flex w-full justify-between items-center border-b py-2 px-5 rounded-sm text-sm">
            <div className="w-10">1.</div>
            <div className="w-44 truncate text-nowrap">02-06-2025</div>
            <div className="w-full truncate text-nowrap">
              Lake Isabella (2 members, 2 member guests)
            </div>
            <div className=" w-36">4</div>
            <div className=" w-32 bg-red-700 text-white p-1 text-center rounded-sm">Complete</div>
          </div>
        </div>

        <div className="w-full border rounded-sm shadow">
          <div className="flex flex-col w-full justify-between items-center border-b p-5 rounded-sm text-sm gap-2">
            <div className="w-full border rounded-sm shadow">
              <div className="flex w-full justify-between border-b py-2 px-5 rounded-sm text-sm">
                <div className=" w-32">#</div>
                <div className="w-full">Quantity</div>
                <div className="w-full">Species</div>
                <div className="w-full">length</div>
                <div className="w-full">Released</div>
                <div className="w-28"></div>
              </div>
              <div className="flex w-full justify-between items-center border-b py-2 px-5 rounded-sm text-sm">
                <div className="w-32">1.</div>
                <div className="w-full truncate text-nowrap">2</div>
                <div className="w-full truncate text-nowrap">Rainbow Trout</div>
                <div className=" w-full">50cm</div>
                <div className=" w-full">Yes</div>
                <div className=" w-10 text-white p-1 text-center rounded-sm">
                  <div className="w-5 h-5  flex justify-center items-center rounded-sm">
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <label className="label">Quantity</label>
              <input placeholder="Qty" type="number" className="input h-10" />
            </div>
            <div className="w-full">
              <label className="label">Species</label>
              <select className="input">
                <option value="rainbow">Rainbow</option>
                <option value="brown">Brown</option>
                <option value="bass">Bass</option>
              </select>
            </div>
            <div className="w-full">
              <label className="label">Length</label>
              <input placeholder="Length (cm)" type="number" className="input" />
            </div>
            <div className="w-full">
              <label>
                <input type="checkbox" /> Released
              </label>
            </div>
            <div className="flex w-full gap-2">
              <Button className="w-full  bg-slate-800 hover:bg-slate-600" title="Add To List" />
            </div>
            <div className="flex w-full gap-2">
              <Button className="w-1/2" title="Submit" />
              <Button className="w-1/2 bg-slate-800 hover:bg-slate-600" title="Nil Return" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
