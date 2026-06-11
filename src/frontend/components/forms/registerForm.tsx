'use client'

import { registerSchema } from '@/frontend/schemas/authSchema'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Button from '../ui/Button'
import { useConfirm } from '../ui/ModalProvider'

type RegisterFormProps = {
  setAuthType?: (authType: string) => void
  submitTitle?: string
}

export default function RegisterForm(props: RegisterFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const uuid = searchParams.get('uuid')
  const email = searchParams.get('email')
  const confirm = useConfirm()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: email || '',
    mobileNumber: '',
    idNumber: '',
    physicalAddress: '',
    password: '',
    confirmPassword: '',
    vehicles: [
      {
        vehicleModel: '',
        vehicleRegistration: '',
        vehicleColour: '',
      },
    ],
    uuid: uuid || '',
  })

  const router = useRouter()

  const updateField = (field: string, value: string) => {
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

    const result = registerSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}

      result.error.errors.forEach((err) => {
        fieldErrors[err.path.join('.')] = err.message
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})

    try {
      setLoading(true)

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = (await response.json()) as any

      if (result.message === 'Registration Successful') {
        props.setAuthType('login')
        const confirmed = await confirm({
          title: 'Registration successful',
          message: 'Please login to continue.',
          confirmTitle: 'LOGIN',
          cancelTitle: 'CLOSE',
        })
        if (!confirmed) return
      }
      if (result.message === 'Onboarding Successful') {
        const confirmed = await confirm({
          title: 'Details updated successfully',
          message: 'Please login to continue.',
          confirmTitle: 'LOGIN',
          cancelTitle: 'CLOSE',
        })
        if (!confirmed) return
      } else {
        setErrors({ submit: result.message || 'Registration failed' })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col bg-slate-900 p-10 pt-8 gap-2">
      {props.submitTitle ? <h1 className="text-2xl mb-2 text-white">{props.submitTitle}</h1> : null}
      {!props.submitTitle && (
        <div className="flex gap-2">
          <h1
            onClick={() => props.setAuthType('login')}
            className="text-2xl mb-2 text-gray-300 underline cursor-pointer"
          >
            LOGIN
          </h1>
          <h1 className="text-2xl mb-2 text-white">/</h1>
          <h1 className="text-2xl mb-2 text-white">REGISTER</h1>
        </div>
      )}

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

      <label className="label">
        PASSWORD
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
      </label>
      <input
        className="input"
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
      />

      <label className="label">
        CONFIRM PASSWORD
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
      </label>
      <input
        className="input"
        placeholder="Confirm password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => updateField('confirmPassword', e.target.value)}
      />

      {errors.submit && <p className="text-red-500 text-xs">{errors.submit}</p>}

      <Button type="submit" loading={loading} title={props.submitTitle || 'REGISTER'} />
    </form>
  )
}
