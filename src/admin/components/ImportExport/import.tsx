'use client'
import { EmailSubscriber } from '@/payload-types'

import React, { useState } from 'react'

export function ImportCSVButton(props: any) {
  console.log(props)
  const [loading, setLoading] = useState(false)

  const createSubscriber = async (data: EmailSubscriber): Promise<Response | null> => {
    try {
      const req = fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/${props.collectionSlug}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      return req
      // const data = await req.json()
    } catch (err) {
      alert('Import failed')
      window.location.reload()
      return null
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target?.result as string
      const rows = text.split('\n').map((row) => row.split(','))

      const [headers, ...data] = rows
      const formattedData = data.map((row) =>
        Object.fromEntries(headers.map((header, i) => [header.trim(), row[i]?.trim()])),
      )
      // add unsubscribeId to each row using crypto.randomUUID
      const subscribers: Promise<Response | null>[] = []
      formattedData.forEach((row: { [k: string]: any }) => {
        row.unsubscribeToken = crypto.randomUUID()
        row.subscribed = true
        subscribers.push(createSubscriber(row as EmailSubscriber))
      })

      const result = await Promise.all(subscribers)

      if (result) {
        window.location.reload()
      } else {
        alert('Import failed')
      }

      setLoading(false)
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <button>
        Import CSV
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </button>
      {loading && <p>Uploading...</p>}
    </div>
  )
}

export default ImportCSVButton
