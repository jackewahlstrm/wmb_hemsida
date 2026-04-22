-- Wahlströms Måleri & Bygg - Supabase Database Schema
-- Kör detta i Supabase SQL Editor efter att du skapat ditt projekt

-- Projekt-tabell
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT '',
  client TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kontaktmeddelanden
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  service TEXT DEFAULT '',
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kunder (logotyper på hemsidan)
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sidinnehåll (redigerbara texter)
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  UNIQUE(section, key)
);

-- Besöksstatistik (en rad per session — sessionId sätts client-side)
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  path TEXT DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_page_views_created_at ON page_views(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Alla kan läsa projekt och kunder (publikt)
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);

-- Alla kan skapa kontaktmeddelanden (via formuläret)
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Alla kan logga sidvisningar (anonymt)
CREATE POLICY "Public insert page_views" ON page_views FOR INSERT WITH CHECK (true);

-- Inloggade användare (admin) kan göra allt
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access clients" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read page_views" ON page_views FOR SELECT USING (auth.role() = 'authenticated');
