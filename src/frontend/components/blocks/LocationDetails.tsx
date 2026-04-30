import { LocationDetailsBlock } from '@/payload-types'
import Col from '../layout/Col'
import RichText from '../layout/RichText'
import Row from '../layout/Row'

export default async function LocationDetails(props: LocationDetailsBlock) {
  return (
    <div id="details" className="relative w-screen">
      <Row>
        <Col>
          <div className="relative flex flex-col bg-slate-900 text-white text-sm overflow-hidden h-[372px] p-5">
            <RichText className="w-full text-slate-200" data={props.description!} />
          </div>
        </Col>
        <Col>
          <div className="relative flex flex-col bg-slate-900 text-white text-sm overflow-hidden">
            <div className="flex justify-between bg-teal-800 px-5 py-2 text-white uppercase">
              <div className="text-xl">Location Details</div>
            </div>
            <div className="flex justify-between border-b border-slate-600 px-5 py-2">
              <div className="uppercase">Access restrictions</div>
              <div>{props.membersOnly ? 'Members only' : 'Members & non-members'}</div>
            </div>
            <div className="flex justify-between border-b border-slate-600 px-5 py-2">
              <div className="uppercase">Rod limit</div>
              {props.rodLimit}
            </div>
            <div className="flex justify-between border-b border-slate-600 px-5 py-2">
              <div className="uppercase">Bag limit</div>
              {props.bagLimit}
            </div>
            <div className="flex justify-between border-b border-slate-600 px-5 py-2">
              <div className="uppercase">Has boats</div>
              {props.hasBoats ? ' Yes' : 'No'}
            </div>
            <div className="flex justify-between border-b border-slate-600 px-5 py-2">
              <div className="uppercase">Fishing methods</div>
              {props.fishingMethods}
            </div>
            <div className="flex justify-between border-b border-slate-600 px-5 py-2">
              <div className="uppercase">Requires gate key</div>
              {props.requiresKey ? ' Yes - Pickup at flyshop' : 'No'}
            </div>
            <div className="flex justify-between border-b border-slate-600 px-5 py-2">
              <div className="uppercase">Requires gate code</div>
              {props.requiresGateCode ? ' Yes - Details on booking' : 'No'}
            </div>
            <div className="flex justify-between px-5 py-2">
              <div className="uppercase">Has bass</div>
              {props.hasBass ? ' Yes' : 'No'}
            </div>
            {/* <Image
              className="absolute z-0 h-full top-0 left-0 object-fill"
              src={'/assets/shade_outer.png'}
              alt="shade"
              fill
            /> */}
          </div>
        </Col>
      </Row>
    </div>
  )
}
