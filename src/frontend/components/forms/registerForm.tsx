'use client'

import { registerSchema } from '@/frontend/schemas/authSchema'
import { FormEvent, useState } from 'react'

type RegisterFormProps = {
  setAuthType: (authType: string) => void
}

export default function RegisterForm(props: RegisterFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    const result = registerSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })

      setErrors(fieldErrors)
    } else {
      setErrors({})
      try {
        console.log(data)
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const result = await response.json()
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <form
      onSubmit={submit}
      className="flex flex-col bg-white p-10 pt-8 gap-2 border rounded shadow-lg"
      action=""
    >
      <div className="flex gap-2">
        <h1
          onClick={() => props.setAuthType('login')}
          className="text-2xl mb-2 text-gray-300 underline cursor-pointer"
        >
          LOGIN
        </h1>
        <h1 className="text-2xl mb-2 text-gray-300">/</h1>
        <h1 className="text-2xl mb-2 ">REGISTER</h1>
      </div>
      <label className="label" htmlFor="firstName">
        FIRST NAME
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
      </label>
      <input name="firstName" className={`input`} type="text" />

      <label className="label" htmlFor="lastName">
        LAST NAME
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
      </label>
      <input name="lastName" className={`input`} type="text" />

      <label className="label" htmlFor="email">
        EMAIL
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </label>
      <input name="email" className={`input`} type="text" />

      <label className="label" htmlFor="mobileNumber">
        MOBILE NUMBER
        {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
      </label>
      <input name="mobileNumber" className={`input`} type="text" />

      <label className="label" htmlFor="password">
        PASSWORD
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </label>
      <input name="password" className={`input`} type="password" />

      <label className="label" htmlFor="confirm-password">
        CONFIRM PASSWORD
        {errors['confirm-password'] && (
          <p className="text-red-500 text-sm">{errors['confirm-password']}</p>
        )}
      </label>
      <input name="confirm-password" className={`input`} type="password" />

      <input className="submit" type="submit" value="REGISTER" />
    </form>
  )
}
