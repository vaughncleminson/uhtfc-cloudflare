'use client'

import { LineItem } from '@/frontend/schemas/lineItemSchema'
import { Membership, membershipSchema } from '@/frontend/schemas/membershipSchema'
import { Setting, User } from '@/payload-types'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../ui/AuthProvider'
import Button from '../ui/Button'
import { useConfirm } from '../ui/ModalProvider'
import { useToast } from '../ui/ToastProvider'

type MembershipFormProps = {
  settings: Setting
  user?: Membership
}

export default function MembershipForm(props: MembershipFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const confirm = useConfirm()
  const user = useAuth().user as User
  const toast = useToast()

  const [formData, setFormData] = useState(
    user && user.role == 'member'
      ? {
          membershipType: 'select',
          firstName: '',
          lastName: '',
          email: '',
          mobileNumber: '',
          idNumber: '',
          physicalAddress: '',
          howDidYouHearAboutUs: '',
          otherMemberships: '',
          vehicles: [
            {
              vehicleModel: '',
              vehicleRegistration: '',
              vehicleColour: '',
            },
          ],
        }
      : {
          productType: 'newMembership',
          userId: user?.id || 0,
          orderId: undefined,
          membershipType: user?.membershipType || 'select',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || email || '',
          mobileNumber: user?.mobileNumber || '',
          idNumber: user?.idNumber || '',
          physicalAddress: user?.physicalAddress || '',
          howDidYouHearAboutUs: '',
          otherMemberships: '',
          vehicles: [
            {
              vehicleModel: user?.vehicles?.[0]?.vehicleModel || '',
              vehicleRegistration: user?.vehicles?.[0]?.vehicleRegistration || '',
              vehicleColour: user?.vehicles?.[0]?.vehicleColour || '',
            },
          ],
          acceptTerms: false,
        },
  )

  useEffect(() => {
    if (formData.membershipType !== 'select') {
      const lineItems: LineItem[] = [
        {
          displayName: `Membership Application`,
          description: `${formData.membershipType} Membership`,
          price:
            props.settings.subsSettings[
              formData.membershipType as keyof typeof props.settings.subsSettings
            ] || 0,
          quantity: 1,
        },
        {
          displayName: 'Joining Fee',
          description: 'Once off joining fee',
          price: props.settings.subsSettings.joiningFee || 0,
          quantity: 1,
        },
      ]
      const totalAmount = lineItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
      setFormData((prev) => ({
        ...prev,
        lineItems,
        totalAmount,
      }))
    }
  }, [formData.membershipType])

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateVehicle = (
    index: number,
    field: 'vehicleModel' | 'vehicleRegistration' | 'vehicleColour',
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((vehicle, i) =>
        i === index
          ? {
              ...vehicle,
              [field]: value,
            }
          : vehicle,
      ),
    }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    const result = membershipSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}

      result.error.errors.forEach((err) => {
        fieldErrors[err.path.join('.')] = err.message
      })

      setErrors(fieldErrors)
      toast.error('Please fill in all the required fields before submitting.')
      return
    }

    setErrors({})

    try {
      setLoading(true)

      const response = await fetch(`/api/newMemberships`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = (await response.json()) as any
      console.log('result', result)

      if (result.message === 'New Membership successfully created.') {
        setLoading(false)
        const confirmed = await confirm({
          title: 'Membership Application Successful',
          message:
            'Memberships are approved by the committee at the monthly meeting (first Wednesday of each month). You will be contacted once your application has been approved.',
          showCancelButton: false,
          confirmTitle: 'Continue',
          confirmUrl: '/',
        })
        if (!confirmed) return
      } else {
        const confirmed = await confirm({
          title: 'Membership Application Failed',
          message: 'Please try again later or contact the club secretary for assistance.',
          showCancelButton: false,
          confirmTitle: 'Continue',
        })
        if (!confirmed) return
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col bg-slate-900 p-10 pt-8 gap-2 relative">
      <h1 className="text-2xl mb-2 text-white">MEMBERSHIP APPLICATION</h1>

      <label className="label">
        MEMBERSHIP TYPE
        {errors.membershipType && <p className="text-red-500 text-xs">{errors.membershipType}</p>}
      </label>
      <select
        value={formData.membershipType}
        onChange={(e) => updateField('membershipType', e.target.value)}
        className="input"
      >
        <option value="select">Select</option>
        <option value="OM">
          Ordinary Member
          {` (R${props.settings.subsSettings.OM}+R${props.settings.subsSettings.joiningFee} joining fee)`}
        </option>
        <option value="OMW">
          Ordinary Member & Wife
          {` (R${props.settings.subsSettings.OMW}+R${props.settings.subsSettings.joiningFee} joining fee)`}
        </option>
        <option value="F">
          Family
          {` (R${props.settings.subsSettings.F}+R${props.settings.subsSettings.joiningFee} joining fee)`}
        </option>
        <option value="J">
          Junior
          {` (R${props.settings.subsSettings.J}+R${props.settings.subsSettings.joiningFee} joining fee)`}
        </option>
        <option value="S">
          Senior
          {` (R${props.settings.subsSettings.S}+R${props.settings.subsSettings.joiningFee} joining fee)`}
        </option>
      </select>

      <label className="label">
        FIRST NAME
        {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
      </label>
      <input
        className="input"
        placeholder="First name"
        type="text"
        value={formData.firstName}
        onChange={(e) => updateField('firstName', e.target.value)}
      />

      <label className="label">
        SURNAME
        {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
      </label>
      <input
        className="input"
        placeholder="Surname"
        type="text"
        value={formData.lastName}
        onChange={(e) => updateField('lastName', e.target.value)}
      />

      <label className="label">
        EMAIL
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
      </label>
      <input
        className="input"
        type="text"
        placeholder="Email address"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
      />

      <label className="label">
        MOBILE NUMBER
        {errors.mobileNumber && <p className="text-red-500 text-xs">{errors.mobileNumber}</p>}
      </label>
      <input
        className="input"
        placeholder="Mobile eg 0829640583"
        type="text"
        value={formData.mobileNumber}
        onChange={(e) => updateField('mobileNumber', e.target.value)}
      />

      <label className="label">
        ID NUMBER
        {errors.idNumber && <p className="text-red-500 text-xs">{errors.idNumber}</p>}
      </label>
      <input
        className="input"
        placeholder="ID Number"
        type="text"
        value={formData.idNumber}
        onChange={(e) => updateField('idNumber', e.target.value)}
      />

      <label className="label">
        PHYSICAL ADDRESS
        {errors.physicalAddress && <p className="text-red-500 text-xs">{errors.physicalAddress}</p>}
      </label>
      <input
        className="input"
        placeholder="Physical address"
        type="text"
        value={formData.physicalAddress}
        onChange={(e) => updateField('physicalAddress', e.target.value)}
      />

      <div>
        {formData.vehicles.map((vehicle, index) => (
          <div key={index} className="flex gap-2">
            <div>
              <label className="label">
                VEHICLE MODEL
                {errors[`vehicles.${index}.vehicleModel`] && (
                  <p className="text-red-500 text-xs">{errors[`vehicles.${index}.vehicleModel`]}</p>
                )}
              </label>

              <input
                className="input"
                placeholder="Model eg Toyota Hilux"
                type="text"
                value={vehicle.vehicleModel}
                onChange={(e) => updateVehicle(index, 'vehicleModel', e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                VEHICLE REGISTRATION
                {errors[`vehicles.${index}.vehicleRegistration`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`vehicles.${index}.vehicleRegistration`]}
                  </p>
                )}
              </label>

              <input
                className="input"
                type="text"
                placeholder="Reg eg BB32VBZN"
                value={vehicle.vehicleRegistration}
                onChange={(e) => updateVehicle(index, 'vehicleRegistration', e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                VEHICLE COLOUR
                {errors[`vehicles.${index}.vehicleColour`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`vehicles.${index}.vehicleColour`]}
                  </p>
                )}
              </label>

              <input
                className="input"
                placeholder="Colour"
                type="text"
                value={vehicle.vehicleColour}
                onChange={(e) => updateVehicle(index, 'vehicleColour', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <label className="label">HOW DID YOU HEAR ABOUT US</label>
      <input
        className="input"
        placeholder="How did you hear about us?"
        type="text"
        value={formData.howDidYouHearAboutUs}
        onChange={(e) => updateField('howDidYouHearAboutUs', e.target.value)}
      />
      <label className="label">MEMBERSHIPS OF OTHER CLUBS</label>
      <input
        className="input"
        placeholder="Memberships of other clubs"
        type="text"
        value={formData.otherMemberships}
        onChange={(e) => updateField('otherMemberships', e.target.value)}
      />
      {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}
      <label className="text-white flex items-center gap-2">
        <input
          onChange={(e) => updateField('acceptTerms', e.target.checked)}
          checked={formData.acceptTerms}
          type="checkbox"
        />{' '}
        I accept the terms and conditions of being a member.
      </label>

      <Button type="submit" loading={loading} title={'SUBMIT'} />
      {!user && (
        <Link href="/#login" className="text-white mt-2 underline">
          <div className="bg-slate-950 bg-opacity-70 absolute left-0 top-0 w-full h-full text-white flex items-center justify-center">
            PLEASE REGISTER OR LOGIN TO APPLY FOR MEMBERSHIP
          </div>
        </Link>
      )}
      {user && (user.role == 'member' || user.role == 'admin') && (
        <div className="bg-slate-950 bg-opacity-70 absolute left-0 top-0 w-full h-full text-white flex items-center justify-center">
          YOU ARE ALREADY A MEMBER
        </div>
      )}
    </form>
  )
}
