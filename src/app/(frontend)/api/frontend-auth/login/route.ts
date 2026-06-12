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
}
