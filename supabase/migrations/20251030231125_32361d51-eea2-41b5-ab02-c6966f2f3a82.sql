-- Create user_dashboards table for multiple dashboards per user
CREATE TABLE IF NOT EXISTS public.user_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dashboard_name TEXT NOT NULL,
  sheet_url TEXT NOT NULL,
  sheet_gid TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_dashboards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_dashboards
CREATE POLICY "Admins can manage all dashboards"
  ON public.user_dashboards
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators can manage managed clients dashboards"
  ON public.user_dashboards
  FOR ALL
  USING (
    has_role(auth.uid(), 'moderator'::app_role) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = user_dashboards.user_id
      AND profiles.manager_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own dashboards"
  ON public.user_dashboards
  FOR SELECT
  USING (auth.uid() = user_id);

-- Add dashboard_id to campaign_data to link data to specific dashboards
ALTER TABLE public.campaign_data
ADD COLUMN IF NOT EXISTS dashboard_id UUID REFERENCES public.user_dashboards(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_campaign_data_dashboard_id ON public.campaign_data(dashboard_id);

-- Update trigger for user_dashboards
CREATE TRIGGER update_user_dashboards_updated_at
  BEFORE UPDATE ON public.user_dashboards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();