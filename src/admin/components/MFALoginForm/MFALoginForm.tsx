'use client'

import { Button, TextInput, toast } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import './index.scss'
import Image from 'next/image'
import Link from 'next/link'

export default function MFALoginForm(props: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [requiresMFA, setRequiresMFA] = useState(false)

  const [emailErr, setEmailErr] = useState(false)
  const [passwordErr, setPasswordErr] = useState(false)
  const [mfaCodeErr, setMfaCodeErr] = useState(false)

  async function submit() {
    if (!validateFields()) {
      return
    }
    const resp = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/mfa-auth`, {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password, mfaCode: mfaCode }),
    })

    const response = await resp.json()

    if (response.success) {
      toast.success('Logged in successfully')
      redirect('/admin')
    } else if (response.mfa) {
      setRequiresMFA(true)
    } else if (response.mfaError) {
      toast.error('Bad MFA code')
    } else {
      setMfaCode('')
      setRequiresMFA(false)
      toast.error('Authentication failed, bad email or password')
    }
  }

  function validateFields() {
    let valid = true
    if (email === '') {
      valid = false
      setEmailErr(true)
      toast.error('Email is required')
    } else {
      setEmailErr(false)
    }
    if (password === '') {
      valid = false
      setPasswordErr(true)
      toast.error('Password is required')
    } else {
      setPasswordErr(false)
    }
    if (requiresMFA && mfaCode === '') {
      valid = false
      setMfaCodeErr(true)
      toast.error('MFA code is required')
    } else {
      setMfaCodeErr(false)
    }
    if (valid) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <div className="login-holder">
        <div className="logo">
          <Image src="/api/media/file/payload_logo.png" alt="Payload" width={200} height={200} />
        </div>
        {!requiresMFA && (
          <>
            <TextInput
              showError={emailErr}
              label={'Email'}
              required={true}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
              }}
              path={props.path}
              readOnly={false}
            />

            <TextInput
              showError={passwordErr}
              label={'Password'}
              required={true}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
              }}
              path={props.path}
              readOnly={false}
            />
            <Link href="/admin/forgot">Forgot password?</Link>
          </>
        )}
        {requiresMFA && (
          <TextInput
            showError={mfaCodeErr}
            label={'MFA Code'}
            required={true}
            value={mfaCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setMfaCode(e.target.value)
            }}
            path={props.path}
            readOnly={false}
          />
        )}

        <Button onClick={submit} className="submit">
          Login
        </Button>
      </div>
    </>
  )
}
