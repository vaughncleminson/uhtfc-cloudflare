'use client'

import { userAtom } from '@/frontend/atoms/userAtom'
import { loginSchema } from '@/frontend/schemas/authSchema'
import { User } from '@/payload-types'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Button from '../ui/Button'

type LoginFormProps = {
  setAuthType: (authType: string) => void
}

export default function LoginForm(props: LoginFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [user, setUser] = useAtom<User | null>(userAtom)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
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
        const login = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const result = await login.json()
        if (result.message == 'Authentication Passed') {
          setUser(result.user)
          router.refresh()
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
    <form
      onSubmit={submit}
      className="flex flex-col bg-white p-10 pt-8 gap-2 border rounded shadow-lg"
      action=""
    >
      <div className="flex gap-2">
        <h1 className="text-2xl mb-2">LOGIN</h1>
        <h1 className="text-2xl mb-2 text-gray-300">/</h1>
        <h1
          onClick={() => props.setAuthType('register')}
          className="text-2xl mb-2 text-gray-300 underline cursor-pointer"
        >
          REGISTER
        </h1>
      </div>

      <label className="label" htmlFor="email">
        EMAIL
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </label>
      <input name="email" className={`input`} type="text" />
      <label className="label" htmlFor="password">
        PASSWORD
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </label>
      <input name="password" className={`input`} type="password" />
      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
      <Button type="submit" loading={loading} title="LOGIN" />
      <p className="underline">Forgot password</p>
    </form>
  )
}
