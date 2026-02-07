import { LocationDetailsBlock } from '@/payload-types'
import Col from '../layout/Col'
import RichText from '../layout/RichText'
import Row from '../layout/Row'

export default async function LocationDetails(props: LocationDetailsBlock) {
  return (
    <div id="details" className="relative py-6 w-screen bg-white lg:py-12">
      <Row>
        <Col>
          <RichText className="w-full" data={props.description!} />
        </Col>
        <Col>
          <div className="flex flex-col border border-slate-800 overflow-hidden">
            <div className="flex justify-between border-b bg-slate-800 px-3 py-2 text-white">
              <div>Location Details</div>
              <div></div>
            </div>
            <div className="flex justify-between border-b border-slate-300 px-3 py-2">
              <div>Access restrictions</div>
              <div>{props.membersOnly ? 'Members only' : 'Members & non-members'}</div>
            </div>
            <div className="flex justify-between border-b border-slate-300 px-3 py-2">
              <div>Rod limit</div>
              {props.rodLimit}
            </div>
            <div className="flex justify-between border-b border-slate-300 px-3 py-2">
              <div>Bag limit</div>
              {props.bagLimit}
            </div>
            <div className="flex justify-between border-b border-slate-300 px-3 py-2">
              <div>Has boats</div>
              {props.hasBoats ? ' Yes' : 'No'}
            </div>
            <div className="flex justify-between border-b border-slate-300 px-3 py-2">
              <div>Fishing methods</div>
              {props.fishingMethods}
            </div>
            <div className="flex justify-between border-b border-slate-300 px-3 py-2">
              <div>Requires gate key</div>
              {props.requiresKey ? ' Yes - Pickup at flyshop' : 'No'}
            </div>
            <div className="flex justify-between border-b border-slate-300 px-3 py-2">
              <div>Requires gate code</div>
              {props.requiresGateCode ? ' Yes - Details on booking' : 'No'}
            </div>
            <div className="flex justify-between px-3 py-2">
              <div>Has bass</div>
              {props.hasBass ? ' Yes' : 'No'}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
