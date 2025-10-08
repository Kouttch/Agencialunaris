-- Adicionar coluna para rastrear confirmação do cliente
ALTER TABLE public.payment_requests
ADD COLUMN IF NOT EXISTS client_confirmed_at TIMESTAMP WITH TIME ZONE;