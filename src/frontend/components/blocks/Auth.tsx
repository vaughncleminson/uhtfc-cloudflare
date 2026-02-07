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
        <div id="login" className="relative py-6 w-screen bg-amber-50 bg-opacity-90 lg:py-12">
          <Row>
            <Col>
              <AuthForm />
            </Col>
            <Col>
              <div>
                <Image
                  src={image.url!}
                  alt={image.alt}
                  width={1024}
                  height={1024}
                  className="rounded shadow-lg h-[386px] object-cover object-center"
                />
              </div>
              <p className="text-center mt-2 text-gray-700">{image.description}</p>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}
