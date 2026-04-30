'use client'

import { userAtom } from '@/frontend/atoms/userAtom'
import { registerSchema } from '@/frontend/schemas/authSchema'
import { User } from '@/payload-types'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Button from '../ui/Button'

type RegisterFormProps = {
  setAuthType: (authType: string) => void
}

export default function RegisterForm(props: RegisterFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [user, setUser] = useAtom<User | null>(userAtom)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
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
        setLoading(true)
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const result = (await response.json()) as any
        if (result.message == 'Registration Successful') {
          props.setAuthType('login')
        } else {
          setErrors({ submit: result.message || 'Registration failed' })
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <form onSubmit={submit} className="flex flex-col bg-slate-900 p-10 pt-8 gap-2" action="">
      <div className="flex gap-2">
        <h1
          onClick={() => props.setAuthType('login')}
          className="text-2xl mb-2 text-gray-300 underline cursor-pointer"
        >
          LOGIN
        </h1>
        <h1 className="text-2xl mb-2 text-white">/</h1>
        <h1 className="text-2xl mb-2 text-white">REGISTER</h1>
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
      <Button type="submit" loading={loading} title="REGISTER" />
    </form>
  )
}
