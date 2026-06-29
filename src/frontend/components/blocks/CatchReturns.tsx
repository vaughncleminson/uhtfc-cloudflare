import { CatchReturnsBlock, Media } from '@/payload-types'
import Image from 'next/image'
import CatchReturnsForm from '../forms/catchReturnsForm'
import Col from '../layout/Col'
import Row from '../layout/Row'

export default function CatchReturns(props: CatchReturnsBlock) {
  const image = props.image as Media
  return (
    <div id="details" className="relative w-screen">
      <Row>
        <Col>
          <CatchReturnsForm />
        </Col>
        <Col>
          <div className="relative">
            <Image
              src={image.url!}
              alt={image.alt}
              width={1024}
              height={1024}
              className="h-[496px] object-cover object-center"
            />
            <Image
              className="absolute z-0 h-full top-0 left-0 object-fill"
              src={'/assets/shade_outer.png'}
              alt="shade"
              fill
            />
          </div>
          <p className="text-center mt-2 text-gray-700 text-sm">{image.description}</p>
        </Col>
      </Row>
    </div>
  )
}
