export interface Project {
  id: string
  title: string
  description: string
  category: string
  client: string
  images: string[]
  featured: boolean
  sort_order: number
  created_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export interface Client {
  id: string
  name: string
  logo: string
  description: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  created_at: string
  read: boolean
}

export interface SiteContent {
  id: string
  section: string
  key: string
  value: string
}
