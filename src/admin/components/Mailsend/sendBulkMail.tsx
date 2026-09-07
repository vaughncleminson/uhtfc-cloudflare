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

      // const recipients = [new Recipient('chris.trevor.green@gmail.com', 'Chris')]
      // const personalization = [
      //   {
      //     email: 'chrisg@codified.co.za',
      //     data: {
      //       recipientName: 'Chris Codified',
      //       emailSubject: 'UHTFC AGM - 26th September 2025',
      //       messageTitle: 'Please Join Us for the 71st UHTFC AGM',
      //       messageBody: `
      //       <p>Minutes and agenda for the 71st annual general meeting of the Underberg-Himeville Trout Fishing Club to be held at the Underberg Bowls Club on Saturday the 26th September 2026 at 19H00.</p>
      //       <p>If you cannot attend, please find a link to the proxy letter below:</p>
      //       <a href="https://uhtfc.s3.af-south-1.amazonaws.com/Proxy+letter+-+2026.docx" target="_blank">UHTFC AGM Proxy Letter</a>
      //       `,
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
