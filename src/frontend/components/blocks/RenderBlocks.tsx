import { Fragment } from 'react'

import type { Location, Page } from '@/payload-types'

import Auth from './Auth'
import Booking from './Booking'
import CatchReturns from './CatchReturns'
import Hero from './Hero'
import LocationDetails from './LocationDetails'
import LocationHero from './LocationHero'
import Locations from './Locations'
import Map from './Map'
import MapDefault from './MapDefault'
import MyBookings from './MyBookings'
import Order from './Order'
import Paymments from './Payments'
import RodFeesMembership from './RodFeesMembership'

const blockComponents: any = {
  hero: Hero,
  locationHero: LocationHero,
  auth: Auth,
  map: Map,
  mapDefault: MapDefault,
  rodFeesMembership: RodFeesMembership,
  booking: Booking,
  locationDetails: LocationDetails,
  locations: Locations,
  order: Order,
  myBookings: MyBookings,
  catchReturns: CatchReturns,
  payments: Paymments,
}

type Props = {
  page?: Page | Location
  blocks: Page['layout'][0][] | Location['layout'][0][]
}

export default function RenderBlocks(props: Props) {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index}>
                  {blockType === 'locationHero' && (
                    <Block locationBlock={block} page={props.page} />
                  )}
                  {blockType !== 'locationHero' && <Block {...block} />}
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
