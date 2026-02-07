import { LivePreviewListener } from '@/admin/components/LivePreviewListener'
import { getServerSideURL } from '@/admin/utils/getURL'
import { mergeOpenGraph } from '@/admin/utils/mergeOpenGraph'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import { cookies, draftMode } from 'next/headers'
import React, { cache } from 'react'
import { gilda } from './fonts'

import Header from '@/frontend/components/layout/Header'
import { ToastProvider } from '@/frontend/components/ui/ToastProvider'
import { Navigation } from '@/payload-types'
import { getPayload } from 'payload'
import './globals.css'
// import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const navigation = (await queryNavigation()) as Navigation

  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  const isAuthenticated = Boolean(token)

  return (
    <html lang="en" suppressHydrationWarning className={`${gilda.className}`}>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <LivePreviewListener />
        <Header navigation={navigation} isAuthenticated={isAuthenticated} />
        <ToastProvider> {children}</ToastProvider>
      </body>
    </html>
  )
}

const queryNavigation = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.findGlobal({
    slug: 'navigation',
  })

  return result
})

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
