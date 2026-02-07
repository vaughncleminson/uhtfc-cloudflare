import type { Location } from '@/payload-types'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { generateMeta } from '@/admin/utils/generateMeta'
import RenderBlocks from '@/frontend/components/blocks/RenderBlocks'
import { Metadata } from 'next'

// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise })
//   const pages = await payload.find({
//     collection: 'pages',
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//     pagination: false,
//     select: {
//       slug: true,
//     },
//   })

//   const params = pages.docs
//     ?.filter((doc) => doc.slug && doc.slug !== 'home') // Exclude "home" and check for slug existence
//     .map((doc) => {
//       const slugParts = doc.slug!.split('/') // Split the slug into parts for [...slug]
//       return { slug: slugParts }
//     })

//   return params
// }

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

const queryPageBySlug = cache(async ({ slug }: { slug: string[] }): Promise<Location> => {
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
