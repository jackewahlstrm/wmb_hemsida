'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  LogOut,
  LayoutDashboard,
  FolderOpen,
  Users,
  Settings,
  Plus,
  Trash2,
  X,
  Save,
  Image as ImageIcon,
  Upload,
  Pencil,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadImage } from '@/lib/cloudinary'
import type { Project, Client as ClientType, SiteContent } from '@/lib/types'

type Tab = 'overview' | 'projects' | 'clients' | 'settings'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<ClientType[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent[]>([])
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin')
      return
    }
    await loadData()
    setLoading(false)
  }

  const loadData = async () => {
    const [projectsRes, clientsRes, contentRes] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('site_content').select('*'),
    ])
    if (projectsRes.data) setProjects(projectsRes.data)
    if (clientsRes.data) setClients(clientsRes.data)
    if (contentRes.data) setSiteContent(contentRes.data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-wmb-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Översikt', icon: LayoutDashboard },
    { id: 'projects' as Tab, label: 'Projekt', icon: FolderOpen },
    { id: 'clients' as Tab, label: 'Kunder', icon: Users },
    { id: 'settings' as Tab, label: 'Inställningar', icon: Settings },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Hantera din webbsida</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Logga ut
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-wmb-red text-white'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab projects={projects} clients={clients} />
      )}
      {activeTab === 'projects' && (
        <ProjectsTab projects={projects} setProjects={setProjects} onReload={loadData} />
      )}
      {activeTab === 'clients' && (
        <ClientsTab clients={clients} setClients={setClients} onReload={loadData} />
      )}
      {activeTab === 'settings' && (
        <SettingsTab siteContent={siteContent} onReload={loadData} />
      )}
    </div>
  )
}

