import { NextResponse } from 'next/server'

async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    return { success: false, error: 'Server configuration error' }
  }
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    })
    const data: { success: boolean; score?: number } = await response.json()
    return {
      success: data.success === true && (data.score ?? 0) >= 0.5,
      score: data.score,
    }
  } catch {
    return { success: false, error: 'Failed to verify reCAPTCHA' }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, company, email, phone, message, recaptcha } = body as {
      name: string; company?: string; email: string; phone?: string; message: string; recaptcha?: string
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (recaptcha) {
      const captchaVerification = await verifyRecaptcha(recaptcha)
      if (!captchaVerification.success) {
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 400 }
        )
      }
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const html = `
      <h2>Expostep Contact Form</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Company:</b> ${company || '-'}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || '-'}</p>
      <p><b>Message:</b><br/>${message}</p>
    `

    await resend.emails.send({
      from: 'info@expostep.com',
      to: 'info@expostep.com',
      bcc: ['eyyup.sav@gmail.com', 'eyup.sav@icloud.com', 'hbkarabey@gmail.com'],
      subject: 'Expostep Contact Form',
      html,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Mail Error:', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
