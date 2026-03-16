'use client'

import { useState, useRef } from 'react'
import { Send, CheckCircle, Paperclip, X } from 'lucide-react'
import { validateEmail, validateMobile, validateLandline } from '@/lib/validation'

const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB per fil

export default function HeroContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    landline: '',
    service: '',
    message: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [fileError, setFileError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (!formData.firstName.trim()) errs.firstName = 'Förnamn krävs'
    if (!formData.lastName.trim()) errs.lastName = 'Efternamn krävs'
    if (!formData.email.trim()) errs.email = 'E-post krävs'
    else if (!validateEmail(formData.email)) errs.email = 'Ogiltig e-postadress'
    if (!formData.mobile.trim() && !formData.landline.trim()) {
      errs.mobile = 'Minst ett telefonnummer krävs'
    } else {
      if (formData.mobile.trim() && !validateMobile(formData.mobile)) errs.mobile = 'Ogiltigt mobilnummer (07X-XXX XX XX)'
      if (formData.landline.trim() && !validateLandline(formData.landline)) errs.landline = 'Ogiltigt telefonnummer'
    }
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
      body.append('mobile', formData.mobile)
      body.append('landline', formData.landline)
      body.append('service', formData.service)
      body.append('message', formData.message)
      files.forEach((file) => body.append('files', file))

      const res = await fetch('/api/contact', {
        method: 'POST',
        body,
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ firstName: '', lastName: '', email: '', mobile: '', landline: '', service: '', message: '' })
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

    const tooLarge = selected.find((f) => f.size > MAX_FILE_SIZE)
    if (tooLarge) {
      setFileError(`"${tooLarge.name}" är för stor (max 10MB).`)
      return
    }

    const total = files.length + selected.length
    if (total > MAX_FILES) {
      setFileError(`Max ${MAX_FILES} filer.`)
      return
    }

    setFiles((prev) => [...prev, ...selected])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setFileError('')
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 bg-white/10 border rounded-lg text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-wmb-blue focus:border-transparent transition-all ${
      errors[field] ? 'border-red-400' : 'border-white/20'
    }`

  if (status === 'success') {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
        <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Tack!</h3>
        <p className="text-zinc-300 text-sm">Vi återkommer inom 24 timmar.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 px-5 py-2 bg-wmb-red hover:bg-wmb-red/90 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Skicka nytt meddelande
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 space-y-4">
      <h3 className="text-lg font-bold text-white mb-1">Begär offert</h3>
      <p className="text-zinc-400 text-sm mb-4">Fyll i formuläret så återkommer vi snabbt.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Förnamn *" className={inputClass('firstName')} />
          {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Efternamn *" className={inputClass('lastName')} />
          {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="E-post *" className={inputClass('email')} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobil (07X-XXX XX XX)" className={inputClass('mobile')} />
          {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
        </div>
        <div>
          <input type="tel" name="landline" value={formData.landline} onChange={handleChange} placeholder="Telefon (08-XXX XXX)" className={inputClass('landline')} />
          {errors.landline && <p className="text-red-400 text-xs mt-1">{errors.landline}</p>}
        </div>
      </div>

      <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-wmb-blue focus:border-transparent transition-all [&>option]:text-zinc-900">
        <option value="">Välj tjänst</option>
        <option value="Invändig målning">Invändig målning</option>
        <option value="Utvändig målning">Utvändig målning</option>
        <option value="Spackling">Spackling</option>
        <option value="Tapetsering">Tapetsering</option>
        <option value="Fasadrenovering">Fasadrenovering</option>
        <option value="Byggtjänster">Byggtjänster</option>
        <option value="Annat">Annat</option>
      </select>

      <div>
        <textarea name="message" rows={3} value={formData.message} onChange={handleChange} placeholder="Berätta om ditt projekt... *" className={inputClass('message') + ' resize-none'} />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>

      {/* File upload */}
      <div>
        <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} className="hidden" id="hero-file-upload" />
        <label htmlFor="hero-file-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-zinc-300 text-sm cursor-pointer hover:bg-white/20 transition-colors">
          <Paperclip size={16} />
          Bifoga filer
        </label>
        <span className="text-zinc-500 text-xs ml-3">Max {MAX_FILES} filer, 10MB/st</span>

        {fileError && <p className="text-red-400 text-xs mt-1">{fileError}</p>}

        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-zinc-300 bg-white/5 rounded-lg px-3 py-1.5">
                <Paperclip size={12} className="shrink-0 text-zinc-400" />
                <span className="truncate">{file.name}</span>
                <span className="text-zinc-500 shrink-0">({formatSize(file.size)})</span>
                <button type="button" onClick={() => removeFile(i)} className="ml-auto shrink-0 p-0.5 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">Något gick fel. Försök igen.</p>
      )}

      <button type="submit" disabled={status === 'loading'} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-wmb-red hover:bg-wmb-red/90 disabled:bg-wmb-red/50 text-white font-semibold rounded-lg transition-all text-sm">
        {status === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Skickar...
          </>
        ) : (
          <>
            <Send size={16} />
            Skicka förfrågan
          </>
        )}
      </button>
    </form>
  )
}
