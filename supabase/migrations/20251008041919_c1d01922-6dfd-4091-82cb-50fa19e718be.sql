-- Remover política genérica que pode estar causando problemas
DROP POLICY IF EXISTS "Admins and moderators can manage payment requests" ON public.payment_requests;

-- Política para admins verem todos os payment requests
CREATE POLICY "Admins can view all payment requests"
ON public.payment_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Política para moderadores verem payment requests dos clientes gerenciados
CREATE POLICY "Moderators can view managed clients payment requests"
ON public.payment_requests
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'moderator'::app_role) AND
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = payment_requests.user_id
      AND profiles.manager_id = auth.uid()
  )
);

-- Política para admins criarem payment requests
CREATE POLICY "Admins can create payment requests"
ON public.payment_requests
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Política para moderadores criarem payment requests para clientes gerenciados
CREATE POLICY "Moderators can create payment requests for managed clients"
ON public.payment_requests
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'moderator'::app_role) AND
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = payment_requests.user_id
      AND profiles.manager_id = auth.uid()
  )
);

-- Política para admins atualizarem payment requests
CREATE POLICY "Admins can update payment requests"
ON public.payment_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Política para moderadores atualizarem payment requests dos clientes gerenciados
CREATE POLICY "Moderators can update managed clients payment requests"
ON public.payment_requests
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'moderator'::app_role) AND
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = payment_requests.user_id
      AND profiles.manager_id = auth.uid()
  )
)
WITH CHECK (
  has_role(auth.uid(), 'moderator'::app_role) AND
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = payment_requests.user_id
      AND profiles.manager_id = auth.uid()
  )
);