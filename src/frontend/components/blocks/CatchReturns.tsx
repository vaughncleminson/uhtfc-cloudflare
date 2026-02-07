import { charm } from '@/app/(frontend)/fonts'
import { CatchReturnsBlock, Media } from '@/payload-types'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import CatchReturnsForm from '../forms/catchReturnsForm'
import Row from '../layout/Row'

export default function CatchReturns(props: CatchReturnsBlock) {
  const image = props.image as Media
  return (
    <div className="relative w-full z-0">
      <Image
        className="fixed z-0 w-screen h-screen top-0 left-0 object-cover object-center"
        src={image.url!}
        alt={image.alt}
        width={2048}
        height={2048}
      />

      <div className="flex flex-col gap-8 z-10 w-full mt-40 mb-10">
        <div className="z-50">
          <Row>
            <div className={`text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] ${charm.className}`}>
              <h1 className="text-6xl ml-5 -mb-9 lg:ml-20">{props.title}</h1>
            </div>
          </Row>
        </div>
        <div className=" z-30 w-full">
          <Row>
            <CatchReturnsForm />
          </Row>
        </div>
        <Link href={'#map'}>
          <div className="flex z-20 flex-col cursor-pointer w-full items-center">
            <FontAwesomeIcon
              className="text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] w-5 h-6 animate-pulse"
              icon={faAngleDown}
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
