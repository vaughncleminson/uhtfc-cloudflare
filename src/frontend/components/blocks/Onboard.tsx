'use client'
import { AuthBlock, Media } from '@/payload-types'
import Image from 'next/image'
import OnboardingForm from '../forms/onboardingForm'
import Col from '../layout/Col'
import Row from '../layout/Row'
import { useAuth } from '../ui/AuthProvider'

export default function Onboard(props: AuthBlock) {
  const image = props.image as Media
  const { user } = useAuth()

  return (
    <>
      {!user && (
        <div id="onboard" className="relative w-screen bg-opacity-90">
          <Row>
            <Col>
              <OnboardingForm submitTitle="UPDATE DETAILS" />
            </Col>
            <Col>
              <div className="relative h-[380px]">
                <Image
                  src={image.url!}
                  alt={image.alt}
                  fill
                  className="shadow-lg h-[386px] object-cover object-center"
                />
                <Image
                  className="absolute z-0 h-full top-0 left-0 object-fill"
                  src={'/assets/shade_outer.png'}
                  alt="shade"
                  fill
                  sizes="100vw"
                />
              </div>
              {/* <p className="text-center mt-2 text-gray-700">{image.description}</p> */}
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}
