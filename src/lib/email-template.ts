interface ContactEmailProps {
  name: string
  email: string
  phone: string
  service: string
  message: string
  attachmentNames?: string[]
}

export function generateContactEmail({ name, email, phone, service, message, attachmentNames }: ContactEmailProps): string {
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
            <td style="background: linear-gradient(135deg, #eb4034, #c4342b); padding: 40px 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="width: 48px; height: 48px; background-color: rgba(255,255,255,0.2); border-radius: 12px; text-align: center; vertical-align: middle;">
                    <span style="color: white; font-weight: bold; font-size: 24px;">W</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <p style="margin: 0; color: white; font-weight: bold; font-size: 18px;">Wahlströms</p>
                    <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 12px;">Måleri & Bygg</p>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 24px 0 0; color: white; font-size: 22px; font-weight: 600;">
                Ny kontaktförfrågan
              </h1>
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
                          <span style="color: #27272a; font-size: 15px; font-weight: 500;">${phone || 'Ej angivet'}</span>
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
            <td style="background-color: #27272a; padding: 24px 40px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #a1a1aa; font-size: 13px;">
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
