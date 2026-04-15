'use client'

import { useState, useRef, useEffect } from 'react'
import WithSkeleton from '@/components/WithSkeleton'
import { ContactSkeleton } from '@/components/PageSkeleton'
import { Phone, Mail, MapPin, Send, CheckCircle, Paperclip, X } from 'lucide-react'
import { validateEmail, validateMobile, validateLandline } from '@/lib/validation'
import { getContactInfo, telHref, mailHref, formatPhone, DEFAULT_CONTACT, type ContactInfo } from '@/lib/contact'

const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif', 'pdf', 'doc', 'docx']

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT)

  useEffect(() => {
    getContactInfo().then(setContact)
  }, [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (!formData.firstName.trim()) errs.firstName = 'Förnamn krävs'
    if (!formData.lastName.trim()) errs.lastName = 'Efternamn krävs'
    if (!formData.email.trim()) errs.email = 'E-post krävs'
    else if (!validateEmail(formData.email)) errs.email = 'Ogiltig e-postadress'
    if (!formData.phone.trim()) errs.phone = 'Telefonnummer krävs'
    else if (!validateMobile(formData.phone) && !validateLandline(formData.phone)) errs.phone = 'Ogiltigt telefonnummer'
    if (!formData.message.trim()) errs.message = 'Meddelande krävs'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('loading')

    try {
      const body = new FormData()
      body.append('firstName', formData.firstName)
      body.append('lastName', formData.lastName)
      body.append('email', formData.email)
      body.append('mobile', formData.phone)
      body.append('service', formData.service)
      body.append('message', formData.message)
      files.forEach((file) => body.append('files', file))

      const res = await fetch('/api/contact', {
        method: 'POST',
        body,
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ firstName: '', lastName: '', email: '', phone: '', service: '', message: '' })
        setFiles([])
        setErrors({})
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => { const next = { ...prev }; delete next[name]; return next })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('')
    const selected = Array.from(e.target.files || [])
    const invalid = selected.find((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || ''
      return !ALLOWED_EXTENSIONS.includes(ext)
    })
    if (invalid) {
      setFileError(`"${invalid.name}" stöds inte. Tillåtna format: ${ALLOWED_EXTENSIONS.map((e) => e.toUpperCase()).join(', ')}.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    const tooLarge = selected.find((f) => f.size > MAX_FILE_SIZE)
    if (tooLarge) { setFileError(`"${tooLarge.name}" är för stor (max 10MB).`); return }
    if (files.length + selected.length > MAX_FILES) { setFileError(`Max ${MAX_FILES} filer.`); return }
    setFiles((prev) => [...prev, ...selected])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => { setFiles((prev) => prev.filter((_, i) => i !== index)); setFileError('') }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-wmb-blue focus:border-transparent transition-all ${
      errors[field] ? 'border-red-400' : 'border-zinc-300 dark:border-zinc-700'
    }`

  return (
    <WithSkeleton skeleton={<ContactSkeleton />}>
      <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-wmb-blue font-semibold text-sm uppercase tracking-wider mb-3">Kontakta oss</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Vi hörs gärna från dig
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Har du ett projekt i åtanke? Fyll i formuläret nedan eller kontakta oss direkt
            så återkommer vi inom 24 timmar.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Kontaktuppgifter</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-wmb-blue/10 dark:bg-wmb-blue-dark/30 text-wmb-blue rounded-lg flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white text-sm">Telefon</p>
                      <a href={telHref(contact.phone)} className="text-zinc-600 dark:text-zinc-400 hover:text-wmb-red transition-colors">
                        {formatPhone(contact.phone)}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-wmb-blue/10 dark:bg-wmb-blue-dark/30 text-wmb-blue rounded-lg flex items-center justify-center shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white text-sm">E-post</p>
                      <a href={mailHref(contact.email)} className="text-zinc-600 dark:text-zinc-400 hover:text-wmb-red transition-colors">
                        {contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-wmb-blue/10 dark:bg-wmb-blue-dark/30 text-wmb-blue rounded-lg flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white text-sm">Adress</p>
                      <p className="text-zinc-600 dark:text-zinc-400">{contact.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-12 text-center">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Tack för ditt meddelande!</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">Vi återkommer till dig inom 24 timmar.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2 bg-wmb-red hover:bg-wmb-red/90 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Skicka nytt meddelande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">Förnamn *</label>
                      <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass('firstName')} placeholder="Förnamn" />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">Efternamn *</label>
                      <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass('lastName')} placeholder="Efternamn" />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">E-post *</label>
                    <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClass('email')} placeholder="din@epost.se" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">Telefon *</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClass('phone')} placeholder="07X-XXX XX XX" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">Tjänst</label>
                    <select id="service" name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-wmb-blue focus:border-transparent transition-all">
                      <option value="">Välj tjänst</option>
                      <option value="Invändig målning">Invändig målning</option>
                      <option value="Utvändig målning">Utvändig målning</option>
                      <option value="Spackling">Spackling</option>
                      <option value="Tapetsering">Tapetsering</option>
                      <option value="Fasadrenovering">Fasadrenovering</option>
                      <option value="Byggtjänster">Byggtjänster</option>
                      <option value="Lackering">Lackering</option>
                      <option value="Annat">Annat</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">Meddelande *</label>
                    <textarea id="message" name="message" rows={6} value={formData.message} onChange={handleChange} className={inputClass('message') + ' resize-none'} placeholder="Berätta om ditt projekt..." />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {/* File upload */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">Bifoga filer</label>
                    <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" id="kontakt-file-upload" />
                    <label htmlFor="kontakt-file-upload" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 text-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                      <Paperclip size={16} />
                      Välj filer
                    </label>
                    <span className="text-zinc-400 text-xs ml-3">Max {MAX_FILES} filer, 10MB/st</span>

                    {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}

                    {files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {files.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-200 dark:border-zinc-700">
                            <Paperclip size={14} className="shrink-0 text-zinc-400" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-zinc-400 shrink-0 text-xs">({formatSize(file.size)})</span>
                            <button type="button" onClick={() => removeFile(i)} className="ml-auto shrink-0 p-1 hover:text-red-500 transition-colors">
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                      Något gick fel. Försök igen eller kontakta oss direkt via telefon.
                    </div>
                  )}

                  <button type="submit" disabled={status === 'loading'} className="inline-flex items-center gap-2 px-8 py-4 bg-wmb-red hover:bg-wmb-red/90 disabled:bg-wmb-red/50 text-white font-semibold rounded-xl transition-all hover:scale-105 disabled:hover:scale-100">
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Skickar...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Skicka meddelande
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      </div>
    </WithSkeleton>
  )
}
