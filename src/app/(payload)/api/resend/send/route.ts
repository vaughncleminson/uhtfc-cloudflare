import config from '@payload-config'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import { getPayload } from 'payload'

type SendPayload = {
  body?: string
  from?: string
  subject?: string
  to?: string
}

const isValidEmail = (value: string) => /.+@.+\..+/.test(value)

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const cookieStore = await cookies()
  const tokenCookieName = `${payload.config.cookiePrefix}-token`
  const payloadToken =
    cookieStore.get(tokenCookieName)?.value || cookieStore.get('payload-token')?.value
  const authHeaders = new Headers(request.headers)

  if (payloadToken) {
    authHeaders.set('authorization', `Bearer ${payloadToken}`)
    authHeaders.set('cookie', `${tokenCookieName}=${payloadToken}; payload-token=${payloadToken}`)
  }

  const { user } = await payload.auth({ headers: authHeaders })

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    return Response.json({ message: 'RESEND_API_KEY is not configured.' }, { status: 500 })
  }

  const data = (await request.json()) as SendPayload

  const from = data.from?.trim() || ''
  const to = data.to?.trim() || ''
  const subject = data.subject?.trim() || ''
  const body = data.body?.trim() || ''

  if (!from || !to || !subject || !body) {
    return Response.json({ message: 'All fields are required.' }, { status: 400 })
  }

  if (!isValidEmail(from) || !isValidEmail(to)) {
    return Response.json({ message: 'Please enter valid email addresses.' }, { status: 400 })
  }

  const emailMode = process.env.EMAIL_MODE || 'test'
  const emailTestAddress = process.env.EMAIL_TEST_ADDRESS?.trim() || ''
  const targetRecipient = emailMode === 'production' ? to : emailTestAddress || to

  const resend = new Resend(resendApiKey)

  await resend.emails.send({
    from,
    to: targetRecipient,
    subject: emailMode === 'production' ? subject : `[TEST-REDIRECT to ${to}] ${subject}`,
    text: emailMode === 'production' ? body : `Original target recipient: ${to}\n\n${body}`,
    html:
      emailMode === 'production'
        ? `<div style="white-space: pre-wrap;">${escapeHtml(body)}</div>`
        : `<p><strong>Original target recipient:</strong> ${escapeHtml(to)}</p><hr/><div style="white-space: pre-wrap;">${escapeHtml(body)}</div>`,
  })

  return Response.json({
    message: 'Email sent.',
    sentTo: targetRecipient,
    status: 'sent',
  })
}
