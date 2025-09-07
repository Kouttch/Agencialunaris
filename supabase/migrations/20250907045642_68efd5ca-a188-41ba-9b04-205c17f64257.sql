-- Add RLS policies for the Lunaris table
-- Since this appears to be a system/admin table, I'll add appropriate policies

-- Allow authenticated users to read from Lunaris table
CREATE POLICY "Authenticated users can view Lunaris data" 
ON public."Lunaris" FOR SELECT 
TO authenticated 
USING (true);

-- Only admins can insert/update/delete Lunaris data
CREATE POLICY "Admins can manage Lunaris data" 
ON public."Lunaris" FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));