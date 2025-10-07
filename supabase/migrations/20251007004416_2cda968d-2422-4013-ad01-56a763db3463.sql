-- Create storage bucket for manager photos if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('manager-photos', 'manager-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view manager photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload manager photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update manager photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete manager photos" ON storage.objects;

-- Create RLS policies for manager photos
CREATE POLICY "Anyone can view manager photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'manager-photos');

CREATE POLICY "Admins can upload manager photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'manager-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update manager photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'manager-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete manager photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'manager-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);