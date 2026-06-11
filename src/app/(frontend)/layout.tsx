import { LivePreviewListener } from '@/admin/components/LivePreviewListener'
import { getServerSideURL } from '@/admin/utils/getURL'
import { mergeOpenGraph } from '@/admin/utils/mergeOpenGraph'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'
import { oswald } from './fonts'

import Footer from '@/frontend/components/layout/Footer'
import Header from '@/frontend/components/layout/Header'
import { AuthProvider } from '@/frontend/components/ui/AuthProvider'
import { ConfirmProvider } from '@/frontend/components/ui/ModalProvider'
import { ToastProvider } from '@/frontend/components/ui/ToastProvider'
import { Navigation } from '@/payload-types'
import { getPayload } from 'payload'
import './globals.css'
// import { getServerSideURL } from '@/utilities/getURL'

// we use below export to force dynamic rendering of the layout,
// this is a workaround when D1 throws 502 errors, like if it ran out of connections
// export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const navigation = (await queryNavigation()) as Navigation

  const payload = await getPayload({ config: configPromise })

  const { user } = await payload.auth({
    headers: await headers(),
  })
  //test
  return (
    <html lang="en" suppressHydrationWarning className={`${oswald.className} bg-slate-800`}>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <LivePreviewListener />
        <AuthProvider user={user}>
          <Header navigation={navigation} />
          <ConfirmProvider>
            <ToastProvider>{children}</ToastProvider>
          </ConfirmProvider>
          <Footer navigation={navigation} />
        </AuthProvider>
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