/* ==================== OVERVIEW ==================== */
function OverviewTab({ projects, clients }: { projects: Project[]; clients: ClientType[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { label: 'Projekt', value: projects.length, icon: FolderOpen },
        { label: 'Kunder', value: clients.length, icon: Users },
        { label: 'Status', value: 'Aktiv', icon: LayoutDashboard },
      ].map((stat) => (
        <div key={stat.label} className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <stat.icon size={20} className="text-wmb-blue" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

/* ==================== PROJECTS ==================== */
function ProjectsTab({
  projects,
  setProjects,
  onReload,
}: {
  projects: Project[]
  setProjects: (p: Project[]) => void
  onReload: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    client: '',
    featured: false,
    images: [] as string[],
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f, 'wmb/projects')))
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
    } catch (err) {
      alert('Kunde inte ladda upp bilden. Försök igen.')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    if (!form.title || !form.description) return
    setSaving(true)
    await supabase.from('projects').insert([{
      title: form.title,
      description: form.description,
      category: form.category,
      client: form.client,
      images: form.images,
      featured: form.featured,
    }])
    setForm({ title: '', description: '', category: '', client: '', featured: false, images: [] })
    setShowForm(false)
    setSaving(false)
    onReload()
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort detta projekt?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(projects.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Projekt</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-wmb-red hover:bg-wmb-red/90 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Avbryt' : 'Nytt projekt'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Titel *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-wmb-blue"
                placeholder="Projektets titel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-wmb-blue"
              >
                <option value="">Välj kategori</option>
                <option value="Invändig">Invändig</option>
                <option value="Utvändig">Utvändig</option>
                <option value="Renovering">Renovering</option>
                <option value="Kommersiellt">Kommersiellt</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Kund</label>
            <input
              type="text"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-wmb-blue"
              placeholder="Kundens namn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Beskrivning *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-wmb-blue resize-none"
              placeholder="Beskriv projektet..."
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Bilder</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="project-images"
            />
            <label
              htmlFor="project-images"
              className={`inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm cursor-pointer transition-colors ${
                uploading ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                  Laddar upp...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Ladda upp bilder
                </>
              )}
            </label>

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                {form.images.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 text-wmb-red rounded border-zinc-300 focus:ring-wmb-blue"
            />
            <label htmlFor="featured" className="text-sm text-zinc-600 dark:text-zinc-300">
              Visa på startsidan
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !form.title || !form.description}
            className="inline-flex items-center gap-2 px-6 py-2 bg-wmb-red hover:bg-wmb-red/90 disabled:bg-wmb-red/50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Save size={16} />
            {saving ? 'Sparar...' : 'Spara projekt'}
          </button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <ImageIcon size={40} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 dark:text-zinc-400">Inga projekt ännu. Skapa ditt första projekt ovan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {project.images.length > 0 ? (
                <img src={project.images[0]} alt={project.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <ImageIcon size={32} className="text-zinc-300 dark:text-zinc-600" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">{project.title}</h3>
                    {project.category && <p className="text-xs text-wmb-blue">{project.category}</p>}
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2">{project.description}</p>
                {project.client && <p className="text-xs text-zinc-400 mt-2">Kund: {project.client}</p>}
                {project.images.length > 1 && (
                  <p className="text-xs text-zinc-400 mt-1">{project.images.length} bilder</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==================== CLIENTS ==================== */
function ClientsTab({
  clients,
  setClients,
  onReload,
}: {
  clients: ClientType[]
  setClients: (c: ClientType[]) => void
  onReload: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ name: '', logo: '', description: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'wmb/clients')
      setForm((prev) => ({ ...prev, logo: url }))
    } catch {
      alert('Kunde inte ladda upp logotypen.')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    await supabase.from('clients').insert([{
      name: form.name,
      logo: form.logo,
      description: form.description,
    }])
    setForm({ name: '', logo: '', description: '' })
    setShowForm(false)
    setSaving(false)
    onReload()
  }

  const deleteClient = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna kund?')) return
    await supabase.from('clients').delete().eq('id', id)
    setClients(clients.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Kunder</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-wmb-red hover:bg-wmb-red/90 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Avbryt' : 'Ny kund'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Kundnamn *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-wmb-blue"
              placeholder="Företagets namn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Beskrivning</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-wmb-blue"
              placeholder="Kort beskrivning (valfritt)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Logotyp</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="client-logo" />
            {form.logo ? (
              <div className="flex items-center gap-4">
                <img src={form.logo} alt="" className="w-16 h-16 object-contain rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white p-1" />
                <button onClick={() => setForm({ ...form, logo: '' })} className="text-sm text-red-500 hover:text-red-600">Ta bort</button>
              </div>
            ) : (
              <label
                htmlFor="client-logo"
                className={`inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm cursor-pointer transition-colors ${
                  uploading ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                    Laddar upp...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Ladda upp logotyp
                  </>
                )}
              </label>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !form.name}
            className="inline-flex items-center gap-2 px-6 py-2 bg-wmb-red hover:bg-wmb-red/90 disabled:bg-wmb-red/50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Save size={16} />
            {saving ? 'Sparar...' : 'Spara kund'}
          </button>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <Users size={40} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 dark:text-zinc-400">Inga kunder ännu. Lägg till din första kund ovan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
              <div className="flex items-start gap-4">
                {client.logo ? (
                  <img src={client.logo} alt={client.name} className="w-14 h-14 object-contain rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white p-1 shrink-0" />
                ) : (
                  <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                    <Users size={20} className="text-zinc-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">{client.name}</h3>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {client.description && (
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">{client.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==================== SETTINGS ==================== */
const SETTINGS_FIELDS = [
  { section: 'contact', key: 'phone', label: 'Telefonnummer', placeholder: '070-123 45 67' },
  { section: 'contact', key: 'email', label: 'E-postadress', placeholder: 'info@wahlstromsmaleri.se' },
  { section: 'contact', key: 'address', label: 'Adress', placeholder: 'Exempelgatan 1, 123 45 Stockholm' },
  { section: 'contact', key: 'hours', label: 'Öppettider', placeholder: 'Mån–Fre: 07:00–17:00' },
]

function SettingsTab({ siteContent, onReload }: { siteContent: SiteContent[]; onReload: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const initial: Record<string, string> = {}
    for (const field of SETTINGS_FIELDS) {
      const existing = siteContent.find((c) => c.section === field.section && c.key === field.key)
      initial[`${field.section}.${field.key}`] = existing?.value || ''
    }
    setValues(initial)
  }, [siteContent])

  const handleSave = async () => {
    setSaving(true)
    for (const field of SETTINGS_FIELDS) {
      const val = values[`${field.section}.${field.key}`] || ''
      if (!val) continue
      const existing = siteContent.find((c) => c.section === field.section && c.key === field.key)
      if (existing) {
        await supabase.from('site_content').update({ value: val }).eq('id', existing.id)
      } else {
        await supabase.from('site_content').insert([{ section: field.section, key: field.key, value: val }])
      }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    onReload()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Inställningar</h2>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <Pencil size={16} className="text-wmb-blue" />
          Kontaktuppgifter
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Dessa visas på kontaktsidan och i footern.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SETTINGS_FIELDS.map((field) => (
            <div key={`${field.section}.${field.key}`}>
              <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">{field.label}</label>
              <input
                type="text"
                value={values[`${field.section}.${field.key}`] || ''}
                onChange={(e) => setValues({ ...values, [`${field.section}.${field.key}`]: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-wmb-blue"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-wmb-red hover:bg-wmb-red/90 disabled:bg-wmb-red/50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Save size={16} />
            {saving ? 'Sparar...' : 'Spara inställningar'}
          </button>
          {saved && <span className="text-green-500 text-sm">Sparat!</span>}
        </div>
      </div>
    </div>
  )
}
