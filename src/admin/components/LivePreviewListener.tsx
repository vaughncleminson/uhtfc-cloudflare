'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  const handleRefresh = () => {
    try {
      router.refresh()
    } catch (err) {
      console.error('Error refreshing route:', err)
    }
  }
  return (
    <PayloadLivePreview
      refresh={handleRefresh}
      serverURL={process.env.NEXT_PUBLIC_PAYLOAD_URL as string}
    />
  )
}
