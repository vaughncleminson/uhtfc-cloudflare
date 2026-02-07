'use client'

import { userAtom } from '@/frontend/atoms/userAtom'
import { ButtonLink } from '@/frontend/types/buttonLink'
import { Location, LocationDetailsBlock } from '@/payload-types'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  buttons: ButtonLink[]
  location?: Location
}

export default function ButtonGroup(props: Props) {
  const [buttons] = useState(props.buttons)
  const [user] = useAtom(userAtom)
  const [locationDetails, setLocationDetails] = useState<LocationDetailsBlock | null>(null)
  const pathName = usePathname()

  useEffect(() => {
    if (props.location) {
      setLocationDetails(
        props.location.layout.find(
          (block) => block.blockType === 'locationDetails',
        ) as LocationDetailsBlock | null,
      )
    }
  }, [props.location])

  const showBookNowButton = () => {
    if (props.location?.temporarilyClosed || !user || pathName.includes('/book-now')) {
      return false
    } else if (locationDetails?.membersOnly && user && user?.role === 'non-member') {
      return false
    }
    return true
  }

  const checkVisibility = (button: ButtonLink) => {
    switch (button.link?.show) {
      case 'always':
        return true
      case 'auth':
        return user ? true : false
      case 'no-auth':
        return user ? false : true
      default:
        return true
    }
  }

  const renderStandardButton = (button: ButtonLink, index: number) => {
    if (button && button.link && button.link.label && checkVisibility(button)) {
      if (button && button.link && button.link.label) {
        if (button.link.type == 'reference') {
          return (
            <Link href={button.link.internalLink!} key={button.id}>
              <div className={`px-3 text-center border-r py-2 w-36 hover:bg-black`} key={button.id}>
                {button.link.label}
              </div>
            </Link>
          )
        } else if (button.link.type == 'custom') {
          return (
            <a href={button.link.url!} key={button.id}>
              <div className={`px-3 text-center border-r py-2 w-32 hover:bg-black`} key={button.id}>
                {button.link.label}
              </div>
            </a>
          )
        }
      }
    }
  }

  return (
    <div className="flex">
      {buttons && buttons?.length > 0 && (
        <div className="border-t border-b border-l flex border-white text-white bg-black bg-opacity-40">
          {buttons?.map((button, index) => {
            if (button) {
              return renderStandardButton(button, index)
            }
          })}
          {showBookNowButton() && (
            <Link
              href={`/book-now${props.location ? `?location=${props.location.id}#details` : ''}`}
            >
              <div className={`px-3 text-center border-r py-2 w-36 hover:bg-black`}>Book Now</div>
            </Link>
          )}
          {!user && (
            <Link href="/#login">
              <div className={`px-3 text-center border-r py-2 w-36 hover:bg-black`}>
                Login/Sign-up
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
