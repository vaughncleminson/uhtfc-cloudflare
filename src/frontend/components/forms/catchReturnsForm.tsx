'use client'
import { catchReturnSchema } from '@/frontend/schemas/catchReturnSchema'
import { Booking, CatchReturn } from '@/payload-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import Button from '../ui/Button'
import { useConfirm } from '../ui/ModalProvider'

type CatchReturnApiResponse = {
  catchReturn: CatchReturn | null
}

//type to hold catch return row data in the form
type CatchReturnRow = {
  quantity: number
  species: string
  length: number
  released: boolean
}

export default function CatchReturnsForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const confirm = useConfirm()

  const [newCatchReturnRow, setNewCatchReturnRow] = useState<CatchReturnRow>({
    quantity: 0,
    species: 'select',
    length: 0,
    released: false,
  })

  // get publicId from url query params
  // note this publicId is for the catch return record, not the booking record, as we want to be able to associate catch returns with bookings but we don't want to expose booking IDs in the URL for security reasons
  const searchParams = useSearchParams()
  const publicId = searchParams.get('publicId')

  // If no publicId is present, we can't associate the catch return with a booking, so we should show an error message
  if (!publicId) {
    return <div className="p-10 bg-white rounded shadow">Invalid catch return link</div>
  }

  // call api to get catch return details using the publicId
  // note that the catch return record will have a relationship field to the booking
  // record, so we can get the booking details from the catch return record
  const [catchReturn, setCatchReturn] = useState<CatchReturn | null>(null)
  const booking =
    catchReturn?.booking && typeof catchReturn.booking === 'object'
      ? (catchReturn.booking as Booking)
      : null

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/catch-return?publicId=${publicId}`, {
          method: 'GET',
        })
        if (res.ok) {
          const data = (await res.json()) as CatchReturnApiResponse
          setCatchReturn(data.catchReturn)

          if (data.catchReturn) {
            const bookingValue = data.catchReturn.booking
            // bookingValue can be a number (booking ID) or an object (booking record), so we need to check the type and extract the booking ID accordingly
            const bookingId =
              bookingValue && typeof bookingValue === 'object' && 'id' in bookingValue
                ? typeof bookingValue.id === 'number'
                  ? bookingValue.id
                  : null
                : typeof bookingValue === 'number'
                  ? bookingValue
                  : null

            setFormData((prev) => ({
              ...prev,
              booking: bookingId,
              returnCompleted: data.catchReturn?.returnCompleted ?? false,
              nilReturn: data.catchReturn?.nilReturn ?? false,
              publicId,
              stats: {
                total: data.catchReturn?.stats?.total ?? 0,
                averageLength: data.catchReturn?.stats?.averageLength ?? 0,
                largeFish: data.catchReturn?.stats?.largeFish ?? 0,
              },
              returns:
                data.catchReturn?.returns && data.catchReturn.returns.length > 0
                  ? data.catchReturn.returns
                      .filter((item) => (item.quantity ?? 0) > 0 && (item.length ?? 0) > 0)
                      .map((item) => ({
                        species: item.species || 'rainbow',
                        length: item.length ?? 0,
                        released: item.released ?? false,
                        quantity: item.quantity ?? 0,
                      }))
                  : [],
            }))
          }
        } else {
          alert('Failed to load catch return details')
        }
      } catch (error) {
        alert('An error occurred while loading catch return details')
      }
    }

    loadData()
  }, [publicId])

  const [formData, setFormData] = useState({
    booking: booking?.id || null,
    returnCompleted: false,
    nilReturn: false,
    publicId: publicId,
    stats: {
      total: 0,
      averageLength: 0,
      largeFish: 0,
    },
    returns: [],
  })

  // return the number of anglers in the booking, or 0 if no booking is present
  const returnCatchReturnBookingAnglerCount = () => {
    if (!booking) return 0
    const anglers = booking.anglers || []
    return anglers.length
  }

  // return count of anglers by role
  // roles are member, member-guest and non-member
  // return a string like "2 members, 1 member-guest, 1 non-member"
  // do not include roles with a count of 0
  const returnCatchReturnBookingAnglerCountByRole = () => {
    if (!booking) return ''
    const anglers = booking.anglers || []
    const memberCount = anglers.filter((a) => a.role === 'member').length
    const memberGuestCount = anglers.filter((a) => a.role === 'member-guest').length
    const nonMemberCount = anglers.filter((a) => a.role === 'non-member').length
    let roleCountString = ''
    if (memberCount > 0) roleCountString += `${memberCount} ${returnPlural(memberCount, 'member')}`
    if (memberGuestCount > 0) {
      if (roleCountString.length > 0) roleCountString += ', '
      roleCountString += `${memberGuestCount} ${returnPlural(memberGuestCount, 'member-guest')}`
    }
    if (nonMemberCount > 0) {
      if (roleCountString.length > 0) roleCountString += ', '
      roleCountString += `${nonMemberCount} ${returnPlural(nonMemberCount, 'non-member')}`
    }
    return roleCountString
  }

  const returnPlural = (count: number, label: string) => {
    return count === 1 ? label : `${label}s`
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const result = catchReturnSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path.join('.')] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    try {
      setLoading(true)
      const response = await fetch('/api/catch-return', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = (await response.json()) as any
      if (response.ok) {
        const confirmed = await confirm({
          title: 'Catch return successful',
          message: 'Catch return submitted successfully.',
          showCancelButton: false,
          confirmTitle: 'OK',
          confirmUrl: `/`,
        })
        if (!confirmed) return

        // Optionally, you could redirect the user or reset the form here
      } else {
        setErrors({ submit: result.message || 'Failed to submit catch return' })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const bFormDisabled = loading || (catchReturn?.returnCompleted ?? false)

  if (!catchReturn) {
    return <div className="p-10 bg-white rounded shadow">Loading catch return details...</div>
  }

  return (
    <form
      onSubmit={submit}
      className="relative min-h-[16rem] flex flex-col bg-slate-700 p-10 pt-8 w-full text-white"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl mb-2 text-white uppercase">Catch Return</h1>
        <div>{booking ? dayjs(new Date()).format('DD-MM-YYYY') : ''}</div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="text-sm">
          <div>{booking ? booking.firstName + ' ' + booking.lastName : ''}</div>
          <div>{booking ? booking.email : ''}</div>
          <div>{booking ? booking.role : ''}</div>
        </div>

        <div className="w-full bg-slate-800">
          <div className="flex w-full justify-between border-b py-2 px-5 rounded-sm text-sm">
            <div className="w-44">Date</div>
            <div className="w-full">Details</div>
            <div className=" w-36">Rods</div>
            <div className=" w-36">Completed</div>
          </div>
          <div className="flex w-full justify-between items-center py-2 px-5 rounded-sm text-sm">
            <div className="w-44 truncate text-nowrap">
              {booking ? dayjs(booking.date).format('DD-MM-YYYY') : ''}
            </div>
            <div className="w-full truncate text-nowrap">
              {booking ? booking.locationName : ''} ({returnCatchReturnBookingAnglerCountByRole()})
            </div>
            <div className=" w-36">{returnCatchReturnBookingAnglerCount()}</div>
            <div className=" w-36">{bFormDisabled ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div className="w-full bg-slate-800">
          <div className="flex flex-col w-full justify-between items-center border-b p-5 rounded-sm text-sm gap-2">
            <div className="w-full border rounded-sm shadow" id="catchReturnsList">
              <div className="flex w-full justify-between border-b py-2 px-5 rounded-sm text-sm">
                <div className=" w-32">#</div>
                <div className="w-full">Quantity</div>
                <div className="w-full">Species</div>
                <div className="w-full">length</div>
                <div className="w-full">Released</div>
                {!bFormDisabled && <div className="w-28"></div>}
              </div>
              {formData.returns.length > 0 ? (
                formData.returns.map((returnItem, index) => (
                  <div
                    key={index}
                    className="flex w-full justify-between items-center border-b py-2 px-5 rounded-sm text-sm"
                  >
                    <div className="w-32">{index + 1}</div>
                    <div className="w-full truncate text-nowrap">{returnItem.quantity}</div>
                    <div className="w-full truncate text-nowrap">{returnItem.species}</div>
                    <div className=" w-full">{returnItem.length}</div>
                    <div className=" w-full">{returnItem.released ? 'Yes' : 'No'}</div>
                    {!bFormDisabled && (
                      <div className=" w-28 text-white p-1 text-center rounded-sm">
                        <div
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              returns: prev.returns.filter((_, i) => i !== index),
                            }))
                          }}
                          className="w-5 h-5 flex justify-center items-center rounded-sm bg-slate-200"
                        >
                          <FontAwesomeIcon className="text-slate-950" icon={faTimes} />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex w-full justify-between items-center border-b py-2 px-5 rounded-sm text-sm">
                  <div className="w-full text-center">No returns recorded</div>
                </div>
              )}
            </div>
            {!bFormDisabled && (
              <div id="spanUpdateCatchReturn" className="w-full">
                <div className="w-full">
                  <label className="label">Quantity</label>
                  <input
                    placeholder="Qty"
                    type="number"
                    className="input h-10"
                    value={newCatchReturnRow.quantity > 0 ? newCatchReturnRow.quantity : ''}
                    onChange={(e) =>
                      setNewCatchReturnRow({
                        ...newCatchReturnRow,
                        quantity: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>
                <div className="w-full">
                  <label className="label">Species</label>
                  <select
                    className="input"
                    value={newCatchReturnRow.species}
                    onChange={(e) =>
                      setNewCatchReturnRow({
                        ...newCatchReturnRow,
                        species: e.target.value,
                      })
                    }
                  >
                    <option value="select" disabled>
                      Select
                    </option>
                    <option value="rainbow">Rainbow</option>
                    <option value="brown">Brown</option>
                    <option value="bass">Bass</option>
                  </select>
                </div>
                <div className="w-full">
                  <label className="label">Length</label>
                  <input
                    placeholder="Length (cm)"
                    type="number"
                    className="input"
                    value={newCatchReturnRow.length > 0 ? newCatchReturnRow.length : ''}
                    onChange={(e) =>
                      setNewCatchReturnRow({
                        ...newCatchReturnRow,
                        length: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>
                <div className="w-full">
                  <label>
                    <input
                      type="checkbox"
                      checked={newCatchReturnRow.released}
                      onChange={(e) =>
                        setNewCatchReturnRow({
                          ...newCatchReturnRow,
                          released: e.target.checked,
                        })
                      }
                    />{' '}
                    Released
                  </label>
                </div>
                <div className="flex w-full gap-2">
                  <Button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        returns:
                          newCatchReturnRow.quantity > 0 &&
                          newCatchReturnRow.length > 0 &&
                          newCatchReturnRow.species !== 'select'
                            ? [...prev.returns, newCatchReturnRow]
                            : prev.returns,
                      }))
                      setNewCatchReturnRow({
                        quantity: 0,
                        species: 'select',
                        length: 0,
                        released: false,
                      })
                    }}
                    className="w-full  bg-slate-700 hover:bg-slate-600"
                    title="Add To List"
                    type="button"
                  />
                </div>
                <div className="flex w-full gap-2">
                  {errors.submit && <p className="text-red-500 text-xs">{errors.submit}</p>}
                </div>
                <div className="flex w-full gap-2">
                  {formData.returns.length > 0 && (
                    <Button className="w-full" title="Submit" type="submit" loading={loading} />
                  )}
                  {formData.returns.length === 0 && (
                    <Button
                      className="w-full bg-slate-700 hover:bg-slate-600"
                      title="Submit Nil Return"
                      loading={loading}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          nilReturn: true,
                          returns: [],
                        }))
                        submit(new Event('submit') as unknown as FormEvent)
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
