'use client'

// import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import { useState } from 'react'
// const mailerSend = new MailerSend({
//   apiKey: process.env.MAILSEND_TOKEN || '',
// })

export function SendBulkMail(props: any) {
  const [loading, setLoading] = useState(false)

  const sendBulkMail = async (): Promise<boolean> => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/send-bulk-mail`, {
        method: 'POST',
        body: JSON.stringify({}),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await req.json()
      console.log(data)
      // const sentFrom = new Sender('uhtfc.office@gmail.com', 'UHTFC')

      // const recipients = [
      //   new Recipient('chrisg@codified.co.za', 'Chris1'),
      //   new Recipient('chris.trevor.green@gmail.com', 'Chris2'),
      // ]
      // const personalization = [
      //   {
      //     email: 'chrisg@codified.co.za',
      //     data: {
      //       name: 'ChrisCodified',
      //     },
      //   },
      //   {
      //     email: 'chris.trevor.green@gmail.com',
      //     data: {
      //       name: 'ChrisGmail',
      //     },
      //   },
      // ]
      // const emailParams = new EmailParams()
      //   .setFrom(sentFrom)
      //   .setTo(recipients)
      //   .setReplyTo(sentFrom)
      //   .setSubject('Rivers in May Festival')
      //   .setPersonalization(personalization)
      //   .setTemplateId('3vz9dle2xrnlkj50')

      // const mailSent = await mailerSend.email.send(emailParams)
      // console.log(mailSent)
    } catch (err) {
      console.log(err)
    }
    return false
  }

  return (
    <div>
      <button onClick={sendBulkMail}>Send Mail</button>
      {loading && <p>Sending...</p>}
    </div>
  )
}

export default SendBulkMail
