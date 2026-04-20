-- ══════════════════════════════════════════════════════════════════
--  Migration: Add reference link columns to daily_tracker
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE daily_tracker
  ADD COLUMN IF NOT EXISTS content_reference  text,
  ADD COLUMN IF NOT EXISTS creative_reference text;
