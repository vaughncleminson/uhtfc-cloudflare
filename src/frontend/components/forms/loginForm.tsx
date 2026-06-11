'use client'

import { loginSchema } from '@/frontend/schemas/authSchema'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Button from '../ui/Button'
import { useConfirm } from '../ui/ModalProvider'

type LoginFormProps = {
  setAuthType: (authType: string) => void
}

export default function LoginForm(props: LoginFormProps) {
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
        <h1 className="text-2xl text-white mb-2">LOGIN</h1>
        <h1 className="text-2xl mb-2 text-white">/</h1>
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
      <p className="text-white underline">
        <Link href="/forgot-password">Forgot password?</Link>
      </p>
    </form>
  )
}
