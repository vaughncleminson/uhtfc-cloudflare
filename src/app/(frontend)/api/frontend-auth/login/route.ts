import configPromise from '@payload-config'
import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

type LoginPayload = {
  email?: string
  password?: string
}

export async function POST(request: Request) {
  const data = (await request.json()) as LoginPayload

  if (!data.email || !data.password) {
    return NextResponse.json({ message: 'Missing email or password' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const resetUser = await payload.find({
      collection: 'previousUsers',
      where: {
        email: {
          equals: data.email,
        },
        reset: {
          equals: false,
        },
      },
    })

    if (resetUser.totalDocs > 0) {
      const resetUUID = randomUUID()
      await payload.update({
        collection: 'previousUsers',
        id: resetUser.docs[0].id,
        data: {
          resetUuid: resetUUID,
        },
      })
      await sendPreviousUserResetEmail({ ...resetUser.docs[0], resetUuid: resetUUID })
      return NextResponse.json({ message: 'Reset email sent' }, { status: 200 })
    }

    const result = await payload.login({
      collection: 'users',
      data: {
        email: data.email,
        password: data.password,
      },
      req: request,
      overrideAccess: false,
      depth: 0,
      showHiddenFields: true,
    })

    const response = NextResponse.json({ message: 'Authentication Passed', user: result.user })

    response.cookies.set('payload-token', result.token!, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch {
    return NextResponse.json({ message: 'Username or password incorrect' }, { status: 401 })
  }

  async function sendPreviousUserResetEmail(previousUser: any) {
    const baseURL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
    const resetURL = `${baseURL}/onboard?uuid=${previousUser.resetUuid}&email=${previousUser.email}`
    const displayName = previousUser.fullName?.split(' ')?.[0] || previousUser.fullName || 'Member'
    await payload.sendEmail({
      to: previousUser.email,
      subject: 'Reset your UHTFC account',
      html: `<p>Hi ${displayName},</p>
          <p>Please click the link below to reset your UHTFC account:</p>
          <p><a href="${resetURL}">Reset your account</a></p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,</p>
          <p>The UHTFC Team</p>`,
    })
  }
}
