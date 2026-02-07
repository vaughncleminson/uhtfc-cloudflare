import { HeroBlock, Media } from '@/payload-types'
import Image from 'next/image'

import { charm } from '@/app/(frontend)/fonts'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import ButtonGroup from '../ui/ButtonGroup'
import CallToAction from '../ui/CallToAction'

export default async function Hero(props: HeroBlock) {
  const image = props.image as Media
  const title = props.title
  const buttons = props.btns

  return (
    <div className="relative h-screen z-0">
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
        <CallToAction />
        {buttons && buttons.links && buttons.links.length > 0 && (
          <ButtonGroup buttons={buttons.links} />
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
