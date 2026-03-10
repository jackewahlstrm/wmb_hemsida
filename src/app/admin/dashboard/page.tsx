'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LogOut,
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Users,
  FileText,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  Image as ImageIcon,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Project, ContactMessage } from '@/lib/types'

type Tab = 'overview' | 'projects' | 'messages' | 'clients' | 'content'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
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
    const [projectsRes, messagesRes] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ])
    if (projectsRes.data) setProjects(projectsRes.data)
    if (messagesRes.data) setMessages(messagesRes.data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort detta projekt?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(projects.filter((p) => p.id !== id))
  }

  const toggleMessageRead = async (id: string, read: boolean) => {
    await supabase.from('contact_messages').update({ read: !read }).eq('id', id)
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: !read } : m)))
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort detta meddelande?')) return
    await supabase.from('contact_messages').delete().eq('id', id)
    setMessages(messages.filter((m) => m.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Översikt', icon: LayoutDashboard },
    { id: 'projects' as Tab, label: 'Projekt', icon: FolderOpen },
    { id: 'messages' as Tab, label: 'Meddelanden', icon: MessageSquare, badge: messages.filter((m) => !m.read).length },
    { id: 'clients' as Tab, label: 'Kunder', icon: Users },
    { id: 'content' as Tab, label: 'Innehåll', icon: FileText },
  ]

  const unreadMessages = messages.filter((m) => !m.read).length

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
                ? 'bg-amber-600 text-white'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {tab.badge ? (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{tab.badge}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Projekt', value: projects.length, icon: FolderOpen },
              { label: 'Olästa meddelanden', value: unreadMessages, icon: MessageSquare },
              { label: 'Totala meddelanden', value: messages.length, icon: FileText },
              { label: 'Status', value: 'Aktiv', icon: LayoutDashboard },
            ].map((stat) => (
              <div key={stat.label} className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon size={20} className="text-amber-600" />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent messages */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Senaste meddelanden</h2>
            {messages.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Inga meddelanden ännu.</p>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 5).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      msg.read
                        ? 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                        : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-900 dark:text-white text-sm">{msg.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{msg.email}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1 truncate">{msg.message}</p>
                      </div>
                      <span className="text-xs text-zinc-400 shrink-0">
                        {new Date(msg.created_at).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <ProjectsTab projects={projects} onDelete={deleteProject} onReload={loadData} />
      )}

      {activeTab === 'messages' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Kontaktmeddelanden</h2>
          {messages.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <MessageSquare size={40} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500 dark:text-zinc-400">Inga meddelanden ännu.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 bg-white dark:bg-zinc-900 rounded-xl border transition-colors ${
                    msg.read
                      ? 'border-zinc-200 dark:border-zinc-800'
                      : 'border-amber-300 dark:border-amber-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white">{msg.name}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-zinc-400">
                        {new Date(msg.created_at).toLocaleDateString('sv-SE')}
                      </span>
                      <button
                        onClick={() => toggleMessageRead(msg.id, msg.read)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        title={msg.read ? 'Markera som oläst' : 'Markera som läst'}
                      >
                        {msg.read ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                        title="Ta bort"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <Users size={40} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Kundhantering</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            Lägg till kunder och deras logotyper som visas på hemsidan.
          </p>
          <p className="text-xs text-zinc-400">Koppla Supabase för att aktivera denna funktion.</p>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <FileText size={40} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Innehållsredigering</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            Redigera texter på hemsidan som beskrivningar, kontaktinformation och statistik.
          </p>
          <p className="text-xs text-zinc-400">Koppla Supabase för att aktivera denna funktion.</p>
        </div>
      )}
    </div>
  )
}

function ProjectsTab({
  projects,
  onDelete,
  onReload,
}: {
  projects: Project[]
  onDelete: (id: string) => void
  onReload: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    client: '',
    featured: false,
  })

  const handleSave = async () => {
    if (!form.title || !form.description) return
    setSaving(true)

    await supabase.from('projects').insert([{
      title: form.title,
      description: form.description,
      category: form.category,
      client: form.client,
      images: [],
      featured: form.featured,
    }])

    setForm({ title: '', description: '', category: '', client: '', featured: false })
    setShowForm(false)
    setSaving(false)
    onReload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Projekt</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Avbryt' : 'Nytt projekt'}
        </button>
      </div>

      {/* New project form */}
      {showForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Titel *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Projektets titel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Kundens namn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-1">Beskrivning *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Beskriv projektet..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 text-amber-600 rounded border-zinc-300 focus:ring-amber-500"
            />
            <label htmlFor="featured" className="text-sm text-zinc-600 dark:text-zinc-300">
              Visa på startsidan
            </label>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !form.title || !form.description}
            className="inline-flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Save size={16} />
            {saving ? 'Sparar...' : 'Spara projekt'}
          </button>
        </div>
      )}

      {/* Projects list */}
      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <ImageIcon size={40} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 dark:text-zinc-400">Inga projekt ännu. Skapa ditt första projekt ovan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">{project.title}</h3>
                  <p className="text-xs text-amber-600">{project.category}</p>
                </div>
                <button
                  onClick={() => onDelete(project.id)}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{project.description}</p>
              {project.client && (
                <p className="text-xs text-zinc-400 mt-2">Kund: {project.client}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
