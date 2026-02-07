import { Location, LocationHeroBlock, Media } from '@/payload-types'
import Image from 'next/image'

import { charm } from '@/app/(frontend)/fonts'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import ButtonGroup from '../ui/ButtonGroup'

type Props = {
  locationBlock: LocationHeroBlock
  page?: Location
}

export default async function LocationHero(props: Props) {
  const image = props.locationBlock.image as Media
  const title = props.locationBlock.title
  const buttons = props.locationBlock.btns

  return (
    <div className="relative h-screen">
      <Image
        className="fixed z-0 w-screen h-screen top-0 left-0 object-cover object-center"
        src={image.url!}
        alt={image.alt}
        width={2048}
        height={2048}
      />
      <div className="absolute flex flex-col gap-8 z-10 w-full h-screen items-center justify-center">
        <div className={`text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] ${charm.className}`}>
          <h1 className="text-6xl text-center">{title}</h1>
        </div>

        <div className="flex">
          <div className="relative w-[24px]">
            <Image
              src="/assets/ribbon.png"
              alt="arrow down"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 10vw"
            />
          </div>
          <div className=" text-white bg-red-700">
            <div className={`px-4 py-2 text-2xl text-center `}>
              {props.page?.temporarilyClosed ? props.page.closureReason : 'Members Only'}
            </div>
          </div>
          <div className="relative w-[24px] rotate-180">
            <Image
              src="/api/media/file/ribbon.png"
              alt="arrow down"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 10vw"
            />
          </div>
        </div>

        {buttons && buttons.links && buttons.links.length > 0 && (
          <ButtonGroup buttons={buttons.links} location={props.page} />
        )}
      </div>
      <Link href={'#details'}>
        <div className="flex z-20 flex-col absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer">
          <FontAwesomeIcon
            className="text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] w-5 h-6 animate-pulse"
            icon={faAngleDown}
          />
        </div>
      </Link>
    </div>
  )
}
