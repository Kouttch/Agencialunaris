-- Create campaign_data table to store real campaign metrics
CREATE TABLE IF NOT EXISTS public.campaign_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  frequency NUMERIC(10,2) DEFAULT 0,
  results INTEGER DEFAULT 0,
  cost_per_result NUMERIC(10,2) DEFAULT 0,
  amount_spent NUMERIC(10,2) DEFAULT 0,
  cpm NUMERIC(10,2) DEFAULT 0,
  link_clicks INTEGER DEFAULT 0,
  cpc NUMERIC(10,2) DEFAULT 0,
  ctr NUMERIC(10,2) DEFAULT 0,
  cost_per_conversation NUMERIC(10,2) DEFAULT 0,
  conversations_started INTEGER DEFAULT 0,
  week_start DATE,
  week_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_data ENABLE ROW LEVEL SECURITY;

-- Users can view their own campaign data
CREATE POLICY "Users can view their own campaign data"
ON public.campaign_data
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all campaign data
CREATE POLICY "Admins can view all campaign data"
ON public.campaign_data
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert campaign data
CREATE POLICY "Admins can insert campaign data"
ON public.campaign_data
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update campaign data
CREATE POLICY "Admins can update campaign data"
ON public.campaign_data
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete campaign data
CREATE POLICY "Admins can delete campaign data"
ON public.campaign_data
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_campaign_data_updated_at
BEFORE UPDATE ON public.campaign_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();