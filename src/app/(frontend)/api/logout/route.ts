import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' })

  response.cookies.set('payload-token', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  })

  return response
}
