import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { readFile } from 'fs/promises'
import path from 'path'
import { supabase } from '@/lib/supabase'
import { generateContactEmail } from '@/lib/email-template'
import { validateEmail, validateMobile, validateLandline } from '@/lib/validation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let firstName: string, lastName: string, email: string, mobile: string, landline: string, service: string, message: string
    let attachmentNames: string[] = []
    const attachments: { filename: string; content: Buffer; contentId?: string }[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      firstName = (formData.get('firstName') as string || '').trim()
      lastName = (formData.get('lastName') as string || '').trim()
      email = (formData.get('email') as string || '').trim()
      mobile = (formData.get('mobile') as string || '').trim()
      landline = (formData.get('landline') as string || '').trim()
      service = (formData.get('service') as string || '').trim()
      message = (formData.get('message') as string || '').trim()

      const files = formData.getAll('files') as File[]
      for (const file of files) {
        if (file.size > 0) {
          attachmentNames.push(file.name)
          const buffer = Buffer.from(await file.arrayBuffer())
          attachments.push({ filename: file.name, content: buffer })
        }
      }
    } else {
      const body = await request.json()
      firstName = (body.firstName || '').trim()
      lastName = (body.lastName || '').trim()
      email = (body.email || '').trim()
      mobile = (body.mobile || '').trim()
      landline = (body.landline || '').trim()
      service = (body.service || '').trim()
      message = (body.message || '').trim()
    }

    // Validation
    const errors: string[] = []
    if (!firstName) errors.push('Förnamn krävs')
    if (!lastName) errors.push('Efternamn krävs')
    if (!email) errors.push('E-post krävs')
    else if (!validateEmail(email)) errors.push('Ogiltig e-postadress')
    if (!mobile && !landline) errors.push('Minst ett telefonnummer krävs')
    if (mobile && !validateMobile(mobile)) errors.push('Ogiltigt mobilnummer')
    if (landline && !validateLandline(landline)) errors.push('Ogiltigt telefonnummer')
    if (!message) errors.push('Meddelande krävs')

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('. ') + '.' }, { status: 400 })
    }

    const name = `${firstName} ${lastName}`
    const phone = [mobile, landline].filter(Boolean).join(' / ')

    // Save to Supabase (skip if placeholder)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{ name, email, phone, service, message, attachments: attachmentNames, read: false }])

      if (dbError) {
        console.error('Database error:', dbError)
      }
    }

    // Lägg till loggan som inline attachment (refereras med cid:wmb-logo i HTML)
    try {
      const logoPath = path.join(process.cwd(), 'public', 'wmb_logo_real.webp')
      const logoBuffer = await readFile(logoPath)
      attachments.push({ filename: 'wmb_logo_real.webp', content: logoBuffer, contentId: 'wmb-logo' })
    } catch (e) {
      console.error('Kunde inte läsa logga:', e)
    }

    // Send email via Resend
    const contactEmail = process.env.CONTACT_EMAIL || 'jackewahlstrm@gmail.com'
    const htmlContent = generateContactEmail({ name, email, phone, service, message, attachmentNames })

    const { error: emailError } = await resend.emails.send({
      from: 'Wahlströms Måleri <onboarding@resend.dev>',
      to: [contactEmail],
      subject: `Ny kontaktförfrågan från ${name}`,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    if (emailError) {
      console.error('Email error:', emailError)
      return NextResponse.json({ error: 'Kunde inte skicka mejlet.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Något gick fel. Försök igen.' }, { status: 500 })
  }
}
