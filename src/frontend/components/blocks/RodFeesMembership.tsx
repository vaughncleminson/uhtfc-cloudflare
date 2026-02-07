import { RodFeesMembershipBlock, Setting } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import MembershipForm from '../forms/membershipForm'
import Col from '../layout/Col'
import Row from '../layout/Row'

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

export default async function RodFeesMembership(props: RodFeesMembershipBlock) {
  const settings = await getSettings()
  return (
    <div className="relative py-6 w-screen bg-amber-50 bg-opacity-90 lg:py-12">
      <Row>
        <Col>
          <MembershipForm settings={settings!} />
        </Col>
      </Row>
    </div>
  )
}
