-- Create table for account managers
CREATE TABLE IF NOT EXISTS public.account_managers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.account_managers ENABLE ROW LEVEL SECURITY;

-- Policies for account_managers
CREATE POLICY "Admins can manage account managers"
ON public.account_managers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view account managers"
ON public.account_managers
FOR SELECT
USING (true);

-- Add manager_id to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.account_managers(id);

-- Add trigger for updated_at
CREATE TRIGGER update_account_managers_updated_at
BEFORE UPDATE ON public.account_managers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for storing Google Sheets sync configuration
CREATE TABLE IF NOT EXISTS public.sheets_sync_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sheet_url TEXT NOT NULL,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sheets_sync_config ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage sync configs"
ON public.sheets_sync_config
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));