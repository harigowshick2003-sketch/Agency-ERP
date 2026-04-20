-- ═══════════════════════════════════════════════════════════════════
--  Agency ERP — Full Database Schema Setup
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. CLIENTS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    timestamptz DEFAULT now(),
  client_code   text,
  name          text        NOT NULL,
  industry      text,
  brand_tone    text,
  contact_name  text,
  contact_email text,
  contact_phone text
);

-- ── 2. DELIVERABLES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deliverables (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    timestamptz DEFAULT now(),
  client_id     uuid        REFERENCES clients(id) ON DELETE CASCADE,
  activity_code text        NOT NULL,
  activity_type text        DEFAULT 'AT001',
  date          date,
  platform      text,
  notes         text
);

-- ── 3. DAILY TRACKER (approval statuses per deliverable) ─────────────
CREATE TABLE IF NOT EXISTS daily_tracker (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      timestamptz DEFAULT now(),
  deliverable_id  uuid        REFERENCES deliverables(id) ON DELETE CASCADE,
  content_status  text,
  creative_status text,
  client_status   text,
  posting_status  text,
  notes           text
);

-- ── 4. EMPLOYEES ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name       text        NOT NULL,
  emp_id     text,
  role       text,
  department text,
  email      text
);

-- ── 5. JOB TRACKER ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_tracker (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at     timestamptz DEFAULT now(),
  deliverable_id uuid        REFERENCES deliverables(id) ON DELETE CASCADE,
  assigned_to    uuid        REFERENCES employees(id) ON DELETE SET NULL,
  task_type      text,
  is_correction  boolean     DEFAULT false,
  status         text        DEFAULT 'Pending',
  notes          text
);

-- ── 6. CONTENT DETAILS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_details (
  id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at              timestamptz DEFAULT now(),
  deliverable_id          uuid        REFERENCES deliverables(id) ON DELETE CASCADE,
  title                   text,
  copy                    text,
  description             text,
  thumbnail_content       text,
  reference               text,
  rough_cut               text,
  final_output            text,
  thumbnail               text,
  content_approval_status text        DEFAULT 'Content Not Written'
);

-- ═══════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
--  Authenticated users get full CRUD access on all tables.
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE clients         ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables    ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tracker   ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees       ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_tracker     ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_details ENABLE ROW LEVEL SECURITY;

-- Drop old policies if re-running
DROP POLICY IF EXISTS "auth_clients"         ON clients;
DROP POLICY IF EXISTS "auth_deliverables"    ON deliverables;
DROP POLICY IF EXISTS "auth_daily_tracker"   ON daily_tracker;
DROP POLICY IF EXISTS "auth_employees"       ON employees;
DROP POLICY IF EXISTS "auth_job_tracker"     ON job_tracker;
DROP POLICY IF EXISTS "auth_content_details" ON content_details;

-- Full access for authenticated users
CREATE POLICY "auth_clients"         ON clients         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_deliverables"    ON deliverables    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_daily_tracker"   ON daily_tracker   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_employees"       ON employees       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_job_tracker"     ON job_tracker     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_content_details" ON content_details FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════
--  VERIFY — Run this SELECT after setup to confirm all tables exist
-- ═══════════════════════════════════════════════════════════════════
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
