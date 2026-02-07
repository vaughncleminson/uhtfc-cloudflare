import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { MFAProps } from '@/admin/types/mfa'
import speakeasy from 'speakeasy'

export async function POST(request: Request) {
  const data = await request.json()
  const payload = await getPayload({ config })
  const user = await payload.find({
    collection: 'admins',
    where: {
      email: {
        equals: data.email,
      },
    },
  })

  if (user && !user.docs.length) {
    return Response.json({ success: false })
  }

  if (user.docs[0].mfa?.mfaSettings) {
    const mfaSettings = user.docs[0].mfa.mfaSettings as MFAProps

    if (mfaSettings.enabled) {
      if (data.mfaCode && data.mfaCode.length > 0) {
        console.log('MFA Code: ', data.mfaCode)
        // Verify the provided token
        const verified = speakeasy.totp.verify({
          secret: mfaSettings.mfaSecret!,
          encoding: 'base32',
          token: data.mfaCode,
        })
        if (!verified) {
          return Response.json({ mfaError: true })
        }
      } else {
        return Response.json({ mfa: true })
      }
    }
  }
  try {
    const result = await payload.login({
      collection: 'admins', // required
      data: {
        // required
        email: data.email,
        password: data.password,
      },
      req: request, // pass a Request object to be provided to all hooks
      depth: 2,
      locale: 'en',
      // fallbackLocale: false,
      overrideAccess: false,
      showHiddenFields: true,
    })
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'payload-token',
      value: result?.token!,
      httpOnly: true,
      path: '/',
    })
  } catch (e) {
    return Response.json({ success: false })
  }

  return Response.json({ success: true })
}
