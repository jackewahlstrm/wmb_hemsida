import { generateContactEmail } from '@/lib/email-template'

export async function GET() {
  const html = generateContactEmail({
    name: 'Anna Andersson',
    email: 'anna@example.com',
    phone: '070-123 45 67',
    service: 'Invändig målning',
    message: 'Hej!\n\nJag skulle vilja ha en offert på ommålning av vår 3:a på Södermalm. Totalt ca 75 kvm. När kan ni komma på besök för att titta?\n\nVänliga hälsningar,\nAnna',
    attachmentNames: ['planritning.pdf', 'vardagsrum.jpg', 'kok.jpg'],
  })

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
