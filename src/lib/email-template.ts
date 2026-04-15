import { formatPhone } from './contact'

interface ContactEmailProps {
  name: string
  email: string
  phone: string
  service: string
  message: string
  attachmentNames?: string[]
}

export function generateContactEmail({ name, email, phone, service, message, attachmentNames }: ContactEmailProps): string {
  const formattedPhone = phone ? formatPhone(phone) : ''
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background-color: #eb4034; padding: 32px 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <img src="cid:wmb-logo" alt="Wahlströms Måleri & Bygg" width="140" style="display: block; margin: 0 auto; max-width: 140px; height: auto; border-radius: 8px;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: white; padding: 40px;">

              <!-- Greeting -->
              <p style="margin: 0 0 24px; color: #27272a; font-size: 16px; line-height: 1.6;">
                Du har fått ett nytt meddelande via hemsidan. Här är detaljerna:
              </p>

              <!-- Info Cards -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #fafafa; border-radius: 12px; padding: 20px; border: 1px solid #e4e4e7;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Namn</span><br>
                          <span style="color: #27272a; font-size: 15px; font-weight: 500;">${name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">E-post</span><br>
                          <a href="mailto:${email}" style="color: #eb4034; font-size: 15px; font-weight: 500; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Telefon</span><br>
                          <span style="color: #27272a; font-size: 15px; font-weight: 500;">${formattedPhone || 'Ej angivet'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Tjänst</span><br>
                          <span style="color: #27272a; font-size: 15px; font-weight: 500;">${service || 'Ej vald'}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Meddelande</p>
                    <div style="background-color: #fafafa; border-radius: 12px; padding: 20px; border: 1px solid #e4e4e7;">
                      <p style="margin: 0; color: #27272a; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Attachments -->
              ${attachmentNames && attachmentNames.length > 0 ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Bifogade filer (${attachmentNames.length} st)</p>
                    <div style="background-color: #fafafa; border-radius: 12px; padding: 16px; border: 1px solid #e4e4e7;">
                      ${attachmentNames.map(n => `<p style="margin: 4px 0; color: #27272a; font-size: 14px;">📎 ${n}</p>`).join('')}
                      <p style="margin: 12px 0 0; color: #71717a; font-size: 12px; font-style: italic;">Filerna finns bifogade i detta mejl — öppna eller ladda ner dem från mejlets bilage-sektion.</p>
                    </div>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}" style="display: inline-block; padding: 14px 32px; background-color: #eb4034; color: white; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px;">
                      Svara kunden
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #072352; padding: 24px 40px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #a1a1d0; font-size: 13px;">
                Detta mejl skickades automatiskt från wahlstromsmaleri.se
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
