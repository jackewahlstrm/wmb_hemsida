export function validateEmail(email: string): boolean {
  const trimmed = email.trim()
  const atIndex = trimmed.indexOf('@')
  if (atIndex < 1) return false
  const domain = trimmed.slice(atIndex + 1)
  return domain.includes('.') && domain.lastIndexOf('.') < domain.length - 1
}

// Strip everything except digits
function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '')
}

// Swedish mobile: starts with 07, 10 digits
export function validateMobile(phone: string): boolean {
  if (!phone.trim()) return true // optional, emptiness checked elsewhere
  const digits = digitsOnly(phone)
  return /^07\d{8}$/.test(digits)
}

// Swedish landline: starts with 0 (not 07), 7-11 digits
// Covers all area codes: 08, 010-019 (except 07), 020-036, 040-044, 046, 0155, etc.
export function validateLandline(phone: string): boolean {
  if (!phone.trim()) return true
  const digits = digitsOnly(phone)
  return /^0[1-69]\d{6,9}$/.test(digits)
}
