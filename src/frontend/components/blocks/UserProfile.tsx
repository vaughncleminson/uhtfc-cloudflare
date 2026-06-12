'use client'
import { Media, User, UserProfileBlock } from '@/payload-types'
import Image from 'next/image'
import RegisterForm from '../forms/registerForm'
import Col from '../layout/Col'
import Row from '../layout/Row'
import { useAuth } from '../ui/AuthProvider'

export default function UserProfile(props: UserProfileBlock) {
  const image = props.image as Media
  const { user } = useAuth()

  return (
    <>
      <div id="onboard" className="relative w-screen bg-opacity-90">
        <Row>
          <Col>
            <RegisterForm user={user as User} submitTitle="UPDATE PROFILE" />
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
    </>
  )
}
