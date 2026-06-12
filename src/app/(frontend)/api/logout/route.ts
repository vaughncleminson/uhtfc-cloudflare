import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' })

  // Clear legacy cookie value if it was set by old frontend login flow.
  response.cookies.set('payload-token', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  })

  return response
}
