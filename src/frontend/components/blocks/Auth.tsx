import { AuthBlock, Media } from '@/payload-types'
import { cookies } from 'next/headers'
import Image from 'next/image'
import AuthForm from '../forms/authForm'
import Col from '../layout/Col'
import Row from '../layout/Row'

export default async function Auth(props: AuthBlock) {
  const image = props.image as Media
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  const isAuthenticated = Boolean(token)
  return (
    <>
      {!isAuthenticated && (
        <div id="login" className="relative w-screen bg-opacity-90">
          <Row>
            <Col>
              <AuthForm />
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
