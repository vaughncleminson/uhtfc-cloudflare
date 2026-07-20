'use client'

import { createFestivalEntrySchema } from '@/frontend/schemas/festivalEntrySchema'
import { Festival, User } from '@/payload-types'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useAuth } from '../ui/AuthProvider'
import Button from '../ui/Button'
import { useConfirm } from '../ui/ModalProvider'

type FestivalEntriesFormProps = {
  festival: Festival
}

export default function FestivalEntriesForm(props: FestivalEntriesFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [loading, setLoading] = useState(false)
  const user = useAuth().user as User
  const confirm = useConfirm()
  //set the size options based on the selected giveaway type
  const selectedGiveAwayType = props.festival.giveAwayType?.[0]
  const sizeOptions =
    selectedGiveAwayType === 'beanie'
      ? (props.festival.beanieSizes ?? [])
      : selectedGiveAwayType === 'hat'
        ? (props.festival.hatSizes ?? [])
        : (props.festival.garmentSizes ?? [])
  const sizeLabel =
    selectedGiveAwayType === 'tShirt'
      ? 'T-Shirt Size'
      : selectedGiveAwayType
        ? `${selectedGiveAwayType.charAt(0).toUpperCase()}${selectedGiveAwayType.slice(1)} Size`
        : 'Select Size'

  const formatSizeLabel = (size: string) => {
    if (size === 'all') return 'One-size-fits-all'
    return size.toUpperCase()
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    const validationSchema = createFestivalEntrySchema(props.festival.entriesPerTeam ?? 1)
    const result = validationSchema.safeParse(data)
    console.log('festivalEntriesForm: validationSchema: result', result)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        const path = err.path[0]
        if (typeof path === 'string') {
          fieldErrors[path] = err.message
        }
      })
      setErrors(fieldErrors)
    } else {
      setErrors({})
      try {
        setLoading(true)
        const response = await fetch('/api/festival-entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            festivalId: props.festival.id,
          }),
        })
        console.log('festivalEntriesForm: post body:', {
          ...data,
          festivalId: props.festival.id,
        })
        const submitResult = (await response.json()) as {
          success?: boolean
          message?: string
        }

        if (response.ok && submitResult.success) {
          form.reset()
          await confirm({
            title: 'Entry submitted successfully',
            message:
              'Your festival entry has been submitted successfully. Please check your email for confirmation and payment details.',
            showCancelButton: false,
            confirmTitle: 'OK',
          })
        } else {
          if (response.status === 401) {
            setErrors({ submit: 'Please log in first' })
          } else {
            setErrors({ submit: submitResult.message || 'Failed to submit festival entry' })
          }
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
  }
  return (
    <form
      onSubmit={submit}
      className="flex flex-col bg-slate-900 p-10 pt-8 gap-2 relative"
      action=""
    >
      <div className="flex gap-2">
        <h1 className="text-2xl text-white mb-2 uppercase">Enter Now</h1>
      </div>

      <label className="label" htmlFor="teamName">
        TEAM NAME
        {errors.teamName && <p className="text-red-500 text-sm">{errors.teamName}</p>}
      </label>
      <input placeholder="Team name" name="teamName" className="input" type="text" />
      {props.festival.entriesPerTeam > 1 && (
        <>
          {Array.from({ length: props.festival.entriesPerTeam }).map((_, index) => (
            <div key={index}>
              <label className="label">TEAM MEMBER #{index + 1}</label>
              <input
                placeholder={`Full Name`}
                name={`teamMember_${index}`}
                className="input my-2" // Added margin-bottom for spacing
                type="text"
              />
              {errors[`teamMember_${index}`] && (
                <p className="text-red-500 text-sm">{errors[`teamMember_${index}`]}</p>
              )}
              <input
                placeholder={`Email`}
                name={`teamMemberEmail_${index}`}
                className="input mb-2" // Added margin-bottom for spacing
                type="email"
              />
              {errors[`teamMemberEmail_${index}`] && (
                <p className="text-red-500 text-sm">{errors[`teamMemberEmail_${index}`]}</p>
              )}
              <input
                placeholder={`Mobile Number`}
                name={`teamMemberMobile_${index}`}
                className="input mb-2" // Added margin-bottom for spacing
                type="text"
              />
              {errors[`teamMemberMobile_${index}`] && (
                <p className="text-red-500 text-sm">{errors[`teamMemberMobile_${index}`]}</p>
              )}
              <select
                name={`teamMemberSize_${index}`}
                className="input mb-2" // Added margin-bottom for spacing
              >
                <option value="">{sizeLabel}</option>
                {sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {formatSizeLabel(size)}
                  </option>
                ))}
              </select>
              {errors[`teamMemberSize_${index}`] && (
                <p className="text-red-500 text-sm">{errors[`teamMemberSize_${index}`]}</p>
              )}
            </div>
          ))}
        </>
      )}
      <label className="label" htmlFor="extraMeals">
        EXTRA MEALS (Family Members)
      </label>
      <input
        placeholder="Number of extra meals"
        name="extraMeals"
        className="input"
        type="number"
      />
      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
      <Button type="submit" loading={loading} title="SUBMIT" />
      {!user && (
        <Link href="/#login" className="text-white mt-2 underline">
          <div className="bg-slate-950 bg-opacity-70 absolute left-0 top-0 w-full h-full text-white flex items-center justify-center">
            PLEASE REGISTER OR LOGIN TO APPLY FOR FESTIVAL ENTRY
          </div>
        </Link>
      )}
    </form>
  )
}
