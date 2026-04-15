export function validateEmail(email: string): boolean {
  const trimmed = email.trim()
  const atIndex = trimmed.indexOf('@')
  if (atIndex < 1) return false
  const domain = trimmed.slice(atIndex + 1)
  return domain.includes('.') && domain.lastIndexOf('.') < domain.length - 1
}

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '')
}

// Tillåtet: 7–15 siffror (täcker både svenska & internationella nummer)
export function validateMobile(phone: string): boolean {
  if (!phone.trim()) return true
  const digits = digitsOnly(phone)
  return digits.length >= 7 && digits.length <= 15
}

export function validateLandline(phone: string): boolean {
  if (!phone.trim()) return true
  const digits = digitsOnly(phone)
  return digits.length >= 7 && digits.length <= 15
}
