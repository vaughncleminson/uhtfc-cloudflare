import type { Location } from '@/payload-types'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { generateMeta } from '@/admin/utils/generateMeta'
import RenderBlocks from '@/frontend/components/blocks/RenderBlocks'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const locations = await payload.find({
    collection: 'locations',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    where: {
      type: {
        equals: 'river',
      },
    },
  })

  const params = locations.docs
    ?.filter((doc) => typeof doc.slug === 'string' && doc.slug.length > 0)
    .map((doc) => ({ slug: doc.slug as string }))

  return params
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  let page: Location | null
  page = await queryPageBySlug({
    slug,
  })
  if (!page) {
    return <></>
  }
  const { layout } = page
  return (
    <section>
      <RenderBlocks blocks={layout} page={page} />
    </section>
  )
}

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await paramsPromise

  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }): Promise<Location> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'locations',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
      type: {
        equals: 'river',
      },
    },
  })

  return result.docs?.[0] || null
})
