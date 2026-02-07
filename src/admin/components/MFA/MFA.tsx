'use client'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import speakeasy from 'speakeasy'
import { useQRCode } from 'next-qrcode'
import './index.scss'
import {
  Button,
  CheckboxInput,
  FieldLabel,
  JSONField,
  Select,
  TextInput,
  useField,
} from '@payloadcms/ui'
import { JSONFieldClientProps } from 'payload'

type MFAProps = {
  enabled: boolean
  mfaSecret?: string
  mfaURL?: string
}
type MFAObject = {
  ascii?: string
  hex?: string
  base32?: string
  otpauth_url?: string
}

export function MFA(props: JSONFieldClientProps) {
  const { value, setValue } = useField<MFAProps>({ path: props.path || props.field.name })
  const { Canvas } = useQRCode()
  const [hideValues, setHideValues] = useState(false)

  useEffect(() => {
    if (value.enabled && value.mfaSecret && value.mfaURL) {
      console.log('MFA Enabled')
      setHideValues(true)
    } else {
      setHideValues(false)
    }
  }, [])

  function createMFACode() {
    if (!value.enabled) {
      const secret = speakeasy.generateSecret({
        name: 'PayloadCMS(Email here)', // App name for authenticator app
        length: 20,
      })
      console.log(secret)
      return secret
    } else {
      return {}
    }
  }
  return (
    <div className="mfa-holder">
      <CheckboxInput
        label={
          value?.enabled
            ? 'Disable MFA (Warning, you will need to create a new MFA entry if you diasbel and re-enable)'
            : 'Enable MFA'
        }
        checked={value?.enabled}
        onToggle={(e) => {
          const mfaObject: MFAObject = createMFACode()
          setValue({
            ...value,
            enabled: e.target.checked,
            mfaURL: mfaObject.otpauth_url,
            mfaSecret: mfaObject.base32,
          })
          setHideValues(false)
        }}
        readOnly={false}
      />
      {value.enabled && !hideValues && (
        <div>
          <Canvas
            text={value.mfaURL || 'a'}
            options={{
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: 200,
              color: {
                dark: '#000000',
                light: '#FFFFFF',
              },
            }}
          />
          <TextInput
            label={'MFA URL'}
            value={value?.mfaURL}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setValue({
                ...value,
                mfaURL: e.target.value,
              })
            }}
            path={props.path || props.field.name}
            readOnly={true}
          />
          <TextInput
            label={'MFA Secret'}
            value={value?.mfaSecret}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setValue({
                ...value,
                mfaSecret: e.target.value,
              })
            }}
            path={props.path || props.field.name}
            readOnly={true}
          />
        </div>
      )}
    </div>
  )
}
