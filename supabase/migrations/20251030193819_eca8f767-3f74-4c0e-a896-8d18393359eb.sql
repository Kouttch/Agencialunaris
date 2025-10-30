-- Adicionar tipo de relatório aos dados de campanha
ALTER TABLE campaign_data ADD COLUMN IF NOT EXISTS report_type text DEFAULT 'weekly' CHECK (report_type IN ('daily', 'weekly', 'monthly'));
ALTER TABLE campaign_data ADD COLUMN IF NOT EXISTS report_date date;

-- Criar tabela para mapeamento de nomes de campanhas
CREATE TABLE IF NOT EXISTS campaign_name_mappings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  original_name text NOT NULL,
  display_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  UNIQUE(user_id, original_name)
);

-- Enable RLS
ALTER TABLE campaign_name_mappings ENABLE ROW LEVEL SECURITY;

-- Policies para campaign_name_mappings
CREATE POLICY "Admins can manage all campaign name mappings"
  ON campaign_name_mappings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators can manage managed clients mappings"
  ON campaign_name_mappings FOR ALL
  USING (
    has_role(auth.uid(), 'moderator'::app_role) 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = campaign_name_mappings.user_id 
      AND profiles.manager_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own campaign name mappings"
  ON campaign_name_mappings FOR SELECT
  USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_campaign_data_report_type ON campaign_data(report_type);
CREATE INDEX IF NOT EXISTS idx_campaign_data_report_date ON campaign_data(report_date);
CREATE INDEX IF NOT EXISTS idx_campaign_name_mappings_user_id ON campaign_name_mappings(user_id);