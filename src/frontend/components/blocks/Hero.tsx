import { HeroBlock, Media } from '@/payload-types'
import Image from 'next/image'

import { crimson, oswald } from '@/app/(frontend)/fonts'
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
    <div
      className={`px-5 relative z-0  ${props.size === 'small' ? 'h-[calc(50vh)]' : 'h-[calc(100vh-110px)]'} lg:px-40`}
    >
      <div className=" relative w-full h-full">
        <Image
          className="relative z-0 w-full h-full top-0 left-0 object-cover object-center"
          src={image.url!}
          alt={image.alt}
          width={2048}
          height={2048}
        />
        <Image
          className="absolute z-0 h-full top-0 left-0 object-fill"
          src={'/assets/shade_outer.png'}
          alt={image.alt}
          fill
        />
        <CallToAction />
        <div className="absolute top-0 left-0 flex flex-col gap-8 z-10 w-full h-full items-center justify-center">
          <div
            className={`mx-10 text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] ${oswald.className} lg:mx-20 text-center  flex flex-col items-center justify-center gap-2`}
          >
            {props.subtitle && (
              <div
                className={`${crimson.className} italic text-xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]`}
              >
                {props.subtitle}
              </div>
            )}

            <h1 className="text-6xl text-center uppercase px-10 lg:px-40">{title}</h1>

            <div className="mt-5">
              {buttons && buttons.links && buttons.links.length > 0 && (
                <ButtonGroup buttons={buttons.links} />
              )}
            </div>
          </div>
        </div>
        {props.blockName && (
          <Link
            href={props.blockName ? `#${props.blockName}` : '#'}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="flex z-20 flex-col absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer">
              <FontAwesomeIcon
                className="text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] w-5 h-6 animate-pulse"
                icon={faAngleDown}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
