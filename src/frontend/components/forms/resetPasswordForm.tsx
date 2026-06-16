'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Button from '../ui/Button'
import { useConfirm } from '../ui/ModalProvider'

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()
  const confirm = useConfirm()

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.')
      return
    }

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const password = String(formData.get('password') || '')
    const confirmPassword = String(formData.get('confirmPassword') || '')

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (!response.ok) {
        setError('Unable to reset password. Your link may have expired — please request a new one.')
        return
      }

      const confirmed = await confirm({
        title: 'Password Reset Successful',
        message: 'Your password has been successfully reset.',
        confirmTitle: 'Login',
        showCancelButton: false,
        confirmUrl: '/',
      })
      if (!confirmed) return
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col bg-slate-900 p-10 pt-8 gap-2">
      <h1 className="text-2xl text-white mb-2">RESET PASSWORD</h1>

      <p className="text-slate-300 text-sm mb-3">
        Enter your new password below.
        <br />
        Password must be at least 8 characters.
      </p>

      <label className="label" htmlFor="password">
        NEW PASSWORD
      </label>
      <input
        id="password"
        name="password"
        className="input"
        type="password"
        autoComplete="new-password"
      />

      <label className="label" htmlFor="confirmPassword">
        CONFIRM NEW PASSWORD
      </label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        className="input"
        type="password"
        autoComplete="new-password"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <Button type="submit" loading={loading} title="RESET PASSWORD" />
    </form>
  )
}
