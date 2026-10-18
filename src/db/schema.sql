-- ==============================================================================
-- BookMarkSoft UK - Supabase PostgreSQL Database Schema
-- Compatible with Clerk Authentication & Cloudflare Pages / R2 Storage
-- ==============================================================================

-- 1. Candidate Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY, -- Matches Clerk user_id (e.g. user_2abc123)
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role_headline TEXT,
  location TEXT DEFAULT 'London, UK',
  right_to_work_status TEXT DEFAULT 'British Citizen',
  sponsorship_needed BOOLEAN DEFAULT false,
  cv_storage_path TEXT, -- Cloudflare R2 bucket file path
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Candidate Tailored Application Links ("Did they read it?")
CREATE TABLE IF NOT EXISTS public.candidate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  custom_slug TEXT UNIQUE NOT NULL, -- e.g. 'alex-turner/monzo-backend'
  company_name TEXT NOT NULL,
  job_role TEXT NOT NULL,
  recipient_name TEXT,
  cv_version_variant TEXT DEFAULT 'A', -- 'A' or 'B' (CV Lab)
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Live Engagement & Heatmap Events (Logged when recruiter opens dossier)
CREATE TABLE IF NOT EXISTS public.link_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.candidate_links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'open', 'skim', 'deep_read', 'download_pdf', 'vouch_click'
  section_name TEXT, -- 'experience', 'projects', 'skills', 'vouches', 'summary'
  duration_seconds INTEGER DEFAULT 0,
  ip_country TEXT DEFAULT 'GB', -- Extracted from Cloudflare CF-IPCountry header
  ip_city TEXT, -- Extracted from Cloudflare CF-IPCity header
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Candidate-Driven Vouches (Verified claims & references)
CREATE TABLE IF NOT EXISTS public.vouches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL, -- e.g. 'v-84912' used in /vouch/:token
  candidate_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  employment_period TEXT NOT NULL,
  referee_name TEXT NOT NULL,
  referee_email TEXT NOT NULL,
  referee_role TEXT NOT NULL,
  skills_claimed TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'declined')),
  referee_quote TEXT,
  audit_hash TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Ghost Tracker Applications Pipeline
CREATE TABLE IF NOT EXISTS public.ghost_tracker_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  salary_range TEXT,
  location TEXT DEFAULT 'London (Hybrid)',
  stage TEXT DEFAULT 'applied' CHECK (stage IN ('applied', 'opened', 'phone_screen', 'tech_interview', 'final_round', 'offer', 'ghosted', 'rejected')),
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_contact_date DATE NOT NULL DEFAULT CURRENT_DATE,
  contact_person TEXT,
  contact_email TEXT,
  tailored_link_slug TEXT,
  follow_up_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT LOOKUPS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_candidate_links_slug ON public.candidate_links(custom_slug);
CREATE INDEX IF NOT EXISTS idx_link_events_link_id ON public.link_events(link_id);
CREATE INDEX IF NOT EXISTS idx_vouches_token ON public.vouches(token);
CREATE INDEX IF NOT EXISTS idx_ghost_tracker_user ON public.ghost_tracker_apps(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghost_tracker_apps ENABLE ROW LEVEL SECURITY;

-- Candidates can read and update their own profile
CREATE POLICY "Users can manage their own profile"
  ON public.profiles
  FOR ALL
  USING (auth.jwt() ->> 'sub' = id);

-- Candidates can manage their own application links
CREATE POLICY "Users can manage their own candidate links"
  ON public.candidate_links
  FOR ALL
  USING (auth.jwt() ->> 'sub' = user_id);

-- PUBLIC ACCESS: Anyone with the link slug can view active candidate links (for recruiters)
CREATE POLICY "Public can view active candidate links"
  ON public.candidate_links
  FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- PUBLIC ACCESS: Recruiters / viewers can insert tracking & dwell time events anonymously
CREATE POLICY "Public can record link engagement events"
  ON public.link_events
  FOR INSERT
  WITH CHECK (true);

-- Candidates can view events for their links
CREATE POLICY "Candidates can view their link events"
  ON public.link_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.candidate_links
      WHERE candidate_links.id = link_events.link_id
      AND candidate_links.user_id = auth.jwt() ->> 'sub'
    )
  );

-- Candidates can manage their own vouches
CREATE POLICY "Candidates can manage their vouches"
  ON public.vouches
  FOR ALL
  USING (auth.jwt() ->> 'sub' = user_id);

-- PUBLIC ACCESS: Referees can view and verify vouches using the unique token
CREATE POLICY "Referees can view vouches by token"
  ON public.vouches
  FOR SELECT
  USING (true);

CREATE POLICY "Referees can update vouch verification by token"
  ON public.vouches
  FOR UPDATE
  USING (true);

-- Candidates can manage their ghost tracker pipeline
CREATE POLICY "Candidates can manage ghost tracker apps"
  ON public.ghost_tracker_apps
  FOR ALL
  USING (auth.jwt() ->> 'sub' = user_id);
