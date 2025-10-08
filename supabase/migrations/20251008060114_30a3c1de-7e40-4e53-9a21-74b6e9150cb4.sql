-- Create strategy_documents table for PDF uploads
CREATE TABLE IF NOT EXISTS public.strategy_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.strategy_documents ENABLE ROW LEVEL SECURITY;

-- Policies for strategy_documents
CREATE POLICY "Users can view their own strategy documents"
  ON public.strategy_documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all strategy documents"
  ON public.strategy_documents
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators can manage managed clients strategy documents"
  ON public.strategy_documents
  FOR ALL
  USING (
    has_role(auth.uid(), 'moderator'::app_role) 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = strategy_documents.user_id 
      AND profiles.manager_id = auth.uid()
    )
  );

-- Create storage bucket for strategy documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('strategy-documents', 'strategy-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can view their own strategy documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'strategy-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can upload strategy documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'strategy-documents' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Moderators can upload for managed clients"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'strategy-documents' 
    AND has_role(auth.uid(), 'moderator'::app_role)
  );

CREATE POLICY "Admins can delete strategy documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'strategy-documents' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Moderators can delete managed clients documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'strategy-documents' 
    AND has_role(auth.uid(), 'moderator'::app_role)
  );

-- Add trigger for updated_at
CREATE TRIGGER update_strategy_documents_updated_at
  BEFORE UPDATE ON public.strategy_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();