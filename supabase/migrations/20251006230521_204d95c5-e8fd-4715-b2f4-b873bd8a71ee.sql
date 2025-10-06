-- Update the current user to admin role
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '52fed639-be46-4c13-bb38-dadc14f6bf7b';