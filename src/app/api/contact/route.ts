import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateContactEmail } from '@/lib/email-template'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Namn, e-post och meddelande krävs.' },
        { status: 400 }
      )
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ name, email, phone, service, message, read: false }])

    if (dbError) {
      console.error('Database error:', dbError)
    }

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL

    if (resendKey && resendKey !== 'your-resend-api-key') {
      const htmlContent = generateContactEmail({ name, email, phone, service, message })

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Wahlströms Måleri <noreply@wahlstromsmaleri.se>',
          to: [contactEmail || 'info@wahlstromsmaleri.se'],
          subject: `Ny kontaktförfrågan från ${name}`,
          html: htmlContent,
        }),
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
