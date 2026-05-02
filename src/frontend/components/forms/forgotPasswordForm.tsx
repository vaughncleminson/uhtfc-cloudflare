'use client'

import { FormEvent, useState } from 'react'
import Button from '../ui/Button'

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const email = String(formData.get('email') || '').trim()

    if (!email) {
      setError('Email is required')
      setSuccessMessage(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        setError('Unable to send reset email right now. Please try again.')
        return
      }

      setSuccessMessage(`If an account exists for email ${email}, a reset link has been sent.`)
      form.reset()
    } catch (err) {
      setError('Unable to send reset email right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col bg-slate-900 p-10 pt-8 gap-2">
      <h1 className="text-2xl text-white mb-2">FORGOT PASSWORD</h1>

      <p className="text-slate-300 text-sm mb-3">
        Enter your email address and we will send you a password reset link.
      </p>

      <label className="label" htmlFor="email">
        EMAIL
      </label>
      <input name="email" className="input" type="email" autoComplete="email" />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {successMessage && <p className="text-green-400 text-sm mt-2">{successMessage}</p>}

      <Button type="submit" loading={loading} title="EMAIL RESET LINK" />
    </form>
  )
}
