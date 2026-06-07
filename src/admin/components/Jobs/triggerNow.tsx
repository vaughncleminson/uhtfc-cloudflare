'use client'

import { useState } from 'react'
import { toast } from '@payloadcms/ui'

export function TriggerCatchReturnJobButton() {
  const [isRunning, setIsRunning] = useState(false)

  const triggerNow = async () => {
    setIsRunning(true)

    try {
      const triggerResponse = await fetch('/api/jobs/trigger-catch-return-links', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (!triggerResponse.ok) {
        const triggerResult = await triggerResponse.text()
        throw new Error(triggerResult || 'Failed to trigger task')
      }

      toast.success('emailCatchReturnLinks task triggered successfully.')

      window.location.reload()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to run task'
      toast.error(`Could not trigger task: ${message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <button onClick={triggerNow} type="button" disabled={isRunning}>
      {isRunning ? 'Running emailCatchReturnLinks...' : 'Run emailCatchReturnLinks now'}
    </button>
  )
}

export default TriggerCatchReturnJobButton
