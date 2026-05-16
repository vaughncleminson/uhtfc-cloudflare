import { FRONTEND_AUTH_COOKIE_NAME } from '@/frontend/constants/auth'
import configPromise from '@payload-config'
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

    response.cookies.set(FRONTEND_AUTH_COOKIE_NAME, result.token!, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    // Ensure frontend login never leaves an admin cookie behind.
    response.cookies.set('payload-token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'lax',
    })

    return response
  } catch {
    return NextResponse.json({ message: 'Username or password incorrect' }, { status: 401 })
  }
}