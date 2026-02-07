import { BookingBlock, BookingHistory, Location, Media, Setting } from '@/payload-types'
import config from '@payload-config'
import Image from 'next/image'
import { getPayload } from 'payload'
import BookingForm from '../forms/bookingForm'
import Col from '../layout/Col'
import Row from '../layout/Row'

async function getLocations(): Promise<Location[] | undefined> {
  const payload = await getPayload({ config })
  try {
    const locations = await payload.find({
      collection: 'locations',
      limit: 0,
      where: {
        enabled: {
          equals: true,
        },
      },
    })
    return locations.docs
  } catch (e) {
    console.log(e)
  }
}
async function getBookingSettings(): Promise<BookingHistory[] | undefined> {
  const payload = await getPayload({ config })
  try {
    const bookingSettings = await payload.find({
      collection: 'bookingHistory',
      limit: 0,
    })
    return bookingSettings.docs
  } catch (e) {
    console.log(e)
  }
}
async function getSettings(): Promise<Setting | undefined> {
  const payload = await getPayload({ config })
  try {
    const settings = await payload.findGlobal({
      slug: 'settings',
    })
    return settings
  } catch (e) {
    console.log(e)
  }
}

export default async function Booking(props: BookingBlock) {
  const image = props.image as Media
  const locations = await getLocations()
  const bookingSettings = await getBookingSettings()
  const settings = await getSettings()
  return (
    <div id="details" className="relative py-6 w-screen bg-amber-50 bg-opacity-90 lg:py-12">
      <Row>
        <Col>
          <BookingForm
            bookingSettings={bookingSettings!}
            locations={locations!}
            settings={settings!}
          />
        </Col>
        <Col>
          <div>
            <Image
              src={image.url!}
              alt={image.alt}
              width={1024}
              height={1024}
              className="rounded shadow-lg h-[496px] object-cover object-center"
            />
          </div>
          <p className="text-center mt-2 text-gray-700 text-sm">{image.description}</p>
        </Col>
      </Row>
    </div>
  )
}
