import { supabase } from './supabase'

export interface ContactInfo {
  phone: string
  email: string
  address: string
}

export const DEFAULT_CONTACT: ContactInfo = {
  phone: '0707358181',
  email: 'Tomas.wmb@telia.com',
  address: 'Stockholm, Sverige',
}

export async function getContactInfo(): Promise<ContactInfo> {
  const { data } = await supabase
    .from('site_content')
    .select('*')
    .eq('section', 'contact')

  if (!data || data.length === 0) return DEFAULT_CONTACT

  const lookup = new Map<string, string>()
  data.forEach((row) => lookup.set(row.key, row.value))

  return {
    phone: lookup.get('phone') || DEFAULT_CONTACT.phone,
    email: lookup.get('email') || DEFAULT_CONTACT.email,
    address: lookup.get('address') || DEFAULT_CONTACT.address,
  }
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  // 10 siffror (svenskt mobilnummer): XXX-XXX XX XX
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
  }
  // 11 siffror med landskod 46: konvertera 467X... till 07X...
  if (digits.length === 11 && digits.startsWith('46')) {
    const local = '0' + digits.slice(2)
    return `${local.slice(0, 3)}-${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`
  }
  return phone
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s-]/g, '')}`
}

export function mailHref(email: string): string {
  return `mailto:${email}`
}
