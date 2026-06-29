'use client'
import { Media, RodFeesMembershipBlock, Setting } from '@/payload-types'
import { useEffect, useState } from 'react'
import MembershipForm from '../forms/membershipForm'
import Col from '../layout/Col'
import Row from '../layout/Row'
import { useAuth } from '../ui/AuthProvider'

export default function RodFeesMembership(props: RodFeesMembershipBlock) {
  const image = props.image as Media
  const { user } = useAuth()
  const [settings, setSettings] = useState<Setting | null>(null)
  useEffect(() => {
    const fetchSettings = async () => {
      const data: Setting | null = await getSettings()
      console.log(data)
      if (data) {
        setSettings(data)
      }
    }
    fetchSettings()
  }, [])

  const getSettings = async (): Promise<Setting | null> => {
    try {
      const req = await fetch(`/api/globals/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!req.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data: Setting = await req.json()
      return data
    } catch (error) {
      console.error('Error fetching settings:', error)
      return null
    }
  }
  return (
    <>
      <div id="membership" className="relative w-screen bg-opacity-90">
        <Row>
          <Col>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <h2 className="text-left">Rod Fees and Membership</h2>
                <p className="text-white">
                  Here you can find information about the rod fees and membership options available.
                </p>
                <p className="text-white">
                  All bookings and payments are handled through the online booking system. Please
                  ensure you have an account to proceed with any bookings or membership
                  applications.
                </p>
                <p className="text-white">
                  The club welcomes new members and we encourage you to join our community. Please
                  review the membership fees and options below and fill in the membership form. If
                  you have any questions, feel free to contact us.
                </p>
              </div>

              {settings && (
                <div className="flex flex-col gap-5">
                  <div className="relative flex flex-col bg-slate-900 text-white text-sm overflow-hidden">
                    <div className="flex justify-between bg-teal-800 px-5 py-2 text-white uppercase">
                      <div className="text-xl">ROD FEES</div>
                    </div>
                    <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                      <div className="uppercase">Non-member day permit</div>
                      <div>R{settings.fishingFees.nonMember}.00</div>
                    </div>
                    <div className="flex justify-between border-slate-600 px-5 py-2">
                      <div className="uppercase">Member Guest day permit</div>
                      <div>R{settings.fishingFees.memberGuest}.00</div>
                    </div>
                  </div>
                  <div className="relative flex flex-col bg-slate-900 text-white text-sm overflow-hidden">
                    <div className="flex justify-between bg-teal-800 px-5 py-2 text-white uppercase">
                      <div className="text-xl">Membership FEES</div>
                    </div>
                    <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                      <div className="uppercase">Once off joining fee</div>
                      <div>R{settings.subsSettings.joiningFee}.00</div>
                    </div>
                    <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                      <div className="uppercase">Ordinary Member</div>
                      <div>R{settings.subsSettings.OM}.00</div>
                    </div>
                    <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                      <div className="uppercase">Ordinary Member & Wife</div>
                      <div>R{settings.subsSettings.OMW}.00</div>
                    </div>
                    <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                      <div className="uppercase">Family Member </div>
                      <div>R{settings.subsSettings.F}.00</div>
                    </div>
                    <div className="flex justify-between border-b border-slate-600 px-5 py-2">
                      <div className="uppercase">Junior Member </div>
                      <div>R{settings.subsSettings.J}.00</div>
                    </div>
                    <div className="flex justify-between border-slate-600 px-5 py-2">
                      <div className="uppercase">Senior Member </div>
                      <div>R{settings.subsSettings.S}.00</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col>{settings && <MembershipForm settings={settings} />}</Col>
        </Row>
      </div>
    </>
  )
}
