'use client'

import { FormEvent, useMemo, useState } from 'react'

type ResendFormProps = {
  defaultFromAddress: string
  emailMode: string
  emailTestAddress: string
}

type SendResponse = {
  message?: string
  sentTo?: string
  status?: 'sent' | 'error'
}

export function ResendForm({ defaultFromAddress, emailMode, emailTestAddress }: ResendFormProps) {
  const [from, setFrom] = useState(defaultFromAddress)
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [response, setResponse] = useState<SendResponse | null>(null)

  const displayTestAddress = useMemo(() => emailTestAddress || '(not set)', [emailTestAddress])

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResponse(null)
    setIsSending(true)

    try {
      const req = await fetch('/api/resend/send', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, subject, body }),
      })

      const data = (await req.json()) as SendResponse

      if (!req.ok) {
        setResponse({
          status: 'error',
          message: data.message || 'Failed to send email.',
        })
        return
      }

      setResponse({
        status: 'sent',
        message: data.message || 'Email sent successfully.',
        sentTo: data.sentTo,
      })
    } catch {
      setResponse({
        status: 'error',
        message: 'An unexpected error occurred while sending.',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Resend Email Tester</h1>
      <p style={{ marginTop: 0, marginBottom: '1rem', opacity: 0.8 }}>
        Send a one-off email through Resend.
      </p>

      <div
        style={{
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: 8,
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          background: 'var(--theme-bg)',
        }}
      >
        <div>
          <strong>EMAIL_MODE:</strong> {emailMode}
        </div>
        <div>
          <strong>EMAIL_TEST_ADDRESS:</strong> {displayTestAddress}
        </div>
      </div>

      <form onSubmit={handleSend}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <label>
            <div style={{ marginBottom: 4 }}>From</div>
            <input
              required
              type="email"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              style={{ width: '100%' }}
            />
          </label>

          <label>
            <div style={{ marginBottom: 4 }}>Target Email</div>
            <input
              required
              type="email"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              style={{ width: '100%' }}
            />
          </label>

          <label>
            <div style={{ marginBottom: 4 }}>Subject</div>
            <input
              required
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              style={{ width: '100%' }}
            />
          </label>

          <label>
            <div style={{ marginBottom: 4 }}>Body</div>
            <textarea
              required
              rows={10}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </label>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button disabled={isSending} type="submit">
            {isSending ? 'Sending...' : 'Send'}
          </button>
          {response ? (
            <span
              style={{
                color:
                  response.status === 'error'
                    ? 'var(--theme-error-500)'
                    : 'var(--theme-success-500)',
              }}
            >
              {response.message}
              {response.sentTo ? ` Sent to: ${response.sentTo}` : ''}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  )
}
