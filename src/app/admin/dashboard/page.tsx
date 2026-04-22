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
  Type,
  Server,
  Database,
  Cloud,
  Mail,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Inbox,
  Eye,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadImage } from '@/lib/cloudinary'
import { formatTitle } from '@/lib/projects'
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
    { id: 'clients' as Tab, label: 'Text', icon: Type },
    { id: 'settings' as Tab, label: 'Kontaktuppgifter', icon: Settings },
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
        <OverviewTab projects={projects} />
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
type HealthCheck = {
  status: 'ok' | 'error' | 'warning'
  label: string
  latencyMs?: number
}

type HealthResponse = {
  server: HealthCheck
  database: HealthCheck
  cloudinary: HealthCheck
  email: HealthCheck
  checkedAt: string
}

type RangeKey = 'day' | 'week' | 'month' | 'year' | 'total'

const RANGE_OPTIONS: Record<RangeKey, { label: string; sublabel: string }> = {
  day: { label: 'Dag', sublabel: 'idag' },
  week: { label: 'Vecka', sublabel: 'denna vecka' },
  month: { label: 'Månad', sublabel: 'denna månad' },
  year: { label: 'År', sublabel: 'i år' },
  total: { label: 'Totalt', sublabel: 'totalt' },
}

// Returnerar ISO-timestamp för början av perioden i Stockholm-tid.
// Veckan börjar måndag 00:00 lokal tid. Returnerar null för 'total'.
function startOfRangeISO(range: RangeKey): string | null {
  if (range === 'total') return null
  const now = new Date()

  const parts: Record<string, string> = {}
  for (const p of new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(now)) {
    if (p.type !== 'literal') parts[p.type] = p.value
  }

  let y = +parts.year
  let m = +parts.month
  let d = +parts.day
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const dow = weekdayMap[parts.weekday] ?? 0

  if (range === 'week') {
    const diff = dow === 0 ? -6 : 1 - dow
    const tmp = new Date(Date.UTC(y, m - 1, d + diff))
    y = tmp.getUTCFullYear()
    m = tmp.getUTCMonth() + 1
    d = tmp.getUTCDate()
  } else if (range === 'month') {
    d = 1
  } else if (range === 'year') {
    m = 1
    d = 1
  }

  // Hämta aktuell Stockholm-UTC-offset (varierar med sommartid)
  const offsetParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Stockholm',
    timeZoneName: 'longOffset',
  }).formatToParts(now)
  const tzName = offsetParts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+01:00'
  const offset = tzName.replace('GMT', '') || '+01:00'

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${y}-${pad(m)}-${pad(d)}T00:00:00${offset}`
}

async function countRows(table: string, startISO: string | null): Promise<number> {
  const query = supabase.from(table).select('*', { count: 'exact', head: true })
  if (startISO) query.gte('created_at', startISO)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

function StatCard({
  icon: Icon,
  label,
  value,
  range,
  ranges,
  onRangeChange,
}: {
  icon: typeof Server
  label: string
  value: number | string
  range: RangeKey
  ranges: RangeKey[]
  onRangeChange: (r: RangeKey) => void
}) {
  const sub = RANGE_OPTIONS[range]?.sublabel ?? ''
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-wmb-blue/10 flex items-center justify-center">
            <Icon size={18} className="text-wmb-blue" />
          </div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{label}</span>
        </div>
        <div className="inline-flex p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          {ranges.map((key) => (
            <button
              key={key}
              onClick={() => onRangeChange(key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                range === key
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              {RANGE_OPTIONS[key].label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-3xl font-bold text-zinc-900 dark:text-white tabular-nums">{value}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{sub}</p>
    </div>
  )
}

function OverviewTab({ projects }: { projects: Project[] }) {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [checking, setChecking] = useState(true)
  const [contactRange, setContactRange] = useState<RangeKey>('week')
  const [visitorRange, setVisitorRange] = useState<RangeKey>('week')
  const [contactCount, setContactCount] = useState<number | null>(null)
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const imageCount = new Set(projects.map((p) => p.images?.[0] || p.title)).size

  useEffect(() => {
    setContactCount(null)
    countRows('contact_messages', startOfRangeISO(contactRange))
      .then(setContactCount)
      .catch(() => setContactCount(null))
  }, [contactRange])

  useEffect(() => {
    setVisitorCount(null)
    countRows('page_views', startOfRangeISO(visitorRange))
      .then(setVisitorCount)
      .catch(() => setVisitorCount(null))
  }, [visitorRange])

  const runChecks = async () => {
    setChecking(true)
    try {
      const res = await fetch('/api/health', { cache: 'no-store' })
      const data = (await res.json()) as HealthResponse
      setHealth(data)
    } catch {
      setHealth(null)
    }
    setChecking(false)
  }

  useEffect(() => {
    runChecks()
  }, [])

  const allOk = health
    ? [health.server, health.database, health.cloudinary, health.email].every((c) => c.status === 'ok')
    : false

  const services: { key: keyof Omit<HealthResponse, 'checkedAt'>; label: string; icon: typeof Server; description: string }[] = [
    { key: 'server', label: 'Server', icon: Server, description: 'Next.js-applikation' },
    { key: 'database', label: 'Databas', icon: Database, description: 'Supabase' },
    { key: 'cloudinary', label: 'Bildlagring', icon: Cloud, description: 'Cloudinary' },
    { key: 'email', label: 'E-post', icon: Mail, description: 'Resend' },
  ]

  return (
    <div className="space-y-6">
      {/* Top row — bilder + samlad status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon size={20} className="text-wmb-blue" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Bilder</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{imageCount}</p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard size={20} className="text-wmb-blue" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Systemstatus</span>
          </div>
          <div className="flex items-center gap-2">
            {checking ? (
              <>
                <RefreshCw size={18} className="text-zinc-400 animate-spin" />
                <p className="text-2xl font-bold text-zinc-500 dark:text-zinc-400">Kontrollerar...</p>
              </>
            ) : allOk ? (
              <>
                <CheckCircle2 size={22} className="text-green-500" />
                <p className="text-2xl font-bold text-green-500">Allt fungerar</p>
              </>
            ) : (
              <>
                <AlertTriangle size={22} className="text-amber-500" />
                <p className="text-2xl font-bold text-amber-500">Något behöver ses över</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Kontaktförfrågningar + Besökare */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatCard
          icon={Inbox}
          label="Kontaktförfrågningar"
          value={contactCount === null ? '—' : contactCount.toLocaleString('sv-SE')}
          range={contactRange}
          ranges={['week', 'month', 'year', 'total']}
          onRangeChange={setContactRange}
        />
        <StatCard
          icon={Eye}
          label="Besökare"
          value={visitorCount === null ? '—' : visitorCount.toLocaleString('sv-SE')}
          range={visitorRange}
          ranges={['day', 'week', 'month', 'year', 'total']}
          onRangeChange={setVisitorRange}
        />
      </div>

      {/* Service-status */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Tjänster</h3>
          <div className="flex items-center gap-3">
            {health?.checkedAt && (
              <span className="text-xs text-zinc-400">
                Senast kontrollerad {new Date(health.checkedAt).toLocaleTimeString('sv-SE')}
              </span>
            )}
            <button
              onClick={runChecks}
              disabled={checking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
              Kontrollera igen
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => {
            const check = health?.[service.key]
            const status = check?.status ?? (checking ? 'checking' : 'error')
            const statusConfig = {
              ok: { color: 'text-green-500', bg: 'bg-green-500/10', Icon: CheckCircle2, label: 'Online' },
              warning: { color: 'text-amber-500', bg: 'bg-amber-500/10', Icon: AlertTriangle, label: 'Varning' },
              error: { color: 'text-red-500', bg: 'bg-red-500/10', Icon: XCircle, label: 'Nere' },
              checking: { color: 'text-zinc-400', bg: 'bg-zinc-500/10', Icon: RefreshCw, label: 'Kontrollerar' },
            }[status]

            return (
              <div
                key={service.key}
                className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${statusConfig.bg}`}>
                  <service.icon size={20} className={statusConfig.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{service.label}</h4>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{service.description}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <statusConfig.Icon size={14} className={`${statusConfig.color} ${status === 'checking' ? 'animate-spin' : ''}`} />
                    <span className={`text-xs font-medium ${statusConfig.color}`}>
                      {check?.label ?? statusConfig.label}
                    </span>
                    {check?.latencyMs !== undefined && (
                      <span className="text-xs text-zinc-400 font-mono">{check.latencyMs}ms</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
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
    if (!form.title || !form.description || form.categories.length === 0 || form.images.length === 0) return
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

          <button
            onClick={handleSave}
            disabled={saving || !form.title || !form.description || form.categories.length === 0 || form.images.length === 0}
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
          {/* Stora karusellen — med ordning */}
          {(() => {
            const sectionProjects = [...projects.filter((p) => p.category === 'hero')].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            const softLimit = 10
            const overLimit = sectionProjects.length > softLimit

            const moveItem = async (index: number, direction: -1 | 1) => {
              const targetIndex = index + direction
              if (targetIndex < 0 || targetIndex >= sectionProjects.length) return
              const current = sectionProjects[index]
              const target = sectionProjects[targetIndex]
              await Promise.all([
                supabase.from('projects').update({ sort_order: targetIndex }).eq('id', current.id),
                supabase.from('projects').update({ sort_order: index }).eq('id', target.id),
              ])
              onReload()
            }

            return (
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Startsida - stora karusellen</h3>
                  <span className={`text-xs font-mono ${overLimit ? 'text-red-500' : 'text-zinc-400'}`}>
                    {sectionProjects.length} / {softLimit}
                  </span>
                </div>
                {overLimit && (
                  <p className="text-xs text-red-500 mb-3 italic">
                    ⚠ Rekommenderad gräns är {softLimit} bilder. Fler kan påverka prestanda.
                  </p>
                )}
                {sectionProjects.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">Inga bilder i denna kategori.</p>
                ) : (
                  <div className="space-y-2">
                    {sectionProjects.map((project, index) => (
                      <div key={project.id} className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden p-2">
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
                            disabled={index === sectionProjects.length - 1}
                            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                        <span className="text-xs font-mono text-zinc-400 w-6 text-center shrink-0">{index + 1}</span>
                        {project.images.length > 0 ? (
                          <img src={project.images[0]} alt={project.title} className="w-16 h-12 object-cover rounded-lg shrink-0" />
                        ) : (
                          <div className="w-16 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                            <ImageIcon size={16} className="text-zinc-300 dark:text-zinc-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-zinc-900 dark:text-white text-sm truncate">{formatTitle(project)}</h4>
                          <p className="text-zinc-500 text-xs truncate">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Lilla karusellen — grid */}
          {(() => {
            const sectionProjects = projects.filter((p) => p.category === 'ticker')
            const softLimit = 14
            const overLimit = sectionProjects.length > softLimit
            return (
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Startsida - lilla karusellen</h3>
                  <span className={`text-xs font-mono ${overLimit ? 'text-red-500' : 'text-zinc-400'}`}>
                    {sectionProjects.length} / {softLimit}
                  </span>
                </div>
                {overLimit && (
                  <p className="text-xs text-red-500 mb-3 italic">
                    ⚠ Rekommenderad gräns är {softLimit} bilder. Fler kan påverka prestanda.
                  </p>
                )}
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
                          <h4 className="font-medium text-zinc-900 dark:text-white text-xs truncate">{formatTitle(project)}</h4>
                          <p className="text-zinc-500 text-xs truncate mt-1">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

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
                        <h4 className="font-medium text-zinc-900 dark:text-white text-sm truncate">{formatTitle(project)}</h4>
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
                          <h4 className="font-medium text-zinc-900 dark:text-white text-xs truncate">{formatTitle(project)}</h4>
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
  { section: 'contact', key: 'phone', label: 'Telefonnummer', placeholder: '0707358181' },
  { section: 'contact', key: 'email', label: 'E-postadress', placeholder: 'Tomas.wmb@telia.com' },
  { section: 'contact', key: 'address', label: 'Adress', placeholder: 'Stockholm, Sverige' },
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
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Kontaktuppgifter</h2>

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
            {saving ? 'Sparar...' : 'Spara kontaktuppgifter'}
          </button>
          {saved && <span className="text-green-500 text-sm">Sparat!</span>}
        </div>
      </div>
    </div>
  )
}
