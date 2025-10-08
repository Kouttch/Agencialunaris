-- Remover política antiga que pode estar impedindo a atualização
DROP POLICY IF EXISTS "Users can confirm their own payments" ON public.payment_requests;

-- Criar política específica para clientes confirmarem pagamento
CREATE POLICY "Users can confirm their payment status"
ON public.payment_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para admins deletarem payment requests
CREATE POLICY "Admins can delete payment requests"
ON public.payment_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Política para moderadores deletarem payment requests dos clientes gerenciados
CREATE POLICY "Moderators can delete managed clients payment requests"
ON public.payment_requests
FOR DELETE
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