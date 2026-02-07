'use client'
import {
  Location,
  LocationDetailsBlock,
  LocationHeroBlock,
  LocationsBlock,
  Media,
} from '@/payload-types'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Row from '../layout/Row'
import Button from '../ui/Button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import path from 'path'
import { Where } from 'payload'
import qs from 'qs'

type LocationCard = {
  id: string
  title: string
  type: string
  image: Media
  membersOnly: boolean
  rodLimit: number
  slug: string
}

export default function Locations(props: LocationsBlock) {
  const pathName = usePathname()
  const [locations, setLocations] = useState<LocationCard[]>([])
  useEffect(() => {
    const fetchLocations = async () => {
      const pathSplit = pathName.split('/')
      const locationType = pathSplit[pathSplit.length - 1] // Assuming the type is in the 4th segment of the path
      const whereQuery: Where = {
        type: {
          equals: locationType == 'stillwaters' ? 'stillwater' : 'river',
        },
        enabled: {
          equals: true,
        },
      }
      const queryString = qs.stringify({ where: whereQuery, limit: 0 }, { addQueryPrefix: true })

      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/locations${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await req.json()
        const cards: LocationCard[] = data.docs.map((location: Location) => {
          const hero = location.layout[0] as LocationHeroBlock
          const details = location.layout[1] as LocationDetailsBlock

          return {
            id: location.id,
            title: hero.title || '',
            type: location.type || 'stillwater',
            image: hero.image as Media,
            membersOnly: details.membersOnly || false,
            rodLimit: details.rodLimit,
            slug: location.slug || '',
          }
        })
        console.log(cards)
        setLocations(cards)
      } catch (err) {
        console.log(err)
      }
    }
    fetchLocations()
  }, [])
  return (
    <div className=" bg-amber-50 relative py-6 lg:py-12">
      <Row>
        <div className="grid grid-cols-1 gap-10 z-50 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((card) => {
            return (
              <div
                key={card.title}
                className="w-full relative object-cover bg-white shadow-lg rounded overflow-hidden transition-transform duration-300 ease-in-out  hover:scale-105"
              >
                <div className="relative">
                  <Image
                    src={card.image.url!}
                    alt={card.title}
                    width={1024}
                    height={1024}
                    className="w-full object-cover h-1/2"
                  />
                  <h2 className=" absolute bg-red-700 py-2 px-4 text-white bottom-8 left-0 text-xl font-bold">
                    {card.title.toUpperCase()}
                  </h2>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-col items-center justify-center h-full  p-3">
                    <div>{card.membersOnly ? 'Members only' : 'Members & non-members'}</div>
                    <div>Rod limit : {card.rodLimit}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-3 w-full h-full  p-3">
                    <Link href={`/book-now?location=${card.id}#details`} className="w-full">
                      <Button
                        className="w-full h-11 mt-0 bg-white border border-black text-black text-base hover:bg-slate-800 hover:text-white transition-colors duration-300"
                        title="Book Now"
                      />
                    </Link>
                    <Link
                      href={`/our-water/${card.type == 'stillwater' ? 'stillwaters' : 'rivers'}/${card.slug}`}
                      className="w-full"
                    >
                      <Button
                        className="w-full h-11 mt-0 bg-white border border-black text-black text-base hover:bg-slate-800 hover:text-white transition-colors duration-300"
                        title="Location Details"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Row>
    </div>
  )
}
