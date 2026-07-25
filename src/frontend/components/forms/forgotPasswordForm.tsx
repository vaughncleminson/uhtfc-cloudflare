'use client'
import { useConfirm } from '../ui/ModalProvider'
import { FormEvent, useState } from 'react'
import Button from '../ui/Button'

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const confirm = useConfirm()

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

      setSuccessMessage(
        `We will email a reset link if the email address ${email} matches an account.
        If you do not get an email, please check spelling or try another email address.
        For assistance, please contact us at uhtfc.office@gmail.com or 082 636 3985`,
      )
      form.reset()
      const confirmed = await confirm({
        title: 'Email Reset Link',
        message: successMessage || '',
        showCancelButton: false,
        confirmTitle: 'OK',
      })
      if (!confirmed) return
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
      {successMessage && (
        <p className="text-green-400 text-sm mt-2 whitespace-pre-line">{successMessage}</p>
      )}

      <Button type="submit" loading={loading} title="EMAIL RESET LINK" />
    </form>
  )
}
