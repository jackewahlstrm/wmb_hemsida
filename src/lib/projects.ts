import { supabase } from './supabase'
import type { Project } from './types'

export function formatTitle(project: { title: string; client?: string }): string {
  if (project.client && project.client.trim()) {
    return `${project.title} - ${project.client}`
  }
  return project.title
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('category', category)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  return data || []
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
  return data || []
}
