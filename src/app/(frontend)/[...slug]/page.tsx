import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { generateMeta } from '@/admin/utils/generateMeta'
import RenderBlocks from '@/frontend/components/blocks/RenderBlocks'

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  let { slug } = await paramsPromise
  if (!slug) {
    slug = ['home']
  }
  //   const url = '/' + slug
  const page = await queryPageBySlug({
    slug,
  })
  if (!page) {
    return <></>
  }
  const { layout } = page
  return (
    <section className="flex flex-col gap-5 pt-[90px]">
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
