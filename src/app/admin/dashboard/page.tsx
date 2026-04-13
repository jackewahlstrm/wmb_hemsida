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
  ArrowUp,
  ArrowDown,
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
    { id: 'projects' as Tab, label: 'Bilder', icon: ImageIcon },
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
        { label: 'Bilder', value: new Set(projects.map((p) => p.images?.[0] || p.title)).size, icon: ImageIcon },
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
    categories: [] as string[],
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
    if (!form.title || !form.description || form.categories.length === 0) return
    setSaving(true)
    const rows = form.categories.map((cat) => ({
      title: form.title,
      description: form.description,
      category: cat,
      client: form.client,
      images: form.images,
      featured: form.featured,
    }))
    await supabase.from('projects').insert(rows)
    setForm({ title: '', description: '', categories: [], client: '', featured: false, images: [] })
    setShowForm(false)
    setSaving(false)
    onReload()
  }

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna bild?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(projects.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Bilder</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-wmb-red hover:bg-wmb-red/90 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Avbryt' : 'Ladda upp bild'}
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
                placeholder="Bildens titel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Var ska bilden visas? *</label>
              <div className="space-y-2">
                {[
                  { key: 'hero', label: 'Startsida - stora karusellen' },
                  { key: 'ticker', label: 'Startsida - lilla karusellen' },
                  { key: 'projekt', label: 'Projekt sida' },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.categories.includes(opt.key)}
                      onChange={() => toggleCategory(opt.key)}
                      className="w-4 h-4 text-wmb-red rounded border-zinc-300 focus:ring-wmb-blue"
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">{opt.label}</span>
                  </label>
                ))}
              </div>
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
              placeholder="Beskriv bilden..."
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
            disabled={saving || !form.title || !form.description || form.categories.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2 bg-wmb-red hover:bg-wmb-red/90 disabled:bg-wmb-red/50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Save size={16} />
            {saving ? 'Sparar...' : 'Spara bild'}
          </button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <ImageIcon size={40} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 dark:text-zinc-400">Inga bilder ännu. Ladda upp din första bild ovan.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {[
            { key: 'hero', label: 'Startsida - stora karusellen' },
            { key: 'ticker', label: 'Startsida - lilla karusellen' },
          ].map((section) => {
            const sectionProjects = projects.filter((p) => p.category === section.key)
            return (
              <div key={section.key}>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">{section.label}</h3>
                {sectionProjects.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">Inga bilder i denna kategori.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {sectionProjects.map((project) => (
                      <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        {project.images.length > 0 ? (
                          <img src={project.images[0]} alt={project.title} className="w-full h-32 object-cover" />
                        ) : (
                          <div className="w-full h-32 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <ImageIcon size={24} className="text-zinc-300 dark:text-zinc-600" />
                          </div>
                        )}
                        <div className="p-3">
                          <h4 className="font-medium text-zinc-900 dark:text-white text-xs truncate">{project.title}</h4>
                          <p className="text-zinc-500 text-xs truncate mt-1">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Projekt sida — med ordning */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">Projekt sida</h3>
            {(() => {
              const projektItems = [...projects.filter((p) => p.category === 'projekt')].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

              const moveItem = async (index: number, direction: -1 | 1) => {
                const targetIndex = index + direction
                if (targetIndex < 0 || targetIndex >= projektItems.length) return
                const current = projektItems[index]
                const target = projektItems[targetIndex]
                await Promise.all([
                  supabase.from('projects').update({ sort_order: targetIndex }).eq('id', current.id),
                  supabase.from('projects').update({ sort_order: index }).eq('id', target.id),
                ])
                onReload()
              }

              if (projektItems.length === 0) {
                return <p className="text-xs text-zinc-400 italic">Inga bilder i denna kategori.</p>
              }

              return (
                <div className="space-y-2">
                  {projektItems.map((project, index) => (
                    <div key={project.id} className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden p-2">
                      {/* Ordningsknappar */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20 transition-colors"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveItem(index, 1)}
                          disabled={index === projektItems.length - 1}
                          className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20 transition-colors"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      {/* Ordningsnummer */}
                      <span className="text-xs font-mono text-zinc-400 w-6 text-center shrink-0">{index + 1}</span>

                      {/* Bild */}
                      {project.images.length > 0 ? (
                        <img src={project.images[0]} alt={project.title} className="w-16 h-12 object-cover rounded-lg shrink-0" />
                      ) : (
                        <div className="w-16 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                          <ImageIcon size={16} className="text-zinc-300 dark:text-zinc-600" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-zinc-900 dark:text-white text-sm truncate">{project.title}</h4>
                        <p className="text-zinc-500 text-xs truncate">{project.description}</p>
                      </div>

                    </div>
                  ))}
                </div>
              )
            })()}
          </div>

          {/* Alla bilder (unika) */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">Alla bilder</h3>
            {(() => {
              const categoryLabels: Record<string, string> = {
                hero: 'Stora karusellen',
                ticker: 'Lilla karusellen',
                projekt: 'Projekt sida',
              }

              // Gruppera per bild-URL för att hitta unika bilder
              const seen = new Map<string, { project: typeof projects[number]; categories: string[] }>()
              projects.forEach((p) => {
                const key = p.images?.[0] || p.title
                if (seen.has(key)) {
                  const existing = seen.get(key)!
                  if (p.category && !existing.categories.includes(p.category)) {
                    existing.categories.push(p.category)
                  }
                } else {
                  seen.set(key, { project: p, categories: p.category ? [p.category] : [] })
                }
              })
              const uniqueItems = Array.from(seen.values())

              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {uniqueItems.map(({ project, categories }) => (
                    <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                      {project.images.length > 0 ? (
                        <img src={project.images[0]} alt={project.title} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="w-full h-32 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <ImageIcon size={24} className="text-zinc-300 dark:text-zinc-600" />
                        </div>
                      )}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-zinc-900 dark:text-white text-xs truncate">{project.title}</h4>
                          <button
                            onClick={async () => {
                              if (!confirm('Ta bort denna bild från ALLA platser?')) return
                              const imageUrl = project.images?.[0]
                              if (imageUrl) {
                                await supabase.from('projects').delete().filter('images', 'cs', `{"${imageUrl}"}`)
                              } else {
                                await supabase.from('projects').delete().eq('title', project.title).eq('description', project.description)
                              }
                              onReload()
                            }}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors shrink-0"
                            title="Ta bort från alla platser"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-zinc-500 text-xs truncate mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {(['hero', 'ticker', 'projekt'] as const).map((cat) => {
                            const isActive = categories.includes(cat)
                            return (
                              <button
                                key={cat}
                                onClick={async () => {
                                  const imageUrl = project.images?.[0]
                                  if (isActive) {
                                    // Ta bort från denna kategori
                                    if (imageUrl) {
                                      await supabase.from('projects').delete().filter('images', 'cs', `{"${imageUrl}"}`).eq('category', cat)
                                    }
                                  } else {
                                    // Lägg till i denna kategori
                                    await supabase.from('projects').insert([{
                                      title: project.title,
                                      description: project.description,
                                      category: cat,
                                      client: project.client,
                                      images: project.images,
                                      featured: project.featured,
                                    }])
                                  }
                                  onReload()
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full transition-colors ${
                                  isActive
                                    ? 'bg-wmb-blue/10 text-wmb-blue'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600'
                                }`}
                                title={isActive ? `Ta bort från ${categoryLabels[cat]}` : `Lägg till i ${categoryLabels[cat]}`}
                              >
                                {categoryLabels[cat]}
                                {isActive ? <X size={10} /> : <Plus size={10} />}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
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
