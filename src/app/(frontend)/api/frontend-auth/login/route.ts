import mailerSendTemplateAdapter from '@/admin/utils/mailerSendTemplateAdapter'
import configPromise from '@payload-config'
import { randomUUID } from 'crypto'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

const mailsendTemplateID = process.env.MAILSEND_SHARED_WEBSITE_TEMPLATE_ID || 'z86org8onyn4ew13'

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
    const cMessageTitle = `Reset your UHTFC account`
    const cMessageBody = `<p>We received a request to reset your UHTFC account.</p>
          <p>Please click the button below to reset your account:</p>
          <br/>
          <p><a href="${resetURL}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Account</a></p>
          <br/>
          <p>If the button above does not work, please copy and paste the following link into your web browser:</p>
          <p>${resetURL}</p>
          <p>If you did not request this reset, please ignore this email.</p>
          <br/>
          <p>Best regards,<br/>The Underberg-Himeville Trout Fishing Club</p>`

    const payload = await getPayload({ config })
    await mailerSendTemplateAdapter(
      mailsendTemplateID,
      cMessageTitle,
      [{ email: previousUser.email, name: displayName }],
      [
        {
          email: previousUser.email,
          data: {
            recipientName: displayName,
            emailSubject: cMessageTitle,
            messageTitle: cMessageTitle,
            messageBody: cMessageBody,
          },
        },
      ],
      payload.logger,
    )
  }
}
