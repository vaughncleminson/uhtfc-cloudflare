'use client'
import { crimson } from '@/app/(frontend)/fonts'
import {
  Location,
  LocationDetailsBlock,
  LocationHeroBlock,
  LocationsBlock,
  Media,
} from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { Where } from 'payload'
import qs from 'qs'
import { useEffect, useState } from 'react'
import Button from '../ui/Button'

type LocationCard = {
  id: string
  title: string
  type: string
  image: Media
  membersOnly: boolean
  rodLimit: number
  slug: string
}
//test

export default function Locations(props: LocationsBlock) {
  const [locations, setLocations] = useState<LocationCard[]>([])
  useEffect(() => {
    const fetchLocations = async () => {
      const whereQuery: Where = {
        type: {
          equals: props.title == 'Stillwaters' ? 'stillwater' : 'river',
        },
        enabled: {
          equals: true,
        },
      }
      const queryString = qs.stringify({ where: whereQuery, limit: 0 }, { addQueryPrefix: true })

      try {
        const req = await fetch(`/api/locations${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = (await req.json()) as any
        console.log(data)
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
    <div id={props.blockName} className="relative px-5 lg:px-40">
      <div className="grid grid-cols-1 gap-5 z-50 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((card) => {
          return (
            <div
              key={card.title}
              className="w-full h-[400px] relative object-cover transition-transform duration-300 ease-in-out  hover:scale-105"
            >
              <div className="h-full w-full top-0 left-0">
                <Image
                  src={card.image.url!}
                  alt={card.title}
                  width={1024}
                  height={1024}
                  className="w-full object-cover h-full absolute top-0 left-0"
                />
                <Image
                  className="absolute z-0 h-full top-0 left-0 object-fill"
                  src={'/assets/shade_outer.png'}
                  alt="shade"
                  fill
                />
                <div className="absolute w-full h-full top-0 left-0 flex flex-col items-center justify-center">
                  <div className=" drop-shadow-[0_5px_5px_rgba(0,0,0,1)] text-center">
                    <div className="text-white">{card.rodLimit} rods</div>
                    <h2 className="text-3xl z-20 text-white uppercase">{card.title}</h2>
                    <div className={`${crimson.className} text-white`}>
                      {card.membersOnly ? 'Members only' : 'Members & non-members'}
                    </div>

                    <Link href={`/book-now?location=${card.id}#details`} className="w-full">
                      <Button
                        className="w-full rounded-none h-11 mt-3 bg-black bg-opacity-30 border border-white text-white text-base hover:bg-black  transition-colors duration-300"
                        title="Book Now"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
