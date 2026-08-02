'use client'

import { useEffect, useState } from 'react'

type SendBulkMailResponse = {
  attempted?: number
  failed?: number
  mailSent?: boolean
  message?: string
  success?: number
}

type ReadyToSendResponse = {
  readyToSend?: number
}

export function SendBulkMail(props: any) {
  const [loading, setLoading] = useState(false)
  const [readyCount, setReadyCount] = useState<number | null>(null)
  const [readyCountLoading, setReadyCountLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sendData, setSendData] = useState<SendBulkMailResponse | null>(null)

  const loadReadyCount = async (): Promise<void> => {
    setReadyCountLoading(true)

    try {
      const req = await fetch('/api/send-bulk-mail', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!req.ok) {
        throw new Error(await req.text())
      }

      const data = (await req.json()) as ReadyToSendResponse
      setReadyCount(data.readyToSend ?? 0)
    } catch (err) {
      console.log(err)
      setReadyCount(null)
    } finally {
      setReadyCountLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    void loadReadyCount()
  }, [])

  const sendBulkMail = async (): Promise<void> => {
    setLoading(true)

    try {
      const req = await fetch('/api/send-bulk-mail', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!req.ok) {
        throw new Error(await req.text())
      }

      const data = await req.json()
      setSendData(data as SendBulkMailResponse)
    } catch (err) {
      console.log(err)
      setSendData({
        mailSent: false,
        message: err instanceof Error ? err.message : 'Bulk mail request failed.',
      })
    } finally {
      setLoading(false)
      await loadReadyCount()
    }
  }

  if (!mounted) return null

  return (
    <div>
      <p>
        Ready to send: Subscribed true, sent false, failed false
        <br />
        Count: {readyCountLoading ? 'Loading...' : readyCount !== null ? readyCount : 'Unavailable'}
        <br />
        <button onClick={sendBulkMail} type="button" disabled={loading}>
          {loading ? 'Sending Bulk Mail...' : 'Send Bulk Mail'}
        </button>
      </p>
      {loading && <p>Sending...</p>}
      {sendData && (
        <div>
          <p>Mail Sent: {sendData.mailSent ? 'Yes' : 'No'}</p>
          <p>Attempted: {sendData.attempted}</p>
          <p>Success: {sendData.success}</p>
          <p>Failed: {sendData.failed}</p>
          {sendData.message && <p>Message: {sendData.message}</p>}
        </div>
      )}
    </div>
  )
}

export default SendBulkMail
