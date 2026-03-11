import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateContactEmail } from '@/lib/email-template'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let name: string, email: string, phone: string, service: string, message: string
    let attachmentNames: string[] = []
    let attachments: { filename: string; content: string }[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      name = formData.get('name') as string || ''
      email = formData.get('email') as string || ''
      phone = formData.get('phone') as string || ''
      service = formData.get('service') as string || ''
      message = formData.get('message') as string || ''

      const files = formData.getAll('files') as File[]
      for (const file of files) {
        if (file.size > 0) {
          attachmentNames.push(file.name)
          const buffer = Buffer.from(await file.arrayBuffer())
          attachments.push({
            filename: file.name,
            content: buffer.toString('base64'),
          })
        }
      }
    } else {
      const body = await request.json()
      name = body.name
      email = body.email
      phone = body.phone
      service = body.service
      message = body.message
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Namn, e-post och meddelande krävs.' },
        { status: 400 }
      )
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ name, email, phone, service, message, attachments: attachmentNames, read: false }])

    if (dbError) {
      console.error('Database error:', dbError)
    }

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL

    if (resendKey && resendKey !== 'your-resend-api-key') {
      const htmlContent = generateContactEmail({ name, email, phone, service, message, attachmentNames })

      const emailPayload: Record<string, unknown> = {
        from: 'Wahlströms Måleri <noreply@wahlstromsmaleri.se>',
        to: [contactEmail || 'info@wahlstromsmaleri.se'],
        subject: `Ny kontaktförfrågan från ${name}`,
        html: htmlContent,
      }

      if (attachments.length > 0) {
        emailPayload.attachments = attachments
      }

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Något gick fel. Försök igen.' },
      { status: 500 }
    )
  }
}
