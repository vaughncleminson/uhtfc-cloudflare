'use client'
import { orderAtom } from '@/frontend/atoms/orderAtom'
import { userAtom } from '@/frontend/atoms/userAtom'
import { Membership, membershipSchema } from '@/frontend/schemas/membershipSchema'
import { Order } from '@/frontend/schemas/orderScema'
import { Setting, User } from '@/payload-types'
import { useAtom } from 'jotai'
import { FormEvent, useState } from 'react'
import Col from '../layout/Col'
import Row from '../layout/Row'
import Button from '../ui/Button'

type Props = {
  settings: Setting
}

export default function MembershipForm(props: Props) {
  const [user, setUser] = useAtom<User | null>(userAtom)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useAtom<Order | null>(orderAtom)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries()) as unknown as Membership

    data.productType = 'newMembership'
    data.userId = user!.id
    data.totalAmount =
      props.settings.subsSettings[data.membershipType] + props.settings.subsSettings.joiningFee
    data.acceptTerms = data.acceptTerms ? true : false
    data.lineItems = [
      {
        displayName: `Membership type - ${data.membershipType}`,
        description: `Subscription fee`,
        quantity: 1,
        pricingDetails: { price: props.settings.subsSettings[data.membershipType] },
      },
      {
        displayName: `Joining fee`,
        description: `Joining fee for new members`,
        quantity: 1,
        pricingDetails: { price: props.settings.subsSettings.joiningFee },
      },
    ]
    const result = membershipSchema.safeParse(data)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      console.log(result.error.errors)
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })

      setErrors(fieldErrors)
    } else {
      setErrors({})
      console.log(data)
      if (!order) {
        setOrder({
          userId: user!.id || 0,
          firstName: user!.firstName || '',
          lastName: user!.lastName || '',
          email: user!.email || '',
          role: user!.role || 'non-member',
          paymentStatus: 'not-required',
          totalAmount: data.totalAmount,
          products: [data],
          lineItems: [...data.lineItems],
        })
      }
      // else {
      //   order.products.push(bookingObject)
      //   order.totalAmount += bookingObject.totalAmount
      //   order.lineItems.push({
      //     displayName: 'Permit fees',
      //     description: `${bookingObject.locationName} (${bookingObject.date})`,
      //     quantity: 1,
      //     pricingDetails: { price: bookingObject.totalAmount },
      //   })
      //   setOrder(order)
      // }
      // router.push('/checkout')
      // try {
      //   setLoading(true)
      //   const req = await fetch('/api/newMemberships', {
      //     method: 'POST',
      //     credentials: 'include',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(data),
      //   })
      //   const resp = await req.json()
      //   setLoading(false)
      // } catch (err) {
      //   setLoading(false)
      //   console.log(err)
      // }
    }
  }
  return (
    <form
      onSubmit={submit}
      className="flex flex-col bg-white p-10 pt-8 gap-2 border rounded shadow-lg"
      action=""
    >
      <div className="flex gap-2">
        <h1 className="text-2xl mb-2">MEMBERSHIP APPLICATION</h1>
      </div>
      <Row className="px-0 lg:px-0">
        <Col>
          <label className="label" htmlFor="membershipType">
            MEMBERSHIP TYPE
            {errors.membershipType && (
              <p className="text-red-500 text-sm">{errors.membershipType}</p>
            )}
          </label>
          <select name="membershipType" className={`select`}>
            <option value="select">SELECT MEMBERSHIP TYPE</option>
            <option value="OM">{`Ordinary Member (R${props.settings.subsSettings.OM} + R${props.settings.subsSettings.joiningFee} joining fee)`}</option>
            <option value="OMW">{`Ordinary Member & Wife (R${props.settings.subsSettings.OMW} + R${props.settings.subsSettings.joiningFee} joining fee)`}</option>
            <option value="F">{`Family Member (R${props.settings.subsSettings.F} + R${props.settings.subsSettings.joiningFee} joining fee)`}</option>
            <option value="J">{`Junior Member (R${props.settings.subsSettings.J} + R${props.settings.subsSettings.joiningFee} joining fee)`}</option>
            <option value="S">{`Senior Member (R${props.settings.subsSettings.S} + R${props.settings.subsSettings.joiningFee} joining fee)`}</option>
          </select>
          <label className="label" htmlFor="firstName">
            FIRST NAME
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </label>
          <input name="firstName" className={`input`} type="text" />
          <label className="label" htmlFor="lastName">
            LAST NAME
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </label>
          <input name="lastName" className={`input`} type="text" />
          <label className="label" htmlFor="idNumber">
            ID NUMBER
            {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber}</p>}
          </label>
          <input name="idNumber" className={`input`} type="text" />
          <label className="label" htmlFor="email">
            EMAIL
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </label>
          <input name="email" className={`input`} type="text" />
          <label className="label" htmlFor="mobileNumber">
            MOBILE NUMBER
            {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
          </label>
          <input name="mobileNumber" className={`input`} type="text" />
          <label className="label" htmlFor="street">
            STREET ADDRESS
            {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
          </label>
          <input name="street" className={`input`} type="text" />
        </Col>
        <Col>
          <label className="label" htmlFor="city">
            CITY
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </label>
          <input name="city" className={`input`} type="text" />
          <label className="label" htmlFor="province">
            PROVINCE
            {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
          </label>
          <input name="province" className={`input`} type="text" />
          <label className="label" htmlFor="postalCode">
            POSTAL CODE
            {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
          </label>
          <input name="postalCode" className={`input`} type="text" />
          <label className="label" htmlFor="country">
            COUNTRY
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
          </label>
          <input name="country" className={`input`} type="text" />
          <label className="label" htmlFor="otherMemberships">
            MEMBERSHIPS OF OTHER FISHING CLUBS
          </label>
          <input name="otherMemberships" className={`input`} type="text" />
          <label className="label" htmlFor="howDidYouHearAboutUs">
            HOW DID YOU HEAR ABOUT US?
          </label>
          <input name="howDidYouHearAboutUs" className={`input`} type="text" />
          <label className="label">
            {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}
          </label>
          <label>
            <input name="acceptTerms" type="checkbox" /> I accept the terms and conditions of this
            booking.
          </label>
          <Button type="submit" loading={loading} title="SUBMIT" />
        </Col>
      </Row>
    </form>
  )
}
