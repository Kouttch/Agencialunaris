-- Adicionar política RLS para moderadores verem dados de campanha dos clientes gerenciados
CREATE POLICY "Moderators can view managed clients campaign data"
ON public.campaign_data
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = campaign_data.user_id
      AND profiles.manager_id = auth.uid()
  )
);

-- Adicionar política RLS para moderadores verem perfis dos clientes gerenciados
CREATE POLICY "Moderators can view managed clients profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  manager_id = auth.uid()
);

-- Permitir que moderadores insiram notificações para clientes gerenciados
CREATE POLICY "Moderators can insert notifications for managed clients"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'moderator'::app_role) AND
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = notifications.user_id
      AND profiles.manager_id = auth.uid()
  )
);