-- Kör detta i Supabase SQL Editor om du redan har kört huvudschemat.
-- Lägger till tabellen page_views för besöksstatistik.

CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  path TEXT DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert page_views" ON page_views;
CREATE POLICY "Public insert page_views" ON page_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read page_views" ON page_views;
CREATE POLICY "Admin read page_views" ON page_views FOR SELECT USING (auth.role() = 'authenticated');
