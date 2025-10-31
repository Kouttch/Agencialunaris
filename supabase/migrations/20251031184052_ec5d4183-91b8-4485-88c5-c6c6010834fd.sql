-- Drop old Google Sheets related tables
DROP TABLE IF EXISTS campaign_data CASCADE;
DROP TABLE IF EXISTS sheets_sync_config CASCADE;
DROP TABLE IF EXISTS user_dashboards CASCADE;

-- Delete the sync-google-sheets edge function (commented out as we can't drop functions this way)
-- DROP FUNCTION IF EXISTS public.sync_all_google_sheets CASCADE;

-- Create table to map meta_reports account_id to user_id
CREATE TABLE IF NOT EXISTS public.meta_account_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meta_account_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meta_account_mappings
CREATE POLICY "Admins can manage account mappings"
  ON public.meta_account_mappings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators can view managed clients mappings"
  ON public.meta_account_mappings
  FOR SELECT
  USING (
    has_role(auth.uid(), 'moderator'::app_role) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = meta_account_mappings.user_id
      AND profiles.manager_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own account mappings"
  ON public.meta_account_mappings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Update meta_reports RLS policies to allow proper access
DROP POLICY IF EXISTS "allow_anon_insert" ON public.meta_reports;
DROP POLICY IF EXISTS "allow_anon_update" ON public.meta_reports;
DROP POLICY IF EXISTS "allow_select_all" ON public.meta_reports;

-- New RLS policies for meta_reports
CREATE POLICY "Admins can manage all reports"
  ON public.meta_reports
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators can view managed clients reports"
  ON public.meta_reports
  FOR SELECT
  USING (
    has_role(auth.uid(), 'moderator'::app_role) AND
    EXISTS (
      SELECT 1 FROM meta_account_mappings m
      JOIN profiles p ON p.user_id = m.user_id
      WHERE m.account_id = meta_reports.account_id
      AND p.manager_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own reports"
  ON public.meta_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meta_account_mappings
      WHERE meta_account_mappings.account_id = meta_reports.account_id
      AND meta_account_mappings.user_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_meta_account_mappings_updated_at
  BEFORE UPDATE ON public.meta_account_mappings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();