-- Habilitar realtime para payment_requests
ALTER TABLE public.payment_requests REPLICA IDENTITY FULL;

-- Adicionar tabela à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_requests;