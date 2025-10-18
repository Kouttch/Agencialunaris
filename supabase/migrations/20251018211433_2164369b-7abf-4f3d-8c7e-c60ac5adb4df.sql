-- First, drop the existing foreign key constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_manager_id_fkey;

-- Clear invalid manager_id values (those that don't exist in profiles.user_id)
UPDATE public.profiles 
SET manager_id = NULL 
WHERE manager_id IS NOT NULL 
AND manager_id NOT IN (SELECT user_id FROM public.profiles);

-- Add new foreign key constraint that references profiles table itself
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_manager_id_fkey 
FOREIGN KEY (manager_id) 
REFERENCES public.profiles(user_id) 
ON DELETE SET NULL;