-- Adicionar colunas para visitas ao perfil e custo por visita
ALTER TABLE campaign_data 
ADD COLUMN IF NOT EXISTS profile_visits integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS cost_per_visit numeric DEFAULT 0;