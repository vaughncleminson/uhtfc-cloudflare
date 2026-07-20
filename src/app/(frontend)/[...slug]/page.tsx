import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { draftMode, headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import { generateMeta } from '@/admin/utils/generateMeta'
import RenderBlocks from '@/frontend/components/blocks/RenderBlocks'

type Args = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const payload = await getPayload({ config: configPromise })
  const searchParams = await searchParamsPromise
  const status = searchParams.status
  const orderId = searchParams.orderId

  const { user } = await payload.auth({
    headers: await headers(),
  })

  let { slug } = await paramsPromise
  if (!slug) {
    slug = ['home']
  }

  const page = await queryPageBySlug({
    slug,
  })
  if (!page) {
    notFound()
  }
  //Authenticated routes
  const requiresAuth =
    page.slug === 'bookings' || page.slug === 'checkout' || page.slug.includes('profile')

  if (requiresAuth) {
    // 2. Define your bypass condition for the checkout page
    const isBypassCheckout = page.slug === 'checkout' && status && orderId

    // 3. Only redirect if the user is missing AND the bypass condition is NOT met
    if (!user && !isBypassCheckout) {
      redirect('/?auth=false')
    }
  }
  const { layout } = page
  return (
    <section className="flex flex-col gap-5 pt-[90px] pb-[170px]">
      <RenderBlocks blocks={layout} />
    </section>
  )
}
export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  let { slug } = await paramsPromise
  if (!slug) {
    slug = ['home']
  }
  const page = await queryPageBySlug({
    slug,
  })
  return generateMeta({ doc: page })
}
//test
const queryPageBySlug = cache(async ({ slug }: { slug: string[] }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug.join('/'),
      },
    },
  })

  return result.docs?.[0] || null
})
