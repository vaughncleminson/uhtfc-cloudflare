import { NextResponse } from 'next/server'
import { FRONTEND_AUTH_COOKIE_NAME } from '@/frontend/constants/auth'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' })

  response.cookies.set(FRONTEND_AUTH_COOKIE_NAME, '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  })

  // Clear legacy cookie value if it was set by old frontend login flow.
  response.cookies.set('payload-token', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  })

  return response
}
