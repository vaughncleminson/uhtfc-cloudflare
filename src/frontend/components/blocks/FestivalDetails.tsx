import { FestivalBlock, Media } from '@/payload-types'
import config from '@payload-config'
import dayjs from 'dayjs'
import Image from 'next/image'
import { getPayload } from 'payload'
import FestivalEntriesForm from '../forms/festivalEntriesForm'
import Col from '../layout/Col'
import RichText from '../layout/RichText'
import Row from '../layout/Row'

export default async function FestivalDetails(props: FestivalBlock) {
  const payload = await getPayload({ config })
  const festivalDetails = await payload.findByID({
    collection: 'festivals',
    depth: 2,
    id: props.festival as number,
  })

  const sponsorImage = festivalDetails?.sponsorImage as Media
  return (
    <div id="details" className="relative w-screen">
      <Row>
        <Col>
          <div className="flex flex-col gap-5 justify-center items-center">
            <div className="relative w-full flex flex-col bg-slate-900 text-white text-sm p-5">
              <div className="flex flex-col gap-5">
                <div className="text-2xl text-teal-500 uppercase">
                  {festivalDetails.festivalName}
                </div>
                <RichText className="w-full text-slate-200" data={festivalDetails.blurb} />
              </div>
            </div>

            <div className="relative w-full flex flex-col bg-slate-900 text-white text-sm overflow-hidden">
              <div className="flex justify-between bg-teal-800 px-5 py-2 text-white uppercase">
                <div className="text-xl uppercase">Event Details</div>
              </div>
              <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                <div className="uppercase">Date</div>
                <div>
                  {`${dayjs(festivalDetails.startDate).format('D MMM')} - ${dayjs(festivalDetails.endDate).format('D MMM YYYY')}`}
                </div>
              </div>
              <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                <div className="uppercase">Number of teams</div>
                {festivalDetails.numberOfTeams}
              </div>
              <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                <div className="uppercase">Entries per team</div>
                {festivalDetails.entriesPerTeam}
              </div>
              <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                <div className="uppercase">Cost per team</div>
                {festivalDetails.price}
              </div>
              <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                <div className="uppercase">Cost for extra meals (Family members)</div>
                {festivalDetails.extraMeals}
              </div>
              <div className="flex justify-between px-5 py-2">
                <div className="uppercase">Giveaways</div>
                {festivalDetails.giveAwayType.join(', ')}
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <Image
                src={sponsorImage?.url || ''}
                alt={sponsorImage?.alt || ''}
                width={300}
                height={300}
                className=" h-auto"
              />
              <div className="text-white">{sponsorImage.description}</div>
            </div>
          </div>
        </Col>
        <Col>
          <FestivalEntriesForm festival={festivalDetails} />
        </Col>
      </Row>
    </div>
  )
}
