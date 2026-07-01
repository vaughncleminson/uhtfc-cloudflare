'use client'

import { loginSchema } from '@/frontend/schemas/authSchema'
import { Festival } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Button from '../ui/Button'
import { useConfirm } from '../ui/ModalProvider'

type FestivalEntriesFormProps = {
  festival: Festival
}

export default function FestivalEntriesForm(props: FestivalEntriesFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const confirm = useConfirm()
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    const result = loginSchema.safeParse(data)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
    } else {
      setErrors({})
      try {
        setLoading(true)
        const login = await fetch('/api/frontend-auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const result = (await login.json()) as any
        if (result.message == 'Authentication Passed') {
          router.push('/')
          router.refresh()
        } else if (result.message == 'Reset email sent') {
          setLoading(false)
          const confirmed = await confirm({
            title: 'Required information',
            message: `An email has been sent to ${data.email}. You are required to click the link in the email to reset your password and supply other information before continuing. If you haven't received the email within a few minutes, please check your spam folder or contact us directly.`,
            confirmTitle: 'OK',
            cancelTitle: 'Cancel',
            confirmUrl: '/',
            cancelUrl: '/',
          })
          if (!confirmed) return
          form.reset()
        } else {
          setErrors({ submit: 'Username or password incorrect' })
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
  }
  return (
    <form onSubmit={submit} className="flex flex-col bg-slate-900 p-10 pt-8 gap-2" action="">
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
              {errors.teamName && <p className="text-red-500 text-sm">{errors.teamName}</p>}
              <input
                placeholder={`Full Name`}
                name={`teamMember_${index}`}
                className="input my-2" // Added margin-bottom for spacing
                type="text"
              />
              <input
                placeholder={`Email`}
                name={`teamMemberEmail_${index}`}
                className="input mb-2" // Added margin-bottom for spacing
                type="email"
              />
              <input
                placeholder={`Mobile Number`}
                name={`teamMemberMobile_${index}`}
                className="input mb-2" // Added margin-bottom for spacing
                type="text"
              />
              <select
                name={`teamMemberSize_${index}`}
                className="input mb-2" // Added margin-bottom for spacing
              >
                <option value="">{`${props.festival.giveAwayType[0]} Size`}</option>
                {props.festival.garmentSizes.map((size) => (
                  <option key={size} value={size}>
                    {size.toUpperCase()}
                  </option>
                ))}
              </select>
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
    </form>
  )
}
