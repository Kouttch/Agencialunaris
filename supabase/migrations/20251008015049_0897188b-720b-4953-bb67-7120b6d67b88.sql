-- Add account_status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'disabled', 'integration', 'pending'));

-- Create payment_requests table for PIX payments
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  pix_code TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on payment_requests
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_requests
CREATE POLICY "Users can view their own payment requests"
ON public.payment_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins and moderators can manage payment requests"
ON public.payment_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Update RLS policies for checklist to include moderators
DROP POLICY IF EXISTS "Admins can manage all checklist items" ON public.checklist_items;

CREATE POLICY "Admins and moderators can manage checklist items"
ON public.checklist_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Update trigger for payment_requests
CREATE TRIGGER update_payment_requests_updated_at
BEFORE UPDATE ON public.payment_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON public.payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON public.payment_requests(status);