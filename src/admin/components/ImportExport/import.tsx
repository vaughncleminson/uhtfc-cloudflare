'use client'

import React, { useState } from 'react'
import './index.scss'

const BATCH_SIZE = 50
const BATCH_DELAY = 5000 // 5 seconds

export function ImportCSVButton(props: any) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const createSubscriber = async (data: Record<string, any>): Promise<boolean> => {
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/${props.collectionSlug}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      )

      const response = (await req.json()) as any

      if (!req.ok) {
        console.error(response)

        if (response?.errors?.[0]?.message) {
          throw new Error(response.errors[0].message)
        }

        throw new Error('Import failed')
      }

      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setLoading(true)
    setProgress('Reading CSV...')

    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string

        const rows = text
          .split('\n')
          .map((row) => row.trim())
          .filter(Boolean)
          .map((row) => row.split(','))

        const [headers, ...data] = rows

        const subscribers = data.map((row) => {
          const subscriber: Record<string, any> = Object.fromEntries(
            headers.map((header, i) => [header.trim(), row[i]?.trim()]),
          )

          subscriber.unsubscribeToken = crypto.randomUUID()
          subscriber.subscribed = true

          return subscriber
        })

        const total = subscribers.length

        for (let i = 0; i < total; i += BATCH_SIZE) {
          const batch = subscribers.slice(i, i + BATCH_SIZE)

          setProgress(`Uploading ${Math.min(i + batch.length, total)} of ${total} subscribers...`)

          const results = await Promise.allSettled(
            batch.map((subscriber) => createSubscriber(subscriber)),
          )

          const failed = results.find((r) => r.status === 'rejected')

          if (failed) {
            const reason =
              failed.status === 'rejected'
                ? failed.reason?.message || 'Import failed'
                : 'Import failed'

            alert(reason)
            setLoading(false)
            window.location.replace(`/admin/collections/${props.collectionSlug}`)
            return
          }

          const hasMoreBatches = i + BATCH_SIZE < total

          if (hasMoreBatches) {
            await sleep(BATCH_DELAY)
          }
        }

        setProgress(`Successfully imported ${total} subscribers`)

        setTimeout(() => {
          window.location.replace(`/admin/collections/${props.collectionSlug}`)
        }, 1000)
      } catch (error) {
        console.error(error)
        alert(error instanceof Error ? error.message : 'Import failed')
        window.location.replace(`/admin/collections/${props.collectionSlug}`)
      } finally {
        setLoading(false)
      }
    }

    reader.readAsText(file)
  }

  return (
    <div>
      <button id="import-button" disabled={loading}>
        {loading ? 'Importing...' : 'Import CSV'}
        <input
          id="csv-input"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={loading}
        />
      </button>

      {loading && (
        <div>
          <p>{progress}</p>
        </div>
      )}
    </div>
  )
}

export default ImportCSVButton
